import { basename } from 'node:path'

import { type BabelFileResult, transformFromAstSync } from '@babel/core'
import generator from '@babel/generator'
import { declare } from '@babel/helper-plugin-utils'
import { parse } from '@babel/parser'
import template from '@babel/template'
import * as t from '@babel/types'
import { createExtractor } from './createExtractor'
import { getPragmaOptions } from '../getPragmaOptions'
import type { TamaguiOptions } from '../types'
import { createLogger } from './createLogger'
import { isSimpleSpread } from './extractHelpers'
import { literalToAst } from './literalToAst'
import { loadTamaguiBuildConfigSync } from './loadTamagui'

const importNativeView = template(`
const __ReactNativeView = require('react-native').View;
const __ReactNativeText = require('react-native').Text;
`)

const importStyleSheet = template(`
const __ReactNativeStyleSheet = require('react-native').StyleSheet;
`)

const importWithStyle = template(`
const __withStableStyle = require('@tamagui/core')._withStableStyle;
`)

const extractor = createExtractor({ platform: 'native' })

let tamaguiBuildOptionsLoaded: TamaguiOptions | null

export function extractToNative(
  sourceFileName: string,
  sourceCode: string,
  options: TamaguiOptions
): BabelFileResult {
  const ast = parse(sourceCode, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })

  const babelPlugin = getBabelPlugin()

  const out = transformFromAstSync(ast, sourceCode, {
    plugins: [[babelPlugin, options]],
    configFile: false,
    sourceFileName,
    filename: sourceFileName,
  })

  if (!out) {
    throw new Error(`No output returned`)
  }

  return out
}

export function getBabelPlugin() {
  return declare((api, options: TamaguiOptions) => {
    api.assertVersion(7)
    return getBabelParseDefinition(options)
  })
}

