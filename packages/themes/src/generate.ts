import { writeFile } from 'fs/promises'

import { themes } from './themes'
import { themes as themesOld } from './themes-old'

async function run() {
  await writeFile('./generated/generated.json', JSON.stringify(themes, null, 2))
  await writeFile('./generated/generated-old.json', JSON.stringify(themesOld, null, 2))

  await writeFile('./generated/generated.ts', generatedThemesToTypescript(themes))
  await writeFile('./generated/generated-old.ts', generatedThemesToTypescript(themesOld))

  const baseType = `type Theme = {
${Object.entries(themes.light)
  .map(([k]) => {
    return `  ${k}: string;\n`
  })
  .join('')}
}`

  const types = Object.keys(themes)
    .map((name) => {
      return `export type ${name} = Theme`
    })
    .join('\n')

  await writeFile('./generated.d.ts', `${baseType}\n${types}`)
}

run()

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
