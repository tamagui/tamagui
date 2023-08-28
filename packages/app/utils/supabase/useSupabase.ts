import { Database } from '@my/supabase/types'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export const useSupabase = () => {
  return useSupabaseClient<Database>()
}
