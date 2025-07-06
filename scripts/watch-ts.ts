import type { ChildProcess } from 'node:child_process'
import { spawn } from 'node:child_process'

let child: ChildProcess

if (process.env.IS_TAMAGUI_DEV) {
  child = spawn(`yarn`, `typecheck -w`.split(' '), { stdio: 'inherit' })
} else {
  child = spawn(`yarn`, `typecheck:locked -w`.split(' '), { stdio: 'inherit' })
}

child.on('close', (code) => {
  console.info(`Exited with code ${code}`)
})
