import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

import { CONCAT_CLASSNAME_IMPORT } from './extractToClassNames'

const importConcatPkg = '@snackui/helpers'

export function ensureImportingConcat(path: NodePath<t.Program>) {
  const bodyPath = path.get('body')
  const imported: NodePath<t.ImportDeclaration> | undefined = bodyPath.find(
    (x) => x.isImportDeclaration() && x.node.source.value === importConcatPkg
  ) as any
  const importSpecifier = t.importSpecifier(
    t.identifier(CONCAT_CLASSNAME_IMPORT),
    t.identifier(CONCAT_CLASSNAME_IMPORT)
  )

  if (!imported) {
    path.node.body.push(
      t.importDeclaration([importSpecifier], t.stringLiteral(importConcatPkg))
    )
    return
  }

  const specifiers = imported.node.specifiers
  const alreadyImported = specifiers.some(
    (x) =>
      t.isImportSpecifier(x) &&
      t.isIdentifier(x.imported) &&
      x.imported.name === CONCAT_CLASSNAME_IMPORT
  )

  if (!alreadyImported) {
    specifiers.push(
      t.importSpecifier(
        t.identifier(CONCAT_CLASSNAME_IMPORT),
        t.identifier(CONCAT_CLASSNAME_IMPORT)
      )
    )
  }
}
