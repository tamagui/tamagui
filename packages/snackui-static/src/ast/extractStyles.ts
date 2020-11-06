import path from 'path'
import util from 'util'
import vm from 'vm'

import generate from '@babel/generator'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import { writeFileSync } from 'fs-extra'
import invariant from 'invariant'
import { TextStyle, ViewStyle } from 'react-native'
import * as AllExports from 'snackui/node'

import { GLOSS_CSS_FILE } from '../constants'
import { getStylesAtomic, pseudos } from '../style/getStylesAtomic'
import {
  CacheObject,
  ClassNameToStyleObj,
  ExtractStylesOptions,
} from '../types'
import { evaluateAstNode } from './evaluateAstNode'
import {
  Ternary,
  TernaryRecord,
  extractStaticTernaries,
} from './extractStaticTernaries'
import { getPropValueFromAttributes } from './getPropValueFromAttributes'
import { getStaticBindingsForScope } from './getStaticBindingsForScope'
import { literalToAst } from './literalToAst'
import { parse } from './parse'

const UI_PATH = require.resolve('snackui')
const UI_STYLE_PATH = path.join(UI_PATH, '..', '..', 'style.css')

type OptimizableComponent = Function & {
  staticConfig: {
    validStyles: { [key: string]: boolean }
    defaultProps: any
    expansionProps?: {
      // eg: <ZStack fullscreen />, { fullscreen: { position: 'absolute', ... } }
      [key: string]:
        | ViewStyle
        | TextStyle
        | ((props: any) => ViewStyle | TextStyle)
    }
  }
}

const FAILED_EVAL = Symbol('failed_style_eval')

const validComponents: { [key: string]: OptimizableComponent } = Object.keys(
  AllExports
)
  .filter((key) => !!AllExports[key]?.staticConfig)
  .reduce((obj, name) => {
    obj[name] = AllExports[name]
    return obj
  }, {})

if (!!process.env.DEBUG) {
  console.log('validComponents', Object.keys(validComponents))
}

export interface Options {
  cacheObject: CacheObject
  errorCallback?: (str: string, ...args: any[]) => void
  warnCallback?: (str: string, ...args: any[]) => void
}

type ClassNameObject = t.StringLiteral | t.Expression

interface TraversePath<TNode = any> {
  node: TNode
  scope: {} // TODO
  parentPath: TraversePath<any>
  insertBefore: (arg: t.Node) => void
}

const UNTOUCHED_PROPS = {
  key: true,
  style: true,
  className: true,
}

// per-file cache of evaluated bindings
const bindingCache: Record<string, string | null> = {}

const globalCSSMap = new Map<string, string>()

