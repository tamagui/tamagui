import { join } from 'path'

import * as fs from 'fs-extra'

import { generateThemes } from './generate-themes'

export async function writeGeneratedThemes(
  tamaguiDotDir: string,
  outPath: string,
  generatedOutput: Awaited<ReturnType<typeof generateThemes>>
) {
  const { generated, state } = generatedOutput

  const tamaguiDotDirExists = await fs.pathExists(tamaguiDotDir)
  const themeBuilderStatePath = join(tamaguiDotDir, `theme-builder.json`)

  if (process.env.DEBUG === 'tamagui') {
    // rome-ignore lint/nursery/noConsoleLog: <explanation>
    console.log(`Generated themes:`, JSON.stringify(generatedOutput, null, 2))
    // rome-ignore lint/nursery/noConsoleLog: <explanation>
    console.log(`Writing themes to`, { outPath, themeBuilderStatePath })
  }

  await Promise.all([
    fs.writeFile(outPath, generated),
    state && tamaguiDotDirExists
      ? fs.writeFile(themeBuilderStatePath, JSON.stringify(state))
      : null,
  ])
}
