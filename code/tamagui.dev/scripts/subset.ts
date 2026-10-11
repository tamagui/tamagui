// regenerates public/fonts/inter.woff2, the site's only text webfont.
//
// Inter 4.1 ships a variable file with two axes. we pin opsz to its 14 default
// (keeping it costs ~32kb for a refinement nobody will spot) and keep wght as a
// 200-900 range, which covers every weight the site asks for from one file.
// the character set is latin + latin-1 + the punctuation and arrows the docs use.
//
//   bun scripts/subset.ts
//
// no italic: there is no roman/italic pairing worth 58kb here, the browser
// obliques the roman for the few <em>s in the docs.

import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import subsetFont from 'subset-font'

const INTER_VERSION = '4.1'
const cacheDir = join(import.meta.dirname, '.fonts')
const source = join(cacheDir, 'InterVariable.ttf')

const characters =
  `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ` +
  `!@#$%^&*()-=_+{}[]|\\/.,<>;:'"\`~? ` +
  `→↗↑↓←•…–—‘’“”£€¥©®™°±×÷§¶†` +
  `ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŒœŠšŸŽž`

if (!existsSync(source)) {
  const zip = join(cacheDir, `Inter-${INTER_VERSION}.zip`)
  await mkdir(cacheDir, { recursive: true })
  console.info(`downloading Inter ${INTER_VERSION}...`)
  execSync(
    `curl -sL -o ${zip} https://github.com/rsms/inter/releases/download/v${INTER_VERSION}/Inter-${INTER_VERSION}.zip`
  )
  execSync(`unzip -o -j -q ${zip} InterVariable.ttf -d ${cacheDir}`)
}

const out = await subsetFont(await readFile(source), characters, {
  targetFormat: 'woff2',
  variationAxes: {
    opsz: 14,
    wght: { min: 200, max: 900 },
  },
})

await writeFile('public/fonts/inter.woff2', out)
console.info(`public/fonts/inter.woff2 ${(out.length / 1024).toFixed(1)}kb`)
