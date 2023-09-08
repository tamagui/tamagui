import { Database } from '@my/supabase/types'
import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'
import { replaceLocalhost } from '../getLocalhost.native'
import { Config } from '@my/shared-env'

if (!Config.supabaseUrl) {
  throw new Error(
    `EXPO_PUBLIC_SUPABASE_URL is not set. Please update the root .env.local and restart the server.`
  )
}

if (!Config.supabaseAnonKey) {
  throw new Error(
    `EXPO_PUBLIC_SUPABASE_ANON_KEY is not set. Please update the root .env.local and restart the server.`
  )
}

const supabaseUrl = replaceLocalhost(Config.supabaseUrl)

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key)
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value)
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key)
  },
}

export const supabase = createClient<Database>(
  supabaseUrl,
  Config.supabaseAnonKey,
  {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)
