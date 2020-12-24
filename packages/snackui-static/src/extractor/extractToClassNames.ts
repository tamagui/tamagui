import path from 'path'
import util from 'util'

import generate from '@babel/generator'
import traverse, { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import invariant from 'invariant'
import { ViewStyle } from 'react-native'
import { defaultMediaQueries, mediaObjectToString } from 'snackui/node'

import { CSS_FILE_NAME } from '../constants'
import { getStylesAtomic } from '../css/getStylesAtomic'
import { Extractor, isInsideSnackUI } from '../extractor/createExtractor'
import { Ternary } from '../extractor/extractStaticTernaries'
import { ClassNameToStyleObj, PluginOptions } from '../types'
import { babelParse } from './babelParse'
import { getPropValueFromAttributes } from './getPropValueFromAttributes'

type ClassNameObject = t.StringLiteral | t.Expression

export function extractToClassNames(
  extractor: Extractor,
  src: string | Buffer,
  sourceFileName: string,
  options: PluginOptions
): null | {
  js: string | Buffer
  css: string
  cssFileName: string
  ast: t.File
  map: any // RawSourceMap from 'source-map'
} {
  if (typeof src !== 'string') {
    throw new Error('`src` must be a string of javascript')
  }
  invariant(
    typeof sourceFileName === 'string' && path.isAbsolute(sourceFileName),
    '`sourceFileName` must be an absolute path to a .js file'
  )

  const shouldPrintDebug =
    (!!process.env.DEBUG &&
      (process.env.DEBUG_FILE
        ? sourceFileName.includes(process.env.DEBUG_FILE)
        : true)) ||
    (src[0] === '/' && src.startsWith('// debug'))

  // Using a map for (officially supported) guaranteed insertion order
  let ast: t.File

  try {
    ast = babelParse(src)
  } catch (err) {
    console.error(
      'babel parsing error',
      sourceFileName,
      err.message,
      '\n',
      err.stack,
      src
    )
    throw new Error(`Couldn't parse`)
  }

  const cssMap = new Map<string, { css: string; commentTexts: string[] }>()
  const existingHoists = {}
  const mediaQueries = options.mediaQueries ?? defaultMediaQueries

  // for now order first strongest
  const mediaKeys = Object.keys(mediaQueries)
  const mediaKeysLen = mediaKeys.length
  const mediaKeyPrecendence = mediaKeys.reduce((acc, cur, i) => {
    acc[cur] = new Array(mediaKeysLen - i).fill(':root').join('')
    return acc
  }, {})

  let didExtract = false

  traverse(ast, {
    Program(programPath) {
      extractor.parse(programPath, {
        sourceFileName,
        shouldPrintDebug,
        ...options,
        getFlattenedNode: ({ isTextView }) => {
          return isTextView ? 'span' : 'div'
        },
        onExtractTag: ({
          node,
          attemptEval,
          viewStyles,
          ternaries,
          jsxPath,
          originalNodeName,
          filePath,
          lineNumbers,
          spreadInfo,
        }) => {
          didExtract = true

          let classNamePropValue: t.Expression | null = null
          const classNamePropIndex = node.attributes.findIndex(
            (attr) =>
              !t.isJSXSpreadAttribute(attr) &&
              attr.name &&
              attr.name.name === 'className'
          )
          if (classNamePropIndex > -1) {
            classNamePropValue = getPropValueFromAttributes(
              'className',
              node.attributes
            )
            node.attributes.splice(classNamePropIndex, 1)
          }

          const classNameObjects: ClassNameObject[] = []
          if (classNamePropValue) {
            try {
              const evaluatedValue = attemptEval(classNamePropValue)
              classNameObjects.push(t.stringLiteral(evaluatedValue))
            } catch (e) {
              classNameObjects.push(classNamePropValue)
            }
          }

          const stylesByClassName: ClassNameToStyleObj = {}
          const filteredMediaQueries = new Set<string>()

          // convert media query ternaries into media queries
          if (ternaries) {
            ternaries = ternaries.filter((ternary) => {
              const result = getMediaQueryTernary(
                jsxPath,
                ternary,
                sourceFileName
              )
              if (!result) {
                if (shouldPrintDebug) {
                  console.log('  not media query', result)
                }
                // cant evaluate as media query, keep it
                return true
              }
              const { key, bindingName } = result
              const mediaQuery = mediaQueries[key]
              if (!mediaQuery) {
                console.error(
                  `Media query key "${key}" but not found in: ${Object.keys(
                    mediaQueries
                  )}`
                )
                return true
              }
              const getStyleObj = (
                styleObj: ViewStyle | null,
                negate = false
              ) => {
                return styleObj ? { styleObj, negate } : null
              }
              const styleOpts = [
                getStyleObj(ternary.consequent, false),
                getStyleObj(ternary.alternate, true),
              ].filter(isPresent)
              if (shouldPrintDebug && !styleOpts.length) {
                console.log('  media query, no styles?')
                return true
              }
              for (const { styleObj, negate } of styleOpts) {
                const styles = getStylesAtomic(styleObj, null, shouldPrintDebug)
                const mediaStyles = styles.map((style) => {
                  const negKey = negate ? '_not' : ''
                  const identifier = `${style.identifier}_${key}${negKey}`
                  const className = `.${identifier}`
                  const mediaSelector = mediaObjectToString(mediaQueries[key])
                  const screenStr = negate ? ' not' : ''
                  const mediaStr = `@media${screenStr} screen and ${mediaSelector}`
                  const precendencePrefix = mediaKeyPrecendence[key]
                  const styleInner = `${precendencePrefix} ${style.rules[0].replace(
                    style.className,
                    className
                  )}`
                  const styleRule = `${mediaStr} { ${styleInner} }`
                  return {
                    ...style,
                    identifier,
                    className,
                    rules: [styleRule],
                  }
                })

                // add to output
                if (shouldPrintDebug) {
                  console.log('  media style:', mediaStyles)
                }
                for (const mediaStyle of mediaStyles) {
                  stylesByClassName[mediaStyle.identifier] = mediaStyle
                  classNameObjects.push(t.stringLiteral(mediaStyle.identifier))
                }
              }

              // filter out
              ternary.remove()
              filteredMediaQueries.add(bindingName)

              return false
            })
          }

          let classNamePropValueForReals = buildClassNamePropValue(
            classNameObjects
          )

          const addStylesAtomic = (style: any) => {
            if (!style || !Object.keys(style).length) {
              return []
            }
            const res = getStylesAtomic(style, null, shouldPrintDebug)
            for (const x of res) {
              stylesByClassName[x.identifier] = x
            }
            return res
          }

          // get extracted classNames
          const classNames: string[] = []
          const hasViewStyle = Object.keys(viewStyles).length > 0
          if (hasViewStyle) {
            const styles = addStylesAtomic(viewStyles)
            for (const style of styles) {
              classNames.push(style.identifier)
            }
          }

          function getTernaryExpression(record: Ternary, idx: number) {
            const consInfo = addStylesAtomic({
              ...viewStyles,
              ...record.consequent,
            })
            const altInfo = addStylesAtomic({
              ...viewStyles,
              ...record.alternate,
            })
            const cCN = consInfo.map((x) => x.identifier).join(' ')
            const aCN = altInfo.map((x) => x.identifier).join(' ')
            if (consInfo.length && altInfo.length) {
              if (idx > 0) {
                // if it's not the first ternary, add a leading space
                return t.binaryExpression(
                  '+',
                  t.stringLiteral(' '),
                  t.conditionalExpression(
                    record.test,
                    t.stringLiteral(cCN),
                    t.stringLiteral(aCN)
                  )
                )
              } else {
                return t.conditionalExpression(
                  record.test,
                  t.stringLiteral(cCN),
                  t.stringLiteral(aCN)
                )
              }
            } else {
              // if only one className is present, put the padding space inside the ternary
              return t.conditionalExpression(
                record.test,
                t.stringLiteral((idx > 0 && cCN ? ' ' : '') + cCN),
                t.stringLiteral((idx > 0 && aCN ? ' ' : '') + aCN)
              )
            }
          }

          // build the classname property
          if (ternaries?.length) {
            const ternaryExprs = ternaries.map(getTernaryExpression)
            if (shouldPrintDebug) {
              console.log('  ternaryExprs', ternaryExprs)
            }
            if (classNamePropValueForReals) {
              classNamePropValueForReals = t.binaryExpression(
                '+',
                // @ts-expect-error
                buildClassNamePropValue(ternaryExprs),
                t.binaryExpression(
                  '+',
                  t.stringLiteral(' '),
                  classNamePropValueForReals!
                )
              )
            } else {
              // if no spread/className prop, we can optimize all the way
              classNamePropValueForReals = buildClassNamePropValue(ternaryExprs)
            }
          } else {
            if (classNames.length) {
              const classNameProp = t.stringLiteral(classNames.join(' '))
              if (classNamePropValueForReals) {
                classNamePropValueForReals = buildClassNamePropValue([
                  classNamePropValueForReals,
                  classNameProp,
                ])
              } else {
                classNamePropValueForReals = classNameProp
              }
            }
          }

          // for simple spread, we need to have it add in the spread className if exists
          if (
            classNamePropValueForReals &&
            spreadInfo.isSingleSimple &&
            spreadInfo.simpleIdentifier
          ) {
            classNamePropValueForReals = t.binaryExpression(
              '+',
              classNamePropValueForReals,
              t.binaryExpression(
                '+',
                t.stringLiteral(' '),
                t.logicalExpression(
                  '||',
                  t.logicalExpression(
                    '&&',
                    spreadInfo.simpleIdentifier,
                    t.memberExpression(
                      spreadInfo.simpleIdentifier,
                      t.identifier('className')
                    )
                  ),
                  t.stringLiteral('')
                )
              )
            )
          }

          if (classNamePropValueForReals) {
            classNamePropValueForReals = hoistClassNames(
              jsxPath,
              existingHoists,
              classNamePropValueForReals
            )
            node.attributes.push(
              t.jsxAttribute(
                t.jsxIdentifier('className'),
                t.jsxExpressionContainer(classNamePropValueForReals as any)
              )
            )
          }

          const comment = util.format(
            '/* %s:%s (%s) */',
            filePath,
            lineNumbers,
            originalNodeName
          )

          if (shouldPrintDebug) {
            console.log(
              '  final styled classnames',
              Object.keys(stylesByClassName).join(', ')
            )
          }

          for (const className in stylesByClassName) {
            if (cssMap.has(className)) {
              if (comment) {
                const val = cssMap.get(className)!
                val.commentTexts.push(comment)
                cssMap.set(className, val)
              }
            } else {
              if (stylesByClassName[className]) {
                const { rules } = stylesByClassName[className]
                if (rules.length) {
                  if (rules.length > 1) {
                    console.log('  ', { rules })
                    throw new Error(`Shouldn't have more than one rule`)
                  }
                  cssMap.set(className, {
                    css: rules[0],
                    commentTexts: [comment],
                  })
                }
              }
            }
          }
        },
      })
    },
  })

  if (!didExtract) {
    return null
  }

  const css = Array.from(cssMap.values())
    .map((v) => v.commentTexts.map((txt) => `${txt}\n`).join('') + v.css)
    .join(' ')
  const extName = path.extname(sourceFileName)
  const baseName = path.basename(sourceFileName, extName)
  const cssImportFileName = `./${baseName}${CSS_FILE_NAME}`
  const sourceDir = path.dirname(sourceFileName)
  const cssFileName = path.join(sourceDir, cssImportFileName)

  if (css !== '') {
    ast.program.body.unshift(
      t.importDeclaration([], t.stringLiteral(cssImportFileName))
    )
  }

  const result = generate(
    ast,
    {
      compact: 'auto',
      concise: false,
      filename: sourceFileName,
      // @ts-ignore
      quotes: 'single',
      retainLines: false,
      sourceFileName,
      sourceMaps: true,
    },
    src
  )

  if (shouldPrintDebug) {
    console.log(
      '\n\noutput code >> ',
      result.code
        .split('\n')
        .filter((line) => !line.startsWith('//'))
        .join('\n')
    )
    console.log('\n\noutput css >> ', css)
  }

  return {
    ast,
    cssFileName,
    css,
    js: result.code,
    map: result.map,
  }
}

function buildClassNamePropValue(classNameObjects: ClassNameObject[]) {
  return classNameObjects.reduce<t.Expression | null>((acc, val) => {
    if (acc == null) {
      if (
        // pass conditional expressions through
        t.isConditionalExpression(val) ||
        // pass non-null literals through
        t.isStringLiteral(val) ||
        t.isNumericLiteral(val)
      ) {
        return val
      }
      return t.logicalExpression('||', val, t.stringLiteral(''))
    }

    let inner: t.Expression
    if (t.isStringLiteral(val)) {
      if (t.isStringLiteral(acc)) {
        // join adjacent string literals
        return t.stringLiteral(`${acc.value} ${val.value}`)
      }
      inner = t.stringLiteral(` ${val.value}`)
    } else if (t.isLiteral(val)) {
      inner = t.binaryExpression('+', t.stringLiteral(' '), val)
    } else if (t.isConditionalExpression(val) || t.isBinaryExpression(val)) {
      if (t.isStringLiteral(acc)) {
        return t.binaryExpression('+', t.stringLiteral(`${acc.value} `), val)
      }
      inner = t.binaryExpression('+', t.stringLiteral(' '), val)
    } else if (t.isIdentifier(val) || t.isMemberExpression(val)) {
      // identifiers and member expressions make for reasonable ternaries
      inner = t.conditionalExpression(
        val,
        t.binaryExpression('+', t.stringLiteral(' '), val),
        t.stringLiteral('')
      )
    } else {
      if (t.isStringLiteral(acc)) {
        return t.binaryExpression(
          '+',
          t.stringLiteral(`${acc.value} `),
          t.logicalExpression('||', val, t.stringLiteral(''))
        )
      }
      // use a logical expression for more complex prop values
      inner = t.binaryExpression(
        '+',
        t.stringLiteral(' '),
        t.logicalExpression('||', val, t.stringLiteral(''))
      )
    }
    return t.binaryExpression('+', acc, inner)
  }, null)
}

function hoistClassNames(path: any, existing: any, expr: any) {
  const hoist = hoistClassNames.bind(null, path, existing)
  if (t.isStringLiteral(expr)) {
    if (expr.value.trim() === '') {
      return expr
    }
    if (existing[expr.value]) {
      return existing[expr.value]
    }
    const identifier = replaceStringWithVariable(expr)
    existing[expr.value] = identifier
    return identifier
  }
  if (t.isBinaryExpression(expr)) {
    return t.binaryExpression(
      expr.operator,
      hoist(expr.left),
      hoist(expr.right)
    )
  }
  if (t.isLogicalExpression(expr)) {
    return t.logicalExpression(
      expr.operator,
      hoist(expr.left),
      hoist(expr.right)
    )
  }
  if (t.isConditionalExpression(expr)) {
    return t.conditionalExpression(
      expr.test,
      hoist(expr.consequent),
      hoist(expr.alternate)
    )
  }
  return expr

  function replaceStringWithVariable(str: t.StringLiteral): t.Identifier {
    // hoist outside fn!
    const uid = path.scope.generateUidIdentifier('cn')
    const parent = path.findParent((path) => path.isProgram())
    const variable = t.variableDeclaration('const', [
      t.variableDeclarator(uid, str),
    ])
    parent.unshiftContainer('body', variable)
    return uid
  }
}

function getMediaQueryTernary(
  jsxPath: NodePath<t.JSXElement>,
  ternary: Ternary,
  sourceFileName: string
) {
  // const media = useMedia()
  // ... media.sm
  if (
    t.isMemberExpression(ternary.test) &&
    t.isIdentifier(ternary.test.object) &&
    t.isIdentifier(ternary.test.property)
  ) {
    const name = ternary.test.object.name
    const key = ternary.test.property.name
    if (!jsxPath.scope.hasBinding(name)) return false
    const bindingNode = jsxPath.scope.getBinding(name)?.path?.node
    if (!t.isVariableDeclarator(bindingNode) || !bindingNode.init) return false
    if (!isValidMediaCall(jsxPath, bindingNode.init, sourceFileName))
      return false
    return { key, bindingName: name }
  }
  // const { sm } = useMedia()
  // ... sm
  if (t.isIdentifier(ternary.test)) {
    const key = ternary.test.name
    const node = jsxPath.scope.getBinding(ternary.test.name)?.path?.node
    if (!t.isVariableDeclarator(node)) return false
    if (!node.init || !isValidMediaCall(jsxPath, node.init, sourceFileName))
      return false
    return { key, bindingName: key }
  }
  return false
}

function isValidMediaCall(
  jsxPath: NodePath<t.JSXElement>,
  init: t.Expression,
  sourceFileName: string
) {
  if (!t.isCallExpression(init)) return false
  if (!t.isIdentifier(init.callee)) return false
  // TODO could support renaming useMedia by looking up import first
  if (init.callee.name !== 'useMedia') return false
  if (!jsxPath.scope.hasBinding('useMedia')) return false
  const useMediaImport = jsxPath.scope.getBinding('useMedia')?.path.parent
  if (!t.isImportDeclaration(useMediaImport)) return false
  if (useMediaImport.source.value !== 'snackui') {
    if (!isInsideSnackUI(sourceFileName)) {
      return false
    }
  }
  return true
}

function isPresent<T extends Object>(input: null | undefined | T): input is T {
  return input != null
}
