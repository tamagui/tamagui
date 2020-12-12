import vm from 'vm'

import generate from '@babel/generator'
import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import invariant from 'invariant'
import { TextStyle, ViewStyle } from 'react-native'
import * as AllExports from 'snackui/node'

import { pseudos } from '../css/getStylesAtomic'
import { PluginOptions } from '../types'
import { evaluateAstNode } from './evaluateAstNode'
import {
  Ternary,
  TernaryRecord,
  extractStaticTernaries,
} from './extractStaticTernaries'
import { getStaticBindingsForScope } from './getStaticBindingsForScope'
import { literalToAst } from './literalToAst'

const FAILED_EVAL = Symbol('failed_style_eval')
const UNTOUCHED_PROPS = {
  key: true,
  style: true,
  className: true,
}

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

const validComponents: { [key: string]: OptimizableComponent } = Object.keys(
  AllExports
)
  .filter((key) => !!AllExports[key]?.staticConfig)
  .reduce((obj, name) => {
    obj[name] = AllExports[name]
    return obj
  }, {})

type ExtractTagProps = {
  node: t.JSXOpeningElement
  attemptEval: (
    exprNode: t.Node,
    evalFn?: ((node: t.Node) => any) | undefined
  ) => any
  viewStyles: ViewStyle
  ternaries: TernaryRecord[] | null
  jsxPath: NodePath<t.JSXElement>
  originalNodeName: string
  spreadInfo: {
    isSingleSimple: boolean
    simpleIdentifier: t.Identifier | null
  }
}

export type Extractor = ReturnType<typeof createExtractor>

export type ExtractorParseProps = PluginOptions & {
  sourceFileName?: string
  shouldPrintDebug?: boolean
  onExtractTag: (props: ExtractTagProps) => void
  getFlattenedNode: (props: { isTextView: boolean }) => string
}

