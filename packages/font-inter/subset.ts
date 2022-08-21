import { mkdir, readFile, rm, rmdir, writeFile } from 'fs/promises'
import { basename, join } from 'path'

import subsetFont from 'subset-font'

export async function subset({
  inputFiles,
  characters,
  outputDir,
  targetFormat,
}: {
  outputDir: string
  targetFormat: string
  inputFiles: string[]
  characters: string
}) {
  try {
    await rm(outputDir, { recursive: true })
  } catch {}
  await mkdir(outputDir)
  console.log(`Subsetting`, inputFiles)
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

const base = [
  'Thin',
  'ExtraLight',
  'Light',
  'Medium',
  'SemiBold',
  'Bold',
  'ExtraBold',
  'Black',
].map((f) => `Inter-${f}`)
const italics = base.map((b) => `${b}Italic`)

const inputFiles = [...base, ...italics].map((f) => join('tmp', `${f}.otf`))

subset({
  inputFiles,
  outputDir: 'woff2',
  targetFormat: 'woff2',
  characters: characters.en.minimal,
})
