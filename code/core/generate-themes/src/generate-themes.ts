import type { ThemeBuilder } from '@tamagui/theme-builder'
import { join } from 'node:path'

type ThemeBuilderInterceptOpts = {
  onComplete: (result: { themeBuilder: ThemeBuilder<any> }) => void
}

let didRegisterOnce = false

export async function generateThemes(inputFile: string) {
  const inputFilePath = inputFile[0] === '.' ? join(process.cwd(), inputFile) : inputFile

  if (!didRegisterOnce) {
    didRegisterOnce = true
    // the unregsiter does basically nothing and keeps a process running
    require('esbuild-register/dist/node').register({
      hookIgnoreNodeModules: false,
    })
  } else {
    purgeCache(inputFilePath)
  }

  let og = process.env.TAMAGUI_KEEP_THEMES
  process.env.TAMAGUI_KEEP_THEMES = '1'
  process.env.TAMAGUI_RUN_THEMEBUILDER = '1'

  try {
    const requiredThemes = require(inputFilePath)

    const themes =
      requiredThemes['default'] ||
      requiredThemes['themes'] ||
      requiredThemes[Object.keys(requiredThemes)[0]]

    const generatedThemes = generatedThemesToTypescript(themes)

    return {
      generated: generatedThemes,
    }
  } catch (err) {
    console.warn(` ⚠️ Error running theme builder:\n`, err?.['stack'] || err)
  } finally {
    process.env.TAMAGUI_KEEP_THEMES = og
  }
}

/**
 * value -> name of variable
 */
const dedupedTokens = new Map<string, string>()

function generatedThemesToTypescript(themes: Record<string, any>) {
  const dedupedThemes = new Map<string, Object>()
  const dedupedThemeToNames = new Map<string, string[]>()

  let i = 0
  for (const name in themes) {
    i++

    const theme: Record<string, string> = themes[name]

    // go through all tokens in current theme and add the new values to dedupedTokens map
    let j = 0
    for (const [key, value] of Object.entries(theme)) {
      i++
      const uniqueKey = `t${i}${j}`
      if (!dedupedTokens.has(value)) {
        dedupedTokens.set(value, uniqueKey)
      }
    }

    const key = JSON.stringify(theme)
    if (dedupedThemes.has(key)) {
      dedupedThemeToNames.set(key, [...dedupedThemeToNames.get(key)!, name])
    } else {
      dedupedThemes.set(key, theme)
      dedupedThemeToNames.set(key, [name])
    }
  }

  if (!themes) {
    throw new Error(`Didn't find any themes exported or returned`)
  }

  const baseKeys = Object.entries(themes.light || themes[Object.keys(themes)[0]]) as [
    string,
    string,
  ][]

  const baseTypeString = `type Theme = {
${baseKeys
  .map(([k]) => {
    return `  ${k}: string;\n`
  })
  .join('')}
}`

  let out = `${baseTypeString}\n`

  // add in the helper function to generate a theme:
  out += `
function t(a: [number, number][]) {
  let res: Record<string,string> = {}
  for (const [ki, vi] of a) {
    res[ks[ki] as string] = colors[vi] as string
  }
  return res as Theme
}
`

  // add all token variables
  out += `export const colors = [\n`
  let index = 0
  const valueToIndex = {}
  dedupedTokens.forEach((name, value) => {
    valueToIndex[value] = index
    index++
    out += `  '${value}',\n`
  })
  out += ']\n\n'

  // add all keys array
  const keys = baseKeys.map(([k]) => k)
  out += `const ks = [\n`
  out += keys.map((k) => `'${k}'`).join(',\n')
  out += `]\n\n`

  // add all themes
  let nameI = 0

  let themeTypes = `type ThemeNames =`
  let exported = `export const themes: Record<ThemeNames, Theme> = {`

  dedupedThemes.forEach((theme) => {
    nameI++
    const key = JSON.stringify(theme)
    const names = dedupedThemeToNames.get(key)!
    const name = `n${nameI}`
    const baseTheme = `const ${name} = ${objectToJsString(theme, keys, valueToIndex)}`
    out += `\n${baseTheme}`
    names.forEach((n) => {
      exported += `\n  ${n}: ${name},`

      if (n.toLowerCase() === n) {
        themeTypes += `\n | '${n}'`
      }
    })
  })

  out += `\n\n${themeTypes}\n\n${exported}\n}\n`

  return out
}

function objectToJsString(
  obj: Object,
  keys: string[],
  valueToIndex: Record<string, number>
) {
  let arrItems: string[] = []
  for (const key in obj) {
    const ki = keys.indexOf(key)
    const vi = valueToIndex[obj[key]]
    arrItems.push(`[${ki}, ${vi}]`)
  }
  return `t([${arrItems.join(',')}])`
}

/**
 * Removes a module from the cache
 */
function purgeCache(moduleName) {
  // Traverse the cache looking for the files
  // loaded by the specified module name
  searchCache(moduleName, (mod) => {
    delete require.cache[mod.id]
  })

  // @ts-ignore
  if (!module.constructor || !module.constructor._pathCache) {
    // bun doesn't have this
    return
  }

  // Remove cached paths to the module.
  // Thanks to @bentael for pointing this out.
  // @ts-ignore
  Object.keys(module.constructor._pathCache).forEach((cacheKey) => {
    if (cacheKey.indexOf(moduleName) > 0) {
      // @ts-ignore
      delete module.constructor._pathCache[cacheKey]
    }
  })
}

/**
 * Traverses the cache to search for all the cached
 * files of the specified module name
 */
function searchCache(moduleName, callback) {
  // Resolve the module identified by the specified name
  let mod = require.resolve(moduleName)

  // Check if the module has been resolved and found within
  // the cache
  // @ts-ignore
  if (mod && (mod = require.cache[mod]) !== undefined) {
    // Recursively go over the results
    ;(function traverse(mod, depth = 0) {
      // avoid recursing too much
      if (depth > 10) return

      // Go over each of the module's children and
      // traverse them
      // @ts-ignore
      mod.children.forEach((child) => {
        traverse(child, depth + 1)
      })

      // Call the specified callback providing the
      // found cached module
      callback(mod)
    })(mod)
  }
}
