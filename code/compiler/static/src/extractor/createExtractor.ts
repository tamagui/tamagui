import type { NodePath, TraverseOptions } from '@babel/traverse'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import { Color, colorLog } from '@tamagui/cli-color'
import {
  StyleObjectIdentifier,
  StyleObjectRules,
  type GetStyleState,
  type PseudoStyles,
  type SplitStyleProps,
  type StaticConfig,
  type TamaguiComponentState,
} from '@tamagui/web'
import { basename, relative } from 'node:path'
import type { ViewStyle } from 'react-native'
import * as reactNativeWebInternals from '@tamagui/react-native-web-internals'

import { FAILED_EVAL } from '../constants'
import { requireTamaguiCore } from '../helpers/requireTamaguiCore'
import type {
  ExtractedAttr,
  ExtractedAttrStyle,
  ExtractorOptions,
  ExtractorParseProps,
  TamaguiOptions,
  TamaguiOptionsWithFileInfo,
  Ternary,
} from '../types'
import type { TamaguiProjectInfo } from './bundleConfig'
import { createEvaluator, createSafeEvaluator } from './createEvaluator'
import { evaluateAstNode } from './evaluateAstNode'
import {
  attrStr,
  findComponentName,
  getValidComponent,
  getValidComponentsPaths,
  getValidImport,
  isPresent,
  isValidImport,
  objToStr,
} from './extractHelpers'
import { findTopmostFunction } from './findTopmostFunction'
import { cleanupBeforeExit, getStaticBindingsForScope } from './getStaticBindingsForScope'
import { literalToAst } from './literalToAst'
import { loadTamagui, loadTamaguiSync } from './loadTamagui'
import { logLines } from './logLines'
import { normalizeTernaries } from './normalizeTernaries'
import { setPropsToFontFamily } from './propsToFontFamilyCache'
import { removeUnusedHooks } from './removeUnusedHooks'
import { timer } from './timer'
import { validHTMLAttributes } from './validHTMLAttributes'

const UNTOUCHED_PROPS = {
  key: true,
  style: true,
  className: true,
}

const createTernary = (x: Ternary) => x

export type Extractor = ReturnType<typeof createExtractor>

type FileOrPath = NodePath<t.Program> | t.File

let hasLoggedBaseInfo = false

function isFullyDisabled(props: TamaguiOptions) {
  return props.disableExtraction && props.disableDebugAttr
}

