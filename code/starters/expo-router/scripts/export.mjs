import { createRequire } from 'node:module'

const [platform, outputDir] = process.argv.slice(2)
if (!['web', 'ios', 'android'].includes(platform) || !outputDir) {
  throw new Error('usage: node scripts/export.mjs <web|ios|android> <output-dir>')
}

const require = createRequire(import.meta.url)
const { expoExport } = require('@expo/cli/build/src/export')

await expoExport(['--platform', platform, '--output-dir', outputDir])

// static rendering can leave application timers alive after Expo completes;
// the export promise is the authoritative completion signal.
process.exit(process.exitCode ?? 0)
