import { join } from 'path'

import * as fs from 'fs-extra'

import { generateThemes } from './generate-themes'

export async function writeGeneratedThemes(
  tamaguiDotDir: string,
  outPath: string,
  generatedOutput: Awaited<ReturnType<typeof generateThemes>>
) {
  const { generated, state } = generatedOutput
  await Promise.all([
    fs.writeFile(outPath, generated),
    state
      ? fs.writeFile(join(tamaguiDotDir, `theme-builder.json`), JSON.stringify(state))
      : null,
  ])
}
