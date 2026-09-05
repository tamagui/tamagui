import {
  Node,
  SyntaxKind,
  type ArrowFunction,
  type Expression,
  type FunctionExpression,
  type Identifier,
  type ImportDeclaration,
  type Node as MorphNode,
  type ObjectLiteralExpression,
  type SourceFile,
} from 'ts-morph'
import type { Flag } from './convert'
import { unwrapExpression } from './expressions'

type FunctionalCallback = ArrowFunction | FunctionExpression

interface Replacement {
  start: number
  end: number
  text: string
}

export interface RequiredTypeImport {
  module: 'tamagui' | '@tamagui/core'
  name: string
  localName: string
}

interface CallbackAnalysis {
  callback: FunctionalCallback
  firstName: string | null
  rendered: string
  normalizedBody: string | null
  objectReturn: string | null
  usesEnv: boolean
  propsLine: number | null
  draftBody: string | null
  unsupportedExtras: string[]
}

export interface FunctionalVariantReport {
  label: string
  line: number
  before: string
  after: string
  converted: boolean
  flags: Flag[]
  draft: string | null
  notes: string[]
}

export interface FunctionalVariantConversion {
  sites: FunctionalVariantReport[]
  requiredTypeImports: RequiredTypeImport[]
}

const spreadTypes = new Map([
  ['...size', 'SizeTokens'],
  ['...space', 'SpaceTokens'],
  ['...color', 'ColorTokens'],
  ['...radius', 'RadiusTokens'],
  ['...fontSize', 'FontSizeTokens'],
  ['...zIndex', 'ZIndexTokens'],
])

const typeKeys = new Map([
  [':number', 'number'],
  [':string', 'string'],
  [':boolean', 'boolean'],
])

const typeOrder = ['number', 'string', 'boolean'] as const
const envMembers = new Set(['tokens', 'theme', 'fonts', 'font', 'fontFamily'])

function propertyName(node: MorphNode): string | null {
  if (Node.isIdentifier(node) || Node.isPrivateIdentifier(node)) return node.getText()
  if (Node.isStringLiteral(node) || Node.isNumericLiteral(node)) {
    return node.getLiteralText()
  }
  return null
}

function renderNode(node: MorphNode, replacements: readonly Replacement[]): string {
  const start = node.getStart()
  const end = node.getEnd()
  const selected: Replacement[] = []

  for (const replacement of [...replacements].sort(
    (left, right) => right.end - right.start - (left.end - left.start)
  )) {
    if (replacement.start < start || replacement.end > end) continue
    if (
      selected.some(
        (current) => replacement.start < current.end && replacement.end > current.start
      )
    ) {
      continue
    }
    selected.push(replacement)
  }

  let text = node.getText()
  for (const replacement of selected.sort((left, right) => right.start - left.start)) {
    const relativeStart = replacement.start - start
    const relativeEnd = replacement.end - start
    text = `${text.slice(0, relativeStart)}${replacement.text}${text.slice(relativeEnd)}`
  }
  return text
}

function referencesWithin(node: MorphNode, definition: Identifier): MorphNode[] {
  return definition
    .findReferencesAsNodes()
    .filter(
      (reference) =>
        reference.getStart() >= node.getStart() && reference.getEnd() <= node.getEnd()
    )
}

function renderObjectReturn(
  expression: Expression,
  replacements: readonly Replacement[]
): string {
  let current = expression
  while (Node.isParenthesizedExpression(current)) current = current.getExpression()
  return renderNode(
    Node.isAsExpression(current) || Node.isTypeAssertion(current)
      ? expression
      : unwrapExpression(expression),
    replacements
  )
}

