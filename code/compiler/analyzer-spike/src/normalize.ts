import {
  childNode,
  childNodes,
  findAstNode,
  identifierName,
  isAstNode,
  walkAst,
} from './ast'
import type { AnalyzerCandidate, AstNode, DefinitionSite } from './contracts'

export function definitionFromDeclaration(
  id: string,
  name: string,
  program: AstNode,
  declaration: AstNode
): DefinitionSite {
  let identifier = declaration
  let initializer: AstNode | null = null

  if (declaration.type === 'VariableDeclarator') {
    identifier = childNode(declaration, 'id') ?? declaration
    initializer = childNode(declaration, 'init')
  } else if (declaration.type === 'Identifier') {
    const declarator = findAstNode(
      program,
      (node) =>
        node.type === 'VariableDeclarator' &&
        childNode(node, 'id')?.start === declaration.start
    )
    if (declarator) {
      initializer = childNode(declarator, 'init')
    }
  }

  return {
    id,
    name,
    start: identifier.start,
    end: identifier.end,
    initializer,
  }
}

export interface ElementInspection {
  form: 'jsx' | 'jsx-runtime' | 'create-element'
  componentLocal: string
  componentDefinition: DefinitionSite | null
  propNames: string[]
}

function importProvenance(program: AstNode, localName: string): string | null {
  for (const statement of childNodes(program, 'body')) {
    if (statement.type !== 'ImportDeclaration') continue
    const source = childNode(statement, 'source')
    const sourceValue = source && typeof source.value === 'string' ? source.value : null
    for (const specifier of childNodes(statement, 'specifiers')) {
      if (identifierName(childNode(specifier, 'local')) === localName) {
        return sourceValue
      }
    }
  }
  return null
}

function objectPropertyNames(node: AstNode | null): string[] {
  if (!node || node.type !== 'ObjectExpression') return []
  return childNodes(node, 'properties')
    .map((property) => {
      if (property.type !== 'Property' && property.type !== 'ObjectProperty') return null
      const key = childNode(property, 'key')
      return identifierName(key) ?? (typeof key?.value === 'string' ? key.value : null)
    })
    .filter((name): name is string => name !== null)
}

export function inspectElementForms(
  candidate: AnalyzerCandidate,
  id: string
): ElementInspection[] {
  const program = candidate.programOf(id)
  const inspections: ElementInspection[] = []

  walkAst(program, (node) => {
    if (node.type === 'JSXOpeningElement') {
      const componentLocal = identifierName(childNode(node, 'name'))
      if (!componentLocal || !/^[A-Z]/.test(componentLocal)) return
      const propNames = childNodes(node, 'attributes')
        .map((attribute) => identifierName(childNode(attribute, 'name')))
        .filter((name): name is string => name !== null)
      inspections.push({
        form: 'jsx',
        componentLocal,
        componentDefinition: candidate.definitionOf(id, componentLocal),
        propNames,
      })
      return
    }

    if (node.type !== 'CallExpression') return
    const callee = childNode(node, 'callee')
    const args = childNodes(node, 'arguments')
    if (!callee || args.length === 0) return

    const calleeName = identifierName(callee)
    if (
      calleeName &&
      (calleeName === '_jsx' || calleeName === '_jsxs') &&
      importProvenance(program, calleeName) === 'react/jsx-runtime'
    ) {
      const componentLocal = identifierName(args[0])
      if (!componentLocal) return
      inspections.push({
        form: 'jsx-runtime',
        componentLocal,
        componentDefinition: candidate.definitionOf(id, componentLocal),
        propNames: objectPropertyNames(args[1]),
      })
      return
    }

    if (callee.type === 'MemberExpression') {
      const objectName = identifierName(childNode(callee, 'object'))
      const propertyName = identifierName(childNode(callee, 'property'))
      if (
        objectName === 'React' &&
        propertyName === 'createElement' &&
        importProvenance(program, objectName) === 'react'
      ) {
        const componentLocal = identifierName(args[0])
        if (!componentLocal) return
        inspections.push({
          form: 'create-element',
          componentLocal,
          componentDefinition: candidate.definitionOf(id, componentLocal),
          propNames: objectPropertyNames(args[1]),
        })
      }
    }
  })

  return inspections
}

export function declarationForName(program: AstNode, name: string): AstNode | null {
  return findAstNode(program, (node) => {
    if (node.type !== 'VariableDeclarator') return false
    return identifierName(childNode(node, 'id')) === name
  })
}

export function nodeAtSpan(program: AstNode, start: number, end: number): AstNode | null {
  return findAstNode(program, (node) => node.start === start && node.end === end)
}

export function asAstNode(value: unknown, label: string): AstNode {
  if (!isAstNode(value)) throw new Error(`${label} is not an AST node`)
  return value
}
