#!/usr/bin/env node
// Spawns the platform binary, forwarding stdio so the editor talks to it
// directly. `execvp`-style replacement is not available in node, so the parent
// stays alive and mirrors the child's exit code and signal.

import { spawn } from 'node:child_process'
import { binaryPath } from './index.js'

const child = spawn(binaryPath(), process.argv.slice(2), { stdio: 'inherit' })

child.on('exit', (code, signal) => {
  // a signalled child must look signalled to whatever launched us, or an
  // editor cannot tell a crash from a clean shutdown
  if (signal) {
    process.kill(process.pid, signal)
    return
  }
  process.exit(code ?? 0)
})

child.on('error', (error) => {
  console.error(`tamagui-lsp: ${error.message}`)
  process.exit(1)
})
