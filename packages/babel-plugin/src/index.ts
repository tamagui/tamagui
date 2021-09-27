process.env.SNACKUI_COMPILE_PROCESS = '1'

import { basename } from 'path'

import generator from '@babel/generator'
import { declare } from '@babel/helper-plugin-utils'
import template from '@babel/template'
import { Visitor } from '@babel/traverse'
import * as t from '@babel/types'
import {
  SnackOptions,
  createExtractor,
  isSimpleSpread,
  literalToAst,
  rnwPatch,
} from '@snackui/static'

const importNativeView = template(`
import { View as __ReactNativeView, Text as __ReactNativeText } from 'react-native';
`)

const importStyleSheet = template(`
import { StyleSheet as ReactNativeStyleSheet } from 'react-native';
`)

const importRNW = template(rnwPatch)

process.env.TARGET = process.env.TARGET || 'native'

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
    name: 'snackui',

    visitor: {
      Program: {
        enter(this: any, root, state) {
          let sourcePath = this.file.opts.filename

          if (sourcePath.includes('react-native-web/dist/exports/View')) {
            console.log('  🍑 patching react-native-web (babel)')
            // includes the exports we need
            // @ts-expect-error
            root.node.body.push(importRNW())
            return
          }

          // this filename comes back incorrect in react-native, it adds /ios/ for some reason
          // adding a fix here, but it's a bit tentative...
          if (process.env.SOURCE_ROOT?.endsWith('ios')) {
            sourcePath = sourcePath.replace('/ios', '')
          }

          if (options.exclude?.test(sourcePath)) {
            return
          }

          let hasImportedView = false
          let sheetStyles = {}
          const sheetIdentifier = root.scope.generateUidIdentifier('sheet')
          const firstComment = root.node.body[0]?.leadingComments?.[0]?.value?.trim()
          if (firstComment === 'snackui-ignore') {
            return
          }

          const shouldPrintDebug = firstComment?.trim() === 'debug'

          function addSheetStyle(style: any, node: t.JSXOpeningElement) {
            const styleIndex = `${Object.keys(sheetStyles).length}`
            let key = `${styleIndex}`
            if (process.env.NODE_ENV === 'development') {
              const lineNumbers = node.loc
                ? node.loc.start.line +
                  (node.loc.start.line !== node.loc.end.line ? `-${node.loc.end.line}` : '')
                : ''
              key += `:${basename(sourcePath)}:${lineNumbers}`
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
            deoptProps: new Set(['hoverStyle', 'pressStyle', 'focusStyle', 'pointerEvents']),
            excludeProps: [
              'className',
              'display',
              'userSelect',
              'selectable',
              'whiteSpace',
              'textOverflow',
              'cursor',
              'contain',
            ],
            ...options,
            sourcePath,
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

              const stylesExpr = t.arrayExpression([])

              let finalAttrs: (t.JSXAttribute | t.JSXSpreadAttribute)[] = []

              for (const attr of props.attrs) {
                function addStyle(expr: any, key: string) {
                  if (props.isFlattened) {
                    stylesExpr.elements.push(expr)
                  } else {
                    finalAttrs.push(
                      t.jsxAttribute(
                        t.jsxIdentifier(`_style${key}`),
                        t.jsxExpressionContainer(expr)
                      )
                    )
                  }
                }

                switch (attr.type) {
                  case 'style':
                    const ident = addSheetStyle(attr.value, props.node)
                    addStyle(ident, simpleHash(JSON.stringify(attr.value)))
                    break
                  case 'ternary':
                    const { consequent, alternate } = attr.value
                    const cons = addSheetStyle(consequent, props.node)
                    const alt = addSheetStyle(alternate, props.node)
                    const styleExpr = t.conditionalExpression(attr.value.test, cons, alt)
                    addStyle(styleExpr, simpleHash(JSON.stringify({ consequent, alternate })))
                    break
                  case 'attr':
                    if (t.isJSXSpreadAttribute(attr.value)) {
                      if (isSimpleSpread(attr.value)) {
                        stylesExpr.elements.push(
                          t.memberExpression(attr.value.argument, t.identifier('style'))
                        )
                      }
                    }
                    finalAttrs.push(attr.value)
                    break
                }
              }

              props.node.attributes = finalAttrs

              if (props.isFlattened) {
                props.node.attributes.push(
                  t.jsxAttribute(t.jsxIdentifier('style'), t.jsxExpressionContainer(stylesExpr))
                )
              }
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
    console.warn(`⚠️ Cannot pass style attribute to extracted style`)
  }
}

const simpleHash = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash &= hash // Convert to 32bit integer
  }
  return new Uint32Array([hash])[0].toString(36)
}
