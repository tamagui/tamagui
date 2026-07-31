import { isAbsolute, resolve } from 'node:path'

import {
  completeStyleValueAtCursor,
  createCandidatePropertyVocabulary,
  createGrammarConfigViewFromSerializedConfig,
  createModifierRegistry,
  grammarEntries,
  type DiagnoseStyleValueOptions,
  type SerializedGrammarSourceConfig,
} from '@tamagui/style-grammar'
import type ts from 'typescript'

const completionSource = '@tamagui/language-service'
const defaultConfigPath = '.tamagui/tamagui.config.json'
const flatStyledModules: ReadonlySet<string> = new Set([
  'tamagui',
  'tamagui/unstyled',
  '@tamagui/core',
  '@tamagui/ui',
  '@tamagui/web',
])

export interface TamaguiLanguageServicePluginConfig {
  /** Path to the config JSON emitted by the Tamagui compiler. */
  configPath?: string
}

type SerializedConfigFile = {
  tamaguiConfig?: SerializedGrammarSourceConfig
  tamaguiConfigMetadata?: unknown
}

type CompletionState = {
  options: DiagnoseStyleValueOptions
  styleProps: ReadonlySet<string>
}

type ImportedBindings = {
  styled: ReadonlySet<string>
}

function loadCompletionState(
  info: ts.server.PluginCreateInfo,
  configPath: string
): CompletionState | null {
  const contents = info.serverHost.readFile(configPath)
  if (contents === undefined) return null

  try {
    const serialized = JSON.parse(contents) as SerializedConfigFile
    if (!serialized.tamaguiConfig) return null
    const config = createGrammarConfigViewFromSerializedConfig(
      serialized.tamaguiConfig,
      serialized.tamaguiConfigMetadata
    )
    const registry = createModifierRegistry(config).registry
    const styleProps = new Set(grammarEntries.map((entry) => entry.prop))
    for (const shorthand in config.shorthands) {
      styleProps.add(shorthand)
      styleProps.add(config.shorthands[shorthand])
    }
    return {
      options: {
        config,
        registry,
        candidates: createCandidatePropertyVocabulary(config),
      },
      styleProps,
    }
  } catch {
    return null
  }
}

function findStringLiteralAtPosition(
  typescript: typeof ts,
  sourceFile: ts.SourceFile,
  position: number
): ts.StringLiteralLike | null {
  let found: ts.StringLiteralLike | null = null
  const visit = (node: ts.Node): void => {
    if (position < node.getFullStart() || position > node.getEnd()) return
    if (
      typescript.isStringLiteralLike(node) &&
      position >= node.getStart(sourceFile) + 1 &&
      position <= node.getEnd() - 1
    ) {
      found = node
      return
    }
    typescript.forEachChild(node, visit)
  }
  visit(sourceFile)
  return found
}

function importedBindings(
  typescript: typeof ts,
  sourceFile: ts.SourceFile
): ImportedBindings {
  const styled = new Set<string>()

  for (const statement of sourceFile.statements) {
    if (
      !typescript.isImportDeclaration(statement) ||
      !typescript.isStringLiteral(statement.moduleSpecifier)
    ) {
      continue
    }
    const source = statement.moduleSpecifier.text
    if (!flatStyledModules.has(source)) continue
    const bindings = statement.importClause?.namedBindings
    if (!bindings) continue
    if (typescript.isNamespaceImport(bindings)) continue
    for (const element of bindings.elements) {
      const imported = element.propertyName?.text || element.name.text
      if (imported === 'styled') styled.add(element.name.text)
    }
  }

  return { styled }
}

function propertyName(typescript: typeof ts, name: ts.PropertyName): string | null {
  if (typescript.isIdentifier(name) || typescript.isStringLiteral(name)) {
    return name.text
  }
  return null
}

function completionProperty(
  typescript: typeof ts,
  literal: ts.StringLiteralLike,
  state: CompletionState,
  checker: ts.TypeChecker,
  bindings: ImportedBindings
): { property: string; contextualType: ts.Type } | null {
  const contextualType = checker.getContextualType(literal)
  if (!contextualType) return null
  let parent = literal.parent

  if (typescript.isJsxExpression(parent)) parent = parent.parent
  if (typescript.isJsxAttribute(parent)) {
    if (!typescript.isIdentifier(parent.name)) return null
    const property = parent.name.text
    if (!state.styleProps.has(property)) return null
    const opening = parent.parent.parent
    if (!typescript.isJsxOpeningLikeElement(opening)) return null
    const tagType = checker.getTypeAtLocation(opening.tagName)
    if (!checker.getPropertyOfType(tagType, 'staticConfig')) return null
    return { property, contextualType }
  }

  if (!typescript.isPropertyAssignment(parent)) return null
  const property = propertyName(typescript, parent.name)
  if (!property || !state.styleProps.has(property)) return null

  let current: ts.Node = parent
  while (current.parent && !typescript.isCallExpression(current.parent)) {
    current = current.parent
  }
  if (!current.parent || !typescript.isCallExpression(current.parent)) return null
  const call = current.parent
  if (
    call.arguments[1] !== current ||
    !typescript.isIdentifier(call.expression) ||
    !bindings.styled.has(call.expression.text)
  ) {
    return null
  }
  return { property, contextualType }
}

