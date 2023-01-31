#!/usr/bin/env node

process.on('beforeExit', () => {
  process.stdout.write(`exiting22123??????`)
})

process.on('SIGINT', () => {
  process.stdout.write(`exiting33123??????`)
})

import './cli.js'
