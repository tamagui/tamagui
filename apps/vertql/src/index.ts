#!/usr/bin/env node

import { defineCommand, runMain } from 'citty'

import { disposeAll } from './utils'

registerProcessHandlers()

const main = defineCommand({
  meta: {
    name: 'vertql',
    version: '0.0.0',
    description: 'a better stack',
  },
  args: {
    // name: {
    //   type: 'positional',
    //   description: 'Your name',
    //   required: true,
    // },
    // friendly: {
    //   type: 'boolean',
    //   description: 'Use friendly greeting',
    // },
  },

  async run({ args }) {
    (await import('./dev.mjs')).dev({})
  },
})

runMain(main)

function registerProcessHandlers() {
  // dispose
  ;['exit', 'SIGINT'].forEach((_) => {
    process.on(_, () => {
      disposeAll()
      process.exit()
    })
  })

  process.on('uncaughtException', (err) => {
    console.error(err?.message || err)
  })
}
