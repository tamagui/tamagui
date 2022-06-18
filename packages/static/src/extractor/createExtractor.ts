import { relative } from 'path'

import traverse, { NodePath, Visitor } from '@babel/traverse'
import * as t from '@babel/types'
import {
  PseudoStyles,
  StaticConfigParsed,
  TamaguiInternalConfig,
  expandStyles,
  getSplitStyles,
  getStylesAtomic,
  mediaQueryConfig,
  normalizeStyleObject,
  proxyThemeVariables,
  pseudos,
  rnw,
  stylePropsTransform,
} from '@tamagui/core-node'
import { difference, pick } from 'lodash'
import type { ViewStyle } from 'react-native'

import { FAILED_EVAL } from '../constants'
import {
  ExtractedAttr,
  ExtractedAttrAttr,
  ExtractedAttrStyle,
  ExtractorParseProps,
  Ternary,
} from '../types'
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
import { timer } from './timer'
import { validHTMLAttributes } from './validHTMLAttributes'

const UNTOUCHED_PROPS = {
  key: true,
  style: true,
  className: true,
}

const INLINE_EXTRACTABLE = {
  ref: 'ref',
  key: 'key',
  onPress: 'onClick',
  onHoverIn: 'onMouseEnter',
  onHoverOut: 'onMouseLeave',
  onPressIn: 'onMouseDown',
  onPressOut: 'onMouseUp',
}

const isAttr = (x: ExtractedAttr): x is ExtractedAttrAttr => x.type === 'attr'

const validHooks = {
  useMedia: true,
  useTheme: true,
}

export type Extractor = ReturnType<typeof createExtractor>

const createTernary = (x: Ternary) => x

