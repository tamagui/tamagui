#!/usr/bin/env node

import { disposeAll } from './utils'

// dispose
;['exit', 'SIGINT'].forEach((_) => {
  process.on(_, () => {
    disposeAll()
    process.exit()
  })
})

process.on('uncaughtException', (err) => {
  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log(err?.message || err)
})

require('./dev').dev()
