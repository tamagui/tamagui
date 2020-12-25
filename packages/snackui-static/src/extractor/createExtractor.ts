import vm from 'vm'

import generate from '@babel/generator'
import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import invariant from 'invariant'
import { ViewStyle } from 'react-native'
import { StaticComponent } from 'snackui'
import * as AllExports from 'snackui/node'

import { pseudos } from '../css/getStylesAtomic'
import {
  ExtractedAttr,
  ExtractedAttrAttr,
  ExtractorParseProps,
  Ternary,
} from '../types'
import { evaluateAstNode } from './evaluateAstNode'
import {
  attrGetName,
  findComponentName,
  getNameTernary,
  isInsideSnackUI,
  isValidThemeHook,
} from './extractHelpers'
import { findTopmostFunction } from './findTopmostFunction'
import { getStaticBindingsForScope } from './getStaticBindingsForScope'
import { literalToAst } from './literalToAst'
import { removeUnusedHooks } from './removeUnusedHooks'

// used by getStaticBindingsForScope + themeFile
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'CommonJS',
  },
})

const FAILED_EVAL = Symbol('failed_style_eval')
const UNTOUCHED_PROPS = {
  key: true,
  style: true,
  className: true,
}

const validHooks = {
  useMedia: true,
  useTheme: true,
}

const validComponents: { [key: string]: StaticComponent } = Object.keys(
  AllExports
)
  .filter((key) => !!AllExports[key]?.staticConfig)
  .reduce((obj, name) => {
    obj[name] = AllExports[name]
    return obj
  }, {})

export type Extractor = ReturnType<typeof createExtractor>

