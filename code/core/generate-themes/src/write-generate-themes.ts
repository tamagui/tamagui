import { join } from 'node:path'

import * as fs from 'fs-extra'

import type { generateThemes } from './generate-themes'

export async function writeGeneratedThemes(
  tamaguiDotDir: string,
  outPath: string,
  generatedOutput: Awaited<ReturnType<typeof generateThemes>>
) {
  if (!generatedOutput) return

  const { generated, state } = generatedOutput

  const tamaguiDotDirExists = await fs.pathExists(tamaguiDotDir)
  const themeBuilderStatePath = join(tamaguiDotDir, `theme-builder.json`)

  if (process.env.DEBUG === 'tamagui') {
    console.info(`Generated themes:`, JSON.stringify(generatedOutput, null, 2))
    console.info(`Writing themes to`, { outPath, themeBuilderStatePath })
  }

  await Promise.all([
    fs.writeFile(outPath, `// @ts-nocheck\n` + generated),
    state && tamaguiDotDirExists
      ? fs.writeFile(themeBuilderStatePath, JSON.stringify(state))
      : null,
  ])
}