function callbackAnalysis(callback: FunctionalCallback): CallbackAnalysis {
  const body = callback.getBody()
  const parameters = callback.getParameters()
  const firstNameNode = parameters[0]?.getNameNode()
  const firstName = Node.isIdentifier(firstNameNode) ? firstNameNode.getText() : null
  const secondNameNode = parameters[1]?.getNameNode()
  const renderedReplacements: Replacement[] = []
  const normalizedReplacements: Replacement[] = []
  const draftReplacements: Replacement[] = []
  const unsupportedExtras = new Set<string>()
  let propsLine: number | null = null
  let usesEnv = false

  if (firstNameNode && Node.isIdentifier(firstNameNode)) {
    for (const reference of referencesWithin(body, firstNameNode)) {
      normalizedReplacements.push({
        start: reference.getStart(),
        end: reference.getEnd(),
        text: 'value',
      })
    }
  }

  if (secondNameNode && Node.isIdentifier(secondNameNode)) {
    const references = referencesWithin(body, secondNameNode)
    usesEnv = references.length > 0
    const otherSameName = body
      .getDescendantsOfKind(SyntaxKind.Identifier)
      .some(
        (identifier) =>
          identifier.getText() === secondNameNode.getText() &&
          !references.some(
            (reference) =>
              reference.getStart() === identifier.getStart() &&
              reference.getEnd() === identifier.getEnd()
          )
      )
    const envNameExists = body
      .getDescendantsOfKind(SyntaxKind.Identifier)
      .some((identifier) => identifier.getText() === 'env')

    if (secondNameNode.getText() !== 'env' && !otherSameName && !envNameExists) {
      renderedReplacements.push({
        start: secondNameNode.getStart(),
        end: secondNameNode.getEnd(),
        text: 'env',
      })
      for (const reference of references) {
        renderedReplacements.push({
          start: reference.getStart(),
          end: reference.getEnd(),
          text: 'env',
        })
      }
    }

    for (const reference of references) {
      normalizedReplacements.push({
        start: reference.getStart(),
        end: reference.getEnd(),
        text: 'env',
      })
      draftReplacements.push({
        start: reference.getStart(),
        end: reference.getEnd(),
        text: 'env',
      })

      const parent = reference.getParent()
      if (
        Node.isPropertyAccessExpression(parent) &&
        parent.getExpression().getStart() === reference.getStart()
      ) {
        const member = parent.getName()
        if (member === 'props') {
          propsLine ??= callback
            .getSourceFile()
            .getLineAndColumnAtPos(parent.getStart()).line
          draftReplacements.push({
            start: parent.getStart(),
            end: parent.getEnd(),
            text: 'props',
          })
        } else if (!envMembers.has(member)) {
          unsupportedExtras.add(member)
        }
      }
      if (
        Node.isElementAccessExpression(parent) &&
        parent.getExpression().getStart() === reference.getStart()
      ) {
        const argument = parent.getArgumentExpression()
        const member =
          argument && Node.isStringLiteral(argument) ? argument.getLiteralValue() : null
        if (member === 'props') {
          propsLine ??= callback
            .getSourceFile()
            .getLineAndColumnAtPos(parent.getStart()).line
          draftReplacements.push({
            start: parent.getStart(),
            end: parent.getEnd(),
            text: 'props',
          })
        } else if (member === null || !envMembers.has(member)) {
          unsupportedExtras.add(member ?? parent.getText())
        }
      }
    }
  } else if (secondNameNode && Node.isObjectBindingPattern(secondNameNode)) {
    for (const element of secondNameNode.getElements()) {
      const bindingName = element.getNameNode()
      const sourceName = propertyName(element.getPropertyNameNode() ?? bindingName)
      if (!sourceName || !Node.isIdentifier(bindingName)) {
        unsupportedExtras.add(element.getText())
        continue
      }
      if (element.getDotDotDotToken()) {
        unsupportedExtras.add(element.getText())
        continue
      }
      const references = referencesWithin(body, bindingName)
      if (sourceName === 'props') {
        propsLine ??= callback
          .getSourceFile()
          .getLineAndColumnAtPos(element.getStart()).line
        for (const reference of references) {
          draftReplacements.push({
            start: reference.getStart(),
            end: reference.getEnd(),
            text: 'props',
          })
        }
        continue
      }
      if (!envMembers.has(sourceName)) {
        unsupportedExtras.add(sourceName)
        continue
      }
      if (references.length) usesEnv = true
      for (const reference of references) {
        normalizedReplacements.push({
          start: reference.getStart(),
          end: reference.getEnd(),
          text: `env.${sourceName}`,
        })
        draftReplacements.push({
          start: reference.getStart(),
          end: reference.getEnd(),
          text: `env.${sourceName}`,
        })
      }
    }
  } else if (secondNameNode) {
    unsupportedExtras.add(secondNameNode.getText())
  }

  const normalizedBody =
    firstNameNode && !Node.isIdentifier(firstNameNode)
      ? null
      : renderNode(body, normalizedReplacements)
  const draftBody =
    firstNameNode && !Node.isIdentifier(firstNameNode)
      ? null
      : renderNode(body, draftReplacements)
  let objectReturn: string | null = null
  const unwrappedBody = Node.isExpression(body) ? unwrapExpression(body) : body

  if (Node.isExpression(body) && Node.isObjectLiteralExpression(unwrappedBody)) {
    objectReturn = renderObjectReturn(body, normalizedReplacements)
  } else if (Node.isBlock(body)) {
    const statements = body.getStatements()
    if (statements.length === 1 && Node.isReturnStatement(statements[0])) {
      const returned = statements[0].getExpression()
      if (returned) {
        const unwrapped = unwrapExpression(returned)
        if (Node.isObjectLiteralExpression(unwrapped)) {
          objectReturn = renderObjectReturn(returned, normalizedReplacements)
        }
      }
    }
  }

  return {
    callback,
    firstName,
    rendered: renderNode(callback, renderedReplacements),
    normalizedBody,
    objectReturn,
    usesEnv,
    propsLine,
    draftBody,
    unsupportedExtras: [...unsupportedExtras].sort(),
  }
}

