import generate from '@babel/generator'
import type { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import { mergeProps, StyleObjectIdentifier, StyleObjectRules } from '@tamagui/web'
import * as path from 'node:path'
import * as util from 'node:util'
import { requireTamaguiCore } from '../helpers/requireTamaguiCore'
import type { StyleObject, TamaguiOptions, Ternary } from '../types'
import { babelParse } from './babelParse'
import type { Extractor } from './createExtractor'
import { createLogger } from './createLogger'
import { extractMediaStyle } from './extractMediaStyle'
import { normalizeTernaries } from './normalizeTernaries'
import {
  forwardFontFamilyName,
  getFontFamilyNameFromProps,
} from './propsToFontFamilyCache'
import { timer } from './timer'
import { BailOptimizationError } from './errors'
import { concatClassName } from './concatClassName'

export type ExtractedResponse = {
  js: string | Buffer
  styles: string
  stylesPath?: string
  ast: t.File
  map: any
  stats: {
    styled: number
    flattened: number
    optimized: number
    found: number
  }
}

export type ExtractToClassNamesProps = {
  extractor: Extractor
  source: string | Buffer
  sourcePath?: string
  options: TamaguiOptions
  shouldPrintDebug: boolean | 'verbose'
}

// we only expand into ternaries or plain attr, all style is turned into a always-true ternary
// this lets us more easily combine everything easily
// all ternaries in this array ONLY have consequent, they are normalized
const remove = () => {} // we dont remove after this step
const spaceString = t.stringLiteral(' ')

export async function extractToClassNames({
  extractor,
  source,
  sourcePath = '',
  options,
  shouldPrintDebug,
}: ExtractToClassNamesProps): Promise<ExtractedResponse | null> {
  const tm = timer()
  const { getCSSStylesAtomic, createMediaStyle } = requireTamaguiCore('web')

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
  const tamaguiConfig = extractor.getTamagui()!

  const res = await extractor.parse(ast, {
    shouldPrintDebug,
    ...options,
    platform: 'web',
    sourcePath,
    extractStyledDefinitions: true,
    onStyledDefinitionRule(identifier, rules) {
      const css = rules.join(';')
      if (shouldPrintDebug) {
        console.info(`adding styled() rule: .${identifier} ${css}`)
      }
      cssMap.set(`.${identifier}`, { css, commentTexts: [] })
    },
    getFlattenedNode: ({ tag }) => {
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
      staticConfig,
    }) => {
      // bail out of views that don't accept className (falls back to runtime + style={})
      if (staticConfig.acceptsClassName === false) {
        throw new BailOptimizationError()
      }

      // re-worked how we do this
      // merging ternaries on top of base styles is not simple, because we need to ensure the final
      // className has no duplicate style props and selector order is preserved
      // before we tried to be smart and build a big binary expression
      // instead, what we'll do now is pre-calculate the entire className for every possible path
      // for super complex components that means we *will* output a lot of bigger classNames
      // but its so much simpler than trying to implement a multi-stage solver here
      // and in the end its just strings that gzip very well
      // its also much easier to intuit/debug for end users and ourselves

      // example:
      //    a ? 'a' : 'b'
      //    b ? 'c' : 'd'
      // we want:
      //    a && b ? 'a c' : ''
      //    !a && b ? 'b c' : ''
      //    a && !b ? 'a d' : ''
      //    !a && !b ? 'b d' : ''

      // we also simplified the compiler to only handle views that can be fully flattened
      // this means we don't need to account for strange in-between spreads, so we can merge things
      // fairly simply. first, we just merge forward all the non-ternary styles into ternaries.

      // save for the end
      const finalAttrs: t.JSXAttribute[] = []

      let mergeForwardBaseStyle: object | null = null
      let attrClassName: t.Expression | null = null
      let baseFontFamily = ''
      let mediaStylesSeen = 1

      const comment = util.format(
        '/* %s:%s (%s) */',
        filePath,
        lineNumbers,
        originalNodeName
      )

      function addStyle(style: StyleObject) {
        const identifier = style[StyleObjectIdentifier]
        const rules = style[StyleObjectRules]
        const selector = `.${identifier}`
        if (cssMap.has(selector)) {
          const val = cssMap.get(selector)!
          val.commentTexts.push(comment)
        } else if (rules.length) {
          cssMap.set(selector, {
            css: rules.join('\n'),
            commentTexts: [comment],
          })
        }
        return identifier
      }

      function addStyles(style: object) {
        const cssStyles = getCSSStylesAtomic(style as any)
        const classNames: string[] = []

        for (const style of cssStyles) {
          const property = style[0]
          const mediaName = property.slice(1)

          // $group- styles must bail out entirely - they need runtime handling because
          // group changes can affect children that may be animated and need hard values.
          // In the future, CSS animation drivers could potentially optimize this.
          if (mediaName.startsWith('group-')) {
            throw new BailOptimizationError()
          }

          // Check for theme/platform media queries (e.g., $theme-dark, $platform-web)
          const mediaTypeMatch = mediaName.match(/^(theme|platform)-/)
          if (mediaTypeMatch) {
            const mediaType = mediaTypeMatch[1] as 'theme' | 'platform'
            const mediaStyle = createMediaStyle(
              style,
              mediaName,
              extractor.getTamagui()!.media,
              mediaType,
              false,
              mediaStylesSeen
            )
            const identifier = addStyle(mediaStyle)
            classNames.push(identifier)
            continue
          }

          if (mediaName in tamaguiConfig.media) {
            const mediaStyle = createMediaStyle(
              style,
              mediaName,
              extractor.getTamagui()!.media,
              true,
              false,
              mediaStylesSeen
            )
            const identifier = addStyle(mediaStyle)
            classNames.push(identifier)
            continue
          }

          const identifier = addStyle(style)
          classNames.push(identifier)
        }

        return classNames
      }

      const onlyTernaries: Ternary[] = attrs.flatMap((attr) => {
        if (attr.type === 'attr') {
          const value = attr.value

          if (t.isJSXSpreadAttribute(value)) {
            // we only handle flattened stuff now so skip this
            console.error(`Should never happen`)
            return []
          }

          if (value.name.name === 'className') {
            let inner: any = value.value
            if (t.isJSXExpressionContainer(inner)) {
              inner = inner.expression
            }
            try {
              const evaluatedValue = inner ? attemptEval(inner) : null
              if (typeof evaluatedValue === 'string') {
                attrClassName = t.stringLiteral(evaluatedValue)
              }
            } catch (e) {
              if (inner) {
                attrClassName ||= inner
              }
            }
            return []
          }

          finalAttrs.push(value)
          return []
        }

        if (attr.type === 'style') {
          mergeForwardBaseStyle = mergeProps(mergeForwardBaseStyle || {}, attr.value)
          baseFontFamily = getFontFamilyNameFromProps(attr.value) || ''
          return []
        }

        let ternary = attr.value

        if (ternary.inlineMediaQuery) {
          const mediaExtraction = extractMediaStyle(
            parserProps,
            attr.value,
            jsxPath,
            extractor.getTamagui()!,
            sourcePath || '',
            mediaStylesSeen++,
            shouldPrintDebug
          )

          if (mediaExtraction) {
            if (mediaExtraction.mediaStyles) {
              mergeForwardBaseStyle = mergeProps(mergeForwardBaseStyle || {}, {
                [`$${ternary.inlineMediaQuery}`]: attr.value.consequent!,
              })
            }
            if (mediaExtraction.ternaryWithoutMedia) {
              ternary = mediaExtraction.ternaryWithoutMedia
            } else {
              return []
            }
          }
        }

        let mergedAlternate
        let mergedConsequent

        if (ternary.alternate && Object.keys(ternary.alternate).length) {
          mergedAlternate = mergeProps(
            mergeForwardBaseStyle || {},
            ternary.alternate || {}
          )
          forwardFontFamilyName(ternary.alternate, mergedAlternate, baseFontFamily)
        }

        if (ternary.consequent && Object.keys(ternary.consequent).length) {
          mergedConsequent = mergeProps(
            mergeForwardBaseStyle || {},
            ternary.consequent || {}
          )
          forwardFontFamilyName(ternary.consequent, mergedConsequent, baseFontFamily)
        }

        // merge the base style forward into both sides
        return {
          ...ternary,
          alternate: mergedAlternate,
          consequent: mergedConsequent,
        }
      })

      const hasTernaries = Boolean(onlyTernaries.length)

      const baseClassNames = mergeForwardBaseStyle
        ? addStyles(mergeForwardBaseStyle)
        : null

      let baseClassNameStr = !baseClassNames ? '' : baseClassNames.join(' ')

      if (baseFontFamily) {
        baseClassNameStr = `font_${baseFontFamily}${baseClassNameStr ? ` ${baseClassNameStr}` : ''}`
      }

      // add is_View or is_Text base class matching runtime behavior
      const baseTypeClass = staticConfig.isText ? 'is_Text' : 'is_View'
      baseClassNameStr = `${baseTypeClass}${baseClassNameStr ? ` ${baseClassNameStr}` : ''}`

      // add component name class (skip 'Text' since is_Text already covers it)
      const componentNameFinal = staticConfig.componentName
      let base =
        componentNameFinal && componentNameFinal !== 'Text'
          ? t.stringLiteral(
              `is_${componentNameFinal}${baseClassNameStr ? ` ${baseClassNameStr}` : ''}`
            )
          : t.stringLiteral(baseClassNameStr || '')

      attrClassName = attrClassName as t.Expression | null // actual typescript bug, flatMap doesn't update from never

      const baseClassNameExpression: t.Expression = (() => {
        if (attrClassName) {
          if (t.isStringLiteral(attrClassName)) {
            return t.stringLiteral(
              base.value ? `${base.value} ${attrClassName.value}` : attrClassName.value
            )
          } else {
            // space after to ensure its a string and its spaced
            return t.binaryExpression(
              '+',
              t.binaryExpression('+', attrClassName, spaceString),
              base
            )
          }
        }

        return base
      })()

      const expandedTernaries: Ternary[] = []

      if (onlyTernaries.length) {
        // normalize tests to reduce duplicates
        const normalizedTernaries = normalizeTernaries(onlyTernaries)

        for (const ternary of normalizedTernaries) {
          if (!expandedTernaries.length) {
            expandTernary(ternary)
            continue
          }
          // snapshot current array before iterating - expandTernary mutates expandedTernaries
          const prevTernaries = [...expandedTernaries]
          for (const prev of prevTernaries) {
            expandTernary(ternary, prev)
          }
        }
      }

      function expandTernary(ternary: Ternary, prev?: Ternary) {
        // need to diverge into two (or four if alternate)
        if (ternary.consequent && Object.keys(ternary.consequent).length) {
          const fontFamily = getFontFamilyNameFromProps(ternary.consequent)

          expandedTernaries.push({
            fontFamily,
            // prevTest && test: merge consequent
            test: prev
              ? t.logicalExpression('&&', prev.test, ternary.test)
              : ternary.test,
            consequent: prev
              ? mergeProps(prev.consequent!, ternary.consequent)
              : ternary.consequent,
            remove,
            alternate: null,
          })

          if (prev) {
            expandedTernaries.push({
              fontFamily,
              // !prevTest && test: just consequent
              test: t.logicalExpression(
                '&&',
                t.unaryExpression('!', prev.test),
                ternary.test
              ),
              consequent: ternary.consequent,
              alternate: null,
              remove,
            })
          }
        }

        if (ternary.alternate && Object.keys(ternary.alternate).length) {
          const fontFamily = getFontFamilyNameFromProps(ternary.alternate)
          const negated = t.unaryExpression('!', ternary.test)
          expandedTernaries.push({
            fontFamily,
            // prevTest && !test: merge alternate
            test: prev ? t.logicalExpression('&&', prev.test, negated) : negated,
            consequent: prev
              ? mergeProps(prev.alternate!, ternary.alternate)
              : ternary.alternate,
            remove,
            alternate: null,
          })

          if (prev) {
            expandedTernaries.push({
              fontFamily,
              test: t.logicalExpression(
                '&&',
                t.unaryExpression('!', prev.test),
                ternary.test
              ),
              consequent: ternary.alternate,
              remove,
              alternate: null,
            })
          }
        }
      }

      let ternaryClassNameExpr: t.Expression | null = null

      // next: create all CSS, build className strings and hoist, and create final node with props
      if (hasTernaries) {
        for (const ternary of expandedTernaries) {
          if (!ternary.consequent) continue
          const classNames = addStyles(ternary.consequent)
          if (ternary.fontFamily) {
            classNames.unshift(`font_${ternary.fontFamily}`)
          }
          const baseString = t.isStringLiteral(baseClassNameExpression)
            ? baseClassNameExpression.value
            : ''

          const fullClassNameWithDups =
            (baseString ? `${baseString} ` : '') + classNames.join(' ')

          // we concat here as the base could be conditionally overriden by our classNames
          const fullClassName = concatClassName(fullClassNameWithDups)

          const classNameLiteral = t.stringLiteral(fullClassName)

          if (!ternaryClassNameExpr) {
            ternaryClassNameExpr = t.conditionalExpression(
              ternary.test,
              classNameLiteral,
              baseClassNameExpression
            )
          } else {
            ternaryClassNameExpr = t.conditionalExpression(
              ternary.test,
              classNameLiteral,
              ternaryClassNameExpr
            )
          }
        }
      }

      let finalExpression: t.Expression | null =
        ternaryClassNameExpr || baseClassNameExpression || null

      if (shouldPrintDebug) {
        console.info('attrs', JSON.stringify(attrs, null, 2))
        console.info('expandedTernaries', JSON.stringify(expandedTernaries, null, 2))
        console.info('finalExpression', JSON.stringify(finalExpression, null, 2))
        console.info({ hasTernaries, baseClassNameExpression })
      }

      if (finalExpression) {
        // hoist to global variables
        finalExpression = hoistClassNames(jsxPath, finalExpression)

        // console.log('finalExpression', finalExpression)

        const classNameProp = t.jsxAttribute(
          t.jsxIdentifier('className'),
          t.jsxExpressionContainer(finalExpression!)
        )
        finalAttrs.unshift(classNameProp)
      }

      node.attributes = finalAttrs
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
    stats: {
      styled: res.styled,
      flattened: res.flattened,
      optimized: res.optimized,
      found: res.found,
    },
  }
}

function hoistClassNames(path: NodePath<t.JSXElement>, expr: t.Expression) {
  if (t.isStringLiteral(expr)) {
    return hoistClassName(path, expr.value)
  }

  if (t.isLogicalExpression(expr)) {
    const left = t.isStringLiteral(expr.left)
      ? hoistClassName(path, expr.left.value)
      : expr.left
    const right = t.isStringLiteral(expr.right)
      ? hoistClassName(path, expr.right.value)
      : hoistClassNames(path, expr.right)
    return t.logicalExpression(expr.operator, left, right)
  }

  if (t.isConditionalExpression(expr)) {
    const cons = t.isStringLiteral(expr.consequent)
      ? hoistClassName(path, expr.consequent.value)
      : hoistClassNames(path, expr.consequent)

    const alt = t.isStringLiteral(expr.alternate)
      ? hoistClassName(path, expr.alternate.value)
      : hoistClassNames(path, expr.alternate)

    return t.conditionalExpression(expr.test, cons, alt)
  }

  return expr
}

function hoistClassName(path: NodePath<t.JSXElement>, str: string) {
  const uid = path.scope.generateUidIdentifier('cn')
  const parent = path.findParent((path) => path.isProgram())
  if (!parent) throw new Error(`no program?`)
  const variable = t.variableDeclaration('const', [
    t.variableDeclarator(uid, t.stringLiteral(cleanupClassName(str))),
  ])
  // @ts-ignore
  parent.unshiftContainer('body', variable)
  return uid
}

function cleanupClassName(inStr: string) {
  const out = new Set<string>()
  for (const part of inStr.split(' ')) {
    if (part === ' ') continue
    if (part === 'font_') continue
    out.add(part)
  }
  // always a space after for joining
  return [...out].join(' ') + ' '
}
