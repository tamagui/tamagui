import * as path from 'path'
import { basename } from 'path'
import * as util from 'util'

import generate from '@babel/generator'
import * as t from '@babel/types'
import { getStylesAtomic } from '@tamagui/core-node'
import { concatClassName } from '@tamagui/helpers'
import invariant from 'invariant'
import { getRemainingRequest } from 'loader-utils'
import { ViewStyle } from 'react-native'

import { CONCAT_CLASSNAME_IMPORT } from '../constants'
import { ClassNameObject, StyleObject, TamaguiOptions } from '../types'
import { babelParse } from './babelParse'
import { buildClassName } from './buildClassName'
import { Extractor } from './createExtractor'
import { ensureImportingConcat } from './ensureImportingConcat'
import { isSimpleSpread } from './extractHelpers'
import { extractMediaStyle } from './extractMediaStyle'
import { hoistClassNames } from './hoistClassNames'
import { logLines } from './logLines'

const mergeStyleGroups = {
  shadowOpacity: true,
  shadowRadius: true,
  shadowColor: true,
  shadowOffset: true,
}

export function extractToClassNames({
  loader,
  extractor,
  source,
  sourcePath,
  options,
  shouldPrintDebug,
  threaded,
  cssPath,
}: {
  loader: any
  extractor: Extractor
  source: string | Buffer
  sourcePath: string
  options: TamaguiOptions
  shouldPrintDebug: boolean
  cssPath: string
  threaded?: boolean
}): null | {
  js: string | Buffer
  styles: string
  stylesPath?: string
  ast: t.File
  map: any // RawSourceMap from 'source-map'
} {
  if (typeof source !== 'string') {
    throw new Error('`source` must be a string of javascript')
  }
  invariant(
    typeof sourcePath === 'string' && path.isAbsolute(sourcePath),
    '`sourcePath` must be an absolute path to a .js file'
  )

  const shouldLogTiming = options.logTimings ?? true
  const start = Date.now()
  const mem = shouldLogTiming ? process.memoryUsage() : null

  // Using a map for (officially supported) guaranteed insertion order
  let ast: t.File

  try {
    // @ts-ignore
    ast = babelParse(source)
  } catch (err) {
    console.error('babel parse error:', sourcePath)
    throw err
  }

  const cssMap = new Map<string, { css: string; commentTexts: string[] }>()
  const existingHoists: { [key: string]: t.Identifier } = {}

  const res = extractor.parse(ast, {
    sourcePath,
    shouldPrintDebug,
    ...options,
    getFlattenedNode: ({ tag }) => tag,
    onExtractTag: ({
      attrs,
      node,
      attemptEval,
      jsxPath,
      originalNodeName,
      filePath,
      lineNumbers,
      programPath,
    }) => {
      let finalClassNames: ClassNameObject[] = []
      let finalAttrs: (t.JSXAttribute | t.JSXSpreadAttribute)[] = []
      let finalStyles: StyleObject[] = []

      const viewStyles = {}
      for (const attr of attrs) {
        if (attr.type === 'style') {
          Object.assign(viewStyles, attr.value)
        }
      }

      const ensureNeededPrevStyle = (style: ViewStyle) => {
        // ensure all group keys are merged
        const keys = Object.keys(style)
        if (!keys.some((key) => mergeStyleGroups[key])) {
          return style
        }
        for (const k in mergeStyleGroups) {
          if (k in viewStyles) {
            style[k] = style[k] ?? viewStyles[k]
          }
        }
        return style
      }

      const addStyles = (style: ViewStyle | null) => {
        if (!style) return []
        const styleWithPrev = ensureNeededPrevStyle(style)
        const res = getStylesAtomic(styleWithPrev)
        if (res.length) {
          finalStyles = [...finalStyles, ...res]
        }
        return res
      }

      // 1 to start above any :hover styles
      let lastMediaImportance = 1
      for (const attr of attrs) {
        switch (attr.type) {
          case 'style':
            const styles = addStyles(attr.value)
            const newClassNames = concatClassName(styles.map((x) => x.identifier).join(' '))
            // prettier-ignore
            const existing = finalClassNames.find((x) => x.type == 'StringLiteral') as t.StringLiteral | null
            if (existing) {
              existing.value = `${existing.value} ${newClassNames}`
            } else {
              finalClassNames = [...finalClassNames, t.stringLiteral(newClassNames)]
            }
            if (shouldPrintDebug) {
              // prettier-ignore
              console.log('  classnames (after)\n', logLines(finalClassNames.map(x => x['value']).join(' ')))
            }
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
            const mediaExtraction = extractMediaStyle(
              attr.value,
              jsxPath,
              extractor.getTamagui(),
              sourcePath,
              lastMediaImportance,
              shouldPrintDebug
            )
            if (mediaExtraction) {
              lastMediaImportance++
              finalStyles = [...finalStyles, ...mediaExtraction.mediaStyles]
              finalClassNames = [
                ...finalClassNames,
                ...mediaExtraction.mediaStyles.map((x) => t.stringLiteral(x.identifier)),
              ]
              if (!mediaExtraction.ternaryWithoutMedia) {
                continue
              }
            }
            const ternary = mediaExtraction?.ternaryWithoutMedia || attr.value
            const consInfo = addStyles(ternary.consequent)
            const altInfo = addStyles(ternary.alternate)
            const cCN = consInfo.map((x) => x.identifier).join(' ')
            const aCN = altInfo.map((x) => x.identifier).join(' ')
            if (consInfo.length && altInfo.length) {
              finalClassNames.push(
                t.conditionalExpression(ternary.test, t.stringLiteral(cCN), t.stringLiteral(aCN))
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

  if (!res || (!res.modified && !res.optimized && !res.flattened)) {
    if (shouldPrintDebug) {
      console.log('no res or none modified', res)
    }
    return null
  }

  const styles = Array.from(cssMap.values())
    .map((x) => x.css)
    .join('\n')
    .trim()

  if (styles) {
    const cssQuery = threaded
      ? `cssData=${Buffer.from(styles).toString('base64')}`
      : `cssPath=${cssPath}`
    const remReq = getRemainingRequest(loader)
    const importPath = `${cssPath}!=!tamagui-loader?${cssQuery}!${remReq}`
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
    console.log(
      '\n -------- output code ------- \n\n',
      result.code
        .split('\n')
        .filter((x) => !x.startsWith('//'))
        .join('\n')
    )
    console.log('\n -------- output style -------- \n\n', styles)
  }

  if (shouldLogTiming) {
    const memUsed = mem
      ? Math.round(((process.memoryUsage().heapUsed - mem.heapUsed) / 1024 / 1204) * 10) / 10
      : 0
    const timing = `${Date.now() - start}`.padStart(3)
    const path = basename(sourcePath).padStart(40)
    const numOptimized = `${res.optimized}`.padStart(4)
    const memory = memUsed > 10 ? `used ${memUsed}MB` : ''
    console.log(
      `  🥚 ${path} ${timing}ms ׁ· ${numOptimized} optimized · ${res.flattened} flattened ${memory}`
    )
  }

  return {
    ast,
    styles,
    js: result.code,
    map: result.map,
  }
}
