import Module from 'module'
import { join } from 'path'

import type { ThemeBuilder } from '@tamagui/theme-builder'

type ThemeBuilderInterceptOpts = {
  onComplete: (result: { themeBuilder: ThemeBuilder<any> }) => void
}

const ogRequire = Module.prototype.require

export async function generateThemes(inputFile: string) {
  const { unregister } = require('esbuild-register/dist/node').register({
    hookIgnoreNodeModules: false,
  })

  const inputFilePath = inputFile[0] === '.' ? join(process.cwd(), inputFile) : inputFile
  purgeCache(inputFilePath)

  let promise: Promise<null | ThemeBuilder<any>> | null = null as any

  // @ts-ignore
  Module.prototype.require = function (id) {
    // @ts-ignore
    const out = ogRequire.apply(this, arguments)

    if (id === '@tamagui/theme-builder') {
      if (!promise) {
        let resolve: Function
        promise = new Promise((res) => {
          resolve = res
        })
        return createThemeIntercept(out, {
          onComplete: (result) => {
            resolve?.(result.themeBuilder)
          },
        })
      }
    }
    return out
  }

  try {
    const requiredThemes = require(inputFilePath)
    const themes = requiredThemes['default'] || requiredThemes['themes']
    const generatedThemes = generatedThemesToTypescript(themes)

    let tm: any
    if (promise) {
      let finished = false
      promise.then(() => {
        finished = true
      })
      // handle never finishing promise with nice error
      tm = setTimeout(() => {
        if (!finished) {
          console.warn(
            `Warning: ThemeBuilder didn't finish after a couple seconds, did you forget to call .build()?`
          )
        }
      }, 2000)
    }

    const themeBuilder = promise ? await promise : null
    clearTimeout(tm)

    return {
      generated: generatedThemes,
      state: themeBuilder?.state,
    }
  } catch (err) {
    console.warn(` ⚠️ Error running theme builder: ${err}`, err?.['stack'])
  } finally {
    Module.prototype.require = ogRequire
    unregister()
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

  const baseKeys = Object.entries(themes.light || themes[Object.keys(themes)[0]]) as [
    string,
    string
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
    res[ks[ki] as string] = vs[vi] as string
  }
  return res as Theme
}
`

  // add all token variables
  out += `const vs = [\n`
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
  dedupedThemes.forEach((theme) => {
    nameI++
    const key = JSON.stringify(theme)
    const names = dedupedThemeToNames.get(key)!
    const name = `n${nameI}`
    const baseTheme = `const ${name} = ${objectToJsString(theme, keys, valueToIndex)}`
    out += `\n${baseTheme}`
    const duplicateThemes = names.map((n) => `export const ${n} = ${name}`)
    out += `\n\n` + duplicateThemes.join('\n')
  })

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

function createThemeIntercept(
  createThemeExport: any,
  themeBuilderInterceptOpts: ThemeBuilderInterceptOpts
) {
  return new Proxy(createThemeExport, {
    get(target, key) {
      const out = Reflect.get(target, key)
      if (key === 'createThemeBuilder') {
        return new Proxy(out, {
          apply(target, thisArg, argArray) {
            const builder = Reflect.apply(target, thisArg, argArray) as any
            return themeBuilderIntercept(builder, themeBuilderInterceptOpts)
          },
        })
      }
      return out
    },
  })
}

function themeBuilderIntercept(
  themeBuilder: any,
  themeBuilderInterceptOpts: ThemeBuilderInterceptOpts
) {
  return new Proxy(themeBuilder, {
    get(target, key) {
      const out = Reflect.get(target, key)
      if (key === 'build') {
        // get the state and return!
        themeBuilderInterceptOpts.onComplete({
          themeBuilder,
        })
      }
      return out
    },
  })
}

/**
 * Removes a module from the cache
 */
function purgeCache(moduleName) {
  // Traverse the cache looking for the files
  // loaded by the specified module name
  searchCache(moduleName, function (mod) {
    delete require.cache[mod.id]
  })

  // Remove cached paths to the module.
  // Thanks to @bentael for pointing this out.
  // @ts-ignore
  Object.keys(module.constructor._pathCache).forEach(function (cacheKey) {
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
      mod.children.forEach(function (child) {
        traverse(child, depth + 1)
      })

      // Call the specified callback providing the
      // found cached module
      callback(mod)
    })(mod)
  }
}
