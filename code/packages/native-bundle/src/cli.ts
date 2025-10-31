#!/usr/bin/env node
import { runCLI } from './index.js'

runCLI().catch((error) => {
  console.error(error)
  process.exit(1)
})
