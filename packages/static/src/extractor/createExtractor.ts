import traverse, { NodePath, Visitor } from '@babel/traverse'
import * as t from '@babel/types'
import type { StaticConfigParsed, TamaguiInternalConfig } from '@tamagui/core'
import { mediaQueryConfig, postProcessStyles, pseudos } from '@tamagui/core-node'
import { stylePropsTransform } from '@tamagui/helpers'
import { difference, pick } from 'lodash'

import { FAILED_EVAL } from '../constants'
import { ExtractedAttr, ExtractedAttrAttr, ExtractorParseProps, Ternary } from '../types'
import { createEvaluator, createSafeEvaluator } from './createEvaluator'
import { evaluateAstNode } from './evaluateAstNode'
import { attrStr, findComponentName, isInsideTamagui, isPresent, objToStr } from './extractHelpers'
import { findTopmostFunction } from './findTopmostFunction'
import { getStaticBindingsForScope } from './getStaticBindingsForScope'
import { literalToAst } from './literalToAst'
import { loadTamagui } from './loadTamagui'
import { logLines } from './logLines'
import { normalizeTernaries } from './normalizeTernaries'
import { removeUnusedHooks } from './removeUnusedHooks'

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

export type Extractor = ReturnType<typeof createExtractor>

const createTernary = (x: Ternary) => x

