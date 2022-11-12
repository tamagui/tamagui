/* eslint-disable no-console */
import { basename, relative } from 'path'

import traverse, { NodePath, TraverseOptions } from '@babel/traverse'
import * as t from '@babel/types'
import {
  PseudoStyles,
  StaticConfigParsed,
  expandStyles,
  getSplitStyles,
  mediaQueryConfig,
  proxyThemeVariables,
  pseudoDescriptors,
} from '@tamagui/core-node'
import type { ViewStyle } from 'react-native'
import { createDOMProps } from 'react-native-web-internals'

import { FAILED_EVAL } from '../constants.js'
import type {
  ExtractedAttr,
  ExtractedAttrAttr,
  ExtractedAttrStyle,
  ExtractorOptions,
  ExtractorParseProps,
  TamaguiOptions,
  TamaguiOptionsWithFileInfo,
  Ternary,
} from '../types.js'
import { createEvaluator, createSafeEvaluator } from './createEvaluator.js'
import { evaluateAstNode } from './evaluateAstNode.js'
import {
  attrStr,
  findComponentName,
  getValidComponent,
  getValidImport,
  isPresent,
  isValidImport,
  objToStr,
} from './extractHelpers.js'
import { findTopmostFunction } from './findTopmostFunction.js'
import { getPrefixLogs } from './getPrefixLogs.js'
import { cleanupBeforeExit, getStaticBindingsForScope } from './getStaticBindingsForScope.js'
import { literalToAst } from './literalToAst.js'
import { TamaguiProjectInfo, loadTamagui, loadTamaguiSync } from './loadTamagui.js'
import { logLines } from './logLines.js'
import { normalizeTernaries } from './normalizeTernaries.js'
import { removeUnusedHooks } from './removeUnusedHooks.js'
import { timer } from './timer.js'
import { validHTMLAttributes } from './validHTMLAttributes.js'

const UNTOUCHED_PROPS = {
  key: true,
  style: true,
  className: true,
}

const INLINE_EXTRACTABLE = {
  ref: 'ref',
  key: 'key',
  ...(process.env.TAMAGUI_TARGET === 'web' && {
    onPress: 'onClick',
    onHoverIn: 'onMouseEnter',
    onHoverOut: 'onMouseLeave',
    onPressIn: 'onMouseDown',
    onPressOut: 'onMouseUp',
  }),
}

const validHooks = {
  useMedia: true,
  useTheme: true,
}

const isAttr = (x: ExtractedAttr): x is ExtractedAttrAttr => x.type === 'attr'
const createTernary = (x: Ternary) => x

export type Extractor = ReturnType<typeof createExtractor>

type FileOrPath = NodePath<t.Program> | t.File

let hasLoggedBaseInfo = false

