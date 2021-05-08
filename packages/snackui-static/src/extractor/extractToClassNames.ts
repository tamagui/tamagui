import * as path from 'path'
import { basename } from 'path'
import * as util from 'util'

import generate from '@babel/generator'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import { MediaQueries, defaultMediaQueries } from '@snackui/node'
import invariant from 'invariant'
import { getOptions, getRemainingRequest } from 'loader-utils'
import { ViewStyle } from 'react-native'

import { Extractor } from '../extractor/createExtractor'
import { isSimpleSpread } from '../extractor/extractHelpers'
import { getStylesAtomic } from '../getStylesAtomic'
import { ClassNameObject, SnackOptions, StyleObject } from '../types'
import { babelParse } from './babelParse'
import { buildClassName } from './buildClassName'
import { ensureImportingConcat } from './ensureImportingConcat'
import { extractMediaStyle } from './extractMediaStyle'
import { hoistClassNames } from './hoistClassNames'

export const CONCAT_CLASSNAME_IMPORT = 'concatClassName'
let index = 0

let initialFileName = ''
export function getInitialFileName() {
  return initialFileName
}

const mergeStyleGroups = [new Set(['shadowOpacity', 'shadowRadius', 'shadowColor', 'shadowOffset'])]

export function extractToClassNames(
  this: any,
  {
    extractor,
    source,
    sourcePath,
    options,
    shouldPrintDebug,
    threaded,
    cssPath,
  }: {
    extractor: Extractor
    source: string | Buffer
    sourcePath: string
    options: SnackOptions
    shouldPrintDebug: boolean
    cssPath: string
    threaded?: boolean
  }
): null | {
  js: string | Buffer
  styles: string
  stylesPath?: string
  ast: t.File
  map: any // RawSourceMap from 'source-map'
} {
  if (typeof source !== 'string') {
    throw new Error('`source` must be a string of javascript')
  }
  if (!sourcePath.endsWith('sx')) {
    return null
  }
  invariant(
    typeof sourcePath === 'string' && path.isAbsolute(sourcePath),
    '`sourcePath` must be an absolute path to a .js file'
  )

  const shouldLogTiming = shouldPrintDebug || options.logTimings
  const start = Date.now()
  const mem = shouldLogTiming ? process.memoryUsage() : null

  // Using a map for (officially supported) guaranteed insertion order
  let ast: t.File

  try {
    ast = babelParse(source)
  } catch (err) {
    console.error('babel parse error:', sourcePath)
    throw err
  }

  const cssMap = new Map<string, { css: string; commentTexts: string[] }>()
  const existingHoists: { [key: string]: t.Identifier } = {}
  const mediaQueries: MediaQueries = options.mediaQueries ?? defaultMediaQueries

  let flattened = 0
  let optimized = 0

  traverse(ast, {
    Program(programPath) {
      extractor.parse(programPath, {
        sourcePath,
        shouldPrintDebug,
        ...options,
        getFlattenedNode: ({ isTextView }) => {
          flattened++
          return isTextView ? 'span' : 'div'
        },
        onExtractTag: ({
          attrs,
          node,
          attemptEval,
          viewStyles,
          jsxPath,
          originalNodeName,
          filePath,
          lineNumbers,
        }) => {
          optimized++

          let finalClassNames: ClassNameObject[] = []
          let finalAttrs: (t.JSXAttribute | t.JSXSpreadAttribute)[] = []
          let finalStyles: StyleObject[] = []

          const mergeInParentStyles = (style: ViewStyle) => {
            const keys = Object.keys(style)
            for (const group of mergeStyleGroups) {
              if (keys.some((key) => group.has(key))) {
                // ensure all other keys exist on this group
                for (const groupKey of [...group]) {
                  if (viewStyles[groupKey]) {
                    style[groupKey] = style[groupKey] ?? viewStyles[groupKey]
                  }
                }
              }
            }
            return style
          }

          const addStyles = (style: ViewStyle | null) => {
            if (!style) return []
            const res = getStylesAtomic(mergeInParentStyles(style))
            if (res.length) {
              finalStyles = [...finalStyles, ...res]
            }
            return res
          }

          if (viewStyles) {
            const styles = addStyles(viewStyles)
            for (const style of styles) {
              finalClassNames = [...finalClassNames, t.stringLiteral(style.identifier)]
            }
          }

          // 1 to start above any :hover styles
          let lastMediaImportance = 1
          for (const attr of attrs) {
            switch (attr.type) {
              case 'style':
                addStyles(attr.value)
                break
              case 'attr':
                const val = attr.value
                if (t.isJSXSpreadAttribute(val)) {
                  if (isSimpleSpread(val)) {
                    finalClassNames.push(
                      t.logicalExpression(
                        '&&',
                        val.argument,
                        t.memberExpression(val.argument, t.identifier('className'))
                      )
                    )
                  }
                } else if (val.name.name === 'className') {
                  const value = val.value
                  if (value) {
                    try {
                      const evaluatedValue = attemptEval(value)
                      finalClassNames.push(t.stringLiteral(evaluatedValue))
                    } catch (e) {
                      finalClassNames.push(value['expression'])
                    }
                  }
                  continue
                }
                finalAttrs.push(val)
                break
              case 'ternary':
                const mediaStyles = extractMediaStyle(
                  attr.value,
                  jsxPath,
                  mediaQueries,
                  sourcePath,
                  lastMediaImportance,
                  shouldPrintDebug
                )
                if (mediaStyles) {
                  lastMediaImportance++
                  finalStyles = [...finalStyles, ...mediaStyles]
                  finalClassNames = [
                    ...finalClassNames,
                    ...mediaStyles.map((x) => t.stringLiteral(x.identifier)),
                  ]
                  continue
                }
                const ternary = attr.value
                const consInfo = addStyles(ternary.consequent)
                const altInfo = addStyles(ternary.alternate)
                const cCN = consInfo.map((x) => x.identifier).join(' ')
                const aCN = altInfo.map((x) => x.identifier).join(' ')
                if (consInfo.length && altInfo.length) {
                  finalClassNames.push(
                    t.conditionalExpression(
                      ternary.test,
                      t.stringLiteral(cCN),
                      t.stringLiteral(aCN)
                    )
                  )
                } else {
                  finalClassNames.push(
                    t.conditionalExpression(
                      ternary.test,
                      t.stringLiteral(' ' + cCN),
                      t.stringLiteral(' ' + aCN)
                    )
                  )
                }
                break
            }
          }

          node.attributes = finalAttrs

          if (finalClassNames.length) {
            // inserts the _cn variable and uses it for className
            const names = buildClassName(finalClassNames)
            const nameExpr = names ? hoistClassNames(jsxPath, existingHoists, names) : null
            let expr = nameExpr

            // if has some spreads, use concat helper
            if (nameExpr && !t.isIdentifier(nameExpr)) {
              ensureImportingConcat(programPath)
              const simpleSpreads = attrs.filter(
                (x) => t.isJSXSpreadAttribute(x.value) && isSimpleSpread(x.value)
              )
              expr = t.callExpression(t.identifier(CONCAT_CLASSNAME_IMPORT), [
                expr,
                ...simpleSpreads.map((val) => val.value['argument']),
              ])
            }

            node.attributes.push(
              t.jsxAttribute(t.jsxIdentifier('className'), t.jsxExpressionContainer(expr))
            )
          }

          const comment = util.format('/* %s:%s (%s) */', filePath, lineNumbers, originalNodeName)

          for (const { className, rules } of finalStyles) {
            if (cssMap.has(className)) {
              if (comment) {
                const val = cssMap.get(className)!
                val.commentTexts.push(comment)
                cssMap.set(className, val)
              }
            } else if (rules.length) {
              if (rules.length > 1) {
                console.log('  rules error', { rules })
                throw new Error(`Shouldn't have more than one rule`)
              }
              cssMap.set(className, {
                css: rules[0],
                commentTexts: [comment],
              })
            }
          }
        },
      })
    },
  })

  if (!optimized) {
    return null
  }

  const styles = Array.from(cssMap.values())
    .map((x) => {
      // remove comments
      return x.css //shouldInternalDedupe ? x.css : `${x.commentTexts.join('\n')}\n${x.css}`
    })
    .join('\n')
    .trim()

  if (styles) {
    const cssQuery = threaded
      ? `cssData=${Buffer.from(styles).toString('base64')}`
      : `cssPath=${cssPath}`
    const remReq = getRemainingRequest(this)
    const importPath = `${cssPath}!=!snackui-loader?${cssQuery}!${remReq}`
    ast.program.body.unshift(t.importDeclaration([], t.stringLiteral(importPath)))
  }

  const result = generate(
    ast,
    {
      concise: false,
      filename: sourcePath,
      retainLines: false,
      sourceFileName: sourcePath,
      sourceMaps: true,
    },
    source
  )

  if (shouldPrintDebug) {
    console.log('\n\n -------- output code ------- \n\n', result.code)
    console.log('\n\n -------- output style -------- \n\n', styles)
  }

  if (shouldLogTiming && mem) {
    const memUsed =
      Math.round(((process.memoryUsage().heapUsed - mem.heapUsed) / 1024 / 1204) * 10) / 10
    // prettier-ignore
    console.log(`  🍑 ${basename(sourcePath).padStart(40)} (${Date.now() - start}ms) (${optimized} optimized ${flattened} flattened) ${memUsed > 10 ? `used ${memUsed}MB` : ''}`)
  }

  return {
    ast,
    styles,
    js: result.code,
    map: result.map,
  }
}
