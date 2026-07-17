import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { expoExport } = require('@expo/cli/build/src/export')

await expoExport(['--platform', 'web'])

// static rendering can leave application timers alive after Expo completes;
// the export promise is the authoritative completion signal.
process.exit(process.exitCode ?? 0)
