process.env.SNACKUI_COMPILE_PROCESS = '1'

import { basename } from 'path'

import generator from '@babel/generator'
import { declare } from '@babel/helper-plugin-utils'
import template from '@babel/template'
import { Visitor } from '@babel/traverse'
import * as t from '@babel/types'
import { SnackOptions, createExtractor, isSimpleSpread, literalToAst } from '@snackui/static'

const importNativeView = template(`
import { View as __ReactNativeView, Text as __ReactNativeText } from 'react-native';
`)

const importStyleSheet = template(`
import { StyleSheet as ReactNativeStyleSheet } from 'react-native';
`)

const extractor = createExtractor()

export default declare(function snackBabelPlugin(
  api,
  options: SnackOptions
): {
  name: string
  visitor: Visitor
} {
  api.assertVersion(7)

  return {
    name: 'snackui-stylesheet',

    visitor: {
      Program: {
        enter(this: any, root, state) {
          const sourceFileName = this.file.opts.filename
          if (options.exclude?.test(sourceFileName)) {
            return
          }

          let hasImportedView = false
          let sheetStyles = {}
          const sheetIdentifier = root.scope.generateUidIdentifier('sheet')
          const firstComment = root.node.body[0]?.leadingComments?.[0]?.value?.trim()
          if (firstComment === 'disable-snackui') {
            return
          }

          const shouldPrintDebug = firstComment?.trim() === 'debug'

          function addSheetStyle(style: any, node: t.JSXOpeningElement) {
            const styleIndex = `${Object.keys(sheetStyles).length}`
            let key = styleIndex
            if (process.env.NODE_ENV === 'development') {
              const lineNumbers = node.loc
                ? node.loc.start.line +
                  (node.loc.start.line !== node.loc.end.line ? `-${node.loc.end.line}` : '')
                : ''
              key = `${styleIndex}:${basename(sourceFileName)}:${lineNumbers}`
            }
            sheetStyles[key] = style
            return readStyleExpr(key)
          }

          function readStyleExpr(key: string) {
            return template(`SHEET['KEY']`)({
              SHEET: sheetIdentifier.name,
              KEY: key,
            })['expression'] as t.MemberExpression
          }

          if (options.themesFile) {
            console.warn(
              `⚠️ No need to pass themesFile to native apps, themes always run at runtime`
            )
          }

          extractor.parse(root, {
            shouldPrintDebug,
            evaluateImportsWhitelist: ['constants.js', 'colors.js'],
            deoptProps: ['hoverStyle', 'pressStyle', 'focusStyle', 'pointerEvents'],
            excludeProps: [
              'display',
              'userSelect',
              'whiteSpace',
              'textOverflow',
              'cursor',
              'contain',
            ],
            ...options,
            sourceFileName,
            disableThemes: true,
            getFlattenedNode(props) {
              if (!hasImportedView) {
                hasImportedView = true
                root.unshiftContainer('body', importNativeView())
              }
              return props.isTextView ? '__ReactNativeText' : '__ReactNativeView'
            },
            onExtractTag(props) {
              assertValidTag(props.node)

              const baseStyleExpr = addSheetStyle(props.viewStyles, props.node)
              const stylesExpr = t.arrayExpression([baseStyleExpr])

              let finalAttrs: (t.JSXAttribute | t.JSXSpreadAttribute)[] = []

              for (const attr of props.attrs) {
                switch (attr.type) {
                  case 'ternary':
                    const cons = addSheetStyle(attr.value.consequent, props.node)
                    const alt = addSheetStyle(attr.value.alternate, props.node)
                    stylesExpr.elements.push(t.conditionalExpression(attr.value.test, cons, alt))
                    break
                  case 'attr':
                    if (t.isJSXSpreadAttribute(attr.value)) {
                      if (isSimpleSpread(attr.value)) {
                        stylesExpr.elements.push(
                          t.memberExpression(attr.value.argument, t.identifier('style'))
                        )
                      } else {
                        finalAttrs.push(attr.value)
                      }
                    } else {
                      finalAttrs.push(attr.value)
                    }
                    break
                }
              }

              props.node.attributes = finalAttrs
              props.node.attributes.push(
                t.jsxAttribute(t.jsxIdentifier('style'), t.jsxExpressionContainer(stylesExpr))
              )
            },
          })

          if (!Object.keys(sheetStyles).length) {
            if (shouldPrintDebug) {
              console.log('END no styles')
            }
            return
          }

          root.unshiftContainer('body', importStyleSheet())

          const sheetObject = literalToAst(sheetStyles)
          const sheetOuter = template(`const SHEET = ReactNativeStyleSheet.create(null)`)({
            SHEET: sheetIdentifier.name,
          }) as any

          // replace the null with our object
          sheetOuter.declarations[0].init.arguments[0] = sheetObject

          root.unshiftContainer('body', sheetOuter)

          if (shouldPrintDebug) {
            console.log('>>', generator(root.parent).code)
          }
        },
      },
    },
  }
})

function assertValidTag(node: t.JSXOpeningElement) {
  if (node.attributes.find((x) => x.type === 'JSXAttribute' && x.name.name === 'style')) {
    // we can just deopt here instead and log warning
    // need to make onExtractTag have a special catch error or similar
    throw new Error(`Cannot pass style attribute to extracted style`)
  }
}
