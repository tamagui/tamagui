#!/usr/bin/env node
import 'dotenv/config'
import { migrate } from 'drizzle-orm/postgres-js/migrator'

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set in the environment variables')
  process.exit(1)
}
import { db, connection } from './connection'

const run = async () => {
  // This will run migrations on the database, skipping the ones already applied
  await migrate(db, { migrationsFolder: './db/migrations' })
  // Don't forget to close the connection, otherwise the script will hang
  await connection.end()
}

run()