export function createExtractor() {
  if (!process.env.TAMAGUI_TARGET) {
    console.log('⚠️ Please set process.env.TAMAGUI_TARGET to either "web" or "native"')
    process.exit(1)
  }

  const shouldAddDebugProp =
    // really basic disable this for next.js because it messes with ssr
    !process.env.npm_package_dependencies_next &&
    process.env.TAMAGUI_TARGET !== 'native' &&
    process.env.IDENTIFY_TAGS !== 'false' &&
    (process.env.NODE_ENV === 'development' || process.env.DEBUG || process.env.IDENTIFY_TAGS)

  let loadedTamaguiConfig: TamaguiInternalConfig
  let hasLogged = false

  function isValidStyleKey(name: string, staticConfig: StaticConfigParsed) {
    return !!(
      !!staticConfig.validStyles?.[name] ||
      !!pseudos[name] ||
      // disable variants because caching at the variant level = less work
      // and expanding variants can get huge, i'm betting cost of many props
      // is more than cost of expanding variants once for cache
      // staticConfig.variants?.[name] ||
      loadedTamaguiConfig.shorthands[name] ||
      (name[0] === '$' ? !!mediaQueryConfig[name.slice(1)] : false)
    )
  }

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
        onStyleRule,
        getFlattenedNode,
        disable,
        disableExtraction,
        disableExtractInlineMedia,
        disableExtractVariables,
        disableDebugAttr,
        extractStyledDefinitions,
        prefixLogs,
        excludeProps,
        target,
        ...props
      }: ExtractorParseProps
    ) => {
      if (disable) {
        return null
      }
      if (sourcePath === '') {
        throw new Error(`Must provide a source file name`)
      }
      if (!Array.isArray(props.components)) {
        throw new Error(`Must provide components array with list of Tamagui component modules`)
      }

      const isTargetingHTML = target === 'html'
      const ogDebug = shouldPrintDebug
      const tm = timer()

      // we require it after parse because we need to set some global/env stuff before importing
      // otherwise we'd import `rnw` and cause it to evaluate react-native-web which causes errors
      const { components, tamaguiConfig } = loadTamagui({
        config,
        components: props.components || ['tamagui'],
      })

      if (shouldPrintDebug === 'verbose') {
        console.log('tamagui.config.ts:', { components, config })
      }

      tm.mark('load-tamagui', shouldPrintDebug === 'verbose')

      loadedTamaguiConfig = tamaguiConfig as any

      const proxiedTheme = proxyThemeVariables(
        tamaguiConfig.themes[Object.keys(tamaguiConfig.themes)[0]]
      )

      type AccessListener = (key: string) => void
      const themeAccessListeners = new Set<AccessListener>()
      const defaultTheme = new Proxy(proxiedTheme, {
        get(target, key) {
          if (key[0] === '$') {
            themeAccessListeners.forEach((cb) => cb(String(key)))
          }
          return Reflect.get(target, key)
        },
      })

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

      if (shouldPrintDebug === 'verbose') {
        console.log('validComponents', Object.keys(validComponents))
      }

      let doesUseValidImport = false
      let hasImportedTheme = false

      for (const bodyPath of body) {
        if (bodyPath.type !== 'ImportDeclaration') continue
        const node = ('node' in bodyPath ? bodyPath.node : bodyPath) as t.ImportDeclaration
        const from = node.source.value
        // if importing styled()
        if (extractStyledDefinitions) {
          if (from === '@tamagui/core' || from === 'tamagui') {
            if (
              node.specifiers.some((specifier) => {
                return specifier.local.name === 'styled'
              })
            ) {
              doesUseValidImport = true
              break
            }
          }
        }
        const isValidImport = props.components.includes(from) || isInternalImport(from)
        if (isValidImport) {
          const isValidComponent = node.specifiers.some((specifier) => {
            const name = specifier.local.name
            return !!(validComponents[name] || validHooks[name])
          })
          if (shouldPrintDebug === 'verbose') {
            console.log('import from', from, { isValidComponent })
          }
          if (isValidComponent) {
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

      tm.mark('import-check', shouldPrintDebug === 'verbose')

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
        styled: 0,
        flattened: 0,
        optimized: 0,
        modified: 0,
        found: 0,
      }

      callTraverse({
        Program: {
          enter(path) {
            programPath = path
          },
        },

        CallExpression(path) {
          if (disable || disableExtraction) {
            return
          }

          if (!t.isIdentifier(path.node.callee) || path.node.callee.name !== 'styled') {
            return
          }

          const name =
            t.isVariableDeclarator(path.parent) && t.isIdentifier(path.parent.id)
              ? path.parent.id.name
              : 'unknown'
          const definition = path.node.arguments[1]

          if (!name || !definition || !t.isObjectExpression(definition)) {
            return
          }

          const Component = validComponents[name] as
            | { staticConfig: StaticConfigParsed }
            | undefined

          if (!Component) {
            if (shouldPrintDebug) {
              console.log(
                `Didn't recognize styled(${name}), ${name} isn't in design system provided to tamagui.config.ts`
              )
            }
            return
          }

          const componentSkipProps = new Set([
            ...(Component.staticConfig.inlineWhenUnflattened || []),
            ...(Component.staticConfig.inlineProps || []),
            ...(Component.staticConfig.deoptProps || []),
          ])

          // for now dont parse variants, spreads, etc
          const skipped: (t.ObjectProperty | t.SpreadElement | t.ObjectMethod)[] = []
          const styles = {}

          // for now skip variants, will return to them
          const skipProps = {
            variants: true,
            defaultVariants: true,
            name: true,
          }

          // Generate scope object at this level
          const staticNamespace = getStaticBindingsForScope(
            path.scope,
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
                shouldPrintDebug,
              })
          const attemptEvalSafe = createSafeEvaluator(attemptEval)

          for (const property of definition.properties) {
            if (
              !t.isObjectProperty(property) ||
              !t.isIdentifier(property.key) ||
              skipProps[property.key.name] ||
              !isValidStyleKey(property.key.name, Component.staticConfig) ||
              componentSkipProps.has(property.key.name)
            ) {
              skipped.push(property)
              continue
            }
            // attempt eval
            const out = attemptEvalSafe(property.value)
            if (out === FAILED_EVAL) {
              skipped.push(property)
            } else {
              styles[property.key.name] = out
            }
          }

          // turn parsed styles into CSS
          const out = getSplitStyles(styles, Component.staticConfig, defaultTheme, {
            focus: false,
            hover: false,
            mounted: false,
            press: false,
            pressIn: false,
            resolveVariablesAs: 'variable',
          })

          const classNames = {
            ...out.classNames,
          }

          // add in the style object as classnames
          const atomics = getStylesAtomic(out.style)
          for (const atomic of atomics) {
            for (const rule of atomic.rules) {
              out.rulesToInsert.push([atomic.identifier, rule])
            }
            classNames[atomic.property] = atomic.identifier
          }

          // leave only un-parsed props...
          definition.properties = skipped

          // ... + key: className
          for (const cn in classNames) {
            const val = classNames[cn]
            definition.properties.push(t.objectProperty(t.stringLiteral(cn), t.stringLiteral(val)))
          }

          for (const [identifier, rule] of out.rulesToInsert) {
            onStyleRule?.(identifier, [rule])
          }

          res.styled++

          if (shouldPrintDebug) {
            console.log(`Extracted styled(${name}) props:`, styles)
          }
        },

        JSXElement(traversePath) {
          tm.mark('jsx-element', shouldPrintDebug === 'verbose')

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

          // found a valid tag
          res.found++

          const filePath = `./${relative(process.cwd(), sourcePath)}`
          const lineNumbers = node.loc
            ? node.loc.start.line +
              (node.loc.start.line !== node.loc.end.line ? `-${node.loc.end.line}` : '')
            : ''
          const tagId = [componentName, `${node.name.name}`, `${filePath}:${lineNumbers}`].filter(
            Boolean
          )

          // debug just one
          const debugPropValue = node.attributes
            .filter<t.JSXAttribute>(
              // @ts-ignore
              (n) => t.isJSXAttribute(n) && t.isJSXIdentifier(n.name) && n.name.name === 'debug'
            )
            .map((n) => {
              if (n.value === null) return true
              if (t.isStringLiteral(n.value)) return n.value.value as 'verbose'
              return false
            })[0]

          if (debugPropValue) {
            shouldPrintDebug = debugPropValue
          }

          try {
            node.attributes.find(
              (n) =>
                t.isJSXAttribute(n) &&
                t.isJSXIdentifier(n.name) &&
                n.name.name === 'debug' &&
                n.value === null
            )

            if (shouldPrintDebug) {
              console.log('\n')
              console.log('\x1b[33m%s\x1b[0m', `${tagId[0]} | ${tagId[2]} -------------------`)
              console.log('\x1b[1m', '\x1b[32m', `<${originalNodeName} />`)
            }

            // add data-is
            if (shouldAddDebugProp && !disableDebugAttr) {
              res.modified++
              node.attributes.unshift(
                t.jsxAttribute(t.jsxIdentifier('data-is'), t.stringLiteral(tagId.join(' ')))
              )
            }

            const shouldLog = !hasLogged
            if (shouldLog) {
              console.log(`  1️⃣  Inline optimized  2️⃣  Inline flattened  3️⃣  styled() extracted`)
              const prefix = '      |'
              // prettier-ignore
              console.log(prefixLogs || prefix, '                         total ·  1️⃣  ·  2️⃣  ·  3️⃣')
              hasLogged = true
            }
            if (disableExtraction) {
              return
            }

            const { staticConfig } = component
            const variants = staticConfig.variants || {}
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

            const inlineProps = new Set([
              ...(props.inlineProps || []),
              ...(staticConfig.inlineProps || []),
            ])

            const deoptProps = new Set([
              // always de-opt animation
              'animation',
              ...(props.deoptProps || []),
              ...(staticConfig.deoptProps || []),
            ])

            const inlineWhenUnflattened = new Set([...(staticConfig.inlineWhenUnflattened || [])])

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
            // const hasDeopt = (obj: Object) => {
            //   return Object.keys(obj).some(isDeoptedProp)
            // }

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
                if (arg !== undefined) {
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

            tm.mark('jsx-element-flattened', shouldPrintDebug === 'verbose')

            // set flattened
            node.attributes = flattenedAttrs

            let attrs: ExtractedAttr[] = []
            let shouldDeopt = false
            const inlined = new Map<string, any>()
            let hasSetOptimized = false
            const inlineWhenUnflattenedOGVals = {}

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
                  tm.mark('jsx-element-evaluate-attr', shouldPrintDebug === 'verbose')
                  if (!res) {
                    path.remove()
                  }
                  return res
                } catch (err: any) {
                  if (shouldPrintDebug) {
                    console.log('Error extracting attribute', err.message, err.stack)
                    console.log('node', path.node)
                  }
                  // dont flatten if we run into error
                  inlined.set(`${Math.random()}`, 'spread')
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
                if (shouldPrintDebug) {
                  console.log('  ! inlining, spread attr')
                }
                inlined.set(`${Math.random()}`, 'spread')
                return attr
              }

              const name = attribute.name.name

              if (excludeProps?.has(name)) {
                if (shouldPrintDebug) {
                  console.log('  excluding prop', name)
                }
                return null
              }

              if (inlineProps.has(name)) {
                inlined.set(name, name)
                if (shouldPrintDebug) {
                  console.log('  ! inlining, inline prop', name)
                }
                return attr
              }

              // can still optimize the object... see hoverStyle on native
              if (deoptProps.has(name)) {
                shouldDeopt = true
                inlined.set(name, name)
                if (shouldPrintDebug) {
                  console.log('  ! inlining, deopted prop', name)
                }
                return attr
              }

              // pass className, key, and style props through untouched
              if (UNTOUCHED_PROPS[name]) {
                return attr
              }

              if (INLINE_EXTRACTABLE[name]) {
                inlined.set(name, INLINE_EXTRACTABLE[name])
                return attr
              }

              if (name.startsWith('data-')) {
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
                inlined.set('ref', 'ref')
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
                      console.log(`  ! inlining, native disable extract: ${name} =`, value.value)
                    }
                    inlined.set(name, true)
                    return attr
                  }
                }
              }

              if (name === 'theme') {
                inlined.set('theme', attr.value)
                return attr
              }

              // if value can be evaluated, extract it and filter it out
              const styleValue = attemptEvalSafe(value)

              // never flatten if a prop isn't a valid static attribute
              // only post prop-mapping
              if (!variants[name] && !isValidStyleKey(name, staticConfig)) {
                let keys = [name]
                let out: any = null

                // for now passing empty props {}, a bit odd, need to at least document
                // for now we don't expose custom components so just noting behavior
                out = staticConfig.propMapper(
                  name,
                  styleValue,
                  defaultTheme,
                  staticConfig.defaultProps,
                  { resolveVariablesAs: 'auto' },
                  undefined,
                  shouldPrintDebug
                )
                if (out) {
                  if (!Array.isArray(out)) {
                    console.warn(`Error expected array but got`, out)
                    couldntParse = true
                    shouldDeopt = true
                  } else {
                    out = Object.fromEntries(out)
                    keys = Object.keys(out)
                  }
                }
                if (out) {
                  if (isTargetingHTML) {
                    // translate to DOM-compat
                    out = rnw.createDOMProps(isTextView ? 'span' : 'div', out)
                    // remove className - we dont use rnw styling
                    delete out.className
                  }

                  keys = Object.keys(out)
                }

                let didInline = false
                const attributes = keys.map((key) => {
                  const val = out[key]
                  if (isValidStyleKey(key, staticConfig)) {
                    return {
                      type: 'style',
                      value: { [key]: styleValue },
                      name: key,
                      attr: path.node,
                    } as const
                  }
                  if (
                    validHTMLAttributes[key] ||
                    key.startsWith('aria-') ||
                    key.startsWith('data-')
                  ) {
                    return attr
                  }
                  if (shouldPrintDebug) {
                    console.log('  ! inlining, non-static', key)
                  }
                  didInline = true
                  inlined.set(key, val)
                  return val
                })

                // weird logic whats going on here
                if (didInline) {
                  if (shouldPrintDebug) {
                    console.log('  bailing flattening due to attributes', attributes)
                  }
                  // bail
                  return attr
                }

                // return evaluated attributes
                return attributes
              }

              // FAILED = dynamic or ternary, keep going
              if (styleValue !== FAILED_EVAL) {
                if (inlineWhenUnflattened.has(name)) {
                  // preserve original value for restoration
                  inlineWhenUnflattenedOGVals[name] = { styleValue, attr }
                }

                if (isValidStyleKey(name, staticConfig)) {
                  if (shouldPrintDebug) {
                    console.log(`  style: ${name} =`, styleValue)
                  }
                  if (!(name in staticConfig.defaultProps)) {
                    if (!hasSetOptimized) {
                      res.optimized++
                      hasSetOptimized = true
                    }
                  }
                  return {
                    type: 'style',
                    value: { [name]: styleValue },
                    name,
                    attr: path.node,
                  }
                } else {
                  inlined.set(name, true)
                  return attr
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
                inlined.set(name, true)
                return attr
              }

              const staticConditional = getStaticConditional(value)
              if (staticConditional) {
                if (shouldPrintDebug === 'verbose') {
                  console.log(` static conditional ${name}`, value)
                }
                return { type: 'ternary', value: staticConditional }
              }

              const staticLogical = getStaticLogical(value)
              if (staticLogical) {
                if (shouldPrintDebug === 'verbose') {
                  console.log(` static ternary ${name} = `, value)
                }
                return { type: 'ternary', value: staticLogical }
              }

              // if we've made it this far, the prop stays inline
              inlined.set(name, true)
              if (shouldPrintDebug) {
                console.log(` ! inline no match ${name}`, value)
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

            function isExtractable(obj: t.Node): obj is t.ObjectExpression {
              return (
                t.isObjectExpression(obj) &&
                obj.properties.every((prop) => {
                  if (!t.isObjectProperty(prop)) {
                    console.log('not object prop', prop)
                    return false
                  }
                  const propName = prop.key['name']
                  if (!isValidStyleKey(propName, staticConfig) && propName !== 'tag') {
                    if (shouldPrintDebug) {
                      console.log('  not a valid style prop!', propName)
                    }
                    return false
                  }
                  return true
                })
              )
            }

            // side = {
            //   color: 'red',
            //   background: x ? 'red' : 'green',
            //   $gtSm: { color: 'green' }
            // }
            // => Ternary<test, { color: 'red' }, null>
            // => Ternary<test && x, { background: 'red' }, null>
            // => Ternary<test && !x, { background: 'green' }, null>
            // => Ternary<test && '$gtSm', { color: 'green' }, null>
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
                // handle media queries inside spread/conditional objects
                if (t.isIdentifier(property.key)) {
                  const key = property.key.name
                  const mediaQueryKey = key.slice(1)
                  const isMediaQuery = key[0] === '$' && mediaQueryConfig[mediaQueryKey]
                  if (isMediaQuery) {
                    if (t.isExpression(property.value)) {
                      const ternaries = createTernariesFromObjectProperties(
                        t.stringLiteral(mediaQueryKey),
                        property.value,
                        {
                          inlineMediaQuery: mediaQueryKey,
                        }
                      )
                      if (ternaries) {
                        return ternaries.map((value) => ({
                          ...ternaryPartial,
                          ...value,
                          // ensure media query test stays on left side (see getMediaQueryTernary)
                          test: t.logicalExpression('&&', value.test, test),
                        }))
                      } else {
                        console.log('⚠️ no ternaries?', property)
                      }
                    } else {
                      console.log('⚠️ not expression', property)
                    }
                  }
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

            // now update to new values
            node.attributes = attrs.filter(isAttr).map((x) => x.value)

            if (couldntParse || shouldDeopt) {
              if (shouldPrintDebug) {
                console.log(`  avoid optimizing:`, { couldntParse, shouldDeopt })
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

            // flatten logic!
            // fairly simple check to see if all children are text
            const hasSpread = node.attributes.some((x) => t.isJSXSpreadAttribute(x))

            const hasOnlyStringChildren =
              !hasSpread &&
              (node.selfClosing ||
                (traversePath.node.children &&
                  traversePath.node.children.every((x) => x.type === 'JSXText')))

            let themeVal = inlined.get('theme')
            inlined.delete('theme')
            const allOtherPropsExtractable = [...inlined].every(([k, v]) => INLINE_EXTRACTABLE[k])
            const shouldWrapThme = allOtherPropsExtractable && !!themeVal
            const canFlattenProps = inlined.size === 0 || shouldWrapThme || allOtherPropsExtractable

            let shouldFlatten =
              !shouldDeopt &&
              canFlattenProps &&
              !hasSpread &&
              staticConfig.neverFlatten !== true &&
              (staticConfig.neverFlatten === 'jsx' ? hasOnlyStringChildren : true)

            if (disableExtractVariables) {
              themeAccessListeners.add((key) => {
                shouldFlatten = false
                if (shouldPrintDebug) {
                  console.log(' ! accessing theme key, avoid flatten', key)
                }
              })
            }

            if (shouldPrintDebug) {
              // prettier-ignore
              console.log(' - flatten?', objToStr({ hasSpread, shouldDeopt, shouldFlatten, canFlattenProps, shouldWrapThme, allOtherPropsExtractable, hasOnlyStringChildren }))
            }

            // wrap theme around children on flatten
            if (shouldFlatten && shouldWrapThme) {
              if (shouldPrintDebug) {
                console.log('  - wrapping theme', allOtherPropsExtractable, themeVal)
              }

              // remove theme attribute from flattened node
              attrs = attrs.filter((x) =>
                x.type === 'attr' && t.isJSXAttribute(x.value) && x.value.name.name === 'theme'
                  ? false
                  : true
              )

              // add import
              if (!hasImportedTheme) {
                hasImportedTheme = true
                programPath.node.body.push(
                  t.importDeclaration(
                    [t.importSpecifier(t.identifier('_TamaguiTheme'), t.identifier('Theme'))],
                    t.stringLiteral('@tamagui/core')
                  )
                )
              }

              traversePath.replaceWith(
                t.jsxElement(
                  t.jsxOpeningElement(t.jsxIdentifier('_TamaguiTheme'), [
                    t.jsxAttribute(t.jsxIdentifier('name'), themeVal.value),
                  ]),
                  t.jsxClosingElement(t.jsxIdentifier('_TamaguiTheme')),
                  [traversePath.node]
                )
              )
            }

            // only if we flatten, ensure the default styles are there
            if (shouldFlatten && staticConfig.defaultProps) {
              const defaultStyleAttrs = Object.keys(staticConfig.defaultProps).flatMap((key) => {
                if (!isValidStyleKey(key, staticConfig)) {
                  return []
                }
                const value = staticConfig.defaultProps[key]
                const name = tamaguiConfig.shorthands[key] || key
                if (value === undefined) {
                  console.warn(
                    `⚠️ Error evaluating default style for component, prop ${key} ${value}`
                  )
                  shouldDeopt = true
                  return
                }
                const attr: ExtractedAttrStyle = {
                  type: 'style',
                  name,
                  value: { [name]: value },
                }
                return attr
              }) as ExtractedAttr[]

              if (defaultStyleAttrs.length) {
                attrs = [...defaultStyleAttrs, ...attrs]
              }
            }

            if (shouldDeopt) {
              node.attributes = ogAttributes
              return
            }

            // insert overrides - this inserts null props for things that are set in classNames
            // only when not flattening, so the downstream component can skip applying those styles
            const ensureOverridden = {}
            if (!shouldFlatten) {
              for (const cur of attrs) {
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
                        ensureOverridden[key] = true
                      }
                    }
                  }
                }
              }
            }

            if (shouldPrintDebug) {
              console.log('  - attrs (flattened): \n', logLines(attrs.map(attrStr).join(', ')))
              console.log('  - ensureOverriden:', Object.keys(ensureOverridden).join(', '))
            }

            // expand shorthands, de-opt variables
            attrs = attrs.reduce<ExtractedAttr[]>((acc, cur) => {
              if (!cur) return acc
              if (cur.type === 'attr' && !t.isJSXSpreadAttribute(cur.value)) {
                if (shouldFlatten) {
                  if (cur.value.name.name === 'tag') {
                    // remove tag=""
                    return acc
                  }
                }
              }
              if (cur.type !== 'style') {
                acc.push(cur)
                return acc
              }

              let key = Object.keys(cur.value)[0]
              const value = cur.value[key]
              const fullKey = tamaguiConfig.shorthands[key]
              // expand shorthands
              if (fullKey) {
                cur.value = { [fullKey]: value }
                key = fullKey
              }

              // finally we have all styles + expansions, lets see if we need to skip
              // any and keep them as attrs
              if (disableExtractVariables) {
                if (value[0] === '$') {
                  if (shouldPrintDebug) {
                    console.log(`   keeping variable inline: ${key} =`, value)
                  }
                  acc.push({
                    type: 'attr',
                    value: t.jsxAttribute(
                      t.jsxIdentifier(key),
                      t.jsxExpressionContainer(t.stringLiteral(value))
                    ),
                  })
                  return acc
                }
              }

              acc.push(cur)
              return acc
            }, [])

            tm.mark('jsx-element-expanded', shouldPrintDebug === 'verbose')
            if (shouldPrintDebug) {
              console.log('  - attrs (expanded): \n', logLines(attrs.map(attrStr).join(', ')))
            }

            // merge styles, leave undefined values
            let prev: ExtractedAttr | null = null

            function mergeStyles(prev: ViewStyle & PseudoStyles, next: ViewStyle & PseudoStyles) {
              normalizeStyleObject(next)
              for (const key in next) {
                // merge pseudos
                if (pseudos[key]) {
                  prev[key] = prev[key] || {}
                  if (shouldPrintDebug) {
                    if (!next[key] || !prev[key]) {
                      console.log('warn: missing', key, prev, next)
                    }
                  }
                  Object.assign(prev[key], next[key])
                } else {
                  prev[key] = next[key]
                }
              }
            }

            attrs = attrs.reduce<ExtractedAttr[]>((acc, cur) => {
              if (cur.type === 'style') {
                const key = Object.keys(cur.value)[0]
                const value = cur.value[key]

                const shouldKeepOriginalAttr =
                  // !isStyleAndAttr[key] &&
                  !shouldFlatten &&
                  // de-opt transform styles so it merges properly if not flattened
                  // we handle this later on
                  // (stylePropsTransform[key] ||
                  // de-opt if non-style
                  !validStyles[key] &&
                  !pseudos[key] &&
                  !key.startsWith('data-')

                if (shouldKeepOriginalAttr) {
                  if (shouldPrintDebug) {
                    console.log('     - keeping as non-style', key)
                  }
                  prev = cur
                  acc.push({
                    type: 'attr',
                    value: t.jsxAttribute(
                      t.jsxIdentifier(key),
                      t.jsxExpressionContainer(
                        typeof value === 'string' ? t.stringLiteral(value) : literalToAst(value)
                      )
                    ),
                  })
                  acc.push(cur)
                  return acc
                }

                if (ensureOverridden[key]) {
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

                if (prev?.type === 'style') {
                  mergeStyles(prev.value, cur.value)
                  return acc
                }
              }

              prev = cur
              acc.push(cur)
              return acc
            }, [])

            const state = {
              noClassNames: false,
              focus: false,
              hover: false,
              mounted: true, // TODO match logic in createComponent
              press: false,
              pressIn: false,
            }

            // evaluates all static attributes into a simple object
            let foundStaticProps = {}
            for (const key in attrs) {
              const cur = attrs[key]
              if (cur.type === 'style') {
                normalizeStyleObject(cur.value)
                foundStaticProps = {
                  ...foundStaticProps,
                  ...expandStyles(cur.value),
                }
                continue
              }
              if (cur.type === 'attr') {
                if (t.isJSXSpreadAttribute(cur.value)) {
                  continue
                }
                if (!t.isJSXIdentifier(cur.value.name)) {
                  continue
                }
                const key = cur.value.name.name
                // undefined = boolean true
                const value = attemptEvalSafe(cur.value.value || t.booleanLiteral(true))
                if (value !== FAILED_EVAL) {
                  foundStaticProps = {
                    ...foundStaticProps,
                    [key]: value,
                  }
                }
              }
            }

            // must preserve exact order
            const completeProps = {}
            for (const key in staticConfig.defaultProps) {
              if (!(key in foundStaticProps)) {
                completeProps[key] = staticConfig.defaultProps[key]
              }
            }
            for (const key in foundStaticProps) {
              completeProps[key] = foundStaticProps[key]
            }

            if (shouldPrintDebug) {
              console.log('  - attrs (combined 🔀): \n', logLines(attrs.map(attrStr).join(', ')))
              console.log('  - defaultProps: \n', logLines(objToStr(staticConfig.defaultProps)))
              // prettier-ignore
              console.log('  - foundStaticProps: \n', logLines(objToStr(foundStaticProps)))
              console.log('  - completeProps: \n', logLines(objToStr(completeProps)))
            }

            // post process
            const getStyles = (props: Object | null, debugName = '') => {
              if (!props || !Object.keys(props).length) {
                if (shouldPrintDebug) console.log(' getStyles() no props')
                return {}
              }
              if (excludeProps && !!excludeProps.size) {
                for (const key in props) {
                  if (excludeProps.has(key)) {
                    if (shouldPrintDebug) console.log(' delete excluded', key)
                    delete props[key]
                  }
                }
              }
              try {
                const out = getSplitStyles(
                  props,
                  staticConfig,
                  defaultTheme,
                  {
                    ...state,
                    fallbackProps: completeProps,
                  },
                  undefined,
                  props['debug']
                )

                // console.log('outout', out)

                const outStyle = {
                  ...out.style,
                  ...out.pseudos,
                }
                // omitInvalidStyles(outStyle)
                // if (shouldPrintDebug) {
                //   // prettier-ignore
                //   console.log(`       getStyles ${debugName} (props):\n`, logLines(objToStr(props)))
                //   // prettier-ignore
                //   console.log(`       getStyles ${debugName} (out.viewProps):\n`, logLines(objToStr(out.viewProps)))
                //   // prettier-ignore
                //   console.log(`       getStyles ${debugName} (out.style):\n`, logLines(objToStr(outStyle || {}), true))
                // }
                return outStyle
              } catch (err: any) {
                console.log('error', err.message, err.stack)
                return {}
              }
            }

            function omitInvalidStyles(style: any) {
              if (staticConfig.validStyles) {
                for (const key in style) {
                  if (
                    stylePropsTransform[key] ||
                    (!staticConfig.validStyles[key] &&
                      !pseudos[key] &&
                      !/(hoverStyle|focusStyle|pressStyle)$/.test(key))
                  ) {
                    if (shouldPrintDebug) console.log(' delete invalid style', key)
                    delete style[key]
                  }
                }
              }
            }

            // used to ensure we pass the entire prop bundle to getStyles
            const completeStyles = getStyles(completeProps, 'completeStyles')

            if (!completeStyles) {
              throw new Error(`Impossible, no styles`)
            }

            // any extra styles added in postprocess should be added to first group as they wont be overriden
            const addInitialStyleKeys = shouldFlatten
              ? difference(Object.keys(completeStyles), Object.keys(foundStaticProps))
              : []

            if (addInitialStyleKeys.length) {
              const toAdd = pick(completeStyles, ...addInitialStyleKeys)
              const firstGroup = attrs.find((x) => x.type === 'style')
              if (shouldPrintDebug) {
                console.log('    toAdd', objToStr(toAdd))
              }
              if (!firstGroup) {
                attrs.unshift({ type: 'style', value: toAdd })
              } else {
                // because were adding fully processed, remove any unprocessed from first group
                omitInvalidStyles(firstGroup.value)
                Object.assign(firstGroup.value, toAdd)
              }
            }

            if (shouldPrintDebug) {
              // prettier-ignore
              if (shouldFlatten) console.log('   -- addInitialStyleKeys', addInitialStyleKeys.join(', '))
              // prettier-ignore
              // console.log('   -- completeStyles:\n', logLines(objToStr(completeStyles)))
            }

            let getStyleError: any = null

            // fix up ternaries, combine final style values
            for (const attr of attrs) {
              try {
                switch (attr.type) {
                  case 'ternary':
                    const a = getStyles(attr.value.alternate, 'ternary.alternate')
                    const c = getStyles(attr.value.consequent, 'ternary.consequent')
                    if (a) attr.value.alternate = a
                    if (c) attr.value.consequent = c
                    if (shouldPrintDebug) console.log('     => tern ', attrStr(attr))
                    continue
                  case 'style':
                    // expand variants and such
                    const styles = getStyles(attr.value, 'style')
                    if (styles) {
                      attr.value = styles
                    }
                    // prettier-ignore
                    if (shouldPrintDebug) console.log('  * styles (in)', logLines(objToStr(attr.value)), ' (out)', logLines(objToStr(styles)))
                    continue
                }
              } catch (err) {
                // any error de-opt
                getStyleError = err
              }
            }

            if (shouldPrintDebug) {
              // prettier-ignore
              console.log('  - attrs (ternaries/combined):\n', logLines(attrs.map(attrStr).join(', ')))
            }

            tm.mark('jsx-element-styles', shouldPrintDebug === 'verbose')

            if (getStyleError) {
              console.log(' ⚠️ postprocessing error, deopt', getStyleError)
              node.attributes = ogAttributes
              return node
            }

            // final lazy extra loop:
            const existingStyleKeys = new Set()
            for (let i = attrs.length - 1; i >= 0; i--) {
              const attr = attrs[i]

              // if flattening map inline props to proper flattened names
              if (shouldFlatten && canFlattenProps) {
                if (attr.type === 'attr') {
                  if (t.isJSXAttribute(attr.value)) {
                    if (t.isJSXIdentifier(attr.value.name)) {
                      const name = attr.value.name.name
                      if (INLINE_EXTRACTABLE[name]) {
                        // map to HTML only name
                        attr.value.name.name = INLINE_EXTRACTABLE[name]
                      }
                    }
                  }
                }
              }

              // remove duplicate styles
              // so if you have:
              //   style({ color: 'red' }), ...someProps, style({ color: 'green' })
              // this will mutate:
              //   style({}), ...someProps, style({ color: 'green' })
              if (attr.type === 'style') {
                for (const key in attr.value) {
                  if (existingStyleKeys.has(key)) {
                    if (shouldPrintDebug) {
                      console.log('  >> delete existing', key)
                    }
                    delete attr.value[key]
                  } else {
                    existingStyleKeys.add(key)
                  }
                }
              }
            }

            // inlineWhenUnflattened
            if (!shouldFlatten) {
              if (Object.keys(inlineWhenUnflattenedOGVals).length) {
                for (const [index, attr] of attrs.entries()) {
                  if (attr.type === 'style') {
                    for (const key in attr.value) {
                      const val = inlineWhenUnflattenedOGVals[key]
                      if (val) {
                        // delete the style
                        delete attr.value[key]

                        // and insert it before
                        attrs.splice(index - 1, 0, val.attr)
                      }
                    }
                  }
                }
              }
            }

            if (shouldFlatten) {
              // DO FLATTEN
              if (shouldPrintDebug) {
                console.log('  [✅] flattening', originalNodeName, flatNode)
              }
              node.name.name = flatNode
              res.flattened++
              if (closingElement) {
                closingElement.name.name = flatNode
              }
            }

            if (shouldPrintDebug) {
              // prettier-ignore
              console.log(` ❊❊ inline props (${inlined.size}):`, shouldDeopt ? ' deopted' : '', hasSpread ? ' has spread' : '', staticConfig.neverFlatten ? 'neverFlatten' : '')
              console.log('  - attrs (end):\n', logLines(attrs.map(attrStr).join(', ')))
            }

            onExtractTag({
              attrs,
              node,
              lineNumbers,
              filePath,
              attemptEval,
              jsxPath: traversePath,
              originalNodeName,
              isFlattened: shouldFlatten,
              programPath,
            })
          } catch (err) {
            throw err
          } finally {
            if (debugPropValue) {
              shouldPrintDebug = ogDebug
            }
          }
        },
      })

      tm.mark('jsx-done', shouldPrintDebug === 'verbose')

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

      tm.done(shouldPrintDebug === 'verbose')

      return res
    },
  }
}
