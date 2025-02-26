import * as fs from 'fs-extra'

import type { generateThemes } from './generate-themes'

export async function writeGeneratedThemes(
  tamaguiDotDir: string,
  outPath: string,
  generatedOutput: Awaited<ReturnType<typeof generateThemes>>
) {
  if (!generatedOutput) return

  const { generated } = generatedOutput

  if (process.env.DEBUG === 'tamagui') {
    console.info(`Generated themes:`, JSON.stringify(generatedOutput, null, 2))
  }

  await Promise.all([fs.writeFile(outPath, `// @ts-nocheck\n` + generated)])
}