export function extractStyles(
  src: string | Buffer,
  sourceFileName: string,
  { cacheObject, errorCallback }: Options,
  userOptions: ExtractStylesOptions
): {
  js: string | Buffer
  css: string
  cssFileName: string | null
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
  invariant(
    typeof cacheObject === 'object' && cacheObject !== null,
    '`cacheObject` must be an object'
  )

  const shouldPrintDebug =
    (!!process.env.DEBUG &&
      (process.env.DEBUG_FILE
        ? sourceFileName.includes(process.env.DEBUG_FILE)
        : true)) ||
    src.startsWith('// debug')

  const options: ExtractStylesOptions = {
    evaluateVars: true,
    ...userOptions,
  }

  const sourceDir = path.dirname(sourceFileName)

  // Using a map for (officially supported) guaranteed insertion order
  const cssMap = new Map<string, { css: string; commentTexts: string[] }>()
  const ast = parse(src)

  let didExtract = false
  let doesImport = false
  let doesUseValidImport = false

  // Find gloss require in program root
  ast.program.body.forEach((item: t.Node) => {
    if (t.isImportDeclaration(item)) {
      if (
        item.source.value === 'snackui' ||
        sourceFileName.includes('/snackui/src')
      ) {
        doesImport = true
      }
      if (doesImport) {
        item.specifiers.forEach((specifier) => {
          if (validComponents[specifier.local.name]) {
            doesUseValidImport = true
          }
        })
      }
    }
  })

  // gloss isn't included anywhere, so let's bail
  if (!doesImport || !doesUseValidImport) {
    return {
      ast,
      css: '',
      cssFileName: null,
      js: src,
      map: null,
    }
  }

  if (shouldPrintDebug) {
    console.log('\nSTART', sourceFileName)
  }

  const existingHoists = {}
  let couldntParse = false

  /**
   * Step 2: Statically extract from JSX < /> nodes
   */
  traverse(ast, {
    JSXElement: {
      enter(traversePath: TraversePath<t.JSXElement>) {
        const node = traversePath.node.openingElement
        const ogAttributes = node.attributes
        const componentName = findComponentName(traversePath.scope)

        if (
          // skip non-identifier opening elements (member expressions, etc.)
          !t.isJSXIdentifier(node.name) ||
          // skip non-gloss components
          !validComponents[node.name.name]
        ) {
          return
        }

        // Remember the source component

        const component = validComponents[node.name.name]!
        const { staticConfig } = component

        if (!staticConfig) {
          console.log('skipping', node.name.name)
          return
        }

        const originalNodeName = node.name.name
        const isTextView = originalNodeName.endsWith('Text')
        const validStyles = staticConfig?.validStyles ?? {}
        const domNode = isTextView ? 'span' : 'div'

        if (shouldPrintDebug) {
          console.log('node', originalNodeName, domNode)
        }

        const isStaticAttributeName = (name: string) => {
          return (
            !!validStyles[name] ||
            !!staticConfig?.expansionProps?.[name] ||
            !!pseudos[name]
          )
        }

        const attemptEval = !options.evaluateVars
          ? evaluateAstNode
          : (() => {
              // Generate scope object at this level
              const staticNamespace = getStaticBindingsForScope(
                traversePath.scope,
                userOptions.evaluateImportsWhitelist ?? ['constants.js'],
                sourceFileName,
                bindingCache,
                shouldPrintDebug
              )
              if (shouldPrintDebug) {
                console.log('staticNamespace', staticNamespace)
              }
              const evalContext = vm.createContext(staticNamespace)

              // called when evaluateAstNode encounters a dynamic-looking prop
              const evalFn = (n: t.Node) => {
                // variable
                if (t.isIdentifier(n)) {
                  invariant(
                    staticNamespace.hasOwnProperty(n.name),
                    `identifier not in staticNamespace: "${n.name}"`
                  )
                  return staticNamespace[n.name]
                }
                return vm.runInContext(`(${generate(n).code})`, evalContext)
              }

              return (n: t.Node) => {
                return evaluateAstNode(n, evalFn)
              }
            })()

        const attemptEvalSafe = (n: t.Node) => {
          try {
            return attemptEval(n)
          } catch (err) {
            if (shouldPrintDebug) {
              console.log('attemptEvalSafe failed', err.message)
            }
            return FAILED_EVAL
          }
        }

        // STORE *EVERY* { [CLASSNAME]: STYLES } on this (used to generate css later)
        const stylesByClassName: ClassNameToStyleObj = {}
        // ternaries we can extract, of course
        const staticTernaries: Ternary[] = []

        const addStylesAtomic = (style: any) => {
          if (!style || !Object.keys(style).length) {
            return []
          }
          const res = getStylesAtomic(style, null, shouldPrintDebug)
          res.forEach((x) => {
            stylesByClassName[x.identifier] = x
          })
          return res
        }

        let lastSpreadIndex: number = -1
        const flattenedAttributes: (
          | t.JSXAttribute
          | t.JSXSpreadAttribute
        )[] = []

        const isStyleObject = (obj: t.Node): obj is t.ObjectExpression => {
          return (
            t.isObjectExpression(obj) &&
            obj.properties.every((prop) => {
              return (
                t.isObjectProperty(prop) &&
                isStaticAttributeName(prop.key['name'])
              )
            })
          )
        }

        let didFailStaticallyExtractingSpread = false
        let numberNonStaticSpreads = 0

        node.attributes.forEach((attr, index) => {
          if (!t.isJSXSpreadAttribute(attr)) {
            flattenedAttributes.push(attr)
            return
          }

          // simple spreads of style objects like ternaries

          // <VStack {...isSmall ? { color: 'red } : { color: 'blue }}
          if (t.isConditionalExpression(attr.argument)) {
            const { alternate, consequent, test } = attr.argument
            const aStyle = isStyleObject(alternate)
              ? attemptEvalSafe(alternate)
              : FAILED_EVAL
            const cStyle = isStyleObject(consequent)
              ? attemptEvalSafe(consequent)
              : FAILED_EVAL

            if (aStyle !== FAILED_EVAL && cStyle !== FAILED_EVAL) {
              staticTernaries.push({
                test,
                alternate: aStyle,
                consequent: cStyle,
              })
              return
            } else {
              didFailStaticallyExtractingSpread = true
            }
          }

          // <VStack {...isSmall && { color: 'red' }}
          if (t.isLogicalExpression(attr.argument)) {
            if (isStyleObject(attr.argument.right)) {
              const spreadStyle = attemptEvalSafe(attr.argument.right)
              if (spreadStyle !== FAILED_EVAL) {
                const test = (attr.argument as t.LogicalExpression).left
                staticTernaries.push({
                  test,
                  consequent: spreadStyle,
                  alternate: null,
                })
                return
              }
            } else {
              didFailStaticallyExtractingSpread = true
            }
          }

          // handle all other spreads
          let spreadValue: any
          try {
            spreadValue = attemptEval(attr.argument)
          } catch (e) {
            lastSpreadIndex = flattenedAttributes.push(attr) - 1
          }

          if (spreadValue) {
            try {
              if (typeof spreadValue !== 'object' || spreadValue == null) {
                lastSpreadIndex = flattenedAttributes.push(attr) - 1
              } else {
                for (const k in spreadValue) {
                  const value = spreadValue[k]
                  // this is a null spread:
                  if (value && typeof value === 'object') {
                    continue
                  }
                  numberNonStaticSpreads++
                  flattenedAttributes.push(
                    t.jsxAttribute(
                      t.jsxIdentifier(k),
                      t.jsxExpressionContainer(literalToAst(value))
                    )
                  )
                }
              }
            } catch (err) {
              console.warn('caught object err', err)
              didFailStaticallyExtractingSpread = true
              couldntParse = true
            }
          }
        })

        if (couldntParse) {
          console.log('COULDNT PARSE')
          return
        }

        node.attributes = flattenedAttributes

        const styleExpansions: { name: string; value: any }[] = []

        const foundLastSpreadIndex = flattenedAttributes.findIndex((x) =>
          t.isJSXSpreadAttribute(x)
        )
        const hasOneEndingSpread =
          !didFailStaticallyExtractingSpread &&
          numberNonStaticSpreads <= 1 &&
          lastSpreadIndex > -1 &&
          foundLastSpreadIndex === lastSpreadIndex
        let simpleSpreadIdentifier: t.Identifier | null = null
        const isSingleSimpleSpread =
          hasOneEndingSpread &&
          flattenedAttributes.some((x) => {
            if (t.isJSXSpreadAttribute(x)) {
              if (t.isIdentifier(x.argument)) {
                simpleSpreadIdentifier = x.argument
                return true
              }
            }
          })

        let viewStyles: ViewStyle = {}
        let inlinePropCount = 0

        if (shouldPrintDebug) {
          console.log('spreads:', {
            hasOneEndingSpread,
            isSingleSimpleSpread,
            lastSpreadIndex,
            foundLastSpreadIndex,
            inlinePropCount,
          })
          console.log('attrs:', node.attributes.map(attrGetName).join(', '))
        }

        node.attributes = node.attributes.filter((attribute, idx) => {
          const notToLastSpread = idx < lastSpreadIndex && !isSingleSimpleSpread
          if (
            t.isJSXSpreadAttribute(attribute) ||
            // keep the weirdos
            !attribute.name ||
            // filter out JSXIdentifiers
            typeof attribute.name.name !== 'string' ||
            // haven't hit the last spread operator (we can optimize single simple spreads still)
            notToLastSpread
          ) {
            if (t.isJSXSpreadAttribute(attribute)) {
              // spread fine
            } else {
              if (shouldPrintDebug) {
                console.log(
                  'inline (non normal attr)',
                  attribute['name']?.['name']
                )
              }
              inlinePropCount++
            }
            return true
          }

          const name = attribute.name.name
          let value: any = t.isJSXExpressionContainer(attribute?.value)
            ? attribute.value.expression
            : attribute.value

          // handle expansions, we parse these after all props parsed
          const expansion = staticConfig?.expansionProps?.[name]
          if (
            expansion &&
            !t.isBinaryExpression(value) &&
            !t.isConditionalExpression(value)
          ) {
            const styleValue =
              t.isIdentifier(value) && name === value.name
                ? // handle boolean jsx props
                  true
                : attemptEvalSafe(value)
            if (styleValue === FAILED_EVAL) {
              if (shouldPrintDebug) {
                console.warn('Failed style expansion!', name, attribute?.value)
              }
              inlinePropCount++
              return true
            } else {
              styleExpansions.push({ name, value: styleValue })
              return false
            }
          }

          // value == null means boolean (true)
          const isBoolean = value == null

          if (isBoolean) {
            inlinePropCount++
            return true
          }

          // if one or more spread operators are present and we haven't hit the last one yet, the prop stays inline
          const hasntHitLastSpread =
            lastSpreadIndex > -1 && idx <= lastSpreadIndex
          if (
            hasntHitLastSpread &&
            // unless we have a single simple spread, we can handle that
            !isSingleSimpleSpread
          ) {
            inlinePropCount++
            return true
          }
          // pass ref, key, and style props through untouched
          if (UNTOUCHED_PROPS[name]) {
            return true
          }

          if (name === 'ref') {
            inlinePropCount++
            return true
          }

          if (!isStaticAttributeName(name)) {
            inlinePropCount++
            return true
          }

          // if value can be evaluated, extract it and filter it out

          const styleValue = attemptEvalSafe(value)

          if (styleValue === FAILED_EVAL) {
            // dynamic
          } else {
            if (shouldPrintDebug) {
              console.log('attr', {
                name,
                inlinePropCount,
                styleValue,
                value,
                attribute: attribute?.value?.['expression'],
              })
            }
            viewStyles[name] = styleValue
            return false
          }

          // ternaries!

          // binary ternary, we can eventually make this smarter but step 1
          // basically for the common use case of:
          // opacity={(conditional ? 0 : 1) * scale}
          if (t.isBinaryExpression(value)) {
            const { operator, left, right } = value
            // if one side is a ternary, and the other side is evaluatable, we can maybe extract
            const lVal = attemptEvalSafe(left)
            const rVal = attemptEvalSafe(right)
            if (lVal !== FAILED_EVAL && t.isConditionalExpression(right)) {
              if (addBinaryConditional(operator, left, right)) {
                return false
              }
            }
            if (rVal !== FAILED_EVAL && t.isConditionalExpression(left)) {
              if (addBinaryConditional(operator, right, left)) {
                return false
              }
            }
          }

          function addBinaryConditional(
            operator: any,
            staticExpr: any,
            cond: t.ConditionalExpression
          ) {
            if (getStaticConditional(cond)) {
              staticTernaries.push({
                test: cond.test,
                alternate: attemptEval(
                  t.binaryExpression(operator, staticExpr, cond.alternate)
                ),
                consequent: attemptEval(
                  t.binaryExpression(operator, staticExpr, cond.consequent)
                ),
              })
              return true
            }
          }

          function getStaticConditional(value: t.Node): Ternary | null {
            if (t.isConditionalExpression(value)) {
              try {
                const aVal = attemptEval(value.alternate)
                const cVal = attemptEval(value.consequent)
                return {
                  test: value.test,
                  consequent: { [name]: cVal },
                  alternate: { [name]: aVal },
                }
              } catch (err) {
                if (shouldPrintDebug) {
                  console.log(
                    'couldnt statically evaluate conditional',
                    err.message
                  )
                }
              }
            }
            return null
          }

          function getStaticLogical(value: t.Node): Ternary | null {
            if (t.isLogicalExpression(value)) {
              if (value.operator === '&&') {
                try {
                  const val = attemptEval(value.right)
                  return {
                    test: value.left,
                    consequent: { [name]: val },
                    alternate: null,
                  }
                } catch (err) {
                  if (shouldPrintDebug) {
                    console.log('couldnt statically evaluate', err)
                  }
                }
              }
            }
            return null
          }

          const staticConditional = getStaticConditional(value)
          if (staticConditional) {
            staticTernaries.push(staticConditional)
            return false
          }

          const staticLogical = getStaticLogical(value)
          if (staticLogical) {
            staticTernaries.push(staticLogical)
            return false
          }

          if (shouldPrintDebug) {
            console.log('inline prop via no match', name, value.type)
          }

          // if we've made it this far, the prop stays inline
          inlinePropCount++
          return true
        })

        // if inlining + spreading + ternary, deopt fully
        if (inlinePropCount && staticTernaries.length && lastSpreadIndex > -1) {
          if (shouldPrintDebug) {
            console.log(
              'deopt due to inline + spread',
              inlinePropCount,
              staticTernaries
            )
          }
          node.attributes = ogAttributes
          return
        }

        const defaultProps = component.staticConfig?.defaultProps ?? {}
        const defaultStyle = {}
        const defaultStaticProps = {}

        // get our expansion props vs our style props
        for (const key in defaultProps) {
          if (validStyles[key]) {
            defaultStyle[key] = defaultProps[key]
          } else {
            defaultStaticProps[key] = defaultProps[key]
            styleExpansions.push({ name: key, value: defaultProps[key] })
          }
        }

        // if all style props have been extracted, gloss component can be
        // converted to a div or the specified component
        if (inlinePropCount === 0 && !isSingleSimpleSpread) {
          if (
            process.env.NODE_ENV === 'development' ||
            process.env.DEBUG ||
            process.env.IDENTIFY_TAGS
          ) {
            // add name so we can debug it more easily
            node.attributes.push(
              t.jsxAttribute(
                t.jsxIdentifier('data-is'),
                t.stringLiteral(
                  componentName
                    ? `${componentName}-${node.name.name}`
                    : node.name.name
                )
              )
            )
          }
          // since were removing down to div, we need to push the default styles onto this classname
          if (shouldPrintDebug) {
            console.log({ component, originalNodeName, defaultStyle })
          }
          viewStyles = {
            ...defaultStyle,
            ...viewStyles,
          }
          // change to div
          node.name.name = domNode
        }

        // second pass, style expansions
        let styleExpansionError = false
        if (shouldPrintDebug) {
          console.log('styleExpansions', { defaultProps, styleExpansions })
        }
        if (styleExpansions.length) {
          if (shouldPrintDebug) {
            console.log('styleExpansions', styleExpansions)
          }
          // first build fullStyles to pass in
          const fullProps = {
            ...defaultStaticProps,
            ...viewStyles,
          }
          for (const { name, value } of styleExpansions) {
            fullProps[name] = value
          }
          function getStyleExpansion(name: string, value?: any) {
            const expansion = staticConfig?.expansionProps?.[name]
            if (typeof expansion === 'function') {
              if (shouldPrintDebug) {
                console.log('expanding', name, value, fullProps)
              }
              try {
                return expansion({ ...fullProps, [name]: value })
              } catch (err) {
                console.error('Error running expansion', err)
                styleExpansionError = true
                return {}
              }
            }
            if (expansion) {
              return expansion
            }
          }
          for (const { name, value } of styleExpansions) {
            const expandedStyle = getStyleExpansion(name, value)
            if (shouldPrintDebug) {
              console.log('expanded', { styleExpansionError, expandedStyle })
            }
            if (styleExpansionError) {
              break
            }
            if (expandedStyle) {
              Object.assign(viewStyles, expandedStyle)
            }
          }
        }

        if (shouldPrintDebug) {
          console.log('viewStyles', inlinePropCount, viewStyles)
        }

        if (styleExpansionError) {
          if (shouldPrintDebug) {
            console.log('bailing optimization due to failed style expansion')
          }
          node.attributes = ogAttributes
          return
        }

        if (shouldPrintDebug) {
          console.log(
            `\nname: ${node.name.name}\ninlinePropCount: ${inlinePropCount}\ndomNode: ${domNode}`
          )
        }

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

        if (inlinePropCount) {
          // if only some style props were extracted AND additional props are spread onto the component,
          // add the props back with null values to prevent spread props from incorrectly overwriting the extracted prop value
          for (const key in defaultStyle) {
            if (key in viewStyles) {
              node.attributes.push(
                t.jsxAttribute(
                  t.jsxIdentifier(key),
                  t.jsxExpressionContainer(t.nullLiteral())
                )
              )
            }
          }
        }

        if (traversePath.node.closingElement) {
          // this seems strange
          if (t.isJSXMemberExpression(traversePath.node.closingElement.name)) {
            return
          }
          traversePath.node.closingElement.name.name = node.name.name
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

        let classNamePropValueForReals = buildClassNamePropValue(
          classNameObjects
        )

        // get extracted classNames
        const classNames: string[] = []
        const hasViewStyle = Object.keys(viewStyles).length > 0
        if (hasViewStyle) {
          const styles = addStylesAtomic(viewStyles)
          for (const style of styles) {
            classNames.push(style.identifier)
          }
          if (shouldPrintDebug) {
            console.log({ classNames, viewStyles })
          }
        }

        const ternaries = extractStaticTernaries(staticTernaries, cacheObject)
        if (shouldPrintDebug) {
          console.log(JSON.stringify({ staticTernaries, ternaries }, null, 2))
        }

        function getTernaryExpression(record: TernaryRecord, idx: number) {
          const consInfo = addStylesAtomic({
            ...viewStyles,
            ...record.consequentStyles,
          })
          const altInfo = addStylesAtomic({
            ...viewStyles,
            ...record.alternateStyles,
          })
          if (shouldPrintDebug)
            console.log('record', record, viewStyles, defaultStyle)
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
            console.log('ternaryExprs', ternaryExprs)
          }
          if (classNamePropValueForReals) {
            classNamePropValueForReals = t.binaryExpression(
              '+',
              // @ts-ignore TODO remove this is only an issue on CI
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
          isSingleSimpleSpread &&
          simpleSpreadIdentifier
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
                  simpleSpreadIdentifier,
                  t.memberExpression(
                    simpleSpreadIdentifier,
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
            traversePath,
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

        const lineNumbers =
          node.loc &&
          node.loc.start.line +
            (node.loc.start.line !== node.loc.end.line
              ? `-${node.loc.end.line}`
              : '')

        const comment = util.format(
          '/* %s:%s (%s) */',
          sourceFileName.replace(process.cwd(), '.'),
          lineNumbers,
          originalNodeName
        )

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
              if (rules.length > 1) {
                console.log(rules)
                throw new Error(`huh?`)
              }
              if (rules.length) {
                didExtract = true
                if (process.env.NODE_ENV !== 'production') {
                  if (globalCSSMap.has(className)) {
                    continue
                  }
                  globalCSSMap.set(className, rules[0])
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
    },
  })

  // we didnt find anything
  if (!didExtract) {
    if (shouldPrintDebug) {
      console.log('END - nothing extracted!', sourceFileName, '\n', src)
    }
    return {
      ast,
      css: '',
      cssFileName: null,
      js: src,
      map: null,
    }
  }

  const css = Array.from(cssMap.values())
    .map((v) => v.commentTexts.map((txt) => `${txt}\n`).join('') + v.css)
    .join(' ')
  const extName = path.extname(sourceFileName)
  const baseName = path.basename(sourceFileName, extName)

  let cssFileName: string
  let cssImportFileName: string

  if (process.env.NODE_ENV === 'production') {
    cssImportFileName = `./${baseName}${GLOSS_CSS_FILE}`
    cssFileName = path.join(sourceDir, cssImportFileName)
  } else {
    // in dev mode dedupe into one big global sheet
    cssImportFileName = 'snackui/style.css'
    cssFileName = UI_STYLE_PATH

    // only writes if new values found since last write
    if (cssMap.size) {
      const cssOut = Array.from(globalCSSMap.values()).join('\n')
      writeFileSync(UI_STYLE_PATH, cssOut)
    }
  }

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
      'output >> ',
      result.code
        .split('\n')
        .filter((line) => !line.startsWith('//'))
        .join('\n')
    )
    console.log('output css >> ', css)
  }

  return {
    ast,
    css,
    cssFileName,
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

const attrGetName = (attr) => {
  return 'name' in attr
    ? attr.name.name
    : 'name' in attr.argument
    ? `spread-${attr.argument.name}`
    : `unknown-${attr.type}`
}

function findComponentName(scope) {
  let componentName = ''
  let cur = scope.path
  while (cur.parentPath && !t.isProgram(cur.parentPath.parent)) {
    cur = cur.parentPath
  }
  let node = cur.parent
  if (t.isExportNamedDeclaration(node)) {
    node = node.declaration
  }
  if (t.isVariableDeclaration(node)) {
    const [dec] = node.declarations
    if (t.isVariableDeclarator(dec) && t.isIdentifier(dec.id)) {
      return dec.id.name
    }
  }
  if (t.isFunctionDeclaration(node)) {
    return node.id?.name
  }
  return componentName
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

// // hoist outside fn!
// const path = traversePath as any
// const uid = path.scope.generateUidIdentifier('ref')
// const parent = path.findParent((path) => path.isProgram())
// const variable = t.variableDeclaration('const', [
//   t.variableDeclarator(
//     uid,
//     t.stringLiteral(classNamePropValueForReals.value)
//   ),
// ])
// parent.unshiftContainer('body', variable)
// node.attributes.push(
//   t.jsxAttribute(
//     t.jsxIdentifier('className'),
//     t.jsxExpressionContainer(uid)
//   )
// )
