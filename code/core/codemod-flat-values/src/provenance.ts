// Only Tamagui style syntax converts. A `hoverStyle` object or a `$token` string
// means nothing to Emotion, restyle, or a local `styled` helper, so a site is only
// a conversion site when its binding is provably Tamagui.
//
// Provenance is followed through module specifiers, never guessed from a name:
// an import from `tamagui`/`@tamagui/*`, a re-export chain of relative modules
// ending in one, or a local value assigned from a Tamagui `styled()` call.

import {
  Node,
  SyntaxKind,
  type CallExpression,
  type Identifier,
  type JsxOpeningElement,
  type JsxSelfClosingElement,
  type SourceFile,
} from 'ts-morph'

const tamaguiModule = /^(tamagui|@tamagui\/)/

/** the identifier a JSX tag or a call ultimately binds to (`Card.Header` → `Card`) */
function rootIdentifier(node: Node): Identifier | null {
  let current = node
  while (Node.isPropertyAccessExpression(current)) current = current.getExpression()
  return Node.isIdentifier(current) ? current : null
}

export function createProvenance(): {
  isTamaguiElement: (opening: JsxOpeningElement | JsxSelfClosingElement) => boolean
  isTamaguiStyledCall: (call: CallExpression) => boolean
} {
  const resolved = new Map<Node, boolean>()
  const active = new Set<Node>()

  /** whether a declaration binds a value that came from Tamagui */
  const fromDeclaration = (declaration: Node): boolean => {
    const cached = resolved.get(declaration)
    if (cached !== undefined) return cached
    // an export cycle must terminate, and a binding is not Tamagui until proven
    if (active.has(declaration)) return false
    active.add(declaration)
    const answer = computeDeclaration(declaration)
    active.delete(declaration)
    resolved.set(declaration, answer)
    return answer
  }

  /** the named export of a module reached by a relative specifier */
  const fromModule = (
    specifier: string,
    source: SourceFile | undefined,
    name: string
  ): boolean => {
    if (tamaguiModule.test(specifier)) return true
    if (source === undefined) return false
    return exportedBinding(source, name)
  }

  const bindings = new Map<string, boolean>()
  const openBindings = new Set<string>()

  const exportedBinding = (source: SourceFile, name: string): boolean => {
    const key = `${source.getFilePath()}#${name}`
    const cached = bindings.get(key)
    if (cached !== undefined) return cached
    // a re-export cycle must terminate, and a binding is not Tamagui until proven
    if (openBindings.has(key)) return false
    openBindings.add(key)
    const answer = computeBinding(source, name)
    openBindings.delete(key)
    bindings.set(key, answer)
    return answer
  }

  const computeBinding = (source: SourceFile, name: string): boolean => {
    // the re-export walk runs first: it answers from the module specifier alone,
    // without asking the checker to load a package's whole declaration file
    for (const declaration of source.getExportDeclarations()) {
      const specifier = declaration.getModuleSpecifierValue()
      const named = declaration.getNamedExports()
      if (specifier === undefined) {
        // `export { View }`: the local binding is what carries the provenance
        for (const element of named) {
          if ((element.getAliasNode() ?? element.getNameNode()).getText() !== name) {
            continue
          }
          if (fromDeclaration(element)) return true
        }
        continue
      }
      if (!named.length && !declaration.getNamespaceExport()) {
        // `export * from '...'`: the name can come from any of them
        if (fromModule(specifier, declaration.getModuleSpecifierSourceFile(), name)) {
          return true
        }
        continue
      }
      for (const element of named) {
        if ((element.getAliasNode() ?? element.getNameNode()).getText() !== name) continue
        if (
          fromModule(
            specifier,
            declaration.getModuleSpecifierSourceFile(),
            element.getName()
          )
        ) {
          return true
        }
      }
    }

    for (const [exportName, declarations] of source.getExportedDeclarations()) {
      if (exportName !== name) continue
      for (const declaration of declarations) {
        if (fromDeclaration(declaration)) return true
      }
    }
    return false
  }

  const computeDeclaration = (declaration: Node): boolean => {
    if (Node.isImportSpecifier(declaration)) {
      const importDeclaration = declaration.getImportDeclaration()
      return fromModule(
        importDeclaration.getModuleSpecifierValue(),
        importDeclaration.getModuleSpecifierSourceFile(),
        declaration.getName()
      )
    }
    if (Node.isImportClause(declaration) || Node.isNamespaceImport(declaration)) {
      const importDeclaration = declaration.getFirstAncestorByKindOrThrow(
        SyntaxKind.ImportDeclaration
      )
      return tamaguiModule.test(importDeclaration.getModuleSpecifierValue())
    }
    if (Node.isExportSpecifier(declaration)) {
      const exportDeclaration = declaration.getExportDeclaration()
      const specifier = exportDeclaration.getModuleSpecifierValue()
      if (specifier !== undefined) {
        return fromModule(
          specifier,
          exportDeclaration.getModuleSpecifierSourceFile(),
          declaration.getName()
        )
      }
      // `export { View }`: whatever declares View in this file is the binding
      for (const local of declaration.getLocalTargetDeclarations()) {
        if (fromDeclaration(local)) return true
      }
      return false
    }
    if (Node.isVariableDeclaration(declaration)) {
      const initializer = declaration.getInitializer()
      return initializer !== undefined && isTamaguiValue(initializer)
    }
    return false
  }

  const fromIdentifier = (identifier: Identifier): boolean => {
    const symbol = identifier.getSymbol()
    if (symbol === undefined) return false
    for (const declaration of symbol.getDeclarations()) {
      if (fromDeclaration(declaration)) return true
    }
    // an alias the checker already followed across files
    const aliased = symbol.getAliasedSymbol()
    if (aliased === undefined) return false
    for (const declaration of aliased.getDeclarations()) {
      if (fromDeclaration(declaration)) return true
    }
    return false
  }

  const isTamaguiStyledCall = (call: CallExpression): boolean => {
    const callee = rootIdentifier(call.getExpression())
    if (callee === null || callee.getText() !== 'styled') return false
    return fromIdentifier(callee)
  }

  /**
   * A value re-bound from Tamagui: an alias (`const Sheet = SheetRaw as ...`), a
   * member of one, or the result of a Tamagui factory (`styled`,
   * `withStaticProperties`). A local factory over a Tamagui component is not one:
   * whatever it returns is that function's contract, not Tamagui's.
   */
  function isTamaguiValue(expression: Node): boolean {
    let current = expression
    while (
      Node.isParenthesizedExpression(current) ||
      Node.isAsExpression(current) ||
      Node.isNonNullExpression(current)
    ) {
      current = current.getExpression()
    }
    const identifier = rootIdentifier(
      Node.isCallExpression(current) ? current.getExpression() : current
    )
    return identifier !== null && fromIdentifier(identifier)
  }

  return {
    isTamaguiElement: (opening) => {
      const tag = rootIdentifier(opening.getTagNameNode())
      // a lowercase tag is an intrinsic element, never a Tamagui component
      if (tag === null || !/^[A-Z_$]/.test(tag.getText())) return false
      return fromIdentifier(tag)
    },
    isTamaguiStyledCall,
  }
}
