import { createClient } from '@supabase/supabase-js'
import { Database } from '@my/supabase/types'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error(
    `NEXT_PUBLIC_SUPABASE_URL is not set. Please update the root .env.local and restart the server.`
  )
}
if (!process.env.SUPABASE_SERVICE_ROLE) {
  throw new Error(
    `SUPABASE_SERVICE_ROLE is not set. Please update the root .env.local and restart the server.`
  )
}

/**
 * only meant to be used on the server side.
 */
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
)
