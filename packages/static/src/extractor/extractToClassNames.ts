import * as path from 'path'
import { basename } from 'path'
import * as util from 'util'

import generate from '@babel/generator'
import * as t from '@babel/types'
import { getStylesAtomic } from '@tamagui/core-node'
import { concatClassName } from '@tamagui/helpers'
import invariant from 'invariant'
import { ViewStyle } from 'react-native'

import { CONCAT_CLASSNAME_IMPORT } from '../constants'
import { ClassNameObject, StyleObject, TamaguiOptions, Ternary } from '../types'
import { babelParse } from './babelParse'
import { buildClassName } from './buildClassName'
import { Extractor } from './createExtractor'
import { ensureImportingConcat } from './ensureImportingConcat'
import { isSimpleSpread } from './extractHelpers'
import { extractMediaStyle } from './extractMediaStyle'
import { getPrefixLogs } from './getPrefixLogs'
import { hoistClassNames } from './hoistClassNames'
import { logLines } from './logLines'
import { timer } from './timer'

const mergeStyleGroups = {
  shadowOpacity: true,
  shadowRadius: true,
  shadowColor: true,
  shadowOffset: true,
}

export type ExtractedResponse = {
  js: string | Buffer
  styles: string
  stylesPath?: string
  ast: t.File
  map: any // RawSourceMap from 'source-map'
}

