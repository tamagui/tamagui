import * as path from 'node:path'
import * as util from 'node:util'

import generate from '@babel/generator'
import * as t from '@babel/types'
import * as helpers from '@tamagui/helpers'
import type { ViewStyle } from 'react-native'

import { requireTamaguiCore } from '../helpers/requireTamaguiCore'
import type { ClassNameObject, StyleObject, TamaguiOptions, Ternary } from '../types'
import { babelParse } from './babelParse'
import { buildClassName } from './buildClassName'
import type { Extractor } from './createExtractor'
import { createLogger } from './createLogger'
import { ensureImportingConcat } from './ensureImportingConcat'
import { isSimpleSpread } from './extractHelpers'
import { extractMediaStyle } from './extractMediaStyle'
import { hoistClassNames } from './hoistClassNames'
import { getFontFamilyClassNameFromProps } from './propsToFontFamilyCache'
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

export type ExtractToClassNamesProps = {
  extractor: Extractor
  source: string | Buffer
  sourcePath?: string
  options: TamaguiOptions
  shouldPrintDebug: boolean | 'verbose'
}

export async function extractToClassNames({
  extractor,
  source,
  sourcePath = '',
  options,
  shouldPrintDebug,
}: ExtractToClassNamesProps): Promise<ExtractedResponse | null> {
  const tm = timer()
  const { getStylesAtomic } = requireTamaguiCore('web')

  if (sourcePath.includes('node_modules')) {
    return null
  }

  if (shouldPrintDebug) {
    console.warn(`--- ${sourcePath} --- \n\n`)
  }

  if (typeof source !== 'string') {
    throw new Error('`source` must be a string of javascript')
  }
  if (!path.isAbsolute(sourcePath)) {
    throw new Error(
      '`sourcePath` must be an absolute path to a .js file, got: ' + sourcePath
    )
  }

  if (!/.[tj]sx?$/i.test(sourcePath || '')) {
    console.warn(`${sourcePath.slice(0, 100)} - bad filename.`)
  }

  if (!options.disableExtraction && !options['_disableLoadTamagui']) {
    // dont include loading in timing of parsing (one time cost)
    await extractor.loadTamagui(options)
  }

  const printLog = createLogger(sourcePath, options)

  // Using a map for (officially supported) guaranteed insertion order
  let ast: t.File

  try {
    ast = babelParse(source, sourcePath)
  } catch (err) {
    console.error('babel parse error:', sourcePath.slice(0, 100))
    throw err
  }

  tm.mark(`babel-parse`, shouldPrintDebug === 'verbose')

  const cssMap = new Map<string, { css: string; commentTexts: string[] }>()
  const existingHoists: { [key: string]: t.Identifier } = {}

  let hasFlattened = false

  const res = await extractor.parse(ast, {
    shouldPrintDebug,
    ...options,
    platform: 'web',
    sourcePath,
    extractStyledDefinitions: true,
    onStyleRule(identifier, rules) {
      const css = rules.join(';')
      if (shouldPrintDebug) {
        console.info(`adding styled() rule: .${identifier} ${css}`)
      }
      cssMap.set(`.${identifier}`, { css, commentTexts: [] })
    },
    getFlattenedNode: ({ tag }) => {
      hasFlattened = true
      return tag
    },
    onExtractTag: ({
      parserProps,
      attrs,
      node,
      attemptEval,
      jsxPath,
      originalNodeName,
      filePath,
      lineNumbers,
      programPath,
      isFlattened,
      staticConfig,
    }) => {
      // bail out of views that don't accept className (falls back to runtime + style={})
      if (staticConfig.acceptsClassName === false) {
        if (shouldPrintDebug) {
          console.info(`bail, acceptsClassName is false`)
        }
        return
      }

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
        const res = getStylesAtomic(styleWithPrev as any)
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
              const styles = getStylesAtomic(attr.value as any)

              finalStyles = [...finalStyles, ...styles]

              for (const style of styles) {
                //  leave them  as attributes
                const prop = style[helpers.StyleObjectPseudo]
                  ? `${style[helpers.StyleObjectProperty]}-${
                      style[helpers.StyleObjectPseudo]
                    }`
                  : style[helpers.StyleObjectProperty]
                finalAttrs.push(
                  t.jsxAttribute(
                    t.jsxIdentifier(prop),
                    t.stringLiteral(style[helpers.StyleObjectIdentifier])
                  )
                )
              }
            } else {
              const styles = addStyles(attr.value)
              const newFontFamily = getFontFamilyClassNameFromProps(attr.value) || ''
              const newClassNames = helpers.concatClassName(
                styles.map((x) => x[helpers.StyleObjectIdentifier]).join(' ') +
                  newFontFamily
              )
              const existing = finalClassNames.find(
                (x) => x.type == 'StringLiteral'
              ) as t.StringLiteral | null

              if (existing) {
                let previous = existing.value
                // replace existing font_ with new one
                if (newFontFamily) {
                  if (shouldPrintDebug) {
                    console.info(` newFontFamily: ${newFontFamily}`)
                  }
                  previous = previous.replace(/font_[a-z]+/i, '')
                }
                existing.value = `${previous} ${newClassNames}`
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
              parserProps,
              attr.value,
              jsxPath,
              extractor.getTamagui()!,
              sourcePath || '',
              lastMediaImportance,
              shouldPrintDebug
            )
            if (shouldPrintDebug) {
              if (mediaExtraction) {
                console.info(
                  'ternary (mediaStyles)',
                  mediaExtraction.ternaryWithoutMedia?.inlineMediaQuery ?? '',
                  mediaExtraction.mediaStyles
                    .map((x) => x[helpers.StyleObjectIdentifier])
                    .join('.')
                )
              }
            }
            if (!mediaExtraction) {
              if (shouldPrintDebug) {
                if (mediaExtraction) {
                  console.info('add ternary')
                }
              }
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
              addTernaryStyle(
                mediaExtraction.ternaryWithoutMedia,
                mediaExtraction.mediaStyles,
                []
              )
            } else {
              finalClassNames = [
                ...finalClassNames,
                ...mediaExtraction.mediaStyles.map((x) =>
                  t.stringLiteral(x[helpers.StyleObjectIdentifier])
                ),
              ]
            }
            break
          }
        }
      }

      function addTernaryStyle(ternary: Ternary, a: StyleObject[], b: StyleObject[]) {
        const cCN = a.map((x) => x[helpers.StyleObjectIdentifier]).join(' ')
        const aCN = b.map((x) => x[helpers.StyleObjectIdentifier]).join(' ')

        if (a.length && b.length) {
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
      }

      if (shouldPrintDebug === 'verbose') {
        console.info('  finalClassNames AST\n', JSON.stringify(finalClassNames, null, 2))
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

          return value
        })()

        // inserts the _cn variable and uses it for className
        const names = buildClassName(finalClassNames, extraClassNames)

        const nameExpr = names ? hoistClassNames(jsxPath, existingHoists, names) : null
        let expr = nameExpr

        // if has some spreads, use concat helper
        if (nameExpr && !t.isIdentifier(nameExpr)) {
          if (!didFlattenThisTag) {
            // not flat
          } else {
            ensureImportingConcat(programPath)
            const simpleSpreads = attrs.filter((x) => {
              return (
                x.type === 'attr' &&
                t.isJSXSpreadAttribute(x.value) &&
                isSimpleSpread(x.value)
              )
            })
            expr = t.callExpression(t.identifier('concatClassName'), [
              expr,
              ...simpleSpreads.map((val) => val.value['argument']),
            ])
          }
        }

        node.attributes.push(
          t.jsxAttribute(t.jsxIdentifier('className'), t.jsxExpressionContainer(expr))
        )
      }

      const comment = util.format(
        '/* %s:%s (%s) */',
        filePath,
        lineNumbers,
        originalNodeName
      )

      for (const styleObject of finalStyles) {
        const identifier = styleObject[helpers.StyleObjectIdentifier]
        const rules = styleObject[helpers.StyleObjectRules]
        const className = `.${identifier}`
        if (cssMap.has(className)) {
          if (comment) {
            const val = cssMap.get(className)!
            val.commentTexts.push(comment)
            cssMap.set(className, val)
          }
        } else if (rules.length) {
          cssMap.set(className, {
            css: rules.join('\n'),
            commentTexts: [comment],
          })
        }
      }
    },
  })

  if (!res || (!res.modified && !res.optimized && !res.flattened && !res.styled)) {
    if (shouldPrintDebug) {
      console.info('no res or none modified', res)
    }
    return null
  }

  const styles = Array.from(cssMap.values())
    .map((x) => x.css)
    .join('\n')
    .trim()

  // @ts-ignore
  const result = generate(
    ast as any,
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
    console.info(
      '\n -------- output code ------- \n\n',
      result.code
        .split('\n')
        .filter((x) => !x.startsWith('//'))
        .join('\n')
    )
    console.info('\n -------- output style -------- \n\n', styles)
  }

  printLog(res)

  return {
    ast,
    styles,
    js: result.code,
    map: result.map,
  }
}
