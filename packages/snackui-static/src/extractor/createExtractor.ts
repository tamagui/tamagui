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
  isPresent,
  isValidThemeHook,
} from './extractHelpers'
import { findTopmostFunction } from './findTopmostFunction'
import { getStaticBindingsForScope } from './getStaticBindingsForScope'
import { literalToAst } from './literalToAst'
import { normalizeTernaries } from './normalizeTernaries'
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

const isAttr = (x: ExtractedAttr): x is ExtractedAttrAttr => x.type === 'attr'

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

          // flatten any evaluatable spreads
          const flattenedAttrs: (t.JSXAttribute | t.JSXSpreadAttribute)[] = []
          traversePath
            .get('openingElement')
            .get('attributes')
            .forEach((path, idx) => {
              const attr = path.node
              if (!t.isJSXSpreadAttribute(attr)) {
                flattenedAttrs.push(attr)
                return
              }
              let arg: any
              try {
                arg = attemptEval(attr.argument)
              } catch (e) {
                flattenedAttrs.push(attr)
              }
              if (typeof arg !== 'undefined') {
                try {
                  if (typeof arg !== 'object' || arg == null) {
                    flattenedAttrs.push(attr)
                  } else {
                    for (const k in arg) {
                      const value = arg[k]
                      // this is a null prop:
                      if (!value && typeof value === 'object') {
                        console.log('IS NULL - bug???', value)
                        continue
                      }
                      flattenedAttrs.push(
                        t.jsxAttribute(
                          t.jsxIdentifier(k),
                          t.jsxExpressionContainer(literalToAst(value))
                        )
                      )
                    }
                  }
                } catch (err) {
                  console.warn('caught object err', err)
                  couldntParse = true
                }
              }
            })

          if (couldntParse) {
            return
          }

          // set flattened
          node.attributes = flattenedAttrs

          let attrs: ExtractedAttr[] = []
          let shouldDeopt = false
          let viewStyles: ViewStyle = {}
          let inlinePropCount = 0

          // see if we can filter them
          if (shouldPrintDebug) {
            console.log('  attrs (before):', attrs.map(attrGetName).join(', '))
          }

          // iterate and parse out any ternaries / styles
          attrs = traversePath
            .get('openingElement')
            .get('attributes')
            .map((path, idx) => evaluateAttribute(idx, path) ?? path.remove())
            .filter(isPresent)

          // now update to new values
          node.attributes = attrs.filter(isAttr).map((x) => x.value)
          if (shouldPrintDebug) {
            console.log('  attrs (after):', attrs.map(attrGetName).join(', '))
          }

          function evaluateAttribute(
            idx: number,
            path: NodePath<t.JSXAttribute | t.JSXSpreadAttribute>
          ): ExtractedAttr | null {
            const attribute = path.node
            const attr: ExtractedAttr = { type: 'attr', value: attribute }
            if (
              t.isJSXSpreadAttribute(attribute) ||
              // keep the weirdos
              !attribute.name ||
              // filter out JSXIdentifiers
              typeof attribute.name.name !== 'string'
            ) {
              if (t.isJSXSpreadAttribute(attribute)) {
                // <VStack {...isSmall ? { color: 'red } : { color: 'blue }}
                if (t.isConditionalExpression(attribute.argument)) {
                  const { alternate, consequent, test } = attribute.argument
                  const aStyle = isStyleObject(alternate)
                    ? attemptEvalSafe(alternate)
                    : FAILED_EVAL
                  const cStyle = isStyleObject(consequent)
                    ? attemptEvalSafe(consequent)
                    : FAILED_EVAL

                  if (hasDeopt(aStyle) || hasDeopt(cStyle)) {
                    shouldDeopt = true
                    return null
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
                    return {
                      type: 'ternary',
                      value: ternary,
                    }
                  }
                }

                // <VStack {...isSmall && { color: 'red' }}
                if (
                  t.isLogicalExpression(attribute.argument) &&
                  attribute.argument.operator === '&&'
                ) {
                  if (isStyleObject(attribute.argument.right)) {
                    const spreadStyle = attemptEvalSafe(
                      attribute.argument.right
                    )
                    if (spreadStyle === FAILED_EVAL) {
                      // didFailSpread = true
                    } else {
                      if (hasDeopt(spreadStyle)) {
                        shouldDeopt = true
                        return null
                      }
                      const test = (attribute.argument as t.LogicalExpression)
                        .left
                      const testValue = attemptEvalSafe(test)
                      if (testValue === FAILED_EVAL) {
                        // its fine we just cant extract all the way
                      }
                      if (!testValue) {
                        // if its value it evaluates to nada
                        return null
                      }
                      const cons = omitExcludeStyles(spreadStyle)
                      return {
                        type: 'ternary',
                        value: {
                          test,
                          remove() {
                            path.remove()
                          },
                          consequent: cons,
                          alternate: null,
                        },
                      }
                    }
                  }
                }
              } else {
                if (shouldPrintDebug) {
                  console.log('  ! inlining attr', attribute['name']?.['name'])
                }
                inlinePropCount++
              }
              return attr
            }

            const name = attribute.name.name
            if (isExcludedProp(name)) {
              return attr
            }
            if (isDeoptedProp(name)) {
              inlinePropCount++
              return attr
            }

            const [value, valuePath] = (() => {
              if (t.isJSXExpressionContainer(attribute?.value)) {
                return [attribute.value.expression, path.get('value')] as const
              } else {
                return [attribute.value, path.get('value')] as const
              }
            })()
            const remove = () => {
              Array.isArray(valuePath)
                ? valuePath.map((p) => p.remove())
                : valuePath.remove()
            }

            // handle expansions
            const expansion = staticConfig?.expansionProps?.[name]
            if (
              expansion &&
              !t.isBinaryExpression(value) &&
              !t.isConditionalExpression(value)
            ) {
              const styleValue =
                value === null
                  ? // handle boolean jsx props
                    true
                  : attemptEvalSafe(value)
              if (styleValue === FAILED_EVAL) {
                if (shouldPrintDebug) {
                  console.warn('  Failed style expansion', name)
                }
                inlinePropCount++
                return attr
              } else {
                styleExpansions.push({ name, value: styleValue })
                return null
              }
            }

            // value == null means boolean (true)
            if (value === null) {
              // ? not sure, but may be able to optimize here
              if (shouldPrintDebug) {
                console.log('  CAN WE JUST KEEP THIS BOOLENA????', attr)
              }
              inlinePropCount++
              return attr
            }

            // pass ref, key, and style props through untouched
            if (UNTOUCHED_PROPS[name]) {
              return attr
            }
            if (name === 'ref') {
              inlinePropCount++
              return attr
            }
            if (!isStaticAttributeName(name)) {
              inlinePropCount++
              return attr
            }

            // if value can be evaluated, extract it and filter it out
            const styleValue = attemptEvalSafe(value)
            if (shouldPrintDebug) {
              console.log('  attr', name, styleValue)
            }
            // FAILED = dynamic or ternary, keep going
            if (styleValue !== FAILED_EVAL) {
              viewStyles[name] = styleValue
              return null
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
                const ternary = addBinaryConditional(operator, left, right)
                if (ternary) return ternary
              }
              if (rVal !== FAILED_EVAL && t.isConditionalExpression(left)) {
                const ternary = addBinaryConditional(operator, right, left)
                if (ternary) return ternary
              }
              if (shouldPrintDebug) {
                console.log(`  evalBinaryExpression cant extract`)
              }
              inlinePropCount++
              return attr
            }

            const staticConditional = getStaticConditional(value)
            if (staticConditional) {
              return { type: 'ternary', value: staticConditional }
            }

            const staticLogical = getStaticLogical(value)
            if (staticLogical) {
              return { type: 'ternary', value: staticLogical }
            }

            if (shouldPrintDebug) {
              console.log('  inline prop via no match', name, value.type)
            }
            // if we've made it this far, the prop stays inline
            inlinePropCount++
            return attr

            function addBinaryConditional(
              operator: any,
              staticExpr: any,
              cond: t.ConditionalExpression
            ): ExtractedAttr | null {
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
                return {
                  type: 'ternary',
                  value: {
                    test: cond.test,
                    remove,
                    alternate: { [name]: alt },
                    consequent: { [name]: cons },
                  },
                }
              }
              return null
            }

            function getStaticConditional(value: t.Node): Ternary | null {
              if (t.isConditionalExpression(value)) {
                try {
                  const aVal = attemptEval(value.alternate)
                  const cVal = attemptEval(value.consequent)
                  if (shouldPrintDebug) {
                    const type = value.test.type
                    console.log('  staticConditional', type, cVal, aVal)
                  }
                  return {
                    test: value.test,
                    remove,
                    consequent: { [name]: cVal },
                    alternate: { [name]: aVal },
                  }
                } catch (err) {
                  if (shouldPrintDebug) {
                    console.log('  cant static eval conditional', err.message)
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
                      remove,
                      consequent: { [name]: val },
                      alternate: null,
                    }
                  } catch (err) {
                    if (shouldPrintDebug) {
                      console.log('  cant static eval logical', err)
                    }
                  }
                }
              }
              return null
            }
          } // END function evaluateAttribute

          if (couldntParse || shouldDeopt) {
            if (shouldPrintDebug) {
              console.log(`  cancel:`, { couldntParse, shouldDeopt })
            }
            node.attributes = ogAttributes
            return
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
              if (styleExpansions.some((x) => x.name === key)) {
                // if already defined dont overwrite
                continue
              }
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

          // combine ternaries where possible
          // but only combine ternaries that are not separated by spreads
          // because we need spreads to override
          attrs = (() => {
            let next: ExtractedAttr[] = []
            let ternaries: Ternary[] = []

            function combineTernariesAndAddToAttrs() {
              if (!ternaries.length) return
              const normalized = normalizeTernaries(ternaries)
              ternaries = []
              if (shouldPrintDebug) {
                console.log(`  normalized ternaries`, normalized)
              }
              next = [
                ...next,
                ...normalized.map((value) => ({
                  type: 'ternary' as const,
                  value,
                })),
              ]
            }

            for (const attr of attrs) {
              if (attr.type === 'ternary') {
                ternaries.push(attr.value)
              } else {
                if (t.isJSXSpreadAttribute(attr.value)) {
                  if (shouldPrintDebug) console.log(`  spread`)
                  combineTernariesAndAddToAttrs()
                }
                next.push(attr)
              }
            }
            // add any leftover
            combineTernariesAndAddToAttrs()

            return next
          })()

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
