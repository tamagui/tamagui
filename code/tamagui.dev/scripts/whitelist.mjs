#!/usr/bin/env node
// @ts-check
/**
 * CLI script to manage the pro whitelist
 *
 * Usage:
 *   bun scripts/whitelist.mjs list                    - list all whitelisted users
 *   bun scripts/whitelist.mjs add <username> [note]   - add user to whitelist
 *   bun scripts/whitelist.mjs remove <username>       - remove user from whitelist
 *   bun scripts/whitelist.mjs check <username>        - check if user is whitelisted
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPA_URL || !SUPA_KEY) {
  console.error(
    'Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set'
  )
  process.exit(1)
}

const supabase = createClient(SUPA_URL, SUPA_KEY)

const [, , command, ...args] = process.argv

async function list() {
  const { data, error } = await supabase
    .from('pro_whitelist')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching whitelist:', error.message)
    process.exit(1)
  }

  if (!data?.length) {
    console.log('No whitelisted users.')
    return
  }

  console.log(`\nPro Whitelist (${data.length} users):\n`)
  console.log('─'.repeat(60))

  for (const entry of data) {
    const date = new Date(entry.created_at).toLocaleDateString()
    console.log(`  @${entry.github_username}`)
    if (entry.note) {
      console.log(`    Note: ${entry.note}`)
    }
    console.log(`    Added: ${date}`)
    console.log('')
  }
}

async function add(username, note) {
  if (!username) {
    console.error('Error: username is required')
    console.log('Usage: bun scripts/whitelist.mjs add <username> [note]')
    process.exit(1)
  }

  // validate github username format
  if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(username)) {
    console.error('Error: Invalid GitHub username format')
    process.exit(1)
  }

  const { data, error } = await supabase
    .from('pro_whitelist')
    .insert({
      github_username: username,
      note: note || null,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      console.error(`Error: @${username} is already whitelisted`)
    } else {
      console.error('Error adding to whitelist:', error.message)
    }
    process.exit(1)
  }

  console.log(`✓ Added @${username} to whitelist`)
  if (note) {
    console.log(`  Note: ${note}`)
  }
}

async function remove(username) {
  if (!username) {
    console.error('Error: username is required')
    console.log('Usage: bun scripts/whitelist.mjs remove <username>')
    process.exit(1)
  }

  const { error, count } = await supabase
    .from('pro_whitelist')
    .delete()
    .ilike('github_username', username)

  if (error) {
    console.error('Error removing from whitelist:', error.message)
    process.exit(1)
  }

  if (count === 0) {
    console.log(`@${username} was not on the whitelist`)
  } else {
    console.log(`✓ Removed @${username} from whitelist`)
  }
}

async function check(username) {
  if (!username) {
    console.error('Error: username is required')
    console.log('Usage: bun scripts/whitelist.mjs check <username>')
    process.exit(1)
  }

  const { data, error } = await supabase
    .from('pro_whitelist')
    .select('*')
    .ilike('github_username', username)
    .maybeSingle()

  if (error) {
    console.error('Error checking whitelist:', error.message)
    process.exit(1)
  }

  if (data) {
    console.log(`✓ @${data.github_username} is whitelisted`)
    if (data.note) {
      console.log(`  Note: ${data.note}`)
    }
    console.log(`  Added: ${new Date(data.created_at).toLocaleDateString()}`)
  } else {
    console.log(`✗ @${username} is not whitelisted`)
  }
}

async function main() {
  switch (command) {
    case 'list':
    case 'ls':
      await list()
      break
    case 'add':
      await add(args[0], args.slice(1).join(' '))
      break
    case 'remove':
    case 'rm':
    case 'delete':
      await remove(args[0])
      break
    case 'check':
      await check(args[0])
      break
    default:
      console.log(`
Pro Whitelist Management

Usage:
  bun scripts/whitelist.mjs list                    List all whitelisted users
  bun scripts/whitelist.mjs add <username> [note]   Add user to whitelist
  bun scripts/whitelist.mjs remove <username>       Remove user from whitelist
  bun scripts/whitelist.mjs check <username>        Check if user is whitelisted

Examples:
  bun scripts/whitelist.mjs add DaveyEke "contributor - 51 contributions"
  bun scripts/whitelist.mjs check DaveyEke
  bun scripts/whitelist.mjs remove DaveyEke
`)
      if (command) {
        console.error(`Unknown command: ${command}`)
        process.exit(1)
      }
  }
}

main().catch((err) => {
  console.error('Script failed:', err)
  process.exit(1)
})
