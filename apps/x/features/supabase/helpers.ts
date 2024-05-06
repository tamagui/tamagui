import type { CookieOptions } from '@supabase/auth-helpers-shared'

export const supabaseCookieOptions: CookieOptions = {
  domain: process.env.NODE_ENV === 'production' ? '.tamagui.dev' : 'localhost',
  path: '/',
  sameSite: 'none',
  secure: true,
}