function styledImport(sourceFile: SourceFile): ImportDeclaration | null {
  for (const declaration of sourceFile.getImportDeclarations()) {
    const module = declaration.getModuleSpecifierValue()
    if (module !== 'tamagui' && module !== '@tamagui/core') continue
    if (
      declaration.getNamedImports().some((specifier) => {
        const localName = specifier.getAliasNode()?.getText() ?? specifier.getName()
        return specifier.getName() === 'styled' && localName === 'styled'
      })
    ) {
      return declaration
    }
  }
  return null
}

function typeReference(
  sourceFile: SourceFile,
  declaration: ImportDeclaration,
  typeName: string
): { localName: string; required: RequiredTypeImport | null } {
  const module = declaration.getModuleSpecifierValue() as RequiredTypeImport['module']
  for (const current of sourceFile.getImportDeclarations()) {
    if (current.getModuleSpecifierValue() !== module) continue
    const existing = current
      .getNamedImports()
      .find((specifier) => specifier.getName() === typeName)
    if (existing) {
      return {
        localName: existing.getAliasNode()?.getText() ?? existing.getName(),
        required: null,
      }
    }
  }

  let localName = typeName
  if (sourceFile.getLocal(localName)) {
    localName = `Tamagui${typeName}`
    let suffix = 2
    while (sourceFile.getLocal(localName)) localName = `Tamagui${typeName}${suffix++}`
  }
  return { localName, required: { module, name: typeName, localName } }
}

function callbackFromProperty(property: MorphNode): FunctionalCallback | null {
  if (!Node.isPropertyAssignment(property)) return null
  const initializer = unwrapExpression(property.getInitializerOrThrow())
  return Node.isArrowFunction(initializer) || Node.isFunctionExpression(initializer)
    ? initializer
    : null
}

function commentsBefore(properties: readonly MorphNode[]): string {
  const comments = new Map<number, string>()
  for (const property of properties) {
    for (const range of property.getLeadingCommentRanges()) {
      comments.set(range.getPos(), range.getText())
    }
  }
  return [...comments.entries()]
    .sort((left, right) => left[0] - right[0])
    .map((entry) => entry[1])
    .join('\n')
}

