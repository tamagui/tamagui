import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

export function removeUnusedHooks(
  compFn: NodePath<any>,
  shouldPrintDebug: boolean
) {
  compFn.scope.crawl()
  // check the top level statements
  let bodyStatements = compFn?.get('body')
  if (!bodyStatements) {
    console.log('no body statemnts?', compFn)
    return
  }
  if (!Array.isArray(bodyStatements)) {
    if (bodyStatements.isFunctionExpression()) {
      bodyStatements = bodyStatements.scope.path.get('body')
    } else {
      bodyStatements = bodyStatements.get('body')
    }
  }
  if (!bodyStatements || !Array.isArray(bodyStatements)) {
    return
  }
  const statements = bodyStatements as NodePath<any>[]
  for (const statement of statements) {
    if (!statement.isVariableDeclaration()) {
      continue
    }
    const declarations = statement.get('declarations')
    if (!Array.isArray(declarations)) {
      continue
    }
    const isBindingReferenced = (name: string) => {
      return !!statement.scope.getBinding(name)?.referenced
    }
    for (const declarator of declarations) {
      const id = declarator.get('id')
      const init = declarator.node.init
      if (Array.isArray(id) || Array.isArray(init)) {
        continue
      }
      const shouldRemove = (() => {
        if (t.isIdentifier(id.node)) {
          // remove "const media = useMedia()"
          const name = id.node.name
          return !isBindingReferenced(name)
        } else if (t.isObjectPattern(id.node)) {
          // remove "const { sm } = useMedia()"
          const propPaths = id.get('properties') as NodePath<any>[]
          return propPaths.every((prop) => {
            if (!prop.isObjectProperty()) return false
            const value = prop.get('value')
            if (Array.isArray(value) || !value.isIdentifier()) return false
            const name = value.node.name
            return !isBindingReferenced(name)
          })
        }
        return false
      })()
      if (shouldRemove) {
        declarator.remove()
        if (shouldPrintDebug) {
          console.log(`  removed unused hook ${id.node['name'] ?? ''}`)
        }
      } else {
        if (shouldPrintDebug) {
          console.log('  dont remove', id.node['name'])
        }
      }
    }
  }
}
