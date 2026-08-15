import { dirname, join } from 'node:path'
import { createRequire } from 'node:module'

import { generateThemes, writeGeneratedThemes } from '@tamagui/generate-themes'
import { stylePropsAll } from '@tamagui/helpers'
import { grammarEntries } from '@tamagui/style-grammar'
import type { TamaguiOptions } from '@tamagui/types'
import FS from 'fs-extra'

import { requireTamaguiCore } from '../helpers/requireTamaguiCore'
import type { TamaguiPlatform } from '../types'
import type { BundledConfig } from './bundleConfig'
import { getBundledConfig } from './bundleConfig'

/**
 * Sort of a super-set of bundleConfig(), this code needs some refactoring ideally
 */

export async function regenerateConfig(
  tamaguiOptions: TamaguiOptions,
  configIn?: BundledConfig | null,
  rebuild = false
) {
  try {
    // this has a side effect of rebuilding config and css!
    // need to improve code here:
    const config = configIn ?? (await getBundledConfig(tamaguiOptions, rebuild))
    if (!config) return
    const out = transformConfig(config, tamaguiOptions.platform || 'web')
    const confFile = getConfigFile(tamaguiOptions)

    await FS.ensureDir(dirname(confFile))
    await FS.writeJSON(confFile, out, {
      spaces: 2,
    })
  } catch (err) {
    if (process.env.DEBUG?.includes('tamagui') || process.env.IS_TAMAGUI_DEV) {
      console.warn('regenerateConfig error', err)
    }
    // ignore for now
  }
}

export function regenerateConfigSync(
  tamaguiOptions: TamaguiOptions,
  config: BundledConfig
) {
  try {
    const confFile = getConfigFile(tamaguiOptions)
    FS.ensureDirSync(dirname(confFile))
    FS.writeJSONSync(
      confFile,
      transformConfig(config, tamaguiOptions.platform || 'web'),
      {
        spaces: 2,
      }
    )
  } catch (err) {
    if (process.env.DEBUG?.includes('tamagui') || process.env.IS_TAMAGUI_DEV) {
      console.warn('regenerateConfig error', err)
    }
    // ignore for now
  }
}

export async function generateTamaguiThemes(
  tamaguiOptions: TamaguiOptions,
  force = false
) {
  if (!tamaguiOptions.themeBuilder) {
    return
  }

  const { input, output } = tamaguiOptions.themeBuilder
  const root = tamaguiOptions.root || process.cwd()
  const tamaguiDir = join(root, '.tamagui')
  const projectRequire = createRequire(join(root, 'package.json'))
  const inPath = resolveRelativePath(input, root, projectRequire)
  const outPath = resolveRelativePath(output, root, projectRequire)
  const generatedOutput = await generateThemes(inPath)

  // because this runs in parallel (its cheap) lets avoid logging a bunch, so check to see if changed:
  const hasChanged =
    force ||
    (await (async () => {
      try {
        if (!generatedOutput) return false
        const next = generatedOutput.generated
        const current = await FS.readFile(outPath, 'utf-8')
        return next !== current
      } catch (err) {
        // ok
      }
      return true
    })())

  if (hasChanged) {
    await writeGeneratedThemes(tamaguiDir, outPath, generatedOutput)
  }

  return hasChanged
}

const getConfigFile = (options: TamaguiOptions) =>
  join(options.root || process.cwd(), '.tamagui', 'tamagui.config.json')

const resolveRelativePath = (
  inputPath: string,
  root: string,
  projectRequire: NodeRequire
) =>
  inputPath.startsWith('.') ? join(root, inputPath) : projectRequire.resolve(inputPath)

function cloneDeepSafe(x: any, excludeKeys = {}) {
  if (!x) return x
  if (Array.isArray(x)) return x.map((_) => cloneDeepSafe(_))
  if (typeof x === 'function') return `Function`
  if (typeof x !== 'object') return x
  if ('$$typeof' in x) return 'Component'
  return Object.fromEntries(
    Object.entries(x).flatMap(([k, v]) => (excludeKeys[k] ? [] : [[k, cloneDeepSafe(v)]]))
  )
}

/**
 * Which token category each style prop draws its values from, emitted so the
 * language server can offer `bg=""` colors and `p=""` spaces instead of every
 * token in the config.
 *
 * Derived from the style-grammar registry rather than restated here: that
 * registry is already the contract the runtime resolver is pinned to
 * (see core-test/tokenCategoryParity.web.test.tsx), so a second table would be
 * a second thing to keep true.
 *
 * A prefix shared by props of different categories (`border` is both
 * borderWidth/space and borderColor/color) is left out rather than guessed at;
 * an unmapped prop offers the whole vocabulary, which is the honest answer.
 */
function buildPropCategories(): Record<string, string> {
  const out: Record<string, string> = {}
  const byPrefix: Record<string, Set<string | undefined>> = {}

  for (const entry of grammarEntries) {
    if (entry.tokenCategory) out[entry.prop] = entry.tokenCategory
    if (entry.prefix) (byPrefix[entry.prefix] ||= new Set()).add(entry.tokenCategory)
  }

  for (const [prefix, categories] of Object.entries(byPrefix)) {
    // `out[prefix]` may already be set when a prop is its own prefix (`gap`,
    // `color`); the registry agrees with itself there, so this is a no-op
    if (categories.size !== 1) continue
    const [only] = categories
    if (only) out[prefix] = only
  }

  return out
}

function transformConfig(config: BundledConfig, platform: TamaguiPlatform) {
  if (!config) {
    return null
  }

  const { getVariableValue } = requireTamaguiCore(platform)

  // ensure we don't mangle anything in the original
  const next = cloneDeepSafe(config, {
    validStyles: true,
  }) as BundledConfig

  const { components, nameToPaths, tamaguiConfig } = next
  const { themes, tokens } = tamaguiConfig

  // reduce down to usable, smaller json

  // slim themes
  for (const key in themes) {
    const theme = themes[key]
    for (const tkey in theme) {
      theme[tkey] = getVariableValue(theme[tkey])
    }
  }

  // flatten variables
  for (const key in tokens) {
    const token = { ...tokens[key] }
    for (const tkey in token) {
      token[tkey] = getVariableValue(token[tkey])
    }
  }

  // remove bulky stuff in components
  for (const component of components) {
    for (const _ in component.nameToInfo) {
      // avoid mutating
      const compDefinition = { ...component.nameToInfo[_] }
      component.nameToInfo[_] = compDefinition

      const { parentStaticConfig, ...rest } = compDefinition.staticConfig
      compDefinition.staticConfig = rest
    }
  }

  // set to array
  next.nameToPaths = {}
  for (const key in nameToPaths) {
    next.nameToPaths[key] = [...nameToPaths[key]]
  }

  // remove stuff we dont need to send
  const {
    fontsParsed,
    getCSS,
    tokensParsed,
    themeConfig,
    shorthands: _shorthands,
    userShorthands,
    ...cleanedConfig
  } = next.tamaguiConfig

  return {
    components,
    nameToPaths,
    tamaguiConfigMetadata: {
      themeFields: 'values-only',
    },
    tamaguiConfig: {
      ...cleanedConfig,
      // Output userShorthands as shorthands (excludes built-ins)
      shorthands: userShorthands,
      propCategories: buildPropCategories(),
      // every prop that can carry a style value. the shorthand tables alone
      // miss any long-form prop with no shorthand (`gap`, `backgroundColor`),
      // and the language server was silent inside exactly those.
      styleProps: Object.keys(stylePropsAll),
    },
  }
}
