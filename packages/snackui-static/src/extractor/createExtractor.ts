import { join } from 'path'
import vm from 'vm'

import generate from '@babel/generator'
import traverse, { NodePath, Visitor } from '@babel/traverse'
import * as t from '@babel/types'
import * as AllExports from '@snackui/node'
import { difference, pick } from 'lodash'
// @ts-ignore
import { StaticConfig } from 'snackui'

import { pseudos } from '../getStylesAtomic'
import { ExtractedAttr, ExtractedAttrAttr, ExtractorParseProps, Ternary } from '../types'
import { evaluateAstNode } from './evaluateAstNode'
import {
  attrStr,
  findComponentName,
  isInsideSnackUI,
  isPresent,
  isValidThemeHook,
  ternaryStr,
} from './extractHelpers'
import { findTopmostFunction } from './findTopmostFunction'
import { getStaticBindingsForScope } from './getStaticBindingsForScope'
import { literalToAst } from './literalToAst'
import { normalizeTernaries } from './normalizeTernaries'
import { removeUnusedHooks } from './removeUnusedHooks'

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

const validComponents: { [key: string]: any } = Object.keys(AllExports)
  .filter((key) => !!AllExports[key]?.staticConfig)
  .reduce((obj, name) => {
    obj[name] = AllExports[name]
    return obj
  }, {})

export type Extractor = ReturnType<typeof createExtractor>

let hasWarnedOnce = false