export function createExtractor({ logger = console }: ExtractorOptions = { logger: console }) {
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

  let projectInfo: TamaguiProjectInfo | null = null

  // we load tamagui delayed because we need to set some global/env stuff before importing
  // otherwise we'd import `rnw` and cause it to evaluate react-native-web which causes errors

  function loadSync(props: TamaguiOptions) {
    return (projectInfo ||= loadTamaguiSync({
      config: props.config || 'tamagui.config.ts',
      components: props.components || ['tamagui'],
    }))
  }

  async function load(props: TamaguiOptions) {
    return (projectInfo ||= await loadTamagui({
      config: props.config || 'tamagui.config.ts',
      components: props.components || ['tamagui'],
    }))
  }

  return {
    options: {
      logger,
    },
    cleanupBeforeExit,
    loadTamagui: load,
    loadTamaguiSync: loadSync,
    getTamagui() {
      return projectInfo?.tamaguiConfig
    },
    parseSync: (f: FileOrPath, props: ExtractorParseProps) => {
      const projectInfo = loadSync(props)
      return parseWithConfig(projectInfo, f, props)
    },
    parse: async (f: FileOrPath, props: ExtractorParseProps) => {
      const projectInfo = await load(props)
      return parseWithConfig(projectInfo, f, props)
    },
  }

  function parseWithConfig(
    { components, tamaguiConfig }: TamaguiProjectInfo,
    fileOrPath: FileOrPath,
    options: ExtractorParseProps
  ) {
    const {
      config = 'tamagui.config.ts',
      importsWhitelist = ['constants.js'],
      evaluateVars = true,
      sourcePath = '',
      onExtractTag,
      onStyleRule,
      getFlattenedNode,
      disable,
      disableExtraction,
      disableExtractInlineMedia,
      disableExtractVariables,
      disableDebugAttr,
      disableExtractFoundComponents,
      includeExtensions = ['.tsx', '.jsx'],
      extractStyledDefinitions = false,
      prefixLogs,
      excludeProps,
      target,
      ...restProps
    } = options

    let shouldPrintDebug = options.shouldPrintDebug || false

    if (disable === true || (Array.isArray(disable) && disable.includes(sourcePath))) {
      return null
    }
    if (sourcePath === '') {
      throw new Error(`Must provide a source file name`)
    }
    if (!components) {
      throw new Error(`Must provide components`)
    }
    if (includeExtensions && !includeExtensions.some((ext) => sourcePath.endsWith(ext))) {
      if (shouldPrintDebug) {
        logger.info(
          `Ignoring file due to includeExtensions: ${sourcePath}, includeExtensions: ${includeExtensions.join(
            ', '
          )}`
        )
      }
      return null
    }

    function isValidStyleKey(name: string, staticConfig: StaticConfigParsed) {
      if (!projectInfo) {
        throw new Error(`Tamagui extractor not loaded yet`)
      }

      console.log('checking', name, target, Object.keys(mediaQueryConfig)[0])

      if (target === 'native' && name[0] === '$' && mediaQueryConfig[name.slice(1)]) {
        return false
      }
      return !!(
        !!staticConfig.validStyles?.[name] ||
        !!pseudoDescriptors[name] ||
        // dont disable variants or else you lose many things flattening
        staticConfig.variants?.[name] ||
        projectInfo?.tamaguiConfig.shorthands[name] ||
        (name[0] === '$' ? !!mediaQueryConfig[name.slice(1)] : false)
      )
    }

    /**
     * Step 1: Determine if importing any statically extractable components
     */

    const isTargetingHTML = target === 'html'
    const ogDebug = shouldPrintDebug
    const tm = timer()
    const propsWithFileInfo: TamaguiOptionsWithFileInfo = {
      ...options,
      sourcePath,
      allLoadedComponents: [...components],
    }

    if (!hasLoggedBaseInfo) {
      hasLoggedBaseInfo = true
      if (shouldPrintDebug) {
        logger.info(
          [
            'loaded components:',
            propsWithFileInfo.allLoadedComponents
              .map((comp) => Object.keys(comp.nameToInfo).join(', '))
              .join(', '),
          ].join(' ')
        )
      }
      if (process.env.DEBUG?.startsWith('tamagui')) {
        const next = [...propsWithFileInfo.allLoadedComponents].map((info) => {
          const nameToInfo = { ...info.nameToInfo }
          for (const key in nameToInfo) {
            delete nameToInfo[key].staticConfig.validStyles
          }
          return { ...info, nameToInfo }
        })
        logger.info(['loaded:', JSON.stringify(next, null, 2)].join('\n'))
      }
    }

    tm.mark('load-tamagui', !!shouldPrintDebug)

    const firstThemeName = Object.keys(tamaguiConfig.themes)[0]
    const firstTheme = tamaguiConfig.themes[firstThemeName]

    if (!firstTheme || typeof firstTheme !== 'object') {
      console.error(`Missing theme, an error occurred when importing your config`)
      console.log(`Got config:`, tamaguiConfig)
      console.log(`Looking for theme:`, firstThemeName)
      process.exit(0)
    }

    const proxiedTheme = proxyThemeVariables(firstTheme)
    type AccessListener = (key: string) => void
    const themeAccessListeners = new Set<AccessListener>()
    const defaultTheme = new Proxy(proxiedTheme, {
      get(target, key) {
        if (Reflect.has(target, key)) {
          themeAccessListeners.forEach((cb) => cb(String(key)))
        }
        return Reflect.get(target, key)
      },
    })

    // @ts-ignore
    const body = fileOrPath.type === 'Program' ? fileOrPath.get('body') : fileOrPath.program.body

    if (Object.keys(components).length === 0) {
      console.warn(`Warning: Tamagui didn't find any valid components (DEBUG=tamagui for more)`)
      if (process.env.DEBUG === 'tamagui') {
        console.log(`components`, Object.keys(components), components)
      }
    }

    if (shouldPrintDebug === 'verbose') {
      logger.info(
        `allLoadedComponent modules ${propsWithFileInfo.allLoadedComponents
          .map((k) => k.moduleName)
          .join(', ')}`
      )
    }

    let doesUseValidImport = false
    let hasImportedTheme = false

    const importDeclarations: t.ImportDeclaration[] = []

    for (const bodyPath of body) {
      if (bodyPath.type !== 'ImportDeclaration') continue
      const node = ('node' in bodyPath ? bodyPath.node : bodyPath) as t.ImportDeclaration
      const moduleName = node.source.value

      // if importing valid module
      const valid = isValidImport(propsWithFileInfo, moduleName)

      if (valid) {
        importDeclarations.push(node)
      }

      if (extractStyledDefinitions) {
        if (valid) {
          if (node.specifiers.some((specifier) => specifier.local.name === 'styled')) {
            doesUseValidImport = true
            break
          }
        }
      }

      if (valid) {
        const names = node.specifiers.map((specifier) => specifier.local.name)
        const isValidComponent = names.some((name) =>
          Boolean(isValidImport(propsWithFileInfo, moduleName, name) || validHooks[name])
        )
        if (shouldPrintDebug === 'verbose') {
          logger.info(
            `import ${names.join(', ')} from ${moduleName} isValidComponent ${isValidComponent}`
          )
        }
        if (isValidComponent) {
          doesUseValidImport = true
          break
        }
      }
    }

    if (shouldPrintDebug) {
      logger.info(`file: ${sourcePath} ${JSON.stringify({ doesUseValidImport, hasImportedTheme })}`)
    }

    if (!doesUseValidImport) {
      return null
    }

    function getValidImportedComponent(componentName: string) {
      const importDeclaration = importDeclarations.find((dec) =>
        dec.specifiers.some((spec) => spec.local.name === componentName)
      )
      if (!importDeclaration) {
        return null
      }
      return getValidImport(propsWithFileInfo, importDeclaration.source.value, componentName)
    }

    tm.mark('import-check', !!shouldPrintDebug)

    let couldntParse = false
    const modifiedComponents = new Set<NodePath<any>>()

    // only keeping a cache around per-file, reset it if it changes
    const bindingCache: Record<string, string | null> = {}

    const callTraverse = (a: TraverseOptions<any>) => {
      return fileOrPath.type === 'File' ? traverse(fileOrPath, a) : fileOrPath.traverse(a)
    }

    const shouldDisableExtraction =
      disableExtraction === true ||
      (Array.isArray(disableExtraction) && disableExtraction.includes(sourcePath))

    /**
     * Step 2: Statically extract from JSX < /> nodes
     */
    let programPath: NodePath<t.Program> | null = null

    const res = {
      styled: 0,
      flattened: 0,
      optimized: 0,
      modified: 0,
      found: 0,
    }

    callTraverse({
      // @ts-ignore
      Program: {
        enter(path) {
          programPath = path
        },
      },

      // styled() calls
      CallExpression(path) {
        if (disable || shouldDisableExtraction || extractStyledDefinitions === false) {
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

        let Component = getValidImportedComponent(name)

        if (!Component) {
          if (disableExtractFoundComponents === true) {
            return
          }
          if (
            Array.isArray(disableExtractFoundComponents) &&
            disableExtractFoundComponents.includes(name)
          ) {
            return
          }

          try {
            if (shouldPrintDebug) {
              logger.info(`Unknown component ${name}, attempting dynamic load: ${sourcePath}`)
            }

            const out = loadTamaguiSync({
              forceExports: true,
              components: [sourcePath],
            })

            if (!out?.components) {
              if (shouldPrintDebug) {
                logger.info(`Couldn't load, got ${out}`)
              }
              return
            }

            propsWithFileInfo.allLoadedComponents = [
              ...propsWithFileInfo.allLoadedComponents,
              ...out.components,
            ]

            Component = out.components.flatMap((x) => x.nameToInfo[name] ?? [])[0]

            if (shouldPrintDebug === 'verbose') {
              logger.info([`Tamagui Loaded`, JSON.stringify(out.components), !!Component].join(' '))
            }
          } catch (err: any) {
            if (shouldPrintDebug) {
              logger.info(
                `${getPrefixLogs(
                  options
                )} skip optimize styled(${name}), unable to pre-process (DEBUG=tamagui for more)`
              )
            }
            if (process.env.DEBUG === 'tamagui') {
              logger.info(
                ` Disable this with "disableExtractFoundComponents" in your build-time configuration. \n\n ${err.message} ${err.stack}`
              )
            }
          }
        }

        if (!Component) {
          return
        }

        const componentSkipProps = new Set([
          ...(Component.staticConfig.inlineWhenUnflattened || []),
          ...(Component.staticConfig.inlineProps || []),
          ...(Component.staticConfig.deoptProps || []),
          // for now skip variants, will return to them
          'variants',
          'defaultVariants',
          // skip fontFamily its basically a "variant", important for theme use to be value always
          'fontFamily',
          'name',
        ])

        // for now dont parse variants, spreads, etc
        const skipped: (t.ObjectProperty | t.SpreadElement | t.ObjectMethod)[] = []
        const styles = {}

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
              props: propsWithFileInfo,
              staticNamespace,
              sourcePath,
              shouldPrintDebug,
            })
        const attemptEvalSafe = createSafeEvaluator(attemptEval)

        for (const property of definition.properties) {
          if (
            !t.isObjectProperty(property) ||
            !t.isIdentifier(property.key) ||
            !isValidStyleKey(property.key.name, Component.staticConfig) ||
            // skip variants
            Component.staticConfig.variants?.[property.key.name] ||
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

        const out = getSplitStyles(styles, Component.staticConfig, defaultTheme, {
          focus: false,
          hover: false,
          mounted: false,
          press: false,
          pressIn: false,
          resolveVariablesAs: 'variable',
          noClassNames: false,
        })

        const classNames = {
          ...out.classNames,
        }

        if (shouldPrintDebug) {
          // prettier-ignore
          logger.info([`Extracted styled(${name})\n`, JSON.stringify(styles, null, 2), '\n  rulesToInsert:', out.rulesToInsert.flatMap((rule) => rule.rules).join('\n')].join(' '))
        }

        // leave only un-parsed props...
        definition.properties = skipped

        // ... + key: className
        for (const cn in classNames) {
          if (componentSkipProps.has(cn)) {
            continue
          }
          const val = classNames[cn]
          definition.properties.push(t.objectProperty(t.stringLiteral(cn), t.stringLiteral(val)))
        }

        if (out.rulesToInsert) {
          for (const { identifier, rules } of out.rulesToInsert) {
            onStyleRule?.(identifier, rules)
          }
        }

        res.styled++

        if (shouldPrintDebug) {
          logger.info(`Extracted styled(${name})`)
        }
      },

      JSXElement(traversePath) {
        if (shouldDisableExtraction) {
          return
        }

        tm.mark('jsx-element', !!shouldPrintDebug)

        const node = traversePath.node.openingElement
        const ogAttributes = node.attributes.map((attr) => ({ ...attr }))
        const componentName = findComponentName(traversePath.scope)
        const closingElement = traversePath.node.closingElement

        // skip non-identifier opening elements (member expressions, etc.)
        if (t.isJSXMemberExpression(closingElement?.name) || !t.isJSXIdentifier(node.name)) {
          return
        }

        // validate its a proper import from tamagui (or internally inside tamagui)
        const binding = traversePath.scope.getBinding(node.name.name)
        let modulePath = ''

        if (binding) {
          if (!t.isImportDeclaration(binding.path.parent)) {
            if (shouldPrintDebug) {
              logger.info(` - Binding not import declaration, skip`)
            }
            return
          }
          modulePath = binding.path.parent.source.value
          if (!isValidImport(propsWithFileInfo, modulePath, binding.identifier.name)) {
            if (shouldPrintDebug) {
              logger.info(` - Binding not internal import or from components ${modulePath}`)
            }
            return
          }
        }

        const component = getValidComponent(propsWithFileInfo, modulePath, node.name.name)
        if (!component || !component.staticConfig) {
          if (shouldPrintDebug) {
            logger.info(` - No Tamagui conf on this: ${node.name.name}`)
          }
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

        const codePosition = `${filePath}:${lineNumbers}`

        // debug just one
        const debugPropValue = node.attributes
          .filter(
            (n) => t.isJSXAttribute(n) && t.isJSXIdentifier(n.name) && n.name.name === 'debug'
          )
          // @ts-ignore
          .map((n: t.JSXAttribute) => {
            if (n.value === null) return true
            if (t.isStringLiteral(n.value)) return n.value.value as 'verbose'
            return false
          })[0] as boolean | 'verbose' | undefined

        if (debugPropValue) {
          shouldPrintDebug = debugPropValue
        }

        if (shouldPrintDebug) {
          logger.info('\n')
          logger.info(
            `\x1b[33m%s\x1b[0m ` + `${componentName} | ${codePosition} -------------------`
          )
          // prettier-ignore
          logger.info(['\x1b[1m', '\x1b[32m', `<${originalNodeName} />`, disableDebugAttr ? '' : '🐛'].join(' '))
        }

        // add data-* debug attributes
        if (shouldAddDebugProp && !disableDebugAttr) {
          res.modified++
          node.attributes.unshift(
            t.jsxAttribute(t.jsxIdentifier('data-is'), t.stringLiteral(node.name.name))
          )
          if (componentName) {
            node.attributes.unshift(
              t.jsxAttribute(t.jsxIdentifier('data-in'), t.stringLiteral(componentName))
            )
          }

          node.attributes.unshift(
            t.jsxAttribute(
              t.jsxIdentifier('data-at'),
              t.stringLiteral(`${basename(filePath)}:${lineNumbers}`)
            )
          )
        }

        // disable as it gets messy
        // const shouldLog = !hasLogged
        // if (shouldLog) {
        //   logger.info(`  1️⃣  Inline optimized  2️⃣  Inline flattened  3️⃣  styled() extracted`)
        //   const prefix = '      |'
        //   // prettier-ignore
        //   logger.info([prefixLogs || prefix, '                         total ·  1️⃣  ·  2️⃣  ·  3️⃣'].join(' '))
        //   hasLogged = true
        // }

        if (disableExtraction) {
          return
        }

        try {
          const { staticConfig } = component
          const variants = staticConfig.variants || {}
          const isTextView = staticConfig.isText || false
          const validStyles = staticConfig?.validStyles ?? {}

          // find tag="a" tag="main" etc dom indicators
          let tagName = staticConfig.defaultProps.tag ?? (isTextView ? 'span' : 'div')
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

          const flatNode = getFlattenedNode?.({ isTextView, tag: tagName })

          const inlineProps = new Set([
            ...(restProps.inlineProps || []),
            ...(staticConfig.inlineProps || []),
          ])

          const deoptProps = new Set([
            // always de-opt animation
            'animation',
            ...(restProps.deoptProps || []),
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
                props: propsWithFileInfo,
                staticNamespace,
                sourcePath,
                traversePath,
                shouldPrintDebug,
              })
          const attemptEvalSafe = createSafeEvaluator(attemptEval)

          if (shouldPrintDebug) {
            logger.info(`  staticNamespace ${Object.keys(staticNamespace).join(', ')}`)
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
                  logger.info(['  couldnt parse spread', e.message].join(' '))
                }
                flattenedAttrs.push(attr)
                return
              }
              if (arg !== undefined) {
                try {
                  if (typeof arg !== 'object' || arg == null) {
                    if (shouldPrintDebug) {
                      logger.info(['  non object or null arg', arg].join(' '))
                    }
                    flattenedAttrs.push(attr)
                  } else {
                    for (const k in arg) {
                      const value = arg[k]
                      // this is a null prop:
                      if (!value && typeof value === 'object') {
                        logger.error(['Unhandled null prop', k, value, arg].join(' '))
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
                  logger.warn(`cant parse spread, caught err ${err}`)
                  couldntParse = true
                }
              }
            })

          if (couldntParse) {
            return
          }

          tm.mark('jsx-element-flattened', !!shouldPrintDebug)

          // set flattened
          node.attributes = flattenedAttrs

          let attrs: ExtractedAttr[] = []
          let shouldDeopt = false
          const inlined = new Map<string, any>()
          const variantValues = new Map<string, any>()
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
                tm.mark('jsx-element-evaluate-attr', !!shouldPrintDebug)
                if (!res) {
                  path.remove()
                }
                return res
              } catch (err: any) {
                if (shouldPrintDebug) {
                  logger.info(
                    [
                      'Recoverable error extracting attribute',
                      err.message,
                      shouldPrintDebug === 'verbose' ? err.stack : '',
                    ].join(' ')
                  )
                  if (shouldPrintDebug === 'verbose') {
                    logger.info(`node ${path.node?.type}`)
                  }
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
            logger.info(
              ['  - attrs (before):\n', logLines(attrs.map(attrStr).join(', '))].join(' ')
            )
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
                if ([alt, cons].some((side) => side && !isStaticObject(side))) {
                  if (shouldPrintDebug) {
                    logger.info(`not extractable ${alt} ${cons}`)
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
                logger.info('  ! inlining, spread attr')
              }
              inlined.set(`${Math.random()}`, 'spread')
              return attr
            }

            const name = attribute.name.name

            if (excludeProps?.has(name)) {
              if (shouldPrintDebug) {
                logger.info(['  excluding prop', name].join(' '))
              }
              return null
            }

            if (inlineProps.has(name)) {
              inlined.set(name, name)
              if (shouldPrintDebug) {
                logger.info(['  ! inlining, inline prop', name].join(' '))
              }
              return attr
            }

            // can still optimize the object... see hoverStyle on native
            if (deoptProps.has(name)) {
              shouldDeopt = true
              inlined.set(name, name)
              if (shouldPrintDebug) {
                logger.info(['  ! inlining, deopted prop', name].join(' '))
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
              const shortname = name.slice(1)
              if (mediaQueryConfig[shortname]) {
                if (target === 'native') {
                  shouldDeopt = true
                }

                // allow disabling this extraction
                if (disableExtractInlineMedia) {
                  return attr
                }

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
                logger.info(['  ! inlining, ref', name].join(' '))
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
            if (disableExtractVariables === true) {
              if (value) {
                if (value.type === 'StringLiteral' && value.value[0] === '$') {
                  if (shouldPrintDebug) {
                    logger.info(
                      [`  ! inlining, native disable extract: ${name} =`, value.value].join(' ')
                    )
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
                undefined,
                shouldPrintDebug
              )

              if (out) {
                if (!Array.isArray(out)) {
                  logger.warn(`Error expected array but got`, out)
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
                  out = createDOMProps(isTextView ? 'span' : 'div', out)
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
                  key.startsWith('data-') ||
                  // this is debug stuff added by vite / new jsx transform
                  key === '__source' ||
                  key === '__self'
                ) {
                  return attr
                }
                if (shouldPrintDebug) {
                  logger.info('  ! inlining, non-static ' + key)
                }
                didInline = true
                inlined.set(key, val)
                return val
              })

              // weird logic whats going on here
              if (didInline) {
                if (shouldPrintDebug) {
                  logger.info(`  bailing flattening due to attributes ${attributes}`)
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
                  logger.info(`  style: ${name} = ${styleValue}`)
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
                if (variants[name]) {
                  variantValues.set(name, styleValue)
                }
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
                logger.info(` binary expression ${name} = ${value}`)
              }
              const { operator, left, right } = value
              // if one side is a ternary, and the other side is evaluatable, we can maybe extract
              const lVal = attemptEvalSafe(left)
              const rVal = attemptEvalSafe(right)
              if (shouldPrintDebug) {
                logger.info(`  evalBinaryExpression lVal ${String(lVal)}, rVal ${String(rVal)}`)
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
                logger.info(`  evalBinaryExpression cant extract`)
              }
              inlined.set(name, true)
              return attr
            }

            const staticConditional = getStaticConditional(value)
            if (staticConditional) {
              if (shouldPrintDebug === 'verbose') {
                logger.info(` static conditional ${name} ${value}`)
              }
              return { type: 'ternary', value: staticConditional }
            }

            const staticLogical = getStaticLogical(value)
            if (staticLogical) {
              if (shouldPrintDebug === 'verbose') {
                logger.info(` static ternary ${name} =  ${value}`)
              }
              return { type: 'ternary', value: staticLogical }
            }

            // if we've made it this far, the prop stays inline
            inlined.set(name, true)
            if (shouldPrintDebug) {
              logger.info(` ! inline no match ${name} ${value}`)
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
                  logger.info(['  binaryConditional', cond.test, cons, alt].join(' '))
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
                    logger.info(['      static ternary', type, cVal, aVal].join(' '))
                  }
                  return {
                    test: value.test,
                    remove,
                    consequent: { [name]: cVal },
                    alternate: { [name]: aVal },
                  }
                } catch (err: any) {
                  if (shouldPrintDebug) {
                    logger.info(['       cant eval ternary', err.message].join(' '))
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
                      logger.info(['  staticLogical', value.left, name, val].join(' '))
                    }
                    return {
                      test: value.left,
                      remove,
                      consequent: { [name]: val },
                      alternate: null,
                    }
                  } catch (err) {
                    if (shouldPrintDebug) {
                      logger.info(['  cant static eval logical', err].join(' '))
                    }
                  }
                }
              }
              return null
            }
          } // END function evaluateAttribute

          function isStaticObject(obj: t.Node): obj is t.ObjectExpression {
            return (
              t.isObjectExpression(obj) &&
              obj.properties.every((prop) => {
                if (!t.isObjectProperty(prop)) {
                  logger.info(['not object prop', prop].join(' '))
                  return false
                }
                const propName = prop.key['name']
                if (!isValidStyleKey(propName, staticConfig) && propName !== 'tag') {
                  if (shouldPrintDebug) {
                    logger.info(['  not a valid style prop!', propName].join(' '))
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
            if (!isStaticObject(side)) {
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
                      logger.info(['⚠️ no ternaries?', property].join(' '))
                    }
                  } else {
                    logger.info(['⚠️ not expression', property].join(' '))
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

          if (couldntParse || shouldDeopt) {
            if (shouldPrintDebug) {
              logger.info([`  avoid optimizing:`, { couldntParse, shouldDeopt }].join(' '))
            }
            node.attributes = ogAttributes
            return
          }

          // now update to new values
          node.attributes = attrs.filter(isAttr).map((x) => x.value)

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
                    logger.info(
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

          const themeVal = inlined.get('theme')

          // on native we can't flatten when theme prop is set
          if (target !== 'native') {
            inlined.delete('theme')
          }

          for (const [key] of [...inlined]) {
            const isStaticObjectVariant = staticConfig.variants?.[key] && variantValues.has(key)
            if (INLINE_EXTRACTABLE[key] || isStaticObjectVariant) {
              inlined.delete(key)
            }
          }

          const canFlattenProps = inlined.size === 0

          let shouldFlatten = Boolean(
            flatNode &&
              !shouldDeopt &&
              canFlattenProps &&
              !hasSpread &&
              staticConfig.neverFlatten !== true &&
              (staticConfig.neverFlatten === 'jsx' ? hasOnlyStringChildren : true)
          )

          const shouldWrapTheme = shouldFlatten && themeVal
          const usedThemeKeys = new Set<string>()

          if (disableExtractVariables) {
            // if it accesses any theme values during evaluation
            themeAccessListeners.add((key) => {
              shouldFlatten = false
              usedThemeKeys.add(key)
              if (shouldPrintDebug === 'verbose') {
                logger.info([' ! accessing theme key, avoid flatten', key].join(' '))
              }
            })
          }

          if (shouldPrintDebug) {
            try {
              // prettier-ignore
              logger.info([' flatten?', objToStr({ hasSpread, shouldDeopt, shouldFlatten, canFlattenProps, shouldWrapTheme, hasOnlyStringChildren }), 'inlined', [...inlined]].join(' '))
            } catch {
              // ok
            }
          }

          // wrap theme around children on flatten
          // TODO move this to bottom and re-check shouldFlatten
          // account for shouldFlatten could change w the above block "if (disableExtractVariables)"
          if (shouldFlatten && shouldWrapTheme) {
            if (!programPath) {
              console.warn(
                `No program path found, avoiding importing flattening / importing theme in ${sourcePath}`
              )
            } else {
              if (shouldPrintDebug) {
                logger.info(['  - wrapping theme', themeVal].join(' '))
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
          }

          // only if we flatten, ensure the default styles are there
          if (shouldFlatten) {
            const defaultStyleAttrs = Object.keys(staticConfig.defaultProps).flatMap((key) => {
              if (!isValidStyleKey(key, staticConfig)) {
                return []
              }
              const value = staticConfig.defaultProps[key]
              const name = tamaguiConfig.shorthands[key] || key
              if (value === undefined) {
                logger.warn(`⚠️ Error evaluating default style for component, prop ${key} ${value}`)
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
            if (shouldPrintDebug) {
              logger.info(`Deopting`)
            }
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
            logger.info(
              ['  - attrs (flattened): \n', logLines(attrs.map(attrStr).join(', '))].join(' ')
            )
            logger.info(
              ['  - ensureOverriden:', Object.keys(ensureOverridden).join(', ')].join(' ')
            )
          }

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
              // remove variants because they are processed later, and can lead to invalid values here
              // see <Spacer flex /> where flex looks like a valid style, but is a variant
              foundStaticProps = {
                ...foundStaticProps,
                ...expandStylesWithoutVariants(cur.value),
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

          // expand shorthands, de-opt variables
          attrs = attrs.reduce<ExtractedAttr[]>((acc, cur) => {
            if (!cur) return acc
            if (cur.type === 'attr' && !t.isJSXSpreadAttribute(cur.value)) {
              if (shouldFlatten) {
                const name = cur.value.name.name
                if (typeof name === 'string') {
                  if (name === 'tag') {
                    // remove tag=""
                    return acc
                  }

                  // if flattening, expand variants
                  if (variants[name] && variantValues.has(name)) {
                    let out = Object.fromEntries(
                      staticConfig.propMapper(
                        name,
                        variantValues.get(name),
                        defaultTheme,
                        completeProps,
                        { ...state, resolveVariablesAs: 'auto' },
                        undefined,
                        undefined,
                        shouldPrintDebug
                      ) || []
                    )
                    if (out && isTargetingHTML) {
                      const cn = out.className
                      // translate to DOM-compat
                      out = createDOMProps(isTextView ? 'span' : 'div', out)
                      // remove rnw className use ours
                      out.className = cn
                    }
                    if (shouldPrintDebug) {
                      logger.info([' - expanded variant', name, out].join(' '))
                    }
                    for (const key in out) {
                      const value = out[key]
                      if (isValidStyleKey(key, staticConfig)) {
                        acc.push({
                          type: 'style',
                          value: { [key]: value },
                          name: key,
                          attr: cur.value,
                        } as const)
                      } else {
                        acc.push({
                          type: 'attr',
                          value: t.jsxAttribute(
                            t.jsxIdentifier(key),
                            t.jsxExpressionContainer(
                              typeof value === 'string'
                                ? t.stringLiteral(value)
                                : literalToAst(value)
                            )
                          ),
                        })
                      }
                    }
                  }
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
              if (value[0] === '$' && (usedThemeKeys.has(key) || usedThemeKeys.has(fullKey))) {
                if (shouldPrintDebug) {
                  logger.info([`   keeping variable inline: ${key} =`, value].join(' '))
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

          tm.mark('jsx-element-expanded', !!shouldPrintDebug)
          if (shouldPrintDebug) {
            logger.info(
              ['  - attrs (expanded): \n', logLines(attrs.map(attrStr).join(', '))].join(' ')
            )
          }

          // merge styles, leave undefined values
          let prev: ExtractedAttr | null = null

          function splitVariants(style: any) {
            const variants = {}
            const styles = {}
            for (const key in style) {
              if (staticConfig.variants?.[key]) {
                variants[key] = style[key]
              } else {
                styles[key] = style[key]
              }
            }
            return {
              variants,
              styles,
            }
          }

          function expandStylesWithoutVariants(style: any) {
            const { variants, styles } = splitVariants(style)
            return {
              ...expandStyles(styles),
              ...variants,
            }
          }

          function mergeStyles(prev: ViewStyle & PseudoStyles, nextIn: ViewStyle & PseudoStyles) {
            const next = expandStylesWithoutVariants(nextIn)
            for (const key in next) {
              // merge pseudos
              if (pseudoDescriptors[key]) {
                prev[key] = prev[key] || {}
                if (shouldPrintDebug) {
                  if (!next[key] || !prev[key]) {
                    logger.info(['warn: missing', key, prev, next].join(' '))
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
                !pseudoDescriptors[key] &&
                !key.startsWith('data-')

              if (shouldKeepOriginalAttr) {
                if (shouldPrintDebug) {
                  logger.info(['     - keeping as non-style', key].join(' '))
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
                    t.jsxAttribute(t.jsxIdentifier(key), t.jsxExpressionContainer(t.nullLiteral())),
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

          if (shouldPrintDebug) {
            logger.info(
              ['  - attrs (combined 🔀): \n', logLines(attrs.map(attrStr).join(', '))].join(' ')
            )
            logger.info(
              ['  - defaultProps: \n', logLines(objToStr(staticConfig.defaultProps))].join(' ')
            )
            // prettier-ignore
            logger.info(['  - foundStaticProps: \n', logLines(objToStr(foundStaticProps))].join(' '))
            logger.info(['  - completeProps: \n', logLines(objToStr(completeProps))].join(' '))
          }

          // post process
          const getStyles = (props: Object | null, debugName = '') => {
            if (!props || !Object.keys(props).length) {
              if (shouldPrintDebug) logger.info([' getStyles() no props'].join(' '))
              return {}
            }
            if (excludeProps && !!excludeProps.size) {
              for (const key in props) {
                if (excludeProps.has(key)) {
                  if (shouldPrintDebug) logger.info([' delete excluded', key].join(' '))
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
                undefined,
                undefined,
                debugPropValue
              )

              const outStyle = {
                ...out.style,
                ...out.pseudos,
              }
              // omitInvalidStyles(outStyle)
              // if (shouldPrintDebug) {
              //   // prettier-ignore
              //   logger.info(`       getStyles ${debugName} (props):\n`, logLines(objToStr(props)))
              //   // prettier-ignore
              //   logger.info(`       getStyles ${debugName} (out.viewProps):\n`, logLines(objToStr(out.viewProps)))
              //   // prettier-ignore
              //   logger.info(`       getStyles ${debugName} (out.style):\n`, logLines(objToStr(outStyle || {}), true))
              // }
              return outStyle
            } catch (err: any) {
              logger.info(['error', err.message, err.stack].join(' '))
              return {}
            }
          }

          // used to ensure we pass the entire prop bundle to getStyles
          const completeStyles = getStyles(completeProps, 'completeStyles')

          if (!completeStyles) {
            throw new Error(`Impossible, no styles`)
          }

          const isNativeNotFlat = !shouldFlatten && target === 'native'
          if (isNativeNotFlat) {
            if (shouldPrintDebug) {
              logger.info(`Disabled flattening except for simple cases on native for now`)
            }
            node.attributes = ogAttributes
            return null
          }

          let getStyleError: any = null

          // fix up ternaries, combine final style values
          for (const attr of attrs) {
            try {
              switch (attr.type) {
                case 'ternary': {
                  const a = getStyles(attr.value.alternate, 'ternary.alternate')
                  const c = getStyles(attr.value.consequent, 'ternary.consequent')
                  if (a) attr.value.alternate = a
                  if (c) attr.value.consequent = c
                  if (shouldPrintDebug) logger.info(['     => tern ', attrStr(attr)].join(' '))
                  continue
                }
                case 'style': {
                  // expand variants and such
                  const styles = getStyles(attr.value, 'style')
                  if (styles) {
                    attr.value = styles
                  }
                  // prettier-ignore
                  if (shouldPrintDebug) logger.info(['  * styles (in)', logLines(objToStr(attr.value))].join(' '))
                  // prettier-ignore
                  if (shouldPrintDebug) logger.info(['  * styles (out)', logLines(objToStr(styles))].join(' '))
                  continue
                }
              }
            } catch (err) {
              // any error de-opt
              getStyleError = err
            }
          }

          if (shouldPrintDebug) {
            // prettier-ignore
            logger.info(['  - attrs (ternaries/combined):\n', logLines(attrs.map(attrStr).join(', '))].join(' '))
          }

          tm.mark('jsx-element-styles', !!shouldPrintDebug)

          if (getStyleError) {
            logger.info([' ⚠️ postprocessing error, deopt', getStyleError].join(' '))
            node.attributes = ogAttributes
            return null
          }

          // final lazy extra loop:
          const existingStyleKeys = new Set()
          for (let i = attrs.length - 1; i >= 0; i--) {
            const attr = attrs[i]

            // if flattening map inline props to proper flattened names
            if (shouldFlatten) {
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
                    logger.info([`  >> delete existing ${key}`].join(' '))
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
            if (inlineWhenUnflattened.size) {
              for (const [index, attr] of attrs.entries()) {
                if (attr.type === 'style') {
                  for (const key in attr.value) {
                    if (!inlineWhenUnflattened.has(key)) continue
                    const val = inlineWhenUnflattenedOGVals[key]
                    if (val) {
                      // delete the style
                      delete attr.value[key]

                      // and insert it before
                      attrs.splice(index - 1, 0, val.attr)
                    } else {
                      // just delete it, it was added during expansion but should be left inline
                      delete attr.value[key]
                    }
                  }
                }
              }
            }
          }

          if (shouldFlatten) {
            // DO FLATTEN
            if (shouldPrintDebug) {
              logger.info(['  [✅] flattening', originalNodeName, flatNode].join(' '))
            }
            // @ts-ignore
            node.name.name = flatNode
            res.flattened++
            if (closingElement) {
              // @ts-ignore
              closingElement.name.name = flatNode
            }
          }

          if (shouldPrintDebug) {
            // prettier-ignore
            logger.info([` ❊❊ inline props (${inlined.size}):`, shouldDeopt ? ' deopted' : '', hasSpread ? ' has spread' : '', staticConfig.neverFlatten ? 'neverFlatten' : ''].join(' '))
            logger.info(`  - attrs (end):\n ${logLines(attrs.map(attrStr).join(', '))}`)
          }

          onExtractTag({
            parserProps: propsWithFileInfo,
            attrs,
            node,
            lineNumbers,
            filePath,
            attemptEval,
            jsxPath: traversePath,
            originalNodeName,
            isFlattened: shouldFlatten,
            programPath: programPath!,
            completeProps,
            staticConfig,
          })
        } finally {
          if (debugPropValue) {
            shouldPrintDebug = ogDebug
          }
        }
      },
    })

    tm.mark('jsx-done', !!shouldPrintDebug)

    /**
     * Step 3: Remove dead code from removed media query / theme hooks
     */
    if (modifiedComponents.size) {
      const all = Array.from(modifiedComponents)
      if (shouldPrintDebug) {
        logger.info(`  [🪝] hook check ${all.length}`)
      }
      for (const comp of all) {
        removeUnusedHooks(comp, shouldPrintDebug)
      }
    }

    tm.done(shouldPrintDebug === 'verbose')

    return res
  }
}
