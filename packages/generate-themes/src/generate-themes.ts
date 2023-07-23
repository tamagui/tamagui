import Module from 'module'
import { join } from 'path'

import type { ThemeBuilder } from '@tamagui/theme-builder'

type ThemeBuilderInterceptOpts = {
  onComplete: (result: { themeBuilder: ThemeBuilder<any> }) => void
}

const ogRequire = Module.prototype.require

export async function generateThemes(inputFile: string) {
  const { unregister } = require('esbuild-register/dist/node').register()

  const inputFilePath = inputFile[0] === '.' ? join(process.cwd(), inputFile) : inputFile
  purgeCache(inputFilePath)

  let promise: Promise<null | ThemeBuilder<any>> | null = null as any

  // @ts-ignore
  Module.prototype.require = function (id) {
    // @ts-ignore
    const out = ogRequire.apply(this, arguments)

    if (id === '@tamagui/create-theme/theme-builder' || id === '@tamagui/theme-builder') {
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
    const themeBuilder = promise ? await promise : null
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

  for (const name in themes) {
    const theme: Record<string, string> = themes[name]

    // go through all tokens in current theme and add the new values to dedupedTokens map
    for (const [key, value] of Object.entries(theme)) {
      const uniqueKey = `${name}_${key}`
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

  const baseTypeString = `type Theme = {
${Object.entries(themes.light || themes[Object.keys(themes)[0]])
  .map(([k]) => {
    return `  ${k}: string;\n`
  })
  .join('')}
}`

  let themesString = `${baseTypeString}\n`

  // add all token variables

  dedupedTokens.forEach((names, value) => {
    themesString += `const ${names} = '${value}'\n`
  })
  themesString += '\n'

  dedupedThemes.forEach((theme) => {
    const key = JSON.stringify(theme)
    const [baseName, ...restNames] = dedupedThemeToNames.get(key)!
    const baseTheme = `export const ${baseName} = ${objectToJsString(theme)} as Theme`
    themesString += `\n${baseTheme}`

    if (restNames.length) {
      const duplicateThemes = restNames.map(
        (name) => `export const ${name} = ${baseName} as Theme`
      )
      themesString += `\n\n` + duplicateThemes.join('\n')
    }
  })

  return themesString
}

function objectToJsString(obj: Object, indent = 4) {
  const whitespace = new Array(indent).fill(' ').join('')
  return `{
${Object.entries(obj)
  .map(([k, v]) => {
    const variableName = dedupedTokens.get(v)
    return `${whitespace}${k}: ${variableName}`
  })
  .join(',\n')}
}`
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
    ;(function traverse(mod) {
      // Go over each of the module's children and
      // traverse them
      // @ts-ignore
      mod.children.forEach(function (child) {
        traverse(child)
      })

      // Call the specified callback providing the
      // found cached module
      callback(mod)
    })(mod)
  }
}
