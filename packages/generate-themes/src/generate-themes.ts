import Module from 'module'

import type { ThemeBuilder } from '@tamagui/create-theme/theme-builder'
import fs from 'fs-extra'

type ThemeBuilderInterceptOpts = {
  onComplete: (result: { themeBuilder: ThemeBuilder<any> }) => void
}

export async function generateThemes(options: { inPath: string; outPath: string }) {
  require('esbuild-register/dist/node').register()

  let promise: Promise<null | ThemeBuilder<any>> | null = null as any

  const ogRequire = Module.prototype.require
  // @ts-ignore
  Module.prototype.require = function (id) {
    // @ts-ignore
    const out = ogRequire.apply(this, arguments)
    if (id === '@tamagui/create-theme/theme-builder') {
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
    const requiredThemes = require(options.inPath)
    const themes = requiredThemes['default'] || requiredThemes['themes']
    const generatedThemes = generatedThemesToTypescript(themes)

    const themeBuilder = promise ? await promise : null

    await Promise.all([
      fs.writeFile(options.outPath, generatedThemes),
      themeBuilder?.state
        ? fs.writeFile(
            `${options.outPath}.theme-builder.json`,
            JSON.stringify(themeBuilder?.state)
          )
        : null,
    ])
  } finally {
    Module.prototype.require = ogRequire
  }
}

function generatedThemesToTypescript(themes: Record<string, any>) {
  const deduped = new Map<string, Object>()
  const dedupedToNames = new Map<string, string[]>()

  for (const name in themes) {
    const theme = themes[name]
    const key = JSON.stringify(theme)
    if (deduped.has(key)) {
      dedupedToNames.set(key, [...dedupedToNames.get(key)!, name])
    } else {
      deduped.set(key, theme)
      dedupedToNames.set(key, [name])
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

  deduped.forEach((theme) => {
    const key = JSON.stringify(theme)
    const [baseName, ...restNames] = dedupedToNames.get(key)!
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
  .map(([k, v]) => `${whitespace}${k}: '${v}'`)
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
