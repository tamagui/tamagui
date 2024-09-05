import { defineConfig } from 'drizzle-kit'

console.log('wtf', process.env.DB_URL)

export default defineConfig({
  schema: './schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL!,
  },
  verbose: true,
  strict: true,
})