export function createExtractor() {
  const bindingCache: Record<string, string | null> = {}
  return {
    parse: (
      path: NodePath<t.Program>,
      {
        evaluateImportsWhitelist = [],
        evaluateVars = true,
        shouldPrintDebug = false,
        sourceFileName = '',
        onExtractTag,
        getFlattenedNode,
        ...props
      }: ExtractorParseProps
    ) => {
      const deoptProps = new Set(props.deoptProps ?? [])
      const excludeProps = new Set(props.excludeProps ?? [])
      let doesUseValidImport = false

      /**
       * Step 1: Determine if importing any statically extractable components
       */
      path.traverse({
        ImportDeclaration(path) {
          if (path.node.source.value === 'snackui') {
            path.node.specifiers.forEach((specifier) => {
              if (validComponents[specifier.local.name]) {
                doesUseValidImport = true
              }
            })
          }
        },
      })

      if (!doesUseValidImport) {
        return null
      }

      let couldntParse = false

      /**
       * Step 2: Statically extract from JSX < /> nodes
       */
      path.traverse({
        JSXElement(traversePath) {
          const node = traversePath.node.openingElement
          const ogAttributes = node.attributes
          const componentName = findComponentName(traversePath.scope)

          // skip non-identifier opening elements (member expressions, etc.)
          if (!t.isJSXIdentifier(node.name)) {
            return
          }
          const component = validComponents[node.name.name]
          if (!component || !component.staticConfig) {
            return
          }

          const { staticConfig } = component
          const originalNodeName = node.name.name
          const isTextView = originalNodeName.endsWith('Text')
          const validStyles = staticConfig?.validStyles ?? {}
          const domNode = getFlattenedNode({ isTextView })

          if (shouldPrintDebug) {
            console.log(`\n<${originalNodeName} />`)
          }

          const isStaticAttributeName = (name: string) => {
            return (
              !!validStyles[name] ||
              !!staticConfig?.expansionProps?.[name] ||
              !!pseudos[name]
            )
          }

          const attemptEval = !evaluateVars
            ? evaluateAstNode
            : (() => {
                // Generate scope object at this level
                const staticNamespace = getStaticBindingsForScope(
                  traversePath.scope,
                  evaluateImportsWhitelist ?? ['constants.js'],
                  sourceFileName,
                  bindingCache,
                  shouldPrintDebug
                )
                if (shouldPrintDebug) {
                  console.log('  staticNamespace', staticNamespace)
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
                  return vm.runInContext(
                    `(${generate(n as any).code})`,
                    evalContext
                  )
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
                console.log('  attemptEvalSafe failed', err.message)
              }
              return FAILED_EVAL
            }
          }

          // ternaries we can extract
          const staticTernaries: Ternary[] = []

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
          let shouldDeopt = false

          const hasDeopt = (obj: Object) => {
            return Object.keys(obj).some((x) => deoptProps.has(x))
          }

          const omitExcludeStyles = (obj: Object) => {
            if (!excludeProps.size) {
              return obj
            }
            const res = {}
            for (const key in obj) {
              if (excludeProps.has(key)) {
                continue
              }
              res[key] = obj[key]
            }
            return res
          }

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

              if (hasDeopt(aStyle) || hasDeopt(cStyle)) {
                shouldDeopt = true
                return
              }

              if (aStyle !== FAILED_EVAL && cStyle !== FAILED_EVAL) {
                staticTernaries.push({
                  test,
                  alternate: omitExcludeStyles(aStyle),
                  consequent: omitExcludeStyles(cStyle),
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
                  if (hasDeopt(spreadStyle)) {
                    shouldDeopt = true
                    return
                  }
                  staticTernaries.push({
                    test,
                    consequent: omitExcludeStyles(spreadStyle),
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

          if (couldntParse || shouldDeopt) {
            if (shouldPrintDebug) {
              console.log(`  `, { couldntParse, shouldDeopt })
            }
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
            console.log('  spreads:', {
              hasOneEndingSpread,
              isSingleSimpleSpread,
              lastSpreadIndex,
              foundLastSpreadIndex,
            })
            console.log('  attrs:', node.attributes.map(attrGetName).join(', '))
          }

          node.attributes = node.attributes.filter((attribute, idx) => {
            const isntOnLastSpread =
              idx < lastSpreadIndex && !isSingleSimpleSpread
            if (
              t.isJSXSpreadAttribute(attribute) ||
              // keep the weirdos
              !attribute.name ||
              // filter out JSXIdentifiers
              typeof attribute.name.name !== 'string' ||
              // haven't hit the last spread operator (we can optimize single simple spreads still)
              isntOnLastSpread
            ) {
              if (t.isJSXSpreadAttribute(attribute)) {
                // spread fine
              } else {
                if (shouldPrintDebug) {
                  console.log(
                    '  inline (non normal attr)',
                    attribute['name']?.['name']
                  )
                }
                inlinePropCount++
              }
              return true
            }

            const name = attribute.name.name

            if (excludeProps.has(name)) {
              if (shouldPrintDebug) {
                console.log(`  excluding ${name}`)
              }
              return false
            }

            if (deoptProps.has(name)) {
              if (shouldPrintDebug) {
                console.log(`  deopting ${name}`)
              }
              inlinePropCount++
              return true
            }

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
                  console.warn(
                    '  Failed style expansion!',
                    name,
                    attribute?.value
                  )
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
              // ? not sure, but may be able to optimize here
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

            if (shouldPrintDebug) {
              console.log('  attr', name, styleValue)
            }

            if (styleValue === FAILED_EVAL) {
              // dynamic or ternary
              // not doing anything here so we can fall down to the ternaries
            } else {
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
              if (shouldPrintDebug) {
                console.log(
                  `  evalBinaryExpression lVal ${String(lVal)}, rVal ${String(
                    rVal
                  )}`
                )
              }

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

              if (shouldPrintDebug) {
                console.log(`  evalBinaryExpression cant extract`)
              }
              inlinePropCount++
              return true
            }

            function addBinaryConditional(
              operator: any,
              staticExpr: any,
              cond: t.ConditionalExpression
            ) {
              if (getStaticConditional(cond)) {
                const alternate = attemptEval(
                  t.binaryExpression(operator, staticExpr, cond.alternate)
                )
                const consequent = attemptEval(
                  t.binaryExpression(operator, staticExpr, cond.consequent)
                )
                staticTernaries.push({
                  test: cond.test,
                  alternate: { [name]: alternate },
                  consequent: { [name]: consequent },
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
                      '  couldnt statically evaluate conditional',
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
                      console.log('  couldnt statically evaluate', err)
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
              console.log('  inline prop via no match', name, value.type)
            }

            // if we've made it this far, the prop stays inline
            inlinePropCount++
            return true
          })

          // if inlining + spreading + ternary, deopt fully
          if (
            inlinePropCount &&
            staticTernaries.length &&
            lastSpreadIndex > -1
          ) {
            if (shouldPrintDebug) {
              console.log(
                '  deopt due to inline + spread',
                { inlinePropCount },
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
              if (excludeProps.has(key)) {
                continue
              }
              defaultStyle[key] = defaultProps[key]
            } else {
              defaultStaticProps[key] = defaultProps[key]
              styleExpansions.push({ name: key, value: defaultProps[key] })
            }
          }

          if (shouldPrintDebug) {
            console.log('  finish extract', { inlinePropCount })
          }

          // if all style props have been extracted, component can be
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
              console.log('  default styles', originalNodeName, defaultStyle)
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
            console.log('  styleExpansions', { defaultProps, styleExpansions })
          }
          if (styleExpansions.length) {
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
                console.log('  expanded', {
                  styleExpansionError,
                  expandedStyle,
                })
              }
              if (styleExpansionError) {
                break
              }
              if (expandedStyle) {
                if (excludeProps.size) {
                  for (const key of [...excludeProps]) {
                    delete expandedStyle[key]
                  }
                }
                Object.assign(viewStyles, expandedStyle)
              }
            }
          }

          if (shouldPrintDebug) {
            console.log('  viewStyles', inlinePropCount, viewStyles)
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
              `  >> is extracting, inlinePropCount: ${inlinePropCount}, domNode: ${domNode}`
            )
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
            if (
              t.isJSXMemberExpression(traversePath.node.closingElement.name)
            ) {
              return
            }
            traversePath.node.closingElement.name.name = node.name.name
          }

          if (shouldPrintDebug) {
            console.log(
              '  EVAL staticTernaries',
              staticTernaries.map((x) => [
                `${x.test['object']?.['name']}.${x.test['property']?.['name']}`,
                x.alternate,
                x.consequent,
              ])
            )
          }

          const ternaries = extractStaticTernaries(staticTernaries)

          onExtractTag({
            attemptEval,
            jsxPath: traversePath,
            node,
            originalNodeName,
            spreadInfo: {
              isSingleSimple: isSingleSimpleSpread,
              simpleIdentifier: simpleSpreadIdentifier,
            },
            ternaries,
            viewStyles,
          })
        },
      })
    },
  }
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
