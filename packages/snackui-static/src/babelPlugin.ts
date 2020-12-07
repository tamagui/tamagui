import { declare } from '@babel/helper-plugin-utils'
import template from '@babel/template'
import { Visitor } from '@babel/traverse'
import * as t from '@babel/types'
import { createExtractor, literalToAst } from '@snackui/static'

const importNativeView = template(`
import { View as __ReactNativeView, Text as __ReactNativeText } from 'react-native';
`)

const importStyleSheet = template(`
import { StyleSheet as ReactNativeStyleSheet } from 'react-native';
`)

export const babelPlugin = declare((api): {
  name: string
  visitor: Visitor
} => {
  api.assertVersion(7)

  const extractor = createExtractor({
    shouldPrintDebug: process.env.DEBUG ? true : false,
    options: {
      evaluateImportsWhitelist: ['constants.ts'],
      deoptProps: ['hoverStyle', 'pressStyle', 'focusStyle', 'pointerEvents'],
      excludeProps: [
        'display',
        'userSelect',
        'whiteSpace',
        'textOverflow',
        'cursor',
        'contain',
      ],
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

          function addSheetStyle(style: any) {
            const key = `${Object.keys(sheetStyles).length}`
            sheetStyles[key] = style
            return readStyleExpr(key)
          }

          function readStyleExpr(key: string) {
            return template(`SHEET['KEY']`)({
              SHEET: sheetIdentifier.name,
              KEY: key,
            })['expression'] as t.MemberExpression
          }

          extractor.parse(root, {
            getFlattenedNode(props) {
              if (!hasImportedView) {
                hasImportedView = true
                root.unshiftContainer('body', importNativeView())
              }
              return props.isTextView
                ? '__ReactNativeText'
                : '__ReactNativeView'
            },
            onExtractTag(props) {
              assertValidTag(props.node)

              const baseStyleExpr = addSheetStyle(props.viewStyles)
              const stylesExpr = t.arrayExpression([baseStyleExpr])

              if (props.ternaries) {
                for (const ternary of props.ternaries) {
                  const cons = addSheetStyle(ternary.consequentStyles)
                  const alt = addSheetStyle(ternary.alternateStyles)
                  stylesExpr.elements.push(
                    t.conditionalExpression(ternary.test, cons, alt)
                  )
                }
              }

              props.node.attributes.push(
                t.jsxAttribute(
                  t.jsxIdentifier('style'),
                  t.jsxExpressionContainer(stylesExpr)
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

          root.unshiftContainer('body', sheetOuter)
        },
      },
    },
  }
})

function assertValidTag(node: t.JSXOpeningElement) {
  if (
    node.attributes.find(
      (x) => x.type === 'JSXAttribute' && x.name.name === 'style'
    )
  ) {
    // we can just deopt here instead and log warning
    // need to make onExtractTag have a special catch error or similar
    throw new Error(`Cannot pass style attribute to extracted style`)
  }
}
