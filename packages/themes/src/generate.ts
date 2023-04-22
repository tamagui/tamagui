import { writeFile } from 'fs/promises'

import { themes } from './themes'

async function run() {
  await writeFile('./generated.json', JSON.stringify(themes, null, 2))

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