export async function extractToClassNames({
  extractor,
  source,
  sourcePath,
  options,
  shouldPrintDebug,
}: {
  extractor: Extractor
  source: string | Buffer
  sourcePath: string
  options: TamaguiOptions
  shouldPrintDebug: boolean | 'verbose'
}): Promise<ExtractedResponse | null> {
  const tm = timer()

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
    ast = babelParse(source)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('babel parse error:', sourcePath)
    throw err
  }

  tm.mark(`babel-parse`, shouldPrintDebug === 'verbose')

  const cssMap = new Map<string, { css: string; commentTexts: string[] }>()
  const existingHoists: { [key: string]: t.Identifier } = {}

  let hasFlattened = false

  const res = await extractor.parse(ast, {
    sourcePath,
    shouldPrintDebug,
    ...options,
    target: 'html',
    extractStyledDefinitions: true,
    onStyleRule(identifier, rules) {
      cssMap.set(`.${identifier}`, { css: rules.join(';'), commentTexts: [] })
    },
    getFlattenedNode: ({ tag }) => {
      hasFlattened = true
      return tag
    },
    onExtractTag: ({
      attrs,
      node,
      attemptEval,
      jsxPath,
      originalNodeName,
      filePath,
      lineNumbers,
      programPath,
      isFlattened,
      completeProps,
      staticConfig,
    }) => {
      // reset hasFlattened
      const didFlattenThisTag = hasFlattened
      hasFlattened = false

      let finalClassNames: ClassNameObject[] = []
      const finalAttrs: (t.JSXAttribute | t.JSXSpreadAttribute)[] = []
      let finalStyles: StyleObject[] = []

      let viewStyles = {}
      for (const attr of attrs) {
        if (attr.type === 'style') {
          viewStyles = {
            ...viewStyles,
            ...attr.value,
          }
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

      const addStyles = (style: ViewStyle | null): StyleObject[] => {
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
          case 'style': {
            if (!isFlattened) {
              const styles = getStylesAtomic(attr.value)

              finalStyles = [...finalStyles, ...styles]

              for (const style of styles) {
                //  leave them  as attributes
                const prop = style.pseudo ? `${style.property}-${style.pseudo}` : style.property
                finalAttrs.push(
                  t.jsxAttribute(t.jsxIdentifier(prop), t.stringLiteral(style.identifier))
                )
              }
            } else {
              const styles = addStyles(attr.value)
              const newClassNames = concatClassName(styles.map((x) => x.identifier).join(' '))
              const existing = finalClassNames.find(
                (x) => x.type == 'StringLiteral'
              ) as t.StringLiteral | null

              if (existing) {
                existing.value = `${existing.value} ${newClassNames}`
              } else {
                finalClassNames = [...finalClassNames, t.stringLiteral(newClassNames)]
              }
            }

            break
          }
          case 'attr': {
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
          }
          case 'ternary': {
            const mediaExtraction = extractMediaStyle(
              attr.value,
              jsxPath,
              extractor.getTamagui()!,
              sourcePath,
              lastMediaImportance,
              shouldPrintDebug
            )
            if (shouldPrintDebug) {
              if (mediaExtraction) {
                // eslint-disable-next-line no-console
                console.log(
                  'ternary (mediaStyles)',
                  mediaExtraction.ternaryWithoutMedia?.inlineMediaQuery ?? '',
                  mediaExtraction.mediaStyles.map((x) => x.identifier).join('.')
                )
              }
            }
            if (!mediaExtraction) {
              addTernaryStyle(
                attr.value,
                addStyles(attr.value.consequent),
                addStyles(attr.value.alternate)
              )
              continue
            }
            lastMediaImportance++
            if (mediaExtraction.mediaStyles) {
              finalStyles = [...finalStyles, ...mediaExtraction.mediaStyles]
            }
            if (mediaExtraction.ternaryWithoutMedia) {
              addTernaryStyle(mediaExtraction.ternaryWithoutMedia, mediaExtraction.mediaStyles, [])
            } else {
              finalClassNames = [
                ...finalClassNames,
                ...mediaExtraction.mediaStyles.map((x) => t.stringLiteral(x.identifier)),
              ]
            }
            break
          }
        }
      }

      function addTernaryStyle(ternary: Ternary, a: any, b: any) {
        const cCN = a.map((x) => x.identifier).join(' ')
        const aCN = b.map((x) => x.identifier).join(' ')
        if (a.length && b.length) {
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
      }

      if (shouldPrintDebug) {
        // eslint-disable-next-line no-console
        console.log(
          '  finalClassNames\n',
          logLines(finalClassNames.map((x) => x['value']).join(' '))
        )
      }

      node.attributes = finalAttrs

      if (finalClassNames.length) {
        const extraClassNames = (() => {
          let value = ''
          if (!isFlattened) {
            return value
          }

          // helper to see how many get flattened
          if (process.env.TAMAGUI_DEBUG_OPTIMIZATIONS) {
            value += `is_tamagui_flattened`
          }

          // add is_Component className
          if (staticConfig.componentName) {
            value += ` is_${staticConfig.componentName}`
          }

          if (staticConfig.isText) {
            let family = completeProps.fontFamily
            if (family[0] === '$') {
              family = family.slice(1)
            }
            value += ` font_${family}`
          }

          return value
        })()

        // inserts the _cn variable and uses it for className
        let names = buildClassName(finalClassNames)

        if (names) {
          if (t.isStringLiteral(names)) {
            names.value = concatClassName(names.value)
            names.value = `${extraClassNames} ${names.value}`
          } else {
            names = t.binaryExpression('+', t.stringLiteral(extraClassNames), names)
          }
        }

        const nameExpr = names ? hoistClassNames(jsxPath, existingHoists, names) : null
        let expr = nameExpr

        // if has some spreads, use concat helper
        if (nameExpr && !t.isIdentifier(nameExpr)) {
          if (!didFlattenThisTag) {
            // not flat
          } else {
            ensureImportingConcat(programPath)
            const simpleSpreads = attrs.filter(
              (x) => t.isJSXSpreadAttribute(x.value) && isSimpleSpread(x.value)
            )
            expr = t.callExpression(t.identifier(CONCAT_CLASSNAME_IMPORT), [
              expr,
              ...simpleSpreads.map((val) => val.value['argument']),
            ])
          }
        }

        node.attributes.push(
          t.jsxAttribute(t.jsxIdentifier('className'), t.jsxExpressionContainer(expr))
        )
      }

      const comment = util.format('/* %s:%s (%s) */', filePath, lineNumbers, originalNodeName)

      for (const { identifier, rules } of finalStyles) {
        const className = `.${identifier}`
        if (cssMap.has(className)) {
          if (comment) {
            const val = cssMap.get(className)!
            val.commentTexts.push(comment)
            cssMap.set(className, val)
          }
        } else if (rules.length) {
          if (rules.length > 1) {
            // eslint-disable-next-line no-console
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

  console.log('res', sourcePath, res)

  if (!res || (!res.modified && !res.optimized && !res.flattened && !res.styled)) {
    if (shouldPrintDebug) {
      // eslint-disable-next-line no-console
      console.log('no res or none modified', res)
    }
    return null
  }

  const styles = Array.from(cssMap.values())
    .map((x) => x.css)
    .join('\n')
    .trim()

  const result = generate(
    ast,
    {
      concise: false,
      filename: sourcePath,
      // this makes the debug output terrible, and i think sourcemap works already
      retainLines: false,
      sourceFileName: sourcePath,
      sourceMaps: true,
    },
    source
  )

  if (shouldPrintDebug) {
    // eslint-disable-next-line no-console
    console.log(
      '\n -------- output code ------- \n\n',
      result.code
        .split('\n')
        .filter((x) => !x.startsWith('//'))
        .join('\n')
    )
    // eslint-disable-next-line no-console
    console.log('\n -------- output style -------- \n\n', styles)
  }

  if (shouldLogTiming) {
    const memUsed = mem
      ? Math.round(((process.memoryUsage().heapUsed - mem.heapUsed) / 1024 / 1204) * 10) / 10
      : 0
    const path = basename(sourcePath)
      .replace(/\.[jt]sx?$/, '')
      .slice(0, 22)
      .trim()
      .padStart(24)

    const numStyled = `${res.styled}`.padStart(3)
    const numOptimized = `${res.optimized}`.padStart(3)
    const numFound = `${res.found}`.padStart(3)
    const numFlattened = `${res.flattened}`.padStart(3)
    const memory = process.env.DEBUG && memUsed > 10 ? ` ${memUsed}MB` : ''
    const timing = Date.now() - start
    const timingWarning = timing > 150 ? '⚠️' : timing > 150 ? '☢️' : ''
    const timingStr = `${timing}ms ${timingWarning}`.padStart(6)
    const pre = getPrefixLogs(options)
    const memStr = memory ? `(${memory})` : ''
    // eslint-disable-next-line no-console
    console.log(
      `${pre} ${path}  ${numFound} · ${numOptimized} · ${numFlattened} · ${numStyled}  ${timingStr} ${memStr}`
    )
  }

  return {
    ast,
    styles,
    js: result.code,
    map: result.map,
  }
}