function copyLanguageService(service: ts.LanguageService): ts.LanguageService {
  const proxy = Object.create(null) as ts.LanguageService
  for (const key of Object.keys(service) as Array<keyof ts.LanguageService>) {
    const value = service[key]
    ;(proxy as unknown as Record<string, unknown>)[key] =
      typeof value === 'function' ? value.bind(service) : value
  }
  return proxy
}

const init: ts.server.PluginModuleFactory = ({ typescript }) => ({
  create(info) {
    const pluginConfig = info.config as TamaguiLanguageServicePluginConfig | undefined
    const configuredPath = pluginConfig?.configPath || defaultConfigPath
    const configPath = isAbsolute(configuredPath)
      ? configuredPath
      : resolve(info.project.getCurrentDirectory(), configuredPath)
    let state = loadCompletionState(info, configPath)
    const watcher = info.serverHost.watchFile(configPath, () => {
      state = loadCompletionState(info, configPath)
    })

    const proxy = copyLanguageService(info.languageService)
    const baseCompletions = info.languageService.getCompletionsAtPosition.bind(
      info.languageService
    )
    const baseDetails = info.languageService.getCompletionEntryDetails.bind(
      info.languageService
    )
    const baseDispose = info.languageService.dispose.bind(info.languageService)
    const bindingsBySourceFile = new WeakMap<ts.SourceFile, ImportedBindings>()

    proxy.getCompletionsAtPosition = (
      fileName,
      position,
      options,
      formattingSettings
    ) => {
      const base = baseCompletions(fileName, position, options, formattingSettings)
      if (!state) return base
      const program = info.languageService.getProgram()
      if (!program) return base
      const sourceFile = program.getSourceFile(fileName)
      if (!sourceFile) return base
      const literal = findStringLiteralAtPosition(typescript, sourceFile, position)
      if (!literal) return base
      const checker = program.getTypeChecker()
      let bindings = bindingsBySourceFile.get(sourceFile)
      if (!bindings) {
        bindings = importedBindings(typescript, sourceFile)
        bindingsBySourceFile.set(sourceFile, bindings)
      }
      const site = completionProperty(typescript, literal, state, checker, bindings)
      if (!site) return base

      const contentStart = literal.getStart(sourceFile) + 1
      const contentEnd = literal.getEnd() - 1
      const sourceInput = sourceFile.text.slice(contentStart, contentEnd)
      const input = literal.text
      // TypeScript exposes cooked literal values but not a cooked-to-source
      // offset map. Decline escaped literals until it can replace their exact
      // authored span without risking removal of a runtime clause.
      if (input !== sourceInput) return base
      const cursorCompletions = completeStyleValueAtCursor(
        site.property,
        input,
        position - contentStart,
        state.options
      )
      if (!cursorCompletions) return base
      const replacementSpan = {
        start: contentStart + cursorCompletions.replaceStart,
        length: cursorCompletions.replaceLength,
      }
      const existing = new Set(base?.entries.map((entry) => entry.name))
      const entries: ts.CompletionEntry[] = []
      for (const completion of cursorCompletions.completions) {
        if (existing.has(completion.value)) continue
        const insertText = completion.insertText || completion.value
        if (
          !checker.isTypeAssignableTo(
            checker.getStringLiteralType(insertText),
            site.contextualType
          )
        ) {
          continue
        }
        entries.push({
          name: completion.value,
          kind: typescript.ScriptElementKind.string,
          kindModifiers: '',
          sortText: '0',
          insertText,
          replacementSpan,
          source: completionSource,
          labelDetails: {
            description:
              completion.kind === 'configured'
                ? 'Tamagui configured value'
                : completion.kind === 'modifier'
                  ? 'Tamagui modifier'
                  : 'Tamagui style keyword',
          },
        })
      }
      if (entries.length === 0) return base
      return {
        ...(base || {
          isGlobalCompletion: false,
          isMemberCompletion: false,
          isNewIdentifierLocation: true,
        }),
        entries: [...(base?.entries || []), ...entries],
      }
    }

    proxy.getCompletionEntryDetails = (
      fileName,
      position,
      entryName,
      formatOptions,
      source,
      preferences,
      data
    ) => {
      if (source === completionSource) {
        return {
          name: entryName,
          kind: typescript.ScriptElementKind.string,
          kindModifiers: '',
          displayParts: [
            {
              text: entryName,
              kind: 'stringLiteral',
            },
          ],
          documentation: [
            {
              text: 'Resolved from the active Tamagui config.',
              kind: 'text',
            },
          ],
          tags: [],
        }
      }
      return baseDetails(
        fileName,
        position,
        entryName,
        formatOptions,
        source,
        preferences,
        data
      )
    }

    proxy.dispose = () => {
      watcher.close()
      baseDispose()
    }
    return proxy
  },
})

export default init
