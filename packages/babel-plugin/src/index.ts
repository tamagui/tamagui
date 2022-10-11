process.env.TAMAGUI_COMPILE_PROCESS = '1'

import { basename } from 'path'

import generator from '@babel/generator'
import { declare } from '@babel/helper-plugin-utils'
import template from '@babel/template'
import { Visitor } from '@babel/traverse'
import * as t from '@babel/types'
import { simpleHash } from '@tamagui/simple-hash'
import {
  TamaguiOptions,
  createExtractor,
  getPragmaOptions,
  isSimpleSpread,
  literalToAst,
  patchReactNativeWeb,
} from '@tamagui/static'

const importNativeView = template(`
import { View as __ReactNativeView, Text as __ReactNativeText } from 'react-native';
`)

const importStyleSheet = template(`
import { StyleSheet as ReactNativeStyleSheet } from 'react-native';
`)

process.env.TAMAGUI_TARGET = process.env.TAMAGUI_TARGET || 'native'

const extractor = createExtractor()

export default declare(function snackBabelPlugin(
  api,
  options: TamaguiOptions
): {
  name: string
  visitor: Visitor
} {
  api.assertVersion(7)

  if (!process.env.TAMAGUI_DISABLE_RNW_PATCH) {
    patchReactNativeWeb()
  }

  return {
    name: 'tamagui',

    visitor: {
      Program: {
        enter(this: any, root) {
          let sourcePath = this.file.opts.filename

          // this filename comes back incorrect in react-native, it adds /ios/ for some reason
          // adding a fix here, but it's a bit tentative...
          if (process.env.SOURCE_ROOT?.endsWith('ios')) {
            sourcePath = sourcePath.replace('/ios', '')
          }

          if (options.exclude?.test(sourcePath)) {
            return
          }

          let hasImportedView = false
          const sheetStyles = {}
          const sheetIdentifier = root.scope.generateUidIdentifier('sheet')
          const firstComment = root.node.body[0]?.leadingComments?.[0]?.value?.trim() ?? ''
          const { shouldPrintDebug, shouldDisable } = getPragmaOptions({
            disableCommentCheck: true,
            source: firstComment,
            path: sourcePath,
          })

          if (shouldDisable) {
            return
          }

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

          try {
            extractor.parseSync(root, {
              target: 'native',
              shouldPrintDebug,
              importsWhitelist: ['constants.js', 'colors.js'],
              deoptProps: new Set(['focusStyle', 'hoverStyle', 'pressStyle', 'pointerEvents']),
              extractStyledDefinitions: options.forceExtractStyleDefinitions || false,
              excludeProps: new Set([
                'className',
                'userSelect',
                'selectable',
                'whiteSpace',
                'textOverflow',
                'cursor',
                'contain',
              ]),
              ...options,
              // disable this extraction for now at least, need to figure out merging theme vs non-theme
              // because theme need to stay in render(), whereas non-theme can be extracted
              // for now just turn it off entirely at a small perf loss
              disableExtractInlineMedia: true,
              // disable extracting variables as no native concept of them (only theme values)
              disableExtractVariables: 'theme',
              sourcePath,

              // disabling flattening for now
              // it's flattening a plain <Paragraph>hello</Paragraph> which breaks things because themes
              // thinking it's not really worth the effort to do much compilation on native
              // for now just disable flatten as it can only run in narrow places on native
              // disableFlattening: 'styled',

              getFlattenedNode({ isTextView }) {
                if (!hasImportedView) {
                  hasImportedView = true
                  root.unshiftContainer('body', importNativeView())
                }
                return isTextView ? '__ReactNativeText' : '__ReactNativeView'
              },

              onExtractTag(props) {
                assertValidTag(props.node)
                const stylesExpr = t.arrayExpression([])
                const finalAttrs: (t.JSXAttribute | t.JSXSpreadAttribute)[] = []

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

                for (const attr of props.attrs) {
                  switch (attr.type) {
                    case 'style':
                      // split theme properties and leave them as props since RN has no concept of theme
                      const { themed, plain } = splitThemeStyles(attr.value)
                      for (const key in themed) {
                        finalAttrs.push(
                          t.jsxAttribute(t.jsxIdentifier(key), t.stringLiteral(themed[key]))
                        )
                      }
                      const ident = addSheetStyle(plain, props.node)
                      addStyle(ident, simpleHash(JSON.stringify(plain)))
                      break
                    case 'ternary':
                      // TODO use splitThemeStyles
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
          } catch (err) {
            if (err instanceof Error) {
              // metro doesn't show stack so we can
              console.warn(
                'Error in Tamagui parse, skipping',
                shouldPrintDebug === 'verbose' ? err : err.message
              )
              return
            }
          }

          if (!Object.keys(sheetStyles).length) {
            if (shouldPrintDebug) {
              // eslint-disable-next-line no-console
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
            // eslint-disable-next-line no-console
            console.log('\n -------- output code ------- \n')
            // eslint-disable-next-line no-console
            console.log(
              generator(root.parent)
                .code.split('\n')
                .filter((x) => !x.startsWith('//'))
                .join('\n')
            )
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
    if (process.env.DEBUG?.startsWith('tamagui')) {
      // eslint-disable-next-line no-console
      console.warn(`⚠️ Cannot pass style attribute to extracted style`)
    }
  }
}

function splitThemeStyles(style: Object) {
  const themed = {}
  const plain = {}
  for (const key in style) {
    const val = style[key]
    if (val && val[0] === '$') {
      themed[key] = val
    } else {
      plain[key] = val
    }
  }
  return { themed, plain }
}