export function getBabelParseDefinition(options: TamaguiOptions) {
  return {
    name: 'tamagui',

    visitor: {
      Program: {
        enter(this: any, root) {
          let sourcePath = this.file.opts.filename
          if (sourcePath?.includes('node_modules')) {
            return
          }
          // by default only pick up .jsx / .tsx
          if (!sourcePath?.endsWith('.jsx') && !sourcePath?.endsWith('.tsx')) {
            return
          }

          // this filename comes back incorrect in react-native, it adds /ios/ for some reason
          // adding a fix here, but it's a bit tentative...
          if (process.env.SOURCE_ROOT?.endsWith('ios')) {
            sourcePath = sourcePath.replace('/ios', '')
          }

          let hasImportedView = false
          let hasImportedViewWrapper = false
          const sheetStyles = {}
          const sheetIdentifier = root.scope.generateUidIdentifier('sheet')

          // babel doesnt append the `//` so we need to
          const firstCommentContents = // join because you can join together multiple pragmas
            root.node.body[0]?.leadingComments
              ?.map((comment) => comment?.value || ' ')
              .join(' ') ?? ''
          const firstComment = firstCommentContents ? `//${firstCommentContents}` : ''

          const { shouldPrintDebug, shouldDisable } = getPragmaOptions({
            source: firstComment,
            path: sourcePath,
          })

          if (shouldDisable) {
            return
          }

          if (!options.config && !options.components) {
            // if no config/components given try and load from the tamagui.build.ts file
            tamaguiBuildOptionsLoaded ||= loadTamaguiBuildConfigSync({})
          }

          const finalOptions = {
            // @ts-ignore just in case they leave it out
            platform: 'native',
            ...tamaguiBuildOptionsLoaded,
            ...options,
          } satisfies TamaguiOptions

          const printLog = createLogger(sourcePath, finalOptions)

          function addSheetStyle(style: any, node: t.JSXOpeningElement) {
            const styleIndex = `${Object.keys(sheetStyles).length}`
            let key = `${styleIndex}`
            if (process.env.NODE_ENV === 'development') {
              const lineNumbers = node.loc
                ? node.loc.start.line +
                  (node.loc.start.line !== node.loc.end.line
                    ? `-${node.loc.end.line}`
                    : '')
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

          let res

          try {
            res = extractor.parseSync(root, {
              importsWhitelist: ['constants.js', 'colors.js'],
              extractStyledDefinitions: options.forceExtractStyleDefinitions,
              excludeProps: new Set([
                'className',
                'userSelect',
                'whiteSpace',
                'textOverflow',
                'cursor',
                'contain',
              ]),
              shouldPrintDebug,
              ...finalOptions,
              // disable this extraction for now at least, need to figure out merging theme vs non-theme
              // because theme need to stay in render(), whereas non-theme can be extracted
              // for now just turn it off entirely at a small perf loss
              disableExtractInlineMedia: true,
              // disable extracting variables as no native concept of them (only theme values)
              disableExtractVariables: options.experimentalFlattenThemesOnNative
                ? false
                : 'theme',
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
                const { isFlattened } = props

                if (!isFlattened) {
                  // we aren't optimizing at all if not flattened anymore
                  return
                }

                assertValidTag(props.node)
                const stylesExpr = t.arrayExpression([])
                const hocStylesExpr = t.arrayExpression([])
                const expressions: t.Expression[] = []
                const finalAttrs: (t.JSXAttribute | t.JSXSpreadAttribute)[] = []
                const themeKeysUsed = new Set<string>()

                function getStyleExpression(style: Object | null) {
                  if (!style) return

                  // split theme properties and leave them as props since RN has no concept of theme
                  const { plain, themed } = splitThemeStyles(style)

                  // TODO: themed is not a good name, because it's not just theme it also includes tokens
                  let themeExpr: t.ObjectExpression | null = null
                  if (themed && options.experimentalFlattenThemesOnNative) {
                    for (const key in themed) {
                      themeKeysUsed.add(themed[key].split('$')[1])
                    }

                    // make a sub-array
                    themeExpr = getThemedStyleExpression(themed)
                  }
                  const ident = addSheetStyle(plain, props.node)
                  if (themeExpr) {
                    addStyleExpression(ident)
                    addStyleExpression(ident, true)
                    return themeExpr
                  }
                  // since we only do flattened disabling this path
                  return ident
                }

                function addStyleExpression(expr: any, HOC = false) {
                  if (Array.isArray(expr)) {
                    ;(HOC ? hocStylesExpr : stylesExpr).elements.push(...expr)
                  } else {
                    ;(HOC ? hocStylesExpr : stylesExpr).elements.push(expr)
                  }
                }

                function getThemedStyleExpression(styles: Object) {
                  const themedStylesAst = literalToAst(styles) as t.ObjectExpression
                  themedStylesAst.properties.forEach((_) => {
                    const prop = _ as t.ObjectProperty
                    if (prop.value.type === 'StringLiteral') {
                      prop.value = t.memberExpression(
                        t.identifier('theme'),
                        t.identifier(prop.value.value.slice(1) + '.get()')
                      )
                    }
                  })
                  return themedStylesAst
                }

                let hasDynamicStyle = false

                for (const attr of props.attrs) {
                  switch (attr.type) {
                    case 'style': {
                      let styleExpr = getStyleExpression(attr.value)
                      addStyleExpression(styleExpr)
                      if (options.experimentalFlattenThemesOnNative) {
                        addStyleExpression(styleExpr, true)
                      }
                      break
                    }

                    case 'ternary': {
                      const { consequent, alternate } = attr.value
                      const consExpr = getStyleExpression(consequent)
                      const altExpr = getStyleExpression(alternate)

                      if (options.experimentalFlattenThemesOnNative) {
                        expressions.push(attr.value.test)
                        addStyleExpression(
                          t.conditionalExpression(
                            t.identifier(`_expressions[${expressions.length - 1}]`),
                            consExpr || t.nullLiteral(),
                            altExpr || t.nullLiteral()
                          ),
                          true
                        )
                      }

                      const styleExpr = t.conditionalExpression(
                        attr.value.test,
                        consExpr || t.nullLiteral(),
                        altExpr || t.nullLiteral()
                      )
                      addStyleExpression(
                        styleExpr
                        // TODO: what is this for ?
                        // isFlattened ? simpleHash(JSON.stringify({ consequent, alternate })) : undefined
                      )
                      break
                    }

                    case 'dynamic-style': {
                      hasDynamicStyle = true
                      expressions.push(attr.value as t.Expression)
                      if (options.experimentalFlattenDynamicValues) {
                        addStyleExpression(
                          t.objectExpression([
                            t.objectProperty(
                              t.identifier(attr.name as string),
                              t.identifier(`_expressions[${expressions.length - 1}]`)
                            ),
                          ]),
                          true
                        )
                      } else {
                        addStyleExpression(
                          t.objectExpression([
                            t.objectProperty(
                              t.identifier(attr.name as string),
                              attr.value as t.Expression
                            ),
                          ])
                        )
                      }
                      break
                    }

                    case 'attr': {
                      if (t.isJSXSpreadAttribute(attr.value)) {
                        if (isSimpleSpread(attr.value)) {
                          stylesExpr.elements.push(
                            t.memberExpression(attr.value.argument, t.identifier('style'))
                          )
                          if (options.experimentalFlattenThemesOnNative) {
                            hocStylesExpr.elements.push(
                              t.memberExpression(
                                attr.value.argument,
                                t.identifier('style')
                              )
                            )
                          }
                        }
                      }
                      finalAttrs.push(attr.value)
                      break
                    }
                  }
                }

                props.node.attributes = finalAttrs

                if (props.isFlattened) {
                  if (
                    options.experimentalFlattenThemesOnNative &&
                    (themeKeysUsed.size ||
                      hocStylesExpr.elements.length > 1 ||
                      hasDynamicStyle)
                  ) {
                    if (!hasImportedViewWrapper) {
                      root.unshiftContainer('body', importWithStyle())
                      hasImportedViewWrapper = true
                    }

                    const name = props.node.name['name']
                    const WrapperIdentifier = root.scope.generateUidIdentifier(
                      name + 'Wrapper'
                    )

                    root.pushContainer(
                      'body',
                      t.variableDeclaration('const', [
                        t.variableDeclarator(
                          WrapperIdentifier,
                          t.callExpression(t.identifier('__withStableStyle'), [
                            t.identifier(name),
                            t.arrowFunctionExpression(
                              [t.identifier('theme'), t.identifier('_expressions')],
                              t.blockStatement([
                                t.returnStatement(
                                  t.callExpression(
                                    t.memberExpression(
                                      t.identifier('React'),
                                      t.identifier('useMemo')
                                    ),
                                    [
                                      t.arrowFunctionExpression(
                                        [],
                                        t.blockStatement([
                                          t.returnStatement(
                                            t.arrayExpression([...hocStylesExpr.elements])
                                          ),
                                        ])
                                      ),
                                      t.arrayExpression([
                                        t.spreadElement(t.identifier('_expressions')),
                                      ]),
                                    ]
                                  )
                                ),
                              ])
                            ),
                          ])
                        ),
                      ])
                    )

                    // @ts-ignore
                    props.node.name = WrapperIdentifier
                    if (props.jsxPath.node.closingElement) {
                      // @ts-ignore
                      props.jsxPath.node.closingElement.name = WrapperIdentifier
                    }

                    if (expressions.length) {
                      props.node.attributes.push(
                        t.jsxAttribute(
                          t.jsxIdentifier('expressions'),
                          t.jsxExpressionContainer(t.arrayExpression(expressions))
                        )
                      )
                    }
                  } else {
                    props.node.attributes.push(
                      t.jsxAttribute(
                        t.jsxIdentifier('style'),
                        t.jsxExpressionContainer(
                          stylesExpr.elements.length === 1
                            ? (stylesExpr.elements[0] as any)
                            : stylesExpr
                        )
                      )
                    )
                  }
                }
              },
            })
          } catch (err) {
            if (err instanceof Error) {
              // metro doesn't show stack so we can
              let message = `${shouldPrintDebug === 'verbose' ? err : err.message}`
              if (message.includes('Unexpected return value from visitor method')) {
                message = 'Unexpected return value from visitor method'
              }
              console.warn('Error in Tamagui parse, skipping', message, err.stack)
              return
            }
          }

          if (!Object.keys(sheetStyles).length) {
            if (shouldPrintDebug) {
              console.info('END no styles')
            }
            if (res) printLog(res)
            return
          }

          const sheetObject = literalToAst(sheetStyles)
          const sheetOuter = template(
            'const SHEET = __ReactNativeStyleSheet.create(null)'
          )({
            SHEET: sheetIdentifier.name,
          }) as any

          // replace the null with our object
          sheetOuter.declarations[0].init.arguments[0] = sheetObject
          root.unshiftContainer('body', sheetOuter)
          // add import
          root.unshiftContainer('body', importStyleSheet())

          if (shouldPrintDebug) {
            console.info('\n -------- output code ------- \n')
            console.info(
              generator(root.parent)
                .code.split('\n')
                .filter((x) => !x.startsWith('//'))
                .join('\n')
            )
          }

          if (res) printLog(res)
        },
      },
    },
  }
}

function assertValidTag(node: t.JSXOpeningElement) {
  if (node.attributes.find((x) => x.type === 'JSXAttribute' && x.name.name === 'style')) {
    // we can just deopt here instead and log warning
    // need to make onExtractTag have a special catch error or similar
    if (process.env.DEBUG?.startsWith('tamagui')) {
      console.warn('⚠️ Cannot pass style attribute to extracted style')
    }
  }
}

function splitThemeStyles(style: Object) {
  const themed: Object = {}
  const plain: Object = {}
  let noTheme = true
  for (const key in style) {
    const val = style[key]
    if (val && val[0] === '$') {
      themed[key] = val
      noTheme = false
    } else {
      plain[key] = val
    }
  }
  return { themed: noTheme ? null : themed, plain }
}