export function createExtractor() {
  const shouldAddDebugProp =
    // really basic disable this for next.js because it messes with ssr
    !process.env.npm_package_dependencies_next &&
    process.env.TAMAGUI_TARGET !== 'native' &&
    process.env.IDENTIFY_TAGS !== 'false' &&
    (process.env.NODE_ENV === 'development' || process.env.DEBUG || process.env.IDENTIFY_TAGS)

  // ts imports
  require('esbuild-register/dist/node').register({
    target: 'es2019',
    format: 'cjs',
  })

  let loadedTamaguiConfig: TamaguiInternalConfig
  let hasLogged = false

  return {
    getTamagui() {
      return loadedTamaguiConfig
    },
    parse: (
      fileOrPath: NodePath<t.Program> | t.File,
      {
        config = 'tamagui.config.ts',
        importsWhitelist = ['constants.js'],
        evaluateVars = true,
        shouldPrintDebug = false,
        sourcePath = '',
        onExtractTag,
        getFlattenedNode,
        disableExtraction,
        disableExtractInlineMedia,
        disableExtractVariables,
        disableDebugAttr,
        ...props
      }: ExtractorParseProps
    ) => {
      if (sourcePath === '') {
        throw new Error(`Must provide a source file name`)
      }
      if (!Array.isArray(props.components)) {
        throw new Error(`Must provide components array with list of Tamagui component modules`)
      }

      // we require it after parse because we need to set some global/env stuff before importing
      // otherwise we'd import `rnw` and cause it to evaluate react-native-web which causes errors
      const { components, tamaguiConfig } = loadTamagui({
        config,
        components: props.components || ['tamagui'],
      })

      loadedTamaguiConfig = tamaguiConfig

      const defaultTheme = tamaguiConfig.themes[Object.keys(tamaguiConfig.themes)[0]]
      const body = fileOrPath.type === 'Program' ? fileOrPath.get('body') : fileOrPath.program.body

      /**
       * Step 1: Determine if importing any statically extractable components
       */
      const isInternalImport = (importStr: string) => {
        return isInsideTamagui(sourcePath) && importStr[0] === '.'
      }

      const validComponents: { [key: string]: any } = Object.keys(components)
        // check if uppercase to avoid hitting media query proxy before init
        .filter((key) => key[0].toUpperCase() === key[0] && !!components[key]?.staticConfig)
        .reduce((obj, name) => {
          obj[name] = components[name]
          return obj
        }, {})

      let doesUseValidImport = false

      for (const bodyPath of body) {
        if (bodyPath.type !== 'ImportDeclaration') continue
        const node = ('node' in bodyPath ? bodyPath.node : bodyPath) as any
        const from = node.source.value
        if (props.components.includes(from) || isInternalImport(from)) {
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

      const res = {
        flattened: 0,
        optimized: 0,
        modified: 0,
      }

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

          // skip non-identifier opening elements (member expressions, etc.)
          if (t.isJSXMemberExpression(closingElement?.name) || !t.isJSXIdentifier(node.name)) {
            return
          }

          // validate its a proper import from tamagui (or internally inside tamagui)
          const binding = traversePath.scope.getBinding(node.name.name)

          if (binding) {
            if (!t.isImportDeclaration(binding.path.parent)) {
              return
            }
            const source = binding.path.parent.source
            if (!props.components.includes(source.value) && !isInternalImport(source.value)) {
              return
            }
            if (!validComponents[binding.identifier.name]) {
              return
            }
          }

          const component = validComponents[node.name.name] as { staticConfig?: StaticConfigParsed }
          if (!component || !component.staticConfig) {
            return
          }

          const originalNodeName = node.name.name

          if (shouldPrintDebug) {
            console.log(`\n<${originalNodeName} />`)
          }

          const filePath = sourcePath.replace(process.cwd(), '.')
          const lineNumbers = node.loc
            ? node.loc.start.line +
              (node.loc.start.line !== node.loc.end.line ? `-${node.loc.end.line}` : '')
            : ''

          // add data-is
          if (shouldAddDebugProp && !disableDebugAttr) {
            const preName = componentName ? `${componentName}:` : ''
            res.modified++
            node.attributes.unshift(
              t.jsxAttribute(
                t.jsxIdentifier('data-is'),
                t.stringLiteral(
                  `  ${preName}${node.name.name}   ${filePath.replace('./', '')}:${lineNumbers}  `
                )
              )
            )
          }

          if (disableExtraction) {
            if (!hasLogged) {
              console.log('🥚 Tamagui disableExtraction set: no CSS or optimizations will be run')
              hasLogged = true
            }
            return
          }

          const { staticConfig } = component
          const isTextView = staticConfig.isText || false
          const validStyles = staticConfig?.validStyles ?? {}

          // find tag="a" tag="main" etc dom indicators
          let tagName = staticConfig.defaultProps?.tag ?? (isTextView ? 'span' : 'div')
          traversePath
            .get('openingElement')
            .get('attributes')
            .forEach((path) => {
              const attr = path.node
              if (t.isJSXSpreadAttribute(attr)) return
              if (attr.name.name !== 'tag') return
              const val = attr.value
              if (!t.isStringLiteral(val)) return
              tagName = val.value
            })

          const flatNode = getFlattenedNode({ isTextView, tag: tagName })

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

          // Generate scope object at this level
          const staticNamespace = getStaticBindingsForScope(
            traversePath.scope,
            importsWhitelist,
            sourcePath,
            bindingCache,
            shouldPrintDebug
          )

          const attemptEval = !evaluateVars
            ? evaluateAstNode
            : createEvaluator({
                tamaguiConfig,
                staticNamespace,
                sourcePath,
                traversePath,
                shouldPrintDebug,
              })
          const attemptEvalSafe = createSafeEvaluator(attemptEval)

          if (shouldPrintDebug) {
            console.log('  staticNamespace', Object.keys(staticNamespace).join(', '))
          }

          //
          //  SPREADS SETUP
          //

          // TODO restore
          const hasDeopt = (obj: Object) => {
            return Object.keys(obj).some(isDeoptedProp)
          }

          // flatten any easily evaluatable spreads
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
              } catch (e: any) {
                if (shouldPrintDebug) {
                  console.log('  couldnt parse spread', e.message)
                }
                flattenedAttrs.push(attr)
                return
              }
              if (typeof arg !== 'undefined') {
                try {
                  if (typeof arg !== 'object' || arg == null) {
                    if (shouldPrintDebug) {
                      console.log('  non object or null arg', arg)
                    }
                    flattenedAttrs.push(attr)
                  } else {
                    for (const k in arg) {
                      const value = arg[k]
                      // this is a null prop:
                      if (!value && typeof value === 'object') {
                        console.log('shouldnt we handle this?', k, value, arg)
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
                  console.warn('cant parse spread, caught err', err)
                  couldntParse = true
                }
              }
            })

          if (couldntParse) {
            return
          }

          // set flattened
          node.attributes = flattenedAttrs

          // add in default props
          if (staticConfig.defaultProps) {
            for (const key in staticConfig.defaultProps) {
              if (key === 'StyleSheet') {
                // temp bugfix when wrapping styled(require('react-native-web').Input)
                continue
              }
              const serialize = require('babel-literal-to-ast')
              const val = staticConfig.defaultProps[key]
              try {
                const serializedDefaultProp = serialize(val)
                node.attributes.unshift(
                  t.jsxAttribute(
                    t.jsxIdentifier(key),
                    typeof val === 'string'
                      ? t.stringLiteral(val)
                      : t.jsxExpressionContainer(serializedDefaultProp)
                  )
                )
              } catch (err) {
                console.warn(
                  `⚠️ Error evaluating default prop for component ${node.name.name}, prop ${key}\n error: ${err}\n value:`,
                  val,
                  '\n defaultProps:',
                  staticConfig.defaultProps
                )
              }
            }
          }

          let attrs: ExtractedAttr[] = []
          let shouldDeopt = false
          let inlinePropCount = 0
          let isFlattened = false

          // RUN first pass

          // normalize all conditionals so we can evaluate away easier later
          // at the same time lets normalize shorthand media queries into spreads:
          // that way we can parse them with the same logic later on
          //
          // {...media.sm && { color: x ? 'red' : 'blue' }}
          // => {...media.sm && x && { color: 'red' }}
          // => {...media.sm && !x && { color: 'blue' }}
          //
          // $sm={{ color: 'red' }}
          // => {...media.sm && { color: 'red' }}
          //
          // $sm={{ color: x ? 'red' : 'blue' }}
          // => {...media.sm && x && { color: 'red' }}
          // => {...media.sm && !x && { color: 'blue' }}

          attrs = traversePath
            .get('openingElement')
            .get('attributes')
            .flatMap((path) => {
              try {
                const res = evaluateAttribute(path)
                if (!res) {
                  path.remove()
                }
                return res
              } catch (err: any) {
                if (shouldPrintDebug) {
                  console.log('Error extracting attribute', err.message, err.stack)
                  console.log('node', path.node)
                }
                return {
                  type: 'attr',
                  value: path.node,
                } as const
              }
            })
            .flat(4)
            .filter(isPresent)

          if (shouldPrintDebug) {
            console.log('  - attrs (before):\n', logLines(attrs.map(attrStr).join(', ')))
          }

          function isStaticAttributeName(name: string) {
            return !!(
              !!validStyles[name] ||
              staticConfig.validPropsExtra?.[name] ||
              !!pseudos[name] ||
              staticConfig.variants?.[name] ||
              tamaguiConfig.shorthands[name] ||
              (name[0] === '$' ? !!mediaQueryConfig[name.slice(1)] : false)
            )
          }

          function isExtractable(obj: t.Node): obj is t.ObjectExpression {
            return (
              t.isObjectExpression(obj) &&
              obj.properties.every((prop) => {
                if (!t.isObjectProperty(prop)) {
                  console.log('not object prop', prop)
                  return false
                }
                const propName = prop.key['name']
                if (!isStaticAttributeName(propName) && propName !== 'tag') {
                  if (shouldPrintDebug) {
                    console.log('  not a valid style prop!', propName)
                  }
                  return false
                }
                return true
              })
            )
          }

          // side <= { color: 'red', background: x ? 'red' : 'green' }
          // | => Ternary<test, { color: 'red' }, null>
          // | => Ternary<test && x, { background: 'red' }, null>
          // | => Ternary<test && !x, { background: 'green' }, null>
          function createTernariesFromObjectProperties(
            test: t.Expression,
            side: t.Expression | null,
            ternaryPartial: Partial<Ternary> = {}
          ): null | Ternary[] {
            if (!side) {
              return null
            }
            if (!isExtractable(side)) {
              throw new Error('not extractable')
            }
            return side.properties.flatMap((property) => {
              if (!t.isObjectProperty(property)) {
                throw new Error('expected object property')
              }
              // this could be a recurse here if we want to get fancy
              if (t.isConditionalExpression(property.value)) {
                // merge up into the parent conditional, split into two
                const [truthy, falsy] = [
                  t.objectExpression([t.objectProperty(property.key, property.value.consequent)]),
                  t.objectExpression([t.objectProperty(property.key, property.value.alternate)]),
                ].map((x) => attemptEval(x))
                return [
                  createTernary({
                    remove() {},
                    ...ternaryPartial,
                    test: t.logicalExpression('&&', test, property.value.test),
                    consequent: truthy,
                    alternate: null,
                  }),
                  createTernary({
                    ...ternaryPartial,
                    test: t.logicalExpression(
                      '&&',
                      test,
                      t.unaryExpression('!', property.value.test)
                    ),
                    consequent: falsy,
                    alternate: null,
                    remove() {},
                  }),
                ]
              }
              const obj = t.objectExpression([t.objectProperty(property.key, property.value)])
              const consequent = attemptEval(obj)
              return createTernary({
                remove() {},
                ...ternaryPartial,
                test,
                consequent,
                alternate: null,
              })
            })
          }

          // START function evaluateAttribute
          function evaluateAttribute(
            path: NodePath<t.JSXAttribute | t.JSXSpreadAttribute>
          ): ExtractedAttr | ExtractedAttr[] | null {
            const attribute = path.node
            const attr: ExtractedAttr = { type: 'attr', value: attribute }
            // ...spreads
            if (t.isJSXSpreadAttribute(attribute)) {
              const arg = attribute.argument
              const conditional = t.isConditionalExpression(arg)
                ? // <YStack {...isSmall ? { color: 'red } : { color: 'blue }}
                  ([arg.test, arg.consequent, arg.alternate] as const)
                : t.isLogicalExpression(arg) && arg.operator === '&&'
                ? // <YStack {...isSmall && { color: 'red }}
                  ([arg.left, arg.right, null] as const)
                : null

              if (conditional) {
                const [test, alt, cons] = conditional
                if (!test) throw new Error(`no test`)
                if ([alt, cons].some((side) => side && !isExtractable(side))) {
                  if (shouldPrintDebug) {
                    console.log('not extractable', alt, cons)
                  }
                  return attr
                }
                // split into individual ternaries per object property
                return [
                  ...(createTernariesFromObjectProperties(test, alt) || []),
                  ...((cons &&
                    createTernariesFromObjectProperties(t.unaryExpression('!', test), cons)) ||
                    []),
                ].map((ternary) => ({
                  type: 'ternary',
                  value: ternary,
                }))
              }
            }
            // END ...spreads

            // directly keep these
            // couldn't evaluate spread, undefined name, or name is not string
            if (
              t.isJSXSpreadAttribute(attribute) ||
              !attribute.name ||
              typeof attribute.name.name !== 'string'
            ) {
              inlinePropCount++
              return attr
            }

            const name = attribute.name.name

            if (isExcludedProp(name)) {
              return null
            }

            // can still optimize the object... see hoverStyle on native
            if (isDeoptedProp(name)) {
              if (shouldPrintDebug) {
                console.log('  ! inlining, deopt prop', name)
              }
              inlinePropCount++
              return attr
            }

            // pass className, key, and style props through untouched
            if (UNTOUCHED_PROPS[name]) {
              return attr
            }

            // shorthand media queries
            if (name[0] === '$' && t.isJSXExpressionContainer(attribute?.value)) {
              // allow disabling this extraction
              if (disableExtractInlineMedia) {
                return attr
              }

              const shortname = name.slice(1)
              if (mediaQueryConfig[shortname]) {
                const expression = attribute.value.expression
                if (!t.isJSXEmptyExpression(expression)) {
                  const ternaries = createTernariesFromObjectProperties(
                    t.stringLiteral(shortname),
                    expression,
                    {
                      inlineMediaQuery: shortname,
                    }
                  )
                  if (ternaries) {
                    return ternaries.map((value) => ({
                      type: 'ternary',
                      value,
                    }))
                  }
                }
              }
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

            if (name === 'ref') {
              if (shouldPrintDebug) {
                console.log('  ! inlining, ref', name)
              }
              inlinePropCount++
              return attr
            }

            if (name === 'tag') {
              return {
                type: 'attr',
                value: path.node,
              }
            }

            // native shouldn't extract variables
            if (disableExtractVariables) {
              if (value) {
                if (value.type === 'StringLiteral' && value.value[0] === '$') {
                  if (shouldPrintDebug) {
                    console.log(`  native, disable extract:  ${name} =`, value.value)
                  }
                  inlinePropCount++
                  return attr
                }
              }
            }

            // if value can be evaluated, extract it and filter it out
            const styleValue = attemptEvalSafe(value)

            // never flatten if a prop isn't a valid static attribute
            // only post prop-mapping
            if (!isStaticAttributeName(name)) {
              let keys = [name]
              if (staticConfig.propMapper) {
                // for now passing empty props {}, a bit odd, need to at least document
                // for now we don't expose custom components so just noting behavior
                const out = staticConfig.propMapper(
                  name,
                  styleValue,
                  defaultTheme,
                  staticConfig.defaultProps
                )
                if (out) {
                  keys = Object.keys(out)
                }
              }
              if (
                keys.some((k) => !isStaticAttributeName(k) && k !== 'tag' && !k.startsWith('data-'))
              ) {
                if (shouldPrintDebug) {
                  console.log('  ! inlining, not static attribute name', name)
                }
                inlinePropCount++
                return attr
              }
            }

            // FAILED = dynamic or ternary, keep going
            if (styleValue !== FAILED_EVAL) {
              if (shouldPrintDebug) {
                console.log(`  style: ${name} =`, styleValue)
              }
              return {
                type: 'style',
                value: { [name]: styleValue },
                name,
                attr: path.node,
              }
            }

            // ternaries!

            // binary ternary, we can eventually make this smarter but step 1
            // basically for the common use case of:
            // opacity={(conditional ? 0 : 1) * scale}
            if (t.isBinaryExpression(value)) {
              if (shouldPrintDebug) {
                console.log(` binary expression ${name} = `, value)
              }
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
              if (shouldPrintDebug) {
                console.log(` static conditional ${name} = `, value)
              }
              return { type: 'ternary', value: staticConditional }
            }

            const staticLogical = getStaticLogical(value)
            if (staticLogical) {
              if (shouldPrintDebug) {
                console.log(` static ternary ${name} = `, value)
              }
              return { type: 'ternary', value: staticLogical }
            }

            if (shouldPrintDebug) {
              console.log('  ! inline prop via no match', name, value.type)
            }
            // if we've made it this far, the prop stays inline
            inlinePropCount++

            if (shouldPrintDebug) {
              console.log(` inlining ${name} = `, value)
            }

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
                  if (shouldPrintDebug) {
                    console.log('attempt', value.alternate, value.consequent)
                  }
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
                } catch (err: any) {
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

          // now update to new values
          node.attributes = attrs.filter(isAttr).map((x) => x.value)

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
                const key = cur.value.name.name
                // undefined = boolean true
                const value = attemptEvalSafe(cur.value.value || t.booleanLiteral(true))
                if (value === FAILED_EVAL) {
                  return acc
                }
                acc[key] = value
              }
              return acc
            }, {}),
          }

          // flatten logic!
          // fairly simple check to see if all children are text
          const hasSpread = node.attributes.some((x) => t.isJSXSpreadAttribute(x))
          const hasOnlyStringChildren =
            !hasSpread &&
            (node.selfClosing ||
              (traversePath.node.children &&
                traversePath.node.children.every((x) => x.type === 'JSXText')))
          const shouldFlatten =
            !shouldDeopt &&
            inlinePropCount === 0 &&
            !hasSpread &&
            staticConfig.neverFlatten !== true &&
            (staticConfig.neverFlatten === 'jsx' ? hasOnlyStringChildren : true)

          // insert overrides - this inserts null props for things that are set in classNames
          // only when not flattening, so the downstream component can skip applying those styles
          if (!shouldFlatten) {
            attrs = attrs.reduce<ExtractedAttr[]>((acc, cur) => {
              if (cur.type === 'style') {
                // TODO need to loop over initial props not just style props
                for (const key in cur.value) {
                  const shouldEnsureOverridden = !!staticConfig.ensureOverriddenProp?.[key]
                  const isSetInAttrsAlready = attrs.some(
                    (x) =>
                      x.type === 'attr' &&
                      x.value.type === 'JSXAttribute' &&
                      x.value.name.name === key
                  )

                  if (!isSetInAttrsAlready) {
                    const isVariant = !!staticConfig.variants?.[cur.name || '']
                    if (isVariant || shouldEnsureOverridden) {
                      acc.push({
                        type: 'attr',
                        value:
                          cur.attr ||
                          t.jsxAttribute(
                            t.jsxIdentifier(key),
                            t.jsxExpressionContainer(t.nullLiteral())
                          ),
                      })
                    }
                  }
                }
              }
              acc.push(cur)
              return acc
            }, [])
          }

          if (shouldPrintDebug) {
            console.log('  - attrs (flattened): \n', logLines(attrs.map(attrStr).join(', ')))
          }

          // evaluate away purely style props
          attrs = attrs.reduce<ExtractedAttr[]>((acc, cur) => {
            if (cur.type === 'style') {
              let key = Object.keys(cur.value)[0]
              let value = cur.value[key]
              const nonShortKey = tamaguiConfig.shorthands[key]
              // expand shorthand here
              if (nonShortKey) {
                cur.value = { [nonShortKey]: value }
                key = nonShortKey
              }

              // finally we have all styles + expansions, lets see if we need to skip
              // any and keep them as attrs
              if (disableExtractVariables) {
                if (value[0] === '$') {
                  if (shouldPrintDebug) {
                    console.log(`   keeping variable inline: ${key} =`, value)
                  }
                  return [
                    {
                      type: 'attr',
                      value: t.jsxAttribute(
                        t.jsxIdentifier(key),
                        t.jsxExpressionContainer(t.stringLiteral(value))
                      ),
                    },
                  ]
                }
              }

              if (!validStyles[key] && !pseudos[key]) {
                if (shouldPrintDebug) {
                  console.log('   - ignoring (expanded already):', key)
                }
                // we've already expanded shorthands, now we can remove them
                return acc
              }
            }
            acc.push(cur)
            return acc
          }, [])

          if (shouldPrintDebug) {
            console.log('  - attrs (evaluated styles): \n', logLines(attrs.map(attrStr).join(', ')))
          }

          // combine styles, leave undefined values
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
            console.log('  - attrs (combined 🔀): \n', logLines(attrs.map(attrStr).join(', ')))
          }

          // post process
          const getStyles = (props: Object | null) => {
            if (!props) return
            if (!!excludeProps.size) {
              for (const key in props) {
                if (isExcludedProp(key)) delete props[key]
              }
            }
            const out = postProcessStyles(props, staticConfig, defaultTheme)
            const next = out?.style ?? props
            if (shouldPrintDebug) {
              console.log('  viewProps >>\n', logLines(objToStr(out.viewProps)))
              console.log('  props >>\n', logLines(objToStr(props)))
              console.log('  next  <<\n', logLines(objToStr(next)))
            }
            for (const key in next) {
              if (staticConfig.validStyles) {
                if (!staticConfig.validStyles[key] && !pseudos[key]) {
                  delete next[key]
                }
              }
            }
            return next
          }

          // used to ensure we pass the entire prop bundle to getStyles
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
              console.log('    toAdd', objToStr(toAdd))
            }
            if (!firstGroup) {
              attrs.unshift({ type: 'style', value: toAdd })
            } else {
              Object.assign(firstGroup.value, toAdd)
            }
          }

          if (shouldPrintDebug) {
            // prettier-ignore
            console.log('   completeStaticProps\n', logLines(objToStr(completeStaticProps)))
            // prettier-ignore
            console.log('   completeStylesProcessed\n', logLines(objToStr(completeStylesProcessed)))
          }

          let getStyleError: any = null

          // fix up ternaries, combine final style values
          for (const attr of attrs) {
            try {
              switch (attr.type) {
                case 'ternary':
                  const a = getStyles(attr.value.alternate)
                  const c = getStyles(attr.value.consequent)
                  attr.value.alternate = a
                  attr.value.consequent = c
                  if (shouldPrintDebug) console.log('     => tern ', attrStr(attr))
                  continue
                case 'style':
                  for (const keyIn in attr.value) {
                    const [key, value] = (() => {
                      if (keyIn in stylePropsTransform) {
                        // TODO this logic needs to be a bit more right, because could have spread in between transforms...
                        return ['transform', completeStylesProcessed['transform']] as const
                      } else {
                        return [keyIn, completeStylesProcessed[keyIn] ?? attr.value[keyIn]] as const
                      }
                    })()
                    attr.value[key] = value
                  }
                  continue
              }
            } catch (err) {
              // any error de-opt
              getStyleError = err
            }
          }

          if (getStyleError) {
            console.log(' ⚠️ postprocessing error, deopt', getStyleError)
            node.attributes = ogAttributes
            return node
          }

          if (shouldPrintDebug) {
            console.log('  - attrs (after):\n', logLines(attrs.map(attrStr).join(', ')))
          }

          if (shouldFlatten) {
            // DO FLATTEN
            if (shouldPrintDebug) {
              console.log('  [✅] flattening', originalNodeName, flatNode)
            }
            isFlattened = true
            node.name.name = flatNode
            res.flattened++
            if (closingElement) {
              closingElement.name.name = flatNode
            }
          }

          if (shouldPrintDebug) {
            // prettier-ignore
            console.log('  [❊] inline props ', inlinePropCount, shouldDeopt ? ' deopted' : '', hasSpread ? ' spread' : '', '!flatten', staticConfig.neverFlatten)
            console.log('  - attrs (end):\n', logLines(attrs.map(attrStr).join(', ')))
          }

          res.optimized++

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

      return res
    },
  }
}
