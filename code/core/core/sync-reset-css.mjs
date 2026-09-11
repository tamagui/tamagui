#!/usr/bin/env node
// the alias re-exports every js entry from @tamagui/style, but a stylesheet cannot be
// re-exported, so copy the one file across on build and keep the two byte-identical.
import { copyFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const here = fileURLToPath(new URL('.', import.meta.url))
copyFileSync(`${here}../style/reset.css`, `${here}reset.css`)
