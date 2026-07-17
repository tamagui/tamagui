import {
  childNode,
  childNodes,
  identifierName,
  parseModuleAst,
} from '@tamagui/compiler-core'

function declarationName(node: ReturnType<typeof childNode>): string | null {
  return identifierName(node ? childNode(node, 'id') : null)
}

/** Adds exports used only while evaluating local component modules. */
export function addLocalExports(source: string, id?: string): string {
  const program = parseModuleAst(source, id)
  const usedNames = new Set<string>()
  const candidates: string[] = []

  for (const statement of childNodes(program, 'body')) {
    if (statement.type === 'ExportNamedDeclaration') {
      for (const specifier of childNodes(statement, 'specifiers')) {
        const exported = childNode(specifier, 'exported')
        const name = identifierName(exported)
        if (name) usedNames.add(name)
      }
      const declaration = childNode(statement, 'declaration')
      if (declaration?.type === 'VariableDeclaration') {
        for (const declarator of childNodes(declaration, 'declarations')) {
          const name = declarationName(declarator)
          if (name) usedNames.add(name)
        }
      } else {
        const name = declarationName(declaration)
        if (name) usedNames.add(name)
      }
      continue
    }

    if (statement.type !== 'VariableDeclaration') continue
    const declarations = childNodes(statement, 'declarations')
    if (declarations.length !== 1) continue
    const declaration = declarations[0]!
    const name = declarationName(declaration)
    if (!name || !childNode(declaration, 'init') || usedNames.has(name)) continue
    candidates.push(name)
  }

  const names = candidates.filter((name) => !usedNames.has(name))
  return names.length ? `${source}\nexport { ${names.join(', ')} }\n` : source
}