export function createExtractor(
  { logger = console, platform = 'web' }: ExtractorOptions = { logger: console }
) {
  if (!process.env.TAMAGUI_TARGET) {
    console.warn('⚠️ Please set process.env.TAMAGUI_TARGET to either "web" or "native"')
    process.exit(1)
  }

  const INLINE_EXTRACTABLE = {
    ref: 'ref',
    key: 'key',
    ...(platform === 'web' && {
      onPress: 'onClick',
      onHoverIn: 'onMouseEnter',
      onHoverOut: 'onMouseLeave',
      onPressIn: 'onMouseDown',
      onPressOut: 'onMouseUp',
    }),
  }

  const componentState: TamaguiComponentState = {
    focus: false,
    focusVisible: false,
    focusWithin: false,
    hover: false,
    unmounted: true,
    press: false,
    pressIn: false,
    disabled: false,
  } as const

  const styleProps: SplitStyleProps = {
    resolveValues: process.env.TAMAGUI_TARGET === 'native' ? 'value' : 'variable',
    noClass: false,
    isAnimated: false,
  }

  const shouldAddDebugProp =
    // really basic disable this for next.js because it messes with ssr
    !process.env.npm_package_dependencies_next &&
    process.env.TAMAGUI_TARGET !== 'native' &&
    process.env.IDENTIFY_TAGS !== 'false' &&
    (process.env.NODE_ENV === 'development' ||
      process.env.DEBUG ||
      process.env.IDENTIFY_TAGS)

  let projectInfo: TamaguiProjectInfo | null = null

  // we load tamagui delayed because we need to set some global/env stuff before importing
  // otherwise we'd import `rnw` and cause it to evaluate react-native-web which causes errors

  function loadSync(props: TamaguiOptions) {
    if (isFullyDisabled(props)) {
      return null
    }
    return (projectInfo ||= loadTamaguiSync(props))
  }

  async function load(props: TamaguiOptions) {
    if (isFullyDisabled(props)) {
      return null
    }
    return (projectInfo ||= await loadTamagui(props))
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
      return parseWithConfig(projectInfo || {}, f, props)
    },
    parse: async (f: FileOrPath, props: ExtractorParseProps) => {
      const projectInfo = await load(props)
      return parseWithConfig(projectInfo || {}, f, props)
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
      enableDynamicEvaluation = false,
      disableOptimizeHooks,
      includeExtensions = ['.ts', '.tsx', '.jsx'],
      extractStyledDefinitions = false,
      prefixLogs,
      excludeProps,
      platform,
      ...restProps
    } = options

    const validHooks = disableOptimizeHooks
      ? {}
      : {
          useMedia: true,
          useTheme: true,
        }

    if (sourcePath.includes('.tamagui-dynamic-eval')) {
      return null
    }

    const {
      normalizeStyle,
      getSplitStyles,
      mediaQueryConfig,
      propMapper,
      proxyThemeVariables,
      pseudoDescriptors,
    } = requireTamaguiCore(platform)

    let shouldPrintDebug = options.shouldPrintDebug || false

    if (disable === true || (Array.isArray(disable) && disable.includes(sourcePath))) {
      return null
    }
    if (!isFullyDisabled(options)) {
      if (!components) {
        throw new Error(`Must provide components`)
      }
    }
    if (
      sourcePath &&
      includeExtensions &&
      !includeExtensions.some((ext) => sourcePath.endsWith(ext))
    ) {
      if (shouldPrintDebug) {
        logger.info(
          `Ignoring file due to includeExtensions: ${sourcePath}, includeExtensions: ${includeExtensions.join(
            ', '
          )}`
        )
      }
      return null
    }

    function isValidStyleKey(name: string, staticConfig: StaticConfig) {
      if (!projectInfo) {
        throw new Error(`Tamagui extractor not loaded yet`)
      }
      if (platform === 'native' && name[0] === '$' && mediaQueryConfig[name.slice(1)]) {
        return false
      }
      return !!(
        staticConfig.validStyles?.[name] ||
        pseudoDescriptors[name] ||
        // don't disable variants or else you lose many things flattening
        staticConfig.variants?.[name] ||
        projectInfo?.tamaguiConfig?.shorthands[name] ||
        (name[0] === '$' ? !!mediaQueryConfig[name.slice(1)] : false)
      )
    }

    /**
     * Step 1: Determine if importing any statically extractable components
     */

    const isTargetingHTML = platform === 'web'
    const ogDebug = shouldPrintDebug
    const tm = timer()
    const propsWithFileInfo: TamaguiOptionsWithFileInfo = {
      ...options,
      sourcePath,
      allLoadedComponents: components ? [...components] : [],
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
        logger.info(
          [
            'loaded:',
            propsWithFileInfo.allLoadedComponents.map((x) => x.moduleName),
          ].join('\n')
        )
      }
    }

    tm.mark('load-tamagui', !!shouldPrintDebug)

    if (!isFullyDisabled(options)) {
      if (!tamaguiConfig?.themes) {
        console.error(
          `⛔️ Error: Missing "themes" in your tamagui.config file:

            You may not need the compiler! Remember you can run Tamagui with no configuration at all.

            You may have not "export default" your config (you can also "export const config").
            
            Or this may be due to duplicated dependency versions:
              - try out https://github.com/bmish/check-dependency-version-consistency to see if there are mis-matches.
              - or search your lockfile for mis-matches.
          `
        )
        console.info(`  Got config:`, tamaguiConfig)
        process.exit(0)
      }
    }

    const firstThemeName = Object.keys(tamaguiConfig?.themes || {})[0]
    const firstTheme = tamaguiConfig?.themes[firstThemeName] || {}

    if (!firstTheme || typeof firstTheme !== 'object') {
      const err = `Missing theme ${firstThemeName}, an error occurred when importing your config`
      console.info(err, `Got config:`, tamaguiConfig)
      console.info(`Looking for theme:`, firstThemeName)
      throw new Error(err)
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

    const body: t.Statement[] | NodePath<t.Statement>[] =
      fileOrPath.type === 'Program' ? fileOrPath.get('body') : fileOrPath.program.body

    if (!isFullyDisabled(options)) {
      if (Object.keys(components || []).length === 0) {
        console.warn(
          `Warning: Tamagui didn't find any valid components (DEBUG=tamagui for more)`
        )
        if (process.env.DEBUG === 'tamagui') {
          console.info(`components`, Object.keys(components || []), components)
        }
      }
    }

    if (shouldPrintDebug === 'verbose') {
      logger.info(
        `allLoadedComponent modules ${propsWithFileInfo.allLoadedComponents
          .map((k) => k.moduleName)
          .join(', ')}`
      )
      logger.info(
        `valid import paths: ${JSON.stringify(
          getValidComponentsPaths(propsWithFileInfo)
        )}`
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

      if (shouldPrintDebug === 'verbose') {
        logger.info(` - import ${moduleName} ${valid}`)
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
            ` - import ${isValidComponent ? '✅' : '⇣'} - ${names.join(
              ', '
            )} from '${moduleName}' - (valid: ${JSON.stringify(
              getValidComponentsPaths(propsWithFileInfo)
            )})`
          )
        }
        if (isValidComponent) {
          doesUseValidImport = true
          break
        }
      }
    }

    if (shouldPrintDebug) {
      logger.info(
        `${JSON.stringify({ doesUseValidImport, hasImportedTheme }, null, 2)}\n`
      )
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
      return getValidImport(
        propsWithFileInfo,
        importDeclaration.source.value,
        componentName
      )
    }

    tm.mark('import-check', !!shouldPrintDebug)

    let couldntParse = false
    const modifiedComponents = new Set<NodePath<any>>()

    // only keeping a cache around per-file, reset it if it changes
    const bindingCache: Record<string, string | null> = {}

    const callTraverse = (a: TraverseOptions<any>) => {
      // @ts-ignore
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

    const version = `${Math.random()}`

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

        const variableName =
          t.isVariableDeclarator(path.parent) && t.isIdentifier(path.parent.id)
            ? path.parent.id.name
            : 'unknown'

        const parentNode = path.node.arguments[0]

        if (!t.isIdentifier(parentNode)) {
          return
        }
        const parentName = parentNode.name
        const definition = path.node.arguments[1]

        if (!parentName || !definition || !t.isObjectExpression(definition)) {
          return
        }

        let Component = getValidImportedComponent(variableName)

        if (!Component) {
          if (enableDynamicEvaluation !== true) {
            return
          }

          try {
            if (shouldPrintDebug) {
              logger.info(
                `Unknown component: ${variableName} = styled(${parentName}) attempting dynamic load: ${sourcePath}`
              )
            }

            const out = loadTamaguiSync({
              forceExports: true,
              components: [sourcePath],
              cacheKey: version,
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

            Component = out.components.flatMap((x) => x.nameToInfo[variableName] ?? [])[0]

            if (!out.cached) {
              const foundNames = out.components
                ?.map((x) => Object.keys(x.nameToInfo).join(', '))
                .join(', ')
                .trim()

              if (foundNames) {
                colorLog(
                  Color.FgYellow,
                  `      | Tamagui found dynamic components: ${foundNames}`
                )
              }
            }
          } catch (err: any) {
            if (shouldPrintDebug) {
              logger.info(
                `skip optimize styled(${variableName}), unable to pre-process (DEBUG=tamagui for more)`
              )
            }
          }
        }

        if (!Component) {
          if (shouldPrintDebug) {
            logger.info(` No component found`)
          }

          /**
           * We could/should still extract CSS just limited to validStyleProps
           */
          return
        }

        const componentSkipProps = new Set([
          ...(Component.staticConfig.inlineWhenUnflattened || []),
          ...(Component.staticConfig.inlineProps || []),
          // for now skip variants, will return to them
          'variants',
          'defaultVariants',
          // skip fontFamily its basically a "variant", important for theme use to be value always
          'fontFamily',
          'name',
          'focusStyle',
          'focusVisibleStyle',
          'focusWithinStyle',
          'disabledStyle',
          'hoverStyle',
          'pressStyle',
        ])

        // for now dont parse variants, spreads, etc
        const skipped = new Set<t.ObjectProperty | t.SpreadElement | t.ObjectMethod>()
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
            // TODO make pseudos and variants work
            // skip pseudos
            pseudoDescriptors[property.key.name] ||
            // skip variants
            Component.staticConfig.variants?.[property.key.name] ||
            componentSkipProps.has(property.key.name)
          ) {
            skipped.add(property)
            continue
          }
          // attempt eval
          const out = attemptEvalSafe(property.value)
          if (out === FAILED_EVAL) {
            skipped.add(property)
          } else {
            styles[property.key.name] = out
          }
        }

        const out = getSplitStyles(
          styles,
          Component.staticConfig,
          defaultTheme,
          '',
          componentState,
          styleProps,
          undefined,
          undefined,
          undefined,
          shouldPrintDebug
        )

        const classNames = {
          ...out.classNames,
        }

        // // add in the style object as classnames
        // const atomics = getPropsAtomic(out.style)
        // for (const atomic of atomics) {
        //   out.rulesToInsert = out.rulesToInsert || []
        //   out.rulesToInsert.push(atomic)
        //   classNames[atomic.property] = atomic.identifier
        // }

        if (shouldPrintDebug) {
          logger.info(
            [
              `Extracted styled(${variableName})\n`,
              JSON.stringify(styles, null, 2),
              '\n classNames:',
              JSON.stringify(classNames, null, 2),
              '\n  rulesToInsert:',
              out.rulesToInsert,
            ].join(' ')
          )
        }

        // leave only un-parsed props...
        // preserve original order
        definition.properties = definition.properties.map((prop) => {
          if (
            skipped.has(prop) ||
            !t.isObjectProperty(prop) ||
            !t.isIdentifier(prop.key)
          ) {
            return prop
          }
          const key = prop.key.name
          const value = classNames[key]
          if (value) {
            return t.objectProperty(t.stringLiteral(key), t.stringLiteral(value))
          }
          return prop
        })

        if (out.rulesToInsert) {
          for (const key in out.rulesToInsert) {
            const styleObject = out.rulesToInsert[key]
            onStyleRule?.(
              styleObject[StyleObjectIdentifier],
              styleObject[StyleObjectRules]
            )
          }
        }

        res.styled++

        if (shouldPrintDebug) {
          logger.info(`Extracted styled(${variableName})`)
        }
      },

      JSXElement(traversePath) {
        tm.mark('jsx-element', !!shouldPrintDebug)

        const node = traversePath.node.openingElement
        const ogAttributes = node.attributes.map((attr) => ({ ...attr }))
        const componentName = findComponentName(traversePath.scope)
        const closingElement = traversePath.node.closingElement

        // skip non-identifier opening elements (member expressions, etc.)
        if (
          (closingElement && t.isJSXMemberExpression(closingElement?.name)) ||
          !t.isJSXIdentifier(node.name)
        ) {
          if (shouldPrintDebug) {
            logger.info(` skip non-identifier element`)
          }

          return
        }

        // validate its a proper import from tamagui (or internally inside tamagui)
        const binding = traversePath.scope.getBinding(node.name.name)
        let moduleName = ''

        if (binding) {
          if (t.isImportDeclaration(binding.path.parent)) {
            moduleName = binding.path.parent.source.value
            if (!isValidImport(propsWithFileInfo, moduleName, binding.identifier.name)) {
              if (shouldPrintDebug) {
                logger.info(
                  ` - Binding in component ${componentName} not valid import: "${binding.identifier.name}" isn't in ${moduleName}\n`
                )
              }
              return
            }
          }
        }

        const component = getValidComponent(propsWithFileInfo, moduleName, node.name.name)
        if (!component || !component.staticConfig) {
          if (shouldPrintDebug) {
            logger.info(`\n - No Tamagui conf for: ${node.name.name}\n`)
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
            (n) =>
              t.isJSXAttribute(n) && t.isJSXIdentifier(n.name) && n.name.name === 'debug'
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
          logger.info(
            `\x1b[33m\x1b[0m ` + `${componentName} | ${codePosition} -------------------`
          )
          // prettier-ignore
          logger.info(
            [
              '\x1b[1m',
              '\x1b[32m',
              `<${originalNodeName} />`,
              disableDebugAttr ? '' : '🐛',
            ].join(' ')
          )
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

        if (shouldDisableExtraction) {
          if (shouldPrintDebug === 'verbose') {
            logger.info(` ❌ Extraction disabled: ${JSON.stringify(disableExtraction)}\n`)
          }
          return
        }

        try {
          const { staticConfig } = component
          const defaultProps = { ...(staticConfig.defaultProps || {}) }
          const variants = staticConfig.variants || {}
          const isTextView = staticConfig.isText || false
          const validStyles = staticConfig?.validStyles ?? {}

          // find tag="a" tag="main" etc dom indicators
          let tagName = defaultProps.tag ?? (isTextView ? 'span' : 'div')
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

          if (shouldPrintDebug === 'verbose') {
            console.info(` Start tag ${tagName}`)
          }

          const flatNode = getFlattenedNode?.({ isTextView, tag: tagName })

          const inlineProps = new Set([
            // adding some always inline props
            'dataSet',
            ...(restProps.inlineProps || []),
            ...(staticConfig.inlineProps || []),
          ])

          const deoptProps = new Set([
            // always de-opt animation these
            'animation',
            'animateOnly',
            'animatePresence',
            'disableOptimization',

            ...(!isTargetingHTML
              ? [
                  'pressStyle',
                  'focusStyle',
                  'focusVisibleStyle',
                  'focusWithinStyle',
                  'disabledStyle',
                ]
              : []),

            // when using a non-CSS driver, de-opt on enterStyle/exitStyle
            ...(tamaguiConfig?.animations.isReactNative
              ? ['enterStyle', 'exitStyle']
              : []),
          ])

          const inlineWhenUnflattened = new Set([
            ...(staticConfig.inlineWhenUnflattened || []),
          ])

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

          if (couldntParse) {
            return
          }

          tm.mark('jsx-element-flattened', !!shouldPrintDebug)

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

          const propMapperStyleState: GetStyleState = {
            staticConfig,
            usedKeys: {},
            classNames: {},
            style: {},
            theme: defaultTheme,
            viewProps: defaultProps,
            conf: tamaguiConfig!,
            props: defaultProps,
            componentState,
            styleProps: {
              ...styleProps,
              resolveValues: 'auto',
            },
            debug: shouldPrintDebug,
          }

          attrs = traversePath
            .get('openingElement')
            .get('attributes')
            .flatMap((path) => {
              // avoid work
              if (shouldDeopt) {
                return
              }

              try {
                const res = evaluateAttribute(path)
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
                    createTernariesFromObjectProperties(
                      t.unaryExpression('!', test),
                      cons
                    )) ||
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

            // in tamagui style is handled at the end of the style loop so its not as simple as just
            // adding this as a "style" property
            // its not used often when using tamagui so not optimizing it for now
            if (name === 'style') {
              shouldDeopt = true
              return null
            }

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

            // de-opt on enterStyle={expression}
            if (
              (name === 'enterStyle' || name === 'exitStyle') &&
              t.isJSXExpressionContainer(attribute?.value)
            ) {
              shouldDeopt = true
              return attr
            }

            // shorthand media queries
            if (name[0] === '$' && t.isJSXExpressionContainer(attribute?.value)) {
              const shortname = name.slice(1)
              if (mediaQueryConfig[shortname]) {
                if (platform === 'native') {
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
              }
              return [attribute.value!, path.get('value')!] as const
            })()

            const remove = () => {
              Array.isArray(valuePath)
                ? valuePath.map((p) => p.remove())
                : valuePath.remove()
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
                      [
                        `  ! inlining, native disable extract: ${name} =`,
                        value.value,
                      ].join(' ')
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
              let out: any = null

              // for now passing empty props {}, a bit odd, need to at least document
              // for now we don't expose custom components so just noting behavior
              propMapper(name, styleValue, propMapperStyleState, false, (key, val) => {
                out ||= {}
                out[key] = val
              })

              if (out) {
                if (isTargetingHTML) {
                  // translate to DOM-compat
                  out = reactNativeWebInternals.createDOMProps(
                    isTextView ? 'span' : 'div',
                    out
                  )
                  // remove className - we dont use rnw styling
                  delete out.className
                }
              }

              let didInline = false
              const attributes = Object.keys(out).map((key) => {
                const val = out[key]
                const isStyle = isValidStyleKey(key, staticConfig)
                if (isStyle) {
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
                  logger.info(
                    `  bailing flattening due to attributes ${attributes.map((x) =>
                      x.toString()
                    )}`
                  )
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
                  logger.info(`  style: ${name} = ${JSON.stringify(styleValue)}`)
                }
                if (!(name in defaultProps)) {
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
              }
              if (variants[name]) {
                variantValues.set(name, styleValue)
              }
              inlined.set(name, true)
              return attr
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
                logger.info(
                  `  evalBinaryExpression lVal ${String(lVal)}, rVal ${String(rVal)}`
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

            // Disabling: this probably doesn't optimize much and needs to be done a bit differently
            if (options.experimentalFlattenDynamicValues) {
              if (isValidStyleKey(name, staticConfig)) {
                return {
                  type: 'dynamic-style',
                  value,
                  name: tamaguiConfig?.shorthands[name] || name,
                }
              }
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
                const alt = attemptEval(
                  t.binaryExpression(operator, staticExpr, cond.alternate)
                )
                const cons = attemptEval(
                  t.binaryExpression(operator, staticExpr, cond.consequent)
                )
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
                    }
                    logger.info(['⚠️ no ternaries?', property].join(' '))
                  } else {
                    logger.info(['⚠️ not expression', property].join(' '))
                  }
                }
              }
              // this could be a recurse here if we want to get fancy
              if (t.isConditionalExpression(property.value)) {
                // merge up into the parent conditional, split into two
                const [truthy, falsy] = [
                  t.objectExpression([
                    t.objectProperty(property.key, property.value.consequent),
                  ]),
                  t.objectExpression([
                    t.objectProperty(property.key, property.value.alternate),
                  ]),
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
              const obj = t.objectExpression([
                t.objectProperty(property.key, property.value),
              ])
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
              logger.info(
                [`  avoid optimizing:`, { couldntParse, shouldDeopt }].join(' ')
              )
            }
            node.attributes = ogAttributes
            return
          }

          // before deopt, can still optimize
          const parentFn = findTopmostFunction(traversePath)
          if (parentFn) {
            modifiedComponents.add(parentFn)
          }

          // flatten logic!
          // fairly simple check to see if all children are text
          const hasSpread = attrs.some(
            (x) => x.type === 'attr' && t.isJSXSpreadAttribute(x.value)
          )

          const hasOnlyStringChildren =
            !hasSpread &&
            (node.selfClosing ||
              (traversePath.node.children &&
                traversePath.node.children.every((x) => x.type === 'JSXText')))

          let themeVal = inlined.get('theme')

          // on native we can't flatten when theme prop is set
          if (platform !== 'native') {
            inlined.delete('theme')
          }

          for (const [key] of [...inlined]) {
            const isStaticObjectVariant =
              staticConfig.variants?.[key] && variantValues.has(key)
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
              !staticConfig.isStyledHOC &&
              !staticConfig.isHOC &&
              !staticConfig.isReactNative &&
              staticConfig.neverFlatten !== true &&
              (staticConfig.neverFlatten === 'jsx' ? hasOnlyStringChildren : true)
          )

          const usedThemeKeys = new Set<string>()
          // if it accesses any theme values during evaluation
          themeAccessListeners.add((key) => {
            if (disableExtractVariables) {
              usedThemeKeys.add(key)
              shouldFlatten = false
              if (shouldPrintDebug === 'verbose') {
                logger.info([' ! accessing theme key, avoid flatten', key].join(' '))
              }
            }
          })

          // only if we flatten, ensure the default styles are there
          if (shouldFlatten) {
            let skipMap = false
            const defaultStyleAttrs = Object.keys(defaultProps).flatMap((key) => {
              if (skipMap) return []
              const value = defaultProps[key]
              if (key === 'theme' && !themeVal) {
                if (platform === 'native') {
                  shouldFlatten = false
                  skipMap = true
                  inlined.set('theme', { value: t.stringLiteral(value) })
                }
                themeVal = { value: t.stringLiteral(value) }
                return []
              }
              if (!isValidStyleKey(key, staticConfig)) {
                return []
              }
              const name = tamaguiConfig?.shorthands[key] || key
              if (value === undefined) {
                logger.warn(
                  `⚠️ Error evaluating default style for component, prop ${key} ${value}`
                )
                shouldDeopt = true
                return
              }
              if (name[0] === '$' && mediaQueryConfig[name.slice(1)]) {
                defaultProps[key] = undefined
                return evaluateAttribute({
                  node: t.jsxAttribute(
                    t.jsxIdentifier(name),
                    t.jsxExpressionContainer(
                      t.objectExpression(
                        Object.keys(value)
                          .filter((k) => {
                            return typeof value[k] !== 'undefined'
                          })
                          .map((k) => {
                            return t.objectProperty(
                              t.identifier(k),
                              literalToAst(value[k])
                            )
                          })
                      )
                    )
                  ),
                } as any)
              }
              const attr: ExtractedAttrStyle = {
                type: 'style',
                name,
                value: { [name]: value },
              }
              return attr
            }) as ExtractedAttr[]

            if (!skipMap) {
              if (defaultStyleAttrs.length) {
                attrs = [...defaultStyleAttrs, ...attrs]
              }
            }
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

          const shouldWrapTheme = shouldFlatten && themeVal
          // wrap theme around children on flatten
          // account for shouldFlatten could change w the above block "if (disableExtractVariables)"
          if (shouldWrapTheme) {
            if (!programPath) {
              console.warn(
                `No program path found, avoiding importing flattening / importing theme in ${sourcePath}`
              )
            } else {
              if (shouldPrintDebug) {
                logger.info(['  - wrapping theme', themeVal].join(' '))
              }

              // remove theme attribute from flattened node
              attrs = attrs.filter(
                (x) =>
                  !(
                    x.type === 'attr' &&
                    t.isJSXAttribute(x.value) &&
                    x.value.name.name === 'theme'
                  )
              )

              // add import
              if (!hasImportedTheme) {
                hasImportedTheme = true
                programPath.node.body.push(
                  t.importDeclaration(
                    [
                      t.importSpecifier(
                        t.identifier('_TamaguiTheme'),
                        t.identifier('Theme')
                      ),
                    ],
                    t.stringLiteral('@tamagui/web')
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

          if (shouldPrintDebug) {
            try {
              // prettier-ignore
              logger.info(
                [
                  ' flatten?',
                  shouldFlatten,
                  objToStr({
                    hasSpread,
                    shouldDeopt,
                    canFlattenProps,
                    shouldWrapTheme,
                    hasOnlyStringChildren,
                  }),
                  'inlined',
                  inlined.size,
                  [...inlined],
                ].join(' ')
              )
            } catch {
              // ok
            }
          }

          if (shouldDeopt || !shouldFlatten) {
            if (shouldPrintDebug) {
              logger.info(`Deopting ${shouldDeopt} ${shouldFlatten}`)
            }
            node.attributes = ogAttributes
            return
          }

          if (shouldPrintDebug) {
            logger.info(
              ['  - attrs (flattened): \n', logLines(attrs.map(attrStr).join(', '))].join(
                ' '
              )
            )
          }

          function mergeToEnd(obj: Object, key: string, val: any) {
            if (key in obj) {
              delete obj[key]
            }
            obj[key] = val
          }

          // preserves order
          function normalizeStyleWithoutVariants(style: any) {
            let res = {}
            for (const key in style) {
              if (staticConfig.variants && key in staticConfig.variants) {
                mergeToEnd(res, key, style[key])
              } else {
                const expanded = normalizeStyle({ [key]: style[key] }, true)
                for (const key in expanded) {
                  mergeToEnd(res, key, expanded[key])
                }
              }
            }
            return res
          }

          // evaluates all static attributes into a simple object
          let foundStaticProps = {}

          for (const key in attrs) {
            const cur = attrs[key]
            if (cur.type === 'style') {
              // remove variants because they are processed later, and can lead to invalid values here
              // see <Spacer flex /> where flex looks like a valid style, but is a variant
              const expanded = normalizeStyleWithoutVariants(cur.value)
              // preserve order
              for (const key in expanded) {
                mergeToEnd(foundStaticProps, key, expanded[key])
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
                mergeToEnd(foundStaticProps, key, value)
              }
            }
          }

          // must preserve exact order
          const completeProps = {}
          for (const key in defaultProps) {
            if (!(key in foundStaticProps)) {
              completeProps[key] = defaultProps[key]
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
                    const styleState = {
                      ...propMapperStyleState,
                      props: completeProps,
                    }

                    let out: Record<string, any> = {}
                    propMapper(
                      name,
                      variantValues.get(name),
                      styleState,
                      false,
                      (key, val) => {
                        out[key] = val
                      }
                    )

                    if (out && isTargetingHTML) {
                      const cn = out.className
                      // translate to DOM-compat
                      out = reactNativeWebInternals.createDOMProps(
                        isTextView ? 'span' : 'div',
                        out
                      )
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
            const fullKey = tamaguiConfig?.shorthands[key]
            // expand shorthands
            if (fullKey) {
              cur.value = { [fullKey]: value }
              key = fullKey
            }

            // finally we have all styles + expansions, lets see if we need to skip
            // any and keep them as attrs
            if (disableExtractVariables) {
              if (
                value[0] === '$' &&
                (usedThemeKeys.has(key) || usedThemeKeys.has(fullKey))
              ) {
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
              ['  - attrs (expanded): \n', logLines(attrs.map(attrStr).join(', '))].join(
                ' '
              )
            )
          }

          // merge styles, leave undefined values
          let prev: ExtractedAttr | null = null

          function mergeStyles(
            prev: ViewStyle & PseudoStyles,
            next: ViewStyle & PseudoStyles
          ) {
            for (const key in next) {
              // merge pseudos
              if (pseudoDescriptors[key]) {
                prev[key] = prev[key] || {}
                Object.assign(prev[key], next[key])
              } else {
                mergeToEnd(prev, key, next[key])
              }
            }
          }

          // post process
          const getProps = (
            props: Object | null,
            includeProps = false,
            debugName = ''
          ) => {
            if (!props) {
              if (shouldPrintDebug) logger.info([' getProps() no props'].join(' '))
              return {}
            }
            if (excludeProps?.size) {
              for (const key in props) {
                if (excludeProps.has(key)) {
                  if (shouldPrintDebug) logger.info([' delete excluded', key].join(' '))
                  delete props[key]
                }
              }
            }

            const before = process.env.IS_STATIC
            process.env.IS_STATIC = 'is_static'
            try {
              const out = getSplitStyles(
                props,
                staticConfig,
                defaultTheme,
                '',
                componentState,
                {
                  ...styleProps,
                  noClass: true,
                  fallbackProps: completeProps,
                },
                undefined,
                undefined,
                undefined,
                debugPropValue || shouldPrintDebug
                // options.experimentalFlattenThemesOnNative
              )

              let outProps = {
                ...(includeProps ? out.viewProps : {}),
                ...out.style,
                ...out.pseudos,
              }

              // check de-opt props again
              for (const key in outProps) {
                if (deoptProps.has(key)) {
                  shouldFlatten = false
                }
              }

              if (shouldPrintDebug) {
                logger.info(`(${debugName})`)
                // prettier-ignore
                logger.info(`\n       getProps (props in): ${logLines(objToStr(props))}`)
                // prettier-ignore
                logger.info(
                  `\n       getProps (outProps): ${logLines(objToStr(outProps))}`
                )
              }

              if (out.fontFamily) {
                setPropsToFontFamily(outProps, out.fontFamily)
                if (shouldPrintDebug) {
                  logger.info(`\n      💬 new font fam: ${out.fontFamily}`)
                }
              }

              return outProps
            } catch (err: any) {
              logger.info(['error', err.message, err.stack].join(' '))
              return {}
            } finally {
              process.env.IS_STATIC = before
            }
          }

          // add default props
          if (shouldFlatten) {
            attrs.unshift({
              type: 'style',
              value: defaultProps,
            })
          }

          attrs = attrs.reduce<ExtractedAttr[]>((acc, cur) => {
            if (cur.type === 'style') {
              const key = Object.keys(cur.value)[0]
              const value = cur.value[key]

              const shouldKeepOriginalAttr =
                // !isStyleAndAttr[key] &&
                !shouldFlatten &&
                // de-opt if non-style
                !validStyles[key] &&
                !pseudoDescriptors[key] &&
                !(key.startsWith('data-') || key.startsWith('aria-'))

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
                      typeof value === 'string'
                        ? t.stringLiteral(value)
                        : literalToAst(value)
                    )
                  ),
                })
                acc.push(cur)
                return acc
              }

              if (prev?.type === 'style') {
                mergeStyles(prev.value, cur.value)
                return acc
              }
            }

            if (cur.type === 'style') {
              prev = cur
            }
            acc.push(cur)
            return acc
          }, [])

          if (shouldPrintDebug) {
            logger.info(
              [
                '  - attrs (combined 🔀): \n',
                logLines(attrs.map(attrStr).join(', ')),
              ].join(' ')
            )
          }

          let getStyleError: any = null

          // fix up ternaries, combine final style values
          for (const attr of attrs) {
            try {
              if (shouldPrintDebug) {
                console.info(`  Processing ${attr.type}:`)
              }

              switch (attr.type) {
                case 'ternary': {
                  const a = getProps(attr.value.alternate, false, 'ternary.alternate')
                  const c = getProps(attr.value.consequent, false, 'ternary.consequent')
                  if (a) attr.value.alternate = a
                  if (c) attr.value.consequent = c
                  if (shouldPrintDebug)
                    logger.info(['     => tern ', attrStr(attr)].join(' '))
                  continue
                }
                case 'style': {
                  // expand variants and such
                  const styles = getProps(attr.value, false, 'style')
                  if (styles) {
                    // @ts-ignore
                    attr.value = styles
                  }
                  // prettier-ignore
                  if (shouldPrintDebug)
                    logger.info(
                      ['  * styles (in)', logLines(objToStr(attr.value))].join(' ')
                    )
                  // prettier-ignore
                  if (shouldPrintDebug)
                    logger.info(
                      ['  * styles (out)', logLines(objToStr(styles))].join(' ')
                    )
                  continue
                }
                case 'attr': {
                  if (shouldFlatten && t.isJSXAttribute(attr.value)) {
                    // we know all attributes are static
                    // this only does one at a time but it should really do the whole group together...
                    // also awkward to be doing it using jsxAttributes...
                    const key = attr.value.name.name as string

                    // dont process style/className can just stay attrs
                    if (key === 'style' || key === 'className' || key === 'tag') {
                      continue
                    }

                    // undefined = boolean true
                    const value = attemptEvalSafe(
                      attr.value.value || t.booleanLiteral(true)
                    )
                    if (value !== FAILED_EVAL) {
                      const outProps = getProps({ [key]: value }, true, `attr.${key}`)
                      const outKey = Object.keys(outProps)[0]
                      if (outKey) {
                        const outVal = outProps[outKey]
                        attr.value = t.jsxAttribute(
                          t.jsxIdentifier(outKey),
                          t.jsxExpressionContainer(
                            typeof outVal === 'string'
                              ? t.stringLiteral(outVal)
                              : literalToAst(outVal)
                          )
                        )
                      }
                    }
                  }
                }
              }
            } catch (err) {
              // any error de-opt
              getStyleError = err
            }
          }

          if (shouldPrintDebug) {
            // prettier-ignore
            logger.info(
              [
                '  - attrs (ternaries/combined):\n',
                logLines(attrs.map(attrStr).join(', ')),
              ].join(' ')
            )
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

            if (attr.type === 'dynamic-style') {
              if (existingStyleKeys.has(attr.name)) {
                //@ts-ignore
                attrs[i] = undefined
              } else {
                existingStyleKeys.add(attr.name)
              }
            }
          }

          if (options.experimentalFlattenThemesOnNative) {
            attrs = attrs.filter(Boolean)
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

          // delete empty styles:
          attrs = attrs.filter((x) => {
            if (
              (x.type === 'style' || x.type === 'dynamic-style') &&
              Object.keys(x.value).length === 0
            ) {
              return false
            }
            return true
          })

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

          const isNativeNotFlat = !shouldFlatten && platform === 'native'
          if (isNativeNotFlat) {
            if (shouldPrintDebug) {
              logger.info(
                `Disabled flattening except for simple cases on native for now: ${JSON.stringify(
                  {
                    flatNode,
                    shouldDeopt,
                    canFlattenProps,
                    hasSpread,
                    'staticConfig.isStyledHOC': staticConfig.isStyledHOC,
                    '!staticConfig.isHOC': !staticConfig.isHOC,
                    'staticConfig.isReactNative': staticConfig.isReactNative,
                    'staticConfig.neverFlatten': staticConfig.neverFlatten,
                  },
                  null,
                  2
                )}`
              )
            }
            node.attributes = ogAttributes
            return null
          }

          if (shouldPrintDebug) {
            // prettier-ignore
            logger.info(
              [
                ` - inlined props (${inlined.size}):`,
                shouldDeopt ? ' deopted' : '',
                hasSpread ? ' has spread' : '',
                staticConfig.neverFlatten ? 'neverFlatten' : '',
              ].join(' ')
            )
            logger.info(`  - shouldFlatten/isFlattened: ${shouldFlatten}`)
            logger.info(`  - attrs (end):\n ${logLines(attrs.map(attrStr).join(', '))}`)
          }

          onExtractTag({
            parserProps: propsWithFileInfo,
            attrs,
            node,
            lineNumbers,
            filePath,
            config: tamaguiConfig!,
            attemptEval,
            jsxPath: traversePath,
            originalNodeName,
            isFlattened: shouldFlatten,
            programPath: programPath!,
            completeProps,
            staticConfig,
          })
        } catch (err: any) {
          node.attributes = ogAttributes
          console.error(
            `@tamagui/static error, reverting optimization. In ${filePath} ${lineNumbers} on ${originalNodeName}: ${err.message}. For stack trace set environment TAMAGUI_DEBUG=1`
          )
          if (process.env.TAMAGUI_DEBUG === '1') {
            console.error(err.stack)
          }
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