export function createExtractor() {
  let themes
  const shouldAddDebugProp =
    process.env.TARGET !== 'native' &&
    process.env.IDENTIFY_TAGS !== 'false' &&
    (process.env.NODE_ENV === 'development' || process.env.DEBUG || process.env.IDENTIFY_TAGS)

  // ts imports
  require('esbuild-register/dist/node').register({
    target: 'es2019',
    format: 'cjs',
  })

  let hasParsedFileLast = 0

  return {
    parse: (
      fileOrPath: NodePath<t.Program> | t.File,
      {
        evaluateImportsWhitelist = ['constants.js'],
        evaluateVars = true,
        themesFile,
        shouldPrintDebug = false,
        sourcePath = '',
        onExtractTag,
        getFlattenedNode,
        disableThemes = false,
        ...props
      }: ExtractorParseProps
    ) => {
      const shouldReCheckTheme = Date.now() - hasParsedFileLast > 600
      hasParsedFileLast = Date.now()

      if (sourcePath === '') {
        throw new Error(`Must provide a source file name`)
      }

      if (process.env.NODE_ENV !== 'production') {
        if (!themesFile && !disableThemes && !hasWarnedOnce) {
          hasWarnedOnce = true
          console.log('SnackUI: no themesFile option provided to SnackUI, using default theme')
        }
      }
      if (!disableThemes && themesFile) {
        if (themesFile[0] !== '/') {
          themesFile = join(process.cwd(), themesFile)
        }
        if (!themes || shouldReCheckTheme) {
          delete require.cache[themesFile]
          themes = require(themesFile).default
        }
      }
      const themeKeys = new Set(themes ? Object.keys(themes[Object.keys(themes)[0]]) : [])

      let doesUseValidImport = false
      const body = fileOrPath.type === 'Program' ? fileOrPath.get('body') : fileOrPath.program.body

      /**
       * Step 1: Determine if importing any statically extractable components
       */
      const isInternalImport = (importStr: string) =>
        isInsideSnackUI(sourcePath) && importStr[0] === '.'

      for (const bodyPath of body) {
        if (bodyPath.type !== 'ImportDeclaration') continue
        const node = ('node' in bodyPath ? bodyPath.node : bodyPath) as any
        const from = node.source.value
        if (from === 'snackui' || isInternalImport(from)) {
          if (
            node.specifiers.some((specifier) => {
              const name = specifier.local.name
              return validComponents[name] || validHooks[name]
            })
          ) {
            doesUseValidImport = true
            break
          }
        }
      }

      if (shouldPrintDebug) {
        console.log(sourcePath, { doesUseValidImport })
      }

      if (!doesUseValidImport) {
        return null
      }

      let couldntParse = false
      const modifiedComponents = new Set<NodePath<any>>()

      // only keeping a cache around per-file, reset it if it changes
      const bindingCache: Record<string, string | null> = {}

      const callTraverse = (a: Visitor<{}>) => {
        return fileOrPath.type === 'File' ? traverse(fileOrPath, a) : fileOrPath.traverse(a)
      }

      /**
       * Step 2: Statically extract from JSX < /> nodes
       */
      let programPath: NodePath<t.Program>

      callTraverse({
        Program: {
          enter(path) {
            programPath = path
          },
        },
        JSXElement(traversePath) {
          const node = traversePath.node.openingElement
          const ogAttributes = node.attributes
          const componentName = findComponentName(traversePath.scope)
          const closingElement = traversePath.node.closingElement

          if (t.isJSXMemberExpression(closingElement?.name)) {
            return
          }

          // skip non-identifier opening elements (member expressions, etc.)
          if (!t.isJSXIdentifier(node.name)) {
            return
          }

          // validate its a proper import from snackui (or internally inside snackui)
          const binding = traversePath.scope.getBinding(node.name.name)
          if (binding) {
            if (!t.isImportDeclaration(binding.path.parent)) {
              return
            }
            const source = binding.path.parent.source
            if (source.value !== 'snackui' && !isInternalImport(source.value)) {
              return
            }
            if (!validComponents[binding.identifier.name]) {
              return
            }
          }

          const component = validComponents[node.name.name] as { staticConfig?: StaticConfig }
          if (!component || !component.staticConfig) {
            return
          }

          const { staticConfig } = component
          const originalNodeName = node.name.name
          const isTextView = staticConfig.isText || false
          const validStyles = staticConfig?.validStyles ?? {}
          const flatNode = getFlattenedNode({ isTextView })

          const deoptProps = new Set([
            ...(props.deoptProps ?? []),
            ...(staticConfig.deoptProps ?? []),
          ])
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

          if (shouldPrintDebug) {
            console.log(`\n<${originalNodeName} />`)
          }

          const isStaticAttributeName = (name: string) => {
            return !!validStyles[name] || staticConfig.validPropsExtra?.[name] || !!pseudos[name]
          }

          // Generate scope object at this level
          const staticNamespace = getStaticBindingsForScope(
            traversePath.scope,
            evaluateImportsWhitelist,
            sourcePath,
            bindingCache,
            shouldPrintDebug
          )

          if (shouldPrintDebug) {
            console.log('  staticNamespace', Object.keys(staticNamespace).join(', '))
          }

          //
          // evaluator
          //
          const attemptEval = !evaluateVars
            ? evaluateAstNode
            : (() => {
                // called when evaluateAstNode encounters a dynamic-looking prop
                const evalFn = (n: t.Node) => {
                  // themes
                  if (
                    t.isMemberExpression(n) &&
                    t.isIdentifier(n.property) &&
                    isValidThemeHook(traversePath, n, sourcePath)
                  ) {
                    const key = n.property.name
                    if (shouldPrintDebug) {
                      console.log('    > found theme prop', key)
                    }
                    if (!themeKeys.has(key)) {
                      throw new Error(`    > accessing non-existent theme key: ${key}`)
                    }
                    return `var(--${key})`
                  }
                  // variable
                  if (t.isIdentifier(n) && staticNamespace.hasOwnProperty(n.name)) {
                    return staticNamespace[n.name]
                  }
                  const evalContext = vm.createContext(staticNamespace)
                  const code = `(${generate(n as any).code})`
                  // if (shouldPrintDebug) {
                  //   console.log('evaluating', { n, code, evalContext })
                  // }
                  return vm.runInContext(code, evalContext)
                }

                return (n: t.Node) => {
                  return evaluateAstNode(n, evalFn)
                }
              })()

          const attemptEvalSafe = (n: t.Node) => {
            try {
              return attemptEval(n)
            } catch (err) {
              return FAILED_EVAL
            }
          }

          //
          //  SPREADS SETUP
          //

          const isExtractable = (obj: t.Node): obj is t.ObjectExpression => {
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

          // flatten any evaluatable spreads
          const flattenedAttrs: (t.JSXAttribute | t.JSXSpreadAttribute)[] = []
          traversePath
            .get('openingElement')
            .get('attributes')
            .forEach((path) => {
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
          let inlinePropCount = 0
          let isFlattened = false

          // iterate and parse out any ternaries / styles
          attrs = traversePath
            .get('openingElement')
            .get('attributes')
            .flatMap((path) => {
              const res = evaluateAttribute(path)
              if (!res) {
                path.remove()
              }
              return res
            })
            .filter(isPresent)

          // see if we can filter them
          if (shouldPrintDebug) {
            console.log('  attrs (before)\n    - ', attrs.map(attrStr).join('\n    - '))
          }

          // now update to new values
          node.attributes = attrs.filter(isAttr).map((x) => x.value)

          function evaluateAttribute(
            path: NodePath<t.JSXAttribute | t.JSXSpreadAttribute>
          ): ExtractedAttr | ExtractedAttr[] | null {
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
                  const aStyle = isExtractable(alternate) ? attemptEvalSafe(alternate) : FAILED_EVAL
                  const cStyle = isExtractable(consequent)
                    ? attemptEvalSafe(consequent)
                    : FAILED_EVAL

                  if (hasDeopt(aStyle) || hasDeopt(cStyle)) {
                    shouldDeopt = true
                    return null
                  }

                  if (aStyle !== FAILED_EVAL && cStyle !== FAILED_EVAL) {
                    const alt = aStyle
                    const cons = cStyle
                    const ternary: Ternary = {
                      test,
                      remove() {
                        path.remove()
                      },
                      alternate: alt,
                      consequent: cons,
                    }
                    if (shouldPrintDebug) {
                      console.log(' conditionalExpression', ternaryStr(ternary))
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
                  if (isExtractable(attribute.argument.right)) {
                    const spreadStyle = attemptEvalSafe(attribute.argument.right)
                    if (spreadStyle === FAILED_EVAL) {
                      // no optimize
                      return attr
                    } else {
                      if (hasDeopt(spreadStyle)) {
                        shouldDeopt = true
                        return null
                      }
                      const test = (attribute.argument as t.LogicalExpression).left
                      const testValue = attemptEvalSafe(test)
                      if (testValue === FAILED_EVAL) {
                        // its fine we just cant extract all the way
                      }
                      if (!testValue) {
                        // if its value it evaluates to nada
                        return null
                      }
                      return {
                        type: 'ternary',
                        value: {
                          test,
                          remove() {
                            path.remove()
                          },
                          consequent: spreadStyle,
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
              return null
            }

            // can still optimize the object... see hoverStyle on native
            if (isDeoptedProp(name)) {
              inlinePropCount++
              return attr
            }

            const [value, valuePath] = (() => {
              if (t.isJSXExpressionContainer(attribute?.value)) {
                return [attribute.value.expression!, path.get('value')!] as const
              } else {
                return [attribute.value!, path.get('value')!] as const
              }
            })()

            const remove = () => {
              Array.isArray(valuePath) ? valuePath.map((p) => p.remove()) : valuePath.remove()
            }

            // value == null means boolean (true)
            if (value === null) {
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
              console.log('     >', name, styleValue)
            }

            // FAILED = dynamic or ternary, keep going
            if (styleValue !== FAILED_EVAL) {
              return {
                type: 'style',
                value: { [name]: styleValue },
              }
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
                console.log(`  evalBinaryExpression lVal ${String(lVal)}, rVal ${String(rVal)}`)
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

            //
            // RETURN ATTR
            //
            return attr

            // attr helpers:
            function addBinaryConditional(
              operator: any,
              staticExpr: any,
              cond: t.ConditionalExpression
            ): ExtractedAttr | null {
              if (getStaticConditional(cond)) {
                const alt = attemptEval(t.binaryExpression(operator, staticExpr, cond.alternate))
                const cons = attemptEval(t.binaryExpression(operator, staticExpr, cond.consequent))
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
                    console.log('      static ternary', type, cVal, aVal)
                  }
                  return {
                    test: value.test,
                    remove,
                    consequent: { [name]: cVal },
                    alternate: { [name]: aVal },
                  }
                } catch (err) {
                  if (shouldPrintDebug) {
                    console.log('       cant eval ternary', err.message)
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

          if (couldntParse) {
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

          const filePath = sourcePath.replace(process.cwd(), '.')
          const lineNumbers = node.loc
            ? node.loc.start.line +
              (node.loc.start.line !== node.loc.end.line ? `-${node.loc.end.line}` : '')
            : ''

          // combine ternaries
          let ternaries: Ternary[] = []
          attrs = attrs
            .reduce<(ExtractedAttr | ExtractedAttr[])[]>((out, cur) => {
              const next = attrs[attrs.indexOf(cur) + 1]
              if (cur.type === 'ternary') {
                ternaries.push(cur.value)
              }
              if ((!next || next.type !== 'ternary') && ternaries.length) {
                // finish, process
                const normalized = normalizeTernaries(ternaries).map(
                  ({ alternate, consequent, ...rest }) => {
                    return {
                      type: 'ternary' as const,
                      value: {
                        ...rest,
                        alternate: alternate || null,
                        consequent: consequent || null,
                      },
                    }
                  }
                )
                try {
                  return [...out, ...normalized]
                } finally {
                  if (shouldPrintDebug) {
                    console.log(
                      `    normalizeTernaries (${ternaries.length} => ${normalized.length})`
                    )
                  }
                  ternaries = []
                }
              }
              if (cur.type === 'ternary') {
                return out
              }
              out.push(cur)
              return out
            }, [])
            .flat()

          // combine styles
          let prev: ExtractedAttr | null = null
          attrs = attrs.reduce<ExtractedAttr[]>((acc, cur) => {
            if (cur.type === 'style') {
              if (prev?.type === 'style') {
                Object.assign(prev.value, cur.value)
                return acc
              }
            }
            acc.push(cur)
            prev = cur
            return acc
          }, [])

          if (shouldPrintDebug) {
            console.log('     - attrs (combined)\n  ', attrs.map(attrStr).join('\n    - '))
          }

          // post process
          const getStyles = (res: Object | null) => {
            if (!res) return
            if (!!excludeProps.size) {
              for (const key in res) {
                if (isExcludedProp(key)) delete res[key]
              }
            }
            const next = staticConfig.postProcessStyles?.(res) ?? res
            if (staticConfig.validStyles) {
              for (const key in next) {
                if (!staticConfig.validStyles[key]) {
                  delete next[key]
                }
              }
            }
            return next
          }

          // evaluates all static attributes into a simple object
          const completeStaticProps = {
            ...Object.keys(attrs).reduce((acc, index) => {
              const cur = attrs[index] as ExtractedAttr
              if (cur.type === 'style') {
                Object.assign(acc, cur.value)
              }
              if (cur.type === 'attr') {
                if (t.isJSXSpreadAttribute(cur.value)) {
                  return acc
                }
                if (!t.isJSXIdentifier(cur.value.name)) {
                  return acc
                }
                try {
                  const key = cur.value.name.name
                  const value = evaluateAstNode(cur.value.value)
                  acc[key] = value
                } catch (err) {
                  // ok, skip - not static
                }
              }
              return acc
            }, {}),
          }

          const completeStylesProcessed = getStyles({
            ...staticConfig.defaultProps,
            ...completeStaticProps,
          })
          // any extra styles added in postprocess should be added to first group as they wont be overriden
          const stylesToAddToInitialGroup = difference(
            Object.keys(completeStylesProcessed),
            Object.keys(completeStaticProps)
          )
          if (stylesToAddToInitialGroup.length) {
            const toAdd = pick(completeStylesProcessed, ...stylesToAddToInitialGroup)
            const firstGroup = attrs.find((x) => x.type === 'style')
            if (shouldPrintDebug) {
              // prettier-ignore
              console.log('stylesToAddToInitialGroup', stylesToAddToInitialGroup, { toAdd, firstGroup })
            }
            if (!firstGroup) {
              attrs.unshift({ type: 'style', value: toAdd })
            } else {
              Object.assign(firstGroup.value, toAdd)
            }
          }

          if (shouldPrintDebug) {
            console.log('completeStaticProps', completeStaticProps)
          }

          for (const attr of attrs) {
            try {
              switch (attr.type) {
                case 'ternary':
                  const a = getStyles(attr.value.alternate)
                  const c = getStyles(attr.value.consequent)
                  attr.value.alternate = a
                  attr.value.consequent = c
                  if (shouldPrintDebug) {
                    console.log('     => tern ', attrStr(attr))
                  }
                  break
                case 'style':
                  const next = {}
                  for (const key in attr.value) {
                    next[key] = completeStylesProcessed[key]
                  }
                  if (shouldPrintDebug) {
                    // prettier-ignore
                    console.log('     => style ', attr.value, '=>', next)
                  }
                  attr.value = next
                  break
              }
            } catch (err) {
              // any error de-opt
              if (shouldPrintDebug) {
                console.log(' postprocessing error, deopt', err)
                node.attributes = ogAttributes
                return node
              }
            }
          }

          if (shouldPrintDebug) {
            console.log('   - attrs (after)\n', attrs.map(attrStr).join('\n    - '))
          }

          // add data-is
          if (shouldAddDebugProp) {
            const preName = componentName ? `${componentName}:` : ''
            // unshift so spreads/nesting overwrite
            attrs.unshift({
              type: 'attr',
              value: t.jsxAttribute(
                t.jsxIdentifier('data-is'),
                t.stringLiteral(`${preName}${node.name.name} @ ${filePath}:${lineNumbers}`)
              ),
            })
          }

          // flatten!
          const hasSpread = node.attributes.some((x) => t.isJSXSpreadAttribute(x))
          if (!shouldDeopt && inlinePropCount === 0 && !hasSpread && !staticConfig.neverFlatten) {
            if (shouldPrintDebug) {
              console.log('  [✅] fully flattened node', originalNodeName, flatNode)
            }
            isFlattened = true
            node.name.name = flatNode
            if (closingElement) {
              closingElement.name.name = flatNode
            }
          } else {
            if (shouldPrintDebug) {
              // prettier-ignore
              console.log('  [❊] ',inlinePropCount,'props un-flattened',shouldDeopt ? ' deopted' : '',hasSpread ? ' spread' : '',staticConfig.neverFlatten ? ' neverFlatten' : '')
            }
          }

          onExtractTag({
            attrs,
            node,
            lineNumbers,
            filePath,
            attemptEval,
            jsxPath: traversePath,
            originalNodeName,
            isFlattened,
            programPath,
          })
        },
      })

      /**
       * Step 3: Remove dead code from removed media query / theme hooks
       */
      if (modifiedComponents.size) {
        const all = Array.from(modifiedComponents)
        if (shouldPrintDebug) {
          console.log('  [🪝] hook check', all.length)
        }
        for (const comp of all) {
          removeUnusedHooks(comp, shouldPrintDebug)
        }
      }
    },
  }
}
