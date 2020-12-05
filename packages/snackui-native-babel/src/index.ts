import { declare } from '@babel/helper-plugin-utils'
import template from '@babel/template'
import { Visitor } from '@babel/traverse'
import * as t from '@babel/types'
import { createExtractor, literalToAst } from 'snackui-static'

const importNativeView = template(`
import { View as ReactNativeView } from 'react-native';
`)

const importStyleSheet = template(`
import { StyleSheet as ReactNativeStyleSheet } from 'react-native';
`)

export default declare((api): { name: string; visitor: Visitor } => {
  api.assertVersion(7)

  const extractor = createExtractor({
    shouldPrintDebug: true,
    userOptions: {
      evaluateImportsWhitelist: ['constants.ts'],
    },
    sourceFileName: '',
  })

  return {
    name: 'snackui-stylesheet',

    visitor: {
      Program: {
        enter(root) {
          let hasImportedView = false
          let sheetStyles = {}
          const sheetIdentifier = root.scope.generateUidIdentifier('sheet')

          extractor.parse(root, {
            getFlattenedNode() {
              if (!hasImportedView) {
                hasImportedView = true
                root.unshiftContainer('body', importNativeView())
              }
              return 'ReactNativeView'
            },
            onExtractTag(props) {
              console.log('ok', props.originalNodeName, props.viewStyles)
              const sheetKey = `${Object.keys(sheetStyles).length}`
              sheetStyles[sheetKey] = props.viewStyles

              if (
                props.node.attributes.find(
                  (x) => x.type === 'JSXAttribute' && x.name.name === 'style'
                )
              ) {
                // we can just deopt here instead and log warning
                // need to make onExtractTag have a special catch error or similar
                throw new Error(
                  `Cannot pass style attribute to extracted style`
                )
              }

              const styleExpr = template(`[SHEET['KEY']]`)({
                SHEET: sheetIdentifier.name,
                KEY: sheetKey,
              }) as t.ExpressionStatement

              props.node.attributes.push(
                t.jsxAttribute(
                  t.jsxIdentifier('style'),
                  t.jsxExpressionContainer(styleExpr.expression)
                )
              )
            },
          })

          if (!Object.keys(sheetStyles).length) {
            return
          }

          root.unshiftContainer('body', importStyleSheet())

          const sheetObject = literalToAst(sheetStyles)

          const sheetOuter = template(
            `const SHEET = ReactNativeStyleSheet.create(null)`
          )({
            SHEET: sheetIdentifier.name,
          }) as any

          // replace the null with our object
          sheetOuter.declarations[0].init.arguments[0] = sheetObject

          // const sheetAst = t.variableDeclaration('const', [
          //   t.variableDeclarator(
          //     t.identifier(),
          //     t.callExpression(
          //       t.objectExpression([
          //         t.objectProperty(
          //           t.identifier('ReactNativeStyleSheet'),
          //           t.identifier('create')
          //         ),
          //       ]),
          //       [sheetObject]
          //     )
          //   ),
          // ])

          root.pushContainer('body', sheetOuter)
        },
      },
    },
  }
})
