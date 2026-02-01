import { type BabelFileResult, transformFromAstSync } from '@babel/core'
import generator from '@babel/generator'
import { declare } from '@babel/helper-plugin-utils'
import { parse } from '@babel/parser'
import template from '@babel/template'
import * as t from '@babel/types'
import { basename } from 'node:path'
import { getPragmaOptions } from '../getPragmaOptions'
import type { ExtractTagProps, TamaguiOptions } from '../types'
import { createExtractor } from './createExtractor'
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

const importReactUseMemo = template(`
const __ReactUseMemo = require('react').useMemo;
`)

// optimized native components that swap styles based on theme without re-renders
const importTamaguiView = template(`
const __TamaguiView = require('@tamagui/native')._TamaguiView;
const __TamaguiText = require('@tamagui/native')._TamaguiText;
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
          let hasImportedTamaguiView = false
          let wrapperCount = 0
          let optimizedStyleCount = 0
          const sheetStyles = {}
          const sheetIdentifier = root.scope.generateUidIdentifier('sheet')
          // for optimized path: stores pre-computed styles for all themes
          const optimizedStyles: Record<string, Record<string, Object>> = {}

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
              // disable extracting variables as no native concept of them (only theme values)
              disableExtractVariables: false,
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

                // try optimized path: pre-compute styles for all themes at build time
                const themes = props.config?.themes
                if (canUseOptimizedPath(props.attrs, themes)) {
                  const useOptimized = tryOptimizedExtraction(
                    props,
                    themes,
                    optimizedStyles,
                    optimizedStyleCount,
                    root,
                    hasImportedTamaguiView,
                    (imported) => {
                      hasImportedTamaguiView = imported
                    },
                    (count) => {
                      optimizedStyleCount = count
                    }
                  )
                  if (useOptimized) {
                    return
                  }
                }

                // fallback to existing runtime theme resolution
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
                  if (themed) {
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
                      const propVal = prop.value.value.slice(1)
                      const isComputed = !t.isValidIdentifier(propVal)
                      prop.value = t.callExpression(
                        t.memberExpression(
                          t.memberExpression(
                            t.identifier('theme'),
                            isComputed ? t.stringLiteral(propVal) : t.identifier(propVal),
                            isComputed
                          ),
                          t.identifier('get')
                        ),
                        []
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
                      addStyleExpression(styleExpr, true)
                      break
                    }

                    case 'ternary': {
                      const { consequent, alternate } = attr.value
                      const consExpr = getStyleExpression(consequent)
                      const altExpr = getStyleExpression(alternate)

                      expressions.push(attr.value.test)
                      addStyleExpression(
                        t.conditionalExpression(
                          t.identifier(`_expressions[${expressions.length - 1}]`),
                          consExpr || t.nullLiteral(),
                          altExpr || t.nullLiteral()
                        ),
                        true
                      )

                      const styleExpr = t.conditionalExpression(
                        attr.value.test,
                        consExpr || t.nullLiteral(),
                        altExpr || t.nullLiteral()
                      )
                      addStyleExpression(styleExpr)
                      break
                    }

                    case 'attr': {
                      if (t.isJSXSpreadAttribute(attr.value)) {
                        if (isSimpleSpread(attr.value)) {
                          stylesExpr.elements.push(
                            t.memberExpression(attr.value.argument, t.identifier('style'))
                          )
                          hocStylesExpr.elements.push(
                            t.memberExpression(attr.value.argument, t.identifier('style'))
                          )
                        }
                      }
                      finalAttrs.push(attr.value)
                      break
                    }
                  }
                }

                props.node.attributes = finalAttrs

                if (
                  themeKeysUsed.size ||
                  hocStylesExpr.elements.length > 1 ||
                  hasDynamicStyle
                ) {
                  if (!hasImportedViewWrapper) {
                    root.unshiftContainer('body', importWithStyle())
                    root.unshiftContainer('body', importReactUseMemo())
                    hasImportedViewWrapper = true
                  }

                  const name = props.flatNodeName || props.node.name['name']
                  // Use a unique name that won't conflict with the base component
                  const wrapperName = `_${name.replace(/^_+/, '')}Styled${wrapperCount++}`
                  // Use regular identifier for variable declarations, JSX identifier for JSX elements
                  const WrapperIdentifier = t.identifier(wrapperName)
                  const WrapperJSXIdentifier = t.jsxIdentifier(wrapperName)

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
                                t.callExpression(t.identifier('__ReactUseMemo'), [
                                  t.arrowFunctionExpression(
                                    [],
                                    t.blockStatement([
                                      t.returnStatement(
                                        t.arrayExpression([...hocStylesExpr.elements])
                                      ),
                                    ])
                                  ),
                                  t.identifier('_expressions'),
                                ])
                              ),
                            ])
                          ),
                        ])
                      ),
                    ])
                  )

                  // @ts-ignore - use JSX identifier for JSX elements
                  props.node.name = WrapperJSXIdentifier
                  // Also set the opening element directly via the path
                  props.jsxPath.node.openingElement.name = WrapperJSXIdentifier
                  if (props.jsxPath.node.closingElement) {
                    // @ts-ignore
                    props.jsxPath.node.closingElement.name = t.jsxIdentifier(wrapperName)
                  }

                  if (expressions.length) {
                    props.node.attributes.push(
                      t.jsxAttribute(
                        t.jsxIdentifier('_expressions'),
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

/**
 * Try the optimized extraction path that pre-computes styles for all themes.
 * Returns true if optimization was successful and component was transformed.
 */
function tryOptimizedExtraction(
  props: ExtractTagProps,
  themes: Record<string, any>,
  optimizedStyles: Record<string, Record<string, Object>>,
  styleCount: number,
  root: any,
  hasImportedTamaguiView: boolean,
  setHasImportedTamaguiView: (v: boolean) => void,
  setStyleCount: (v: number) => void
): boolean {
  // collect all static styles from attrs
  let combinedStyle: Object = {}

  for (const attr of props.attrs) {
    if (attr.type === 'style' && attr.value) {
      combinedStyle = { ...combinedStyle, ...attr.value }
    }
    // shouldn't have attrs here since canUseOptimizedPath filtered them
    if (attr.type === 'attr') {
      // preserve non-style attributes
      continue
    }
  }

  // resolve styles for all themes
  const themedStyles = resolveStylesForAllThemes(combinedStyle, themes)
  if (!themedStyles) {
    // no themed values, shouldn't happen since canUseOptimizedPath checked
    return false
  }

  // add import for optimized components
  if (!hasImportedTamaguiView) {
    root.unshiftContainer('body', importTamaguiView())
    setHasImportedTamaguiView(true)
  }

  // generate unique key for this style matrix
  const styleKey = `_opt${styleCount}`
  setStyleCount(styleCount + 1)

  // store the pre-computed styles
  optimizedStyles[styleKey] = themedStyles

  // determine if text or view
  const isText = props.staticConfig?.isText || false
  const componentName = isText ? '__TamaguiText' : '__TamaguiView'

  // filter to keep only non-style attributes
  const finalAttrs: (t.JSXAttribute | t.JSXSpreadAttribute)[] = []
  for (const attr of props.attrs) {
    if (attr.type === 'attr') {
      finalAttrs.push(attr.value)
    }
  }

  // add __styles prop with pre-computed theme styles
  finalAttrs.push(
    t.jsxAttribute(
      t.jsxIdentifier('__styles'),
      t.jsxExpressionContainer(literalToAst(themedStyles) as t.Expression)
    )
  )

  // update the node
  props.node.attributes = finalAttrs
  // @ts-ignore
  props.node.name = t.jsxIdentifier(componentName)
  props.jsxPath.node.openingElement.name = t.jsxIdentifier(componentName)
  if (props.jsxPath.node.closingElement) {
    // @ts-ignore
    props.jsxPath.node.closingElement.name = t.jsxIdentifier(componentName)
  }

  return true
}

/**
 * Check if we can use the optimized path that pre-computes styles for all themes.
 * Requirements:
 * - Must have themes available in config
 * - Component must have themed styles (uses $token values)
 * - No ternary expressions (those need runtime evaluation)
 * - No spreads (can't statically analyze)
 */
function canUseOptimizedPath(
  attrs: Array<{ type: string; value: any }>,
  themes: Record<string, any> | undefined
): boolean {
  // need themes to pre-compute
  if (!themes || Object.keys(themes).length === 0) {
    return false
  }

  let hasThemedStyle = false

  for (const attr of attrs) {
    // check if any style has theme tokens
    if (attr.type === 'style' && attr.value) {
      const { themed } = splitThemeStyles(attr.value)
      if (themed) {
        hasThemedStyle = true
      }
    }

    // ternaries need runtime evaluation, can't optimize
    if (attr.type === 'ternary') {
      return false
    }

    // spreads make static analysis impossible
    if (attr.type === 'attr' && attr.value?.type === 'JSXSpreadAttribute') {
      return false
    }
  }

  // only use optimized path if there are themed styles to pre-compute
  return hasThemedStyle
}

/**
 * Filter themes to only include base themes and sub-themes (color/state variants).
 * Excludes component-specific themes like "dark_Button", "light_Card", etc.
 *
 * Component themes are identified by having PascalCase parts (e.g., Button, Card).
 * We keep themes where all parts are lowercase (e.g., dark, light_blue, dark_active).
 */
function filterToBaseThemes(themes: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}

  for (const themeName of Object.keys(themes)) {
    const parts = themeName.split('_')

    // check if all parts are lowercase (no component names like "Button")
    const isBaseTheme = parts.every(part => part === part.toLowerCase())

    if (isBaseTheme) {
      result[themeName] = themes[themeName]
    }
  }

  return result
}

/**
 * Deduplicate themes that resolve to identical style values.
 * Many themes (especially sub-themes with different names) can have the same
 * actual values. Instead of storing all of them, we map multiple theme names
 * to the same style object using a "__themes" array.
 *
 * Returns a map where each unique style has a list of theme names that use it.
 */
function deduplicateThemeStyles(
  themedStyles: Record<string, Object>
): Record<string, Object> {
  // map from JSON string of style -> canonical theme name
  const styleToTheme: Map<string, string> = new Map()
  // map from canonical theme -> list of all theme names with same style
  const themeAliases: Map<string, string[]> = new Map()

  for (const [themeName, style] of Object.entries(themedStyles)) {
    const styleKey = JSON.stringify(style)

    if (styleToTheme.has(styleKey)) {
      // this style already exists, add this theme as an alias
      const canonicalTheme = styleToTheme.get(styleKey)!
      const aliases = themeAliases.get(canonicalTheme) || [canonicalTheme]
      aliases.push(themeName)
      themeAliases.set(canonicalTheme, aliases)
    } else {
      // new unique style
      styleToTheme.set(styleKey, themeName)
      themeAliases.set(themeName, [themeName])
    }
  }

  // build result with deduplicated styles
  // each entry has __themes array listing all theme names that use this style
  const result: Record<string, Object> = {}
  for (const [canonicalTheme, aliases] of themeAliases.entries()) {
    const style = themedStyles[canonicalTheme]
    if (aliases.length > 1) {
      // multiple themes share this style, add __themes metadata
      result[canonicalTheme] = {
        ...style,
        __themes: aliases,
      }
    } else {
      // single theme, no deduplication needed
      result[canonicalTheme] = style
    }
  }

  return result
}

/**
 * Resolve styles for all themes at build time.
 * Takes a style object with $token references and returns a map of theme -> resolved styles.
 * Only includes base themes (light, dark) and sub-themes (light_blue, dark_active, etc.).
 * Excludes component-specific themes to keep bundle size manageable.
 * Deduplicates themes with identical style values.
 */
function resolveStylesForAllThemes(
  style: Object,
  themes: Record<string, any>
): Record<string, Object> | null {
  const { plain, themed } = splitThemeStyles(style)

  // no theme tokens, nothing to resolve
  if (!themed) {
    return null
  }

  // filter to only base themes, excluding component themes like Button, Card, etc.
  const filteredThemes = filterToBaseThemes(themes)

  const result: Record<string, Object> = {}

  for (const themeName of Object.keys(filteredThemes)) {
    const theme = filteredThemes[themeName]
    const resolved = { ...plain }

    for (const key in themed) {
      const tokenRef = themed[key] as string
      // $color -> color
      const tokenName = tokenRef.slice(1)
      const themeValue = theme[tokenName]

      if (themeValue) {
        // theme values can be { val: 'actualValue' } or just the value
        resolved[key] = themeValue.val ?? themeValue
      } else {
        // token not found in theme, keep original reference
        // this shouldn't happen with valid config but let's be safe
        resolved[key] = tokenRef
      }
    }

    result[themeName] = resolved
  }

  // deduplicate themes with identical styles to reduce bundle size
  return deduplicateThemeStyles(result)
}
