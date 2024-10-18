import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

export let connection: postgres.Sql

export const db = (() => {
  let val: PostgresJsDatabase<typeof schema>
  if (!global._db) {
    connection = postgres(process.env.DATABASE_URL!)
    val = drizzle(connection, { schema })
    global._db = val
  } else {
    val = global._db
  }
  return val
})()
