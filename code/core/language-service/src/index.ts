import { isAbsolute, resolve } from 'node:path'

import type ts from 'typescript'
import {
  completionSortText,
  createStyleTooling,
  type SerializedConfigFile,
  type StyleTooling,
} from './core'
import { resolveTamaguiHost } from './host'

const completionSource = '@tamagui/language-service'
const diagnosticCode = 78711
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

type ImportedBindings = {
  styled: ReadonlySet<string>
}

type LiteralSite = {
  property: string
  /** cooked value, identical to its authored source text */
  value: string
  /** file offset of the value's first character */
  contentStart: number
  literal: ts.StringLiteralLike
}

function loadTooling(
  info: ts.server.PluginCreateInfo,
  configPath: string
): StyleTooling | null {
  const contents = info.serverHost.readFile(configPath)
  if (contents === undefined) return null
  try {
    return createStyleTooling(JSON.parse(contents) as SerializedConfigFile)
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
  tooling: StyleTooling,
  checker: ts.TypeChecker,
  bindings: ImportedBindings
): { property: string } | null {
  let parent = literal.parent

  if (typescript.isJsxExpression(parent)) parent = parent.parent
  if (typescript.isJsxAttribute(parent)) {
    if (!typescript.isIdentifier(parent.name)) return null
    const property = parent.name.text
    if (!tooling.styleProps.has(property)) return null
    const opening = parent.parent.parent
    if (!typescript.isJsxOpeningLikeElement(opening)) return null
    const host = resolveTamaguiHost(checker, opening.tagName)
    if (!host?.accepts(property)) return null
    return { property }
  }

  if (!typescript.isPropertyAssignment(parent)) return null
  const property = propertyName(typescript, parent.name)
  if (!property || !tooling.styleProps.has(property)) return null

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
  const component = call.arguments[0]
  const host = component && resolveTamaguiHost(checker, component)
  if (!host?.accepts(property)) return null
  return { property }
}

/**
 * The literal as a style value site, or null when it is not one: wrong parent
 * shape, not a style prop, not a tamagui host, or authored with escapes that
 * cook differently than they read (TypeScript exposes cooked values but no
 * cooked-to-source offset map, so exact-raw literals only).
 */
function siteForLiteral(
  typescript: typeof ts,
  sourceFile: ts.SourceFile,
  literal: ts.StringLiteralLike,
  tooling: StyleTooling,
  checker: ts.TypeChecker,
  bindings: ImportedBindings
): LiteralSite | null {
  const site = completionProperty(typescript, literal, tooling, checker, bindings)
  if (!site) return null
  const contentStart = literal.getStart(sourceFile) + 1
  const contentEnd = literal.getEnd() - 1
  const sourceInput = sourceFile.text.slice(contentStart, contentEnd)
  if (literal.text !== sourceInput) return null
  return { property: site.property, value: literal.text, contentStart, literal }
}

function collectLiteralSites(
  typescript: typeof ts,
  sourceFile: ts.SourceFile,
  tooling: StyleTooling,
  checker: ts.TypeChecker,
  bindings: ImportedBindings
): LiteralSite[] {
  const sites: LiteralSite[] = []
  const visit = (node: ts.Node): void => {
    if (typescript.isStringLiteralLike(node)) {
      const site = siteForLiteral(
        typescript,
        sourceFile,
        node,
        tooling,
        checker,
        bindings
      )
      if (site) sites.push(site)
      return
    }
    typescript.forEachChild(node, visit)
  }
  visit(sourceFile)
  return sites
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
    let tooling = loadTooling(info, configPath)
    const watcher = info.serverHost.watchFile(configPath, () => {
      tooling = loadTooling(info, configPath)
    })

    const proxy = copyLanguageService(info.languageService)
    const baseCompletions = info.languageService.getCompletionsAtPosition.bind(
      info.languageService
    )
    const baseDetails = info.languageService.getCompletionEntryDetails.bind(
      info.languageService
    )
    const baseSemanticDiagnostics = info.languageService.getSemanticDiagnostics.bind(
      info.languageService
    )
    const baseQuickInfo = info.languageService.getQuickInfoAtPosition.bind(
      info.languageService
    )
    const baseDispose = info.languageService.dispose.bind(info.languageService)
    const bindingsBySourceFile = new WeakMap<ts.SourceFile, ImportedBindings>()

    const fileContext = (
      fileName: string
    ): {
      sourceFile: ts.SourceFile
      checker: ts.TypeChecker
      bindings: ImportedBindings
    } | null => {
      const program = info.languageService.getProgram()
      const sourceFile = program?.getSourceFile(fileName)
      if (!program || !sourceFile) return null
      let bindings = bindingsBySourceFile.get(sourceFile)
      if (!bindings) {
        bindings = importedBindings(typescript, sourceFile)
        bindingsBySourceFile.set(sourceFile, bindings)
      }
      return { sourceFile, checker: program.getTypeChecker(), bindings }
    }

    proxy.getCompletionsAtPosition = (
      fileName,
      position,
      options,
      formattingSettings
    ) => {
      const getBaseCompletions = () =>
        baseCompletions(fileName, position, options, formattingSettings)
      if (!tooling) return getBaseCompletions()
      const context = fileContext(fileName)
      if (!context) return getBaseCompletions()
      const { sourceFile, checker, bindings } = context
      const literal = findStringLiteralAtPosition(typescript, sourceFile, position)
      if (!literal) return getBaseCompletions()
      const site = siteForLiteral(
        typescript,
        sourceFile,
        literal,
        tooling,
        checker,
        bindings
      )
      if (!site) return getBaseCompletions()

      const cursorCompletions = tooling.completions(
        site.property,
        site.value,
        position - site.contentStart
      )
      if (!cursorCompletions) return getBaseCompletions()
      const replacementSpan = {
        start: site.contentStart + cursorCompletions.replaceStart,
        length: cursorCompletions.replaceLength,
      }
      const entries: ts.CompletionEntry[] = []
      let contextualType: ts.Type | undefined
      for (const completion of cursorCompletions.completions) {
        const insertText = completion.insertText || completion.value
        const modifierKind =
          completion.kind === 'modifier'
            ? tooling.modifierKind(completion.value)
            : undefined
        if (completion.kind === 'keyword') {
          contextualType ||= checker.getContextualType(literal)
          if (
            !contextualType ||
            !checker.isTypeAssignableTo(
              checker.getStringLiteralType(insertText),
              contextualType
            )
          ) {
            continue
          }
        }
        entries.push({
          name: completion.value,
          kind: typescript.ScriptElementKind.string,
          kindModifiers: '',
          sortText: completionSortText(completion, modifierKind),
          insertText,
          replacementSpan,
          source: completionSource,
          labelDetails: {
            description: modifierKind
              ? `Tamagui ${modifierKind} modifier`
              : completion.kind === 'configured'
                ? 'Tamagui configured value'
                : 'Tamagui style keyword',
          },
        })
      }
      if (entries.length === 0) return getBaseCompletions()
      return {
        isGlobalCompletion: false,
        isMemberCompletion: false,
        isNewIdentifierLocation: true,
        // A completion requested immediately after whitespace has an empty
        // replacement span. Ask the editor to request again as the modifier
        // prefix grows instead of dismissing suggestions when the cursor
        // moves beyond that initial span.
        isIncomplete: true,
        entries,
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

    proxy.getSemanticDiagnostics = (fileName) => {
      const diagnostics = [...baseSemanticDiagnostics(fileName)]
      if (!tooling) return diagnostics
      const context = fileContext(fileName)
      if (!context) return diagnostics
      const { sourceFile, checker, bindings } = context
      for (const site of collectLiteralSites(
        typescript,
        sourceFile,
        tooling,
        checker,
        bindings
      )) {
        for (const diagnostic of tooling.diagnostics(site.property, site.value)) {
          diagnostics.push({
            file: sourceFile,
            start: site.contentStart + diagnostic.start,
            length: Math.max(1, diagnostic.end - diagnostic.start),
            messageText: diagnostic.message,
            category: typescript.DiagnosticCategory.Error,
            code: diagnosticCode,
            source: completionSource,
          })
        }
      }
      return diagnostics
    }

    proxy.getQuickInfoAtPosition = (fileName, position) => {
      const getBaseQuickInfo = () => baseQuickInfo(fileName, position)
      if (!tooling) return getBaseQuickInfo()
      const context = fileContext(fileName)
      if (!context) return getBaseQuickInfo()
      const { sourceFile, checker, bindings } = context
      const literal = findStringLiteralAtPosition(typescript, sourceFile, position)
      if (!literal) return getBaseQuickInfo()
      const site = siteForLiteral(
        typescript,
        sourceFile,
        literal,
        tooling,
        checker,
        bindings
      )
      if (!site) return getBaseQuickInfo()
      const hover = tooling.hover(site.property, site.value, position - site.contentStart)
      if (!hover) return getBaseQuickInfo()
      return {
        kind: typescript.ScriptElementKind.string,
        kindModifiers: '',
        textSpan: {
          start: site.contentStart + hover.start,
          length: hover.end - hover.start,
        },
        displayParts: [{ text: hover.text, kind: 'stringLiteral' }],
        documentation: [{ text: hover.markdown, kind: 'text' }],
      }
    }

    proxy.dispose = () => {
      watcher.close()
      baseDispose()
    }
    return proxy
  },
})

export default init
