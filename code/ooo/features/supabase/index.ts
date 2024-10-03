import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SUPA_URL = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

console.info(`Connecting to supabase: ${SUPA_URL} with key? ${!!SUPA_KEY}`)

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin priviliges and overwrites RLS policies!
export const supabase = createClient<Database>(SUPA_URL, SUPA_KEY)
