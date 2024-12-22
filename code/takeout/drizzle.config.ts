import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL!,
  },
  verbose: true,
  strict: true,
})