export function createExtractor() {
  const bindingCache: Record<string, string | null> = {}
  const themesByFile = {}
  const shouldAddDebugProp =
    process.env.TARGET !== 'native' &&
    process.env.IDENTIFY_TAGS !== 'false' &&
    (process.env.NODE_ENV === 'development' ||
      process.env.DEBUG ||
      process.env.IDENTIFY_TAGS)

  return {
    parse: (
      path: NodePath<t.Program>,
      {
        evaluateImportsWhitelist = ['constants.js'],
        evaluateVars = true,
        themesFile,
        shouldPrintDebug = false,
        sourceFileName = '',
        onExtractTag,
        getFlattenedNode,
        ...props
      }: ExtractorParseProps
    ) => {
      if (themesFile) {
        themesByFile[themesFile] =
          themesByFile[themesFile] || require(themesFile).default
      }
      const themes = themesFile ? themesByFile[themesFile] : null
      const themeKeys = new Set(
        themes ? Object.keys(themes[Object.keys(themes)[0]]) : []
      )
      const deoptProps = new Set(props.deoptProps ?? [])
      const excludeProps = new Set(props.excludeProps ?? [])
      const isExcludedProp = (name: string) => {
        const res = excludeProps.has(name)
        if (res && shouldPrintDebug) console.log(`  excluding ${name}`)
        return res
      }
      const isDeoptedProp = (name: string) => {
        const res = deoptProps.has(name)
        if (res && shouldPrintDebug) console.log(`  deopting ${name}`)
        return res
      }

      let doesUseValidImport = false

      if (sourceFileName === '') {
        throw new Error(`Must provide a source file name`)
      }

      /**
       * Step 1: Determine if importing any statically extractable components
       */
      for (const bodyPath of path.get('body')) {
        if (!bodyPath.isImportDeclaration()) continue
        const importStr = bodyPath.node.source.value
        if (
          importStr === 'snackui' ||
          (isInsideSnackUI(sourceFileName) && importStr[0] === '.')
        ) {
          const isValid = bodyPath.node.specifiers.some((specifier) => {
            const name = specifier.local.name
            return validComponents[name] || validHooks[name]
          })
          if (isValid) {
            doesUseValidImport = true
            break
          }
        }
      }

      if (shouldPrintDebug) {
        console.log(sourceFileName, { doesUseValidImport })
      }

      if (!doesUseValidImport) {
        return null
      }

      let couldntParse = false
      const modifiedComponents = new Set<NodePath<any>>()

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
          const isTextView = staticConfig.isText ?? false
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

          // Generate scope object at this level
          const staticNamespace = getStaticBindingsForScope(
            traversePath.scope,
            evaluateImportsWhitelist,
            sourceFileName,
            bindingCache,
            shouldPrintDebug
          )

          //
          // evaluator
          //
          const attemptEval = !evaluateVars
            ? evaluateAstNode
            : (() => {
                if (shouldPrintDebug) {
                  console.log('  attemptEval staticNamespace', staticNamespace)
                }
                const evalContext = vm.createContext(staticNamespace)

                // called when evaluateAstNode encounters a dynamic-looking prop
                const evalFn = (n: t.Node) => {
                  // themes
                  if (themes) {
                    if (
                      t.isMemberExpression(n) &&
                      t.isIdentifier(n.property) &&
                      isValidThemeHook(traversePath, n, sourceFileName)
                    ) {
                      const key = n.property.name
                      if (!themeKeys.has(key)) {
                        throw new Error(
                          `Accessing non-existent theme key: ${key}`
                        )
                      }
                      return `var(--${key})`
                    }
                  }
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

          //
          //  SPREADS SETUP
          //
          const styleExpansions: { name: string; value: any }[] = []
          let shouldDeopt = false

          const isStyleObject = (obj: t.Node): obj is t.ObjectExpression => {
            return (
              t.isObjectExpression(obj) &&
              obj.properties.every((prop) => {
                if (!t.isObjectProperty(prop)) return false
                const propName = prop.key['name']
                if (!isStaticAttributeName(propName)) {
                  if (shouldPrintDebug) {
                    console.log('  not a valid style prop!', propName)
                  }
                  return false
                }
                return true
              })
            )
          }
          const hasDeopt = (obj: Object) => {
            return Object.keys(obj).some(isDeoptedProp)
          }
          const omitExcludeStyles = (obj: Object) => {
            if (!excludeProps.size) {
              return obj
            }
            const res = {}
            for (const key in obj) {
              if (isExcludedProp(key)) {
                continue
              }
              res[key] = obj[key]
            }
            return res
          }

          let attrs: ExtractedAttr[] = []

          //
          // SPREADS
          //
          traversePath
            .get('openingElement')
            .get('attributes')
            .forEach((path, idx) => {
              const attr = path.node
              if (!t.isJSXSpreadAttribute(attr)) {
                attrs.push({ type: 'attr', value: attr })
                return
              }

              // NON evaluatable conditional expressions

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
                  const alt = omitExcludeStyles(aStyle)
                  const cons = omitExcludeStyles(cStyle)
                  const ternary: Ternary = {
                    test,
                    remove() {
                      path.remove()
                    },
                    alternate: alt,
                    consequent: cons,
                  }
                  if (shouldPrintDebug) {
                    console.log(
                      ' conditionalExpression',
                      getNameTernary(ternary)
                    )
                  }
                  attrs.push({
                    type: 'ternary',
                    value: ternary,
                  })
                  return
                }
              }

              // <VStack {...isSmall && { color: 'red' }}
              if (
                t.isLogicalExpression(attr.argument) &&
                attr.argument.operator === '&&'
              ) {
                if (isStyleObject(attr.argument.right)) {
                  const spreadStyle = attemptEvalSafe(attr.argument.right)
                  if (spreadStyle === FAILED_EVAL) {
                    // didFailSpread = true
                  } else {
                    if (hasDeopt(spreadStyle)) {
                      shouldDeopt = true
                      return
                    }
                    const test = (attr.argument as t.LogicalExpression).left
                    const testValue = attemptEvalSafe(test)
                    if (testValue === FAILED_EVAL) {
                      // its fine we just cant extract all the way
                    }
                    if (!testValue) {
                      // if its value it evaluates to nada
                      return
                    }
                    const cons = omitExcludeStyles(spreadStyle)
                    attrs.push({
                      type: 'ternary',
                      value: {
                        test,
                        remove() {
                          path.remove()
                        },
                        consequent: cons,
                        alternate: null,
                      },
                    })
                    return
                  }
                }
              }

              // FLATTEN if possible, process rest of spreads

              let arg: any
              try {
                arg = attemptEval(attr.argument)
              } catch (e) {
                attrs.push({ type: 'attr', value: attr })
              }
              if (typeof arg !== 'undefined') {
                try {
                  if (typeof arg !== 'object' || arg == null) {
                    attrs.push({ type: 'attr', value: attr })
                  } else {
                    for (const k in arg) {
                      const value = arg[k]
                      // this is a null prop:
                      if (!value && typeof value === 'object') {
                        console.log('IS NULL - bug???', value)
                        continue
                      }
                      attrs.push({
                        type: 'attr',
                        value: t.jsxAttribute(
                          t.jsxIdentifier(k),
                          t.jsxExpressionContainer(literalToAst(value))
                        ),
                      })
                    }
                  }
                } catch (err) {
                  console.warn('caught object err', err)
                  couldntParse = true
                }
              }
            })

          const isAttr = (x: ExtractedAttr): x is ExtractedAttrAttr =>
            x.type === 'attr'

          const getNodeAttrs = () => attrs.filter(isAttr).map((x) => x.value)

          // set flattened values
          node.attributes = getNodeAttrs()

          if (couldntParse || shouldDeopt) {
            if (shouldPrintDebug) {
              console.log(`  `, { couldntParse, shouldDeopt })
            }
            return
          }

          if (shouldPrintDebug) {
            console.log('  attrs:', attrs.map(attrGetName).join(', '))
          }

          let viewStyles: ViewStyle = {}
          let inlinePropCount = 0

          // see if we can filter them
          const attributePaths = traversePath
            .get('openingElement')
            .get('attributes')
          const attributes: (t.JSXAttribute | t.JSXSpreadAttribute)[] = []
          for (const [idx, path] of attributePaths.entries()) {
            if (evaluateAttribute(idx, path)) {
              attributes.push(path.node)
            } else {
              attrs = attrs.filter((x) => !isAttr(x) || x.value !== path.node)
              path.remove()
            }
          }

          node.attributes = getNodeAttrs()

          function evaluateAttribute(
            idx: number,
            path: NodePath<t.JSXAttribute | t.JSXSpreadAttribute>
          ) {
            const attribute = path.node
            if (
              t.isJSXSpreadAttribute(attribute) ||
              // keep the weirdos
              !attribute.name ||
              // filter out JSXIdentifiers
              typeof attribute.name.name !== 'string'
            ) {
              if (t.isJSXSpreadAttribute(attribute)) {
                // spread fine
              } else {
                if (shouldPrintDebug) {
                  console.log('  ! inlining attr', attribute['name']?.['name'])
                }
                inlinePropCount++
              }
              return true
            }

            const name = attribute.name.name

            if (isExcludedProp(name)) {
              return true
            }
            if (isDeoptedProp(name)) {
              inlinePropCount++
              return true
            }

            let value: any
            let valuePath: any

            if (t.isJSXExpressionContainer(attribute?.value)) {
              value = attribute.value.expression
              valuePath = path.get('value')
            } else {
              value = attribute.value
              valuePath = path.get('value')
            }

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
                  console.warn('  Failed style expansion', name)
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
                const alt = attemptEval(
                  t.binaryExpression(operator, staticExpr, cond.alternate)
                )
                const cons = attemptEval(
                  t.binaryExpression(operator, staticExpr, cond.consequent)
                )
                if (shouldPrintDebug) {
                  console.log('  binaryConditional', cond.test, cons, alt)
                }
                attrs.push({
                  type: 'ternary',
                  value: {
                    test: cond.test,
                    remove() {
                      valuePath.remove()
                    },
                    alternate: { [name]: alt },
                    consequent: { [name]: cons },
                  },
                })
                return true
              }
            }

            function getStaticConditional(value: t.Node): Ternary | null {
              if (t.isConditionalExpression(value)) {
                try {
                  const aVal = attemptEval(value.alternate)
                  const cVal = attemptEval(value.consequent)
                  if (shouldPrintDebug) {
                    console.log(
                      '  staticConditional',
                      value.test.type,
                      cVal,
                      aVal
                    )
                  }
                  return {
                    test: value.test,
                    remove() {
                      valuePath.remove()
                    },
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
                    if (shouldPrintDebug) {
                      console.log('  staticLogical', value.left, name, val)
                    }
                    return {
                      test: value.left,
                      remove() {
                        valuePath.remove()
                      },
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
              attrs.push({ type: 'ternary', value: staticConditional })
              return false
            }

            const staticLogical = getStaticLogical(value)
            if (staticLogical) {
              attrs.push({ type: 'ternary', value: staticLogical })
              return false
            }

            if (shouldPrintDebug) {
              console.log('  inline prop via no match', name, value.type)
            }

            // if we've made it this far, the prop stays inline
            inlinePropCount++
            return true
          }

          // before deopt, can still optimize
          const parentFn = findTopmostFunction(traversePath)
          if (parentFn) {
            modifiedComponents.add(parentFn)
          }

          const defaultProps = component.staticConfig?.defaultProps ?? {}
          const defaultStyle = {}
          const defaultStaticProps = {}

          // get our expansion props vs our style props
          for (const key in defaultProps) {
            if (validStyles[key]) {
              if (isExcludedProp(key)) {
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

          const filePath = sourceFileName.replace(process.cwd(), '.')
          const lineNumbers = node.loc
            ? node.loc.start.line +
              (node.loc.start.line !== node.loc.end.line
                ? `-${node.loc.end.line}`
                : '')
            : ''

          // helpful attrs for DX
          if (shouldAddDebugProp) {
            const preName = componentName ? `${componentName}:` : ''
            // unshift so spreads/nesting overwrite
            attrs.unshift({
              type: 'attr',
              value: t.jsxAttribute(
                t.jsxIdentifier('data-is'),
                t.stringLiteral(
                  `${preName}${node.name.name} @ ${filePath}:${lineNumbers}`
                )
              ),
            })
          }

          // if all style props have been extracted and no spreads
          // component can be flattened to div or parent view
          if (
            inlinePropCount === 0 &&
            !node.attributes.some((x) => t.isJSXSpreadAttribute(x))
          ) {
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
          // TODO integrate with attrs
          let styleExpansionError = false
          if (shouldPrintDebug) {
            console.log('  styleExpansions', styleExpansions)
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
                  console.log('  expanding', name, value)
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
            attrs = ogAttributes.map((value) => ({ type: 'attr', value }))
            return
          }

          if (shouldPrintDebug) {
            console.log(
              `  >> is extracting, inlinePropCount: ${inlinePropCount}, domNode: ${domNode}`
            )
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

          // const ternaries = normalizeTernaries(staticTernaries)

          onExtractTag({
            attrs,
            node,
            lineNumbers,
            filePath,
            attemptEval,
            jsxPath: traversePath,
            originalNodeName,
            viewStyles,
          })
        },
      })

      /**
       * Step 3: Remove dead code from removed media query / theme hooks
       */
      if (modifiedComponents.size) {
        const all = Array.from(modifiedComponents)
        if (shouldPrintDebug) {
          console.log('  checking', all.length, 'components for dead hooks')
        }
        for (const comp of all) {
          removeUnusedHooks(comp, shouldPrintDebug)
        }
      }
    },
  }
}
