import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import subsetFont from 'subset-font'

export async function subset({
  inputFiles,
  characters,
  outputDir,
  targetFormat,
}: {
  outputDir: string
  targetFormat: 'woff2' | 'sfnt' | 'woff' | 'truetype'
  inputFiles: string[]
  characters: string
}) {
  try {
    await mkdir(outputDir)
  } catch {
    // ok
  }
  await Promise.all(
    inputFiles.map(async (file) => {
      const font = await readFile(file)
      const buffer = await subsetFont(font, characters, {
        targetFormat,
      })
      const fileBaseName = basename(file).replace(/\..*/, '')
      const outPath = join(outputDir, fileBaseName + `.${targetFormat}`)
      await writeFile(outPath, buffer)
    })
  )
}

const characters = {
  en: {
    minimal: `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-=_+{}[]|\\/.,<>;:'"\``,
  },
}

const inputFiles = [join('public/fonts', `berkeley.otf`)]

subset({
  inputFiles,
  outputDir: 'public/fonts',
  targetFormat: 'woff2',
  characters: characters.en.minimal,
})