export function convertFunctionalVariants(
  config: ObjectLiteralExpression,
  label: string,
  write: boolean
): FunctionalVariantConversion {
  const sites: FunctionalVariantReport[] = []
  const requiredTypeImports: RequiredTypeImport[] = []
  const variantsProperty = config.getProperty('variants')
  if (!Node.isPropertyAssignment(variantsProperty)) {
    return { sites, requiredTypeImports }
  }
  const variants = unwrapExpression(variantsProperty.getInitializerOrThrow())
  if (!Node.isObjectLiteralExpression(variants)) return { sites, requiredTypeImports }

  const sourceFile = config.getSourceFile()
  const importDeclaration = styledImport(sourceFile)

  for (const variant of variants.getProperties()) {
    if (!Node.isPropertyAssignment(variant)) continue
    const variantName = propertyName(variant.getNameNode())
    if (!variantName) continue
    const initializer = unwrapExpression(variant.getInitializerOrThrow())
    if (!Node.isObjectLiteralExpression(initializer)) continue

    const functional = initializer.getProperties().flatMap((property) => {
      if (!('getNameNode' in property)) return []
      const name = propertyName(property.getNameNode())
      return name && (name === '...' || name.startsWith('...') || name.startsWith(':'))
        ? [{ name, property }]
        : []
    })
    if (!functional.length) continue

    const flags: Flag[] = []
    const notes: string[] = []
    const line = sourceFile.getLineAndColumnAtPos(functional[0].property.getStart()).line
    const before = variant.getText()
    const exact = initializer
      .getProperties()
      .filter((property) => !functional.some((entry) => entry.property === property))
    const callbacks = functional.map((entry) => callbackFromProperty(entry.property))
    const analyses = callbacks.map((callback) =>
      callback ? callbackAnalysis(callback) : null
    )
    let after = before
    let draft: string | null = null
    let dynamicText: string | null = null
    let requiredImport: RequiredTypeImport | null = null

    if (exact.length) {
      flags.push({
        code: 'functional-variant-mixed',
        detail: `variant "${variantName}" combines exact branches with a function key; v3 has no mixed variant form`,
      })
    }
    if (functional.some((entry) => entry.name === '...')) {
      flags.push({
        code: 'functional-variant-catch-all',
        detail: `choose the value type and replace this catch-all with styled.dynamic<YourValue>(...); unknown would erase the prop contract`,
      })
    }
    if (callbacks.some((callback) => callback === null)) {
      flags.push({
        code: 'functional-variant-unsupported',
        detail: `variant "${variantName}" uses a function key whose value is not an inline arrow or function expression`,
      })
    }
    if (
      callbacks.some(
        (callback) =>
          callback &&
          (callback.getParameters().length > 2 ||
            callback.isAsync() ||
            (Node.isFunctionExpression(callback) && callback.isGenerator()))
      )
    ) {
      flags.push({
        code: 'functional-variant-unsupported',
        detail: `variant "${variantName}" uses an async, generator, or three-parameter callback`,
      })
    }
    if (analyses.some((analysis) => analysis?.firstName === null)) {
      flags.push({
        code: 'functional-variant-unsupported',
        detail: `variant "${variantName}" destructures its value parameter; migrate that callback by hand`,
      })
    }
    const unsupportedExtras = [
      ...new Set(analyses.flatMap((analysis) => analysis?.unsupportedExtras ?? [])),
    ]
    if (unsupportedExtras.length) {
      flags.push({
        code: 'functional-variant-unsupported-extras',
        detail: `v3 env has no ${unsupportedExtras.map((name) => `"${name}"`).join(', ')} member`,
      })
    }

    const propsAnalysis = analyses.find((analysis) => analysis?.propsLine != null)
    if (propsAnalysis) {
      const analysis = propsAnalysis as CallbackAnalysis
      const valueName = analysis.firstName ?? 'value'
      const propAccess = /^[A-Za-z_$][\w$]*$/.test(variantName)
        ? `props.${variantName}`
        : `props[${JSON.stringify(variantName)}]`
      const body = analysis.draftBody
      if (body) {
        const statements = Node.isBlock(analysis.callback.getBody())
          ? body.slice(1, -1).trim()
          : `return ${body}`
        draft = `${variantName}: styled.dynamic<${
          spreadTypes.get(functional[0].name) ??
          typeKeys.get(functional[0].name) ??
          'YourValue'
        }>()\n\n.resolve((props, env) => {\n  const ${valueName} = ${propAccess}\n${statements
          .split('\n')
          .map((statement) => `  ${statement}`)
          .join('\n')}\n})`
      }
      flags.push({
        code: 'functional-variant-needs-resolve',
        detail: `line ${analysis.propsLine} reads sibling props; declare the consumed prop with styled.dynamic<T>() and adapt the generated .resolve draft`,
      })
    }

    const allTypeKeys = functional.every((entry) => typeKeys.has(entry.name))
    const oneSpread = functional.length === 1 && spreadTypes.has(functional[0].name)
    if (new Set(functional.map((entry) => entry.name)).size !== functional.length) {
      flags.push({
        code: 'functional-variant-unsupported',
        detail: `variant "${variantName}" repeats a function key`,
      })
    }
    if (!functional.some((entry) => entry.name === '...') && !allTypeKeys && !oneSpread) {
      flags.push({
        code: 'functional-variant-unsupported',
        detail: `variant "${variantName}" uses unsupported functional keys ${functional
          .map((entry) => `"${entry.name}"`)
          .join(', ')}`,
      })
    }

    if (!flags.length && oneSpread) {
      if (!importDeclaration) {
        flags.push({
          code: 'functional-variant-styled-import',
          detail: `the file does not import styled directly from "tamagui" or "@tamagui/core", so the token type source is not provable`,
        })
      } else {
        const typeName = spreadTypes.get(functional[0].name)!
        const reference = typeReference(sourceFile, importDeclaration, typeName)
        requiredImport = reference.required
        dynamicText = `styled.dynamic<${reference.localName}>(${analyses[0]!.rendered})`
        notes.push(
          `uses ${reference.localName} from ${importDeclaration.getModuleSpecifierValue()}`
        )
      }
    } else if (!flags.length && allTypeKeys) {
      const present = new Set(functional.map((entry) => typeKeys.get(entry.name)!))
      const union = typeOrder.filter((type) => present.has(type)).join(' | ')
      if (functional.length === 1) {
        dynamicText = `styled.dynamic<${union}>(${analyses[0]!.rendered})`
      } else {
        const normalizedBodies = analyses.map((analysis) => analysis!.normalizedBody!)
        const sameBody = normalizedBodies.every((body) => body === normalizedBodies[0])
        const envParameter = analyses.some((analysis) => analysis!.usesEnv) ? ', env' : ''
        if (sameBody) {
          dynamicText = `styled.dynamic<${union}>((value${envParameter}) => ${normalizedBodies[0]})`
        } else if (analyses.every((analysis) => analysis!.objectReturn !== null)) {
          const byType = new Map(
            functional.map((entry, index) => [
              typeKeys.get(entry.name)!,
              analyses[index]!.objectReturn!,
            ])
          )
          const ordered = typeOrder.filter((type) => byType.has(type))
          const branches = ordered.map((type, index) =>
            index === ordered.length - 1
              ? `return ${byType.get(type)}`
              : `if (typeof value === '${type}') return ${byType.get(type)}`
          )
          dynamicText = `styled.dynamic<${union}>((value${envParameter}) => {\n${branches
            .map((branch) => `  ${branch}`)
            .join('\n')}\n})`
        } else {
          flags.push({
            code: 'functional-variant-type-bodies',
            detail: `variant "${variantName}" has different type-key bodies; automatic typeof branches require each body to be one object-literal return`,
          })
        }
      }
    }

    if (dynamicText && !flags.length) {
      const comments = commentsBefore(functional.map((entry) => entry.property))
      const replacement = comments ? `${comments}\n${dynamicText}` : dynamicText
      after = `${variant.getNameNode().getText()}: ${replacement}`
      if (requiredImport) requiredTypeImports.push(requiredImport)
      if (write) variant.setInitializer(replacement)
    }

    sites.push({
      label: `${label} variants.${variantName}`,
      line,
      before,
      after,
      converted: flags.length === 0,
      flags,
      draft,
      notes,
    })
  }

  return { sites, requiredTypeImports }
}

export function addFunctionalVariantTypeImports(
  sourceFile: SourceFile,
  imports: readonly RequiredTypeImport[]
): void {
  const seen = new Set<string>()
  for (const required of imports) {
    const key = `${required.module}:${required.name}:${required.localName}`
    if (seen.has(key)) continue
    seen.add(key)
    const declaration = sourceFile
      .getImportDeclarations()
      .find((current) => current.getModuleSpecifierValue() === required.module)
    if (!declaration) continue
    if (
      sourceFile
        .getImportDeclarations()
        .some(
          (current) =>
            current.getModuleSpecifierValue() === required.module &&
            current
              .getNamedImports()
              .some((specifier) => specifier.getName() === required.name)
        )
    ) {
      continue
    }
    declaration.addNamedImport({
      name: required.name,
      alias: required.localName === required.name ? undefined : required.localName,
      isTypeOnly: !declaration.isTypeOnly(),
    })
  }
}
