#!/usr/bin/env node
/**
 * Port utility for kitchen-sink
 *
 * Usage:
 *   node scripts/get-port.js          # get port (reads from .port if exists, else finds available)
 *   node scripts/get-port.js --find   # find available port and write to .port file
 *   node scripts/get-port.js --clear  # remove .port file
 *
 * Environment:
 *   PORT - if set, always use this port (skips .port file)
 *
 * The .port file ensures webpack and playwright use the same port.
 */

const net = require('net')
const fs = require('fs')
const path = require('path')

const DEFAULT_PORT = 9100
const PORT_FILE = path.join(__dirname, '..', '.port')

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer()
    server.once('error', () => resolve(false))
    server.once('listening', () => {
      server.close()
      resolve(true)
    })
    server.listen(port, '127.0.0.1')
  })
}

async function findAvailablePort(startPort, maxAttempts = 20) {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i
    if (await isPortAvailable(port)) {
      return port
    }
  }
  throw new Error(`No available port found in range ${startPort}-${startPort + maxAttempts - 1}`)
}

function readPortFile() {
  try {
    const content = fs.readFileSync(PORT_FILE, 'utf-8').trim()
    const port = parseInt(content, 10)
    if (!isNaN(port) && port > 0) {
      return port
    }
  } catch {
    // file doesn't exist or is invalid
  }
  return null
}

function writePortFile(port) {
  fs.writeFileSync(PORT_FILE, String(port))
}

function clearPortFile() {
  try {
    fs.unlinkSync(PORT_FILE)
  } catch {
    // file doesn't exist
  }
}

async function main() {
  const args = process.argv.slice(2)
  const findMode = args.includes('--find')
  const clearMode = args.includes('--clear')

  // --clear: remove port file
  if (clearMode) {
    clearPortFile()
    console.error('Cleared .port file')
    return
  }

  // if PORT env is set, always use it
  if (process.env.PORT) {
    const port = parseInt(process.env.PORT, 10)
    console.log(port)
    return
  }

  // --find: find available port and write to file
  if (findMode) {
    const port = await findAvailablePort(DEFAULT_PORT)
    writePortFile(port)
    if (port !== DEFAULT_PORT) {
      console.error(`Port ${DEFAULT_PORT} in use, using ${port}`)
    }
    console.log(port)
    return
  }

  // default: read from file, or find if no file
  const savedPort = readPortFile()
  if (savedPort) {
    console.log(savedPort)
    return
  }

  // no saved port, find one (but don't save - use --find to save)
  const port = await findAvailablePort(DEFAULT_PORT)
  if (port !== DEFAULT_PORT) {
    console.error(`Port ${DEFAULT_PORT} in use, using ${port}`)
  }
  console.log(port)
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
