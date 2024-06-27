export function getSingle<T>(arrOrObj: T | T[]) {
  if (Array.isArray(arrOrObj)) return arrOrObj[0]
  return arrOrObj
}

export function getArray<T>(arrOrObj: T | T[]) {
  if (Array.isArray(arrOrObj)) return arrOrObj
  return [arrOrObj]
}

import type { CookieOptions } from '@supabase/auth-helpers-shared'

export const supabaseCookieOptions: CookieOptions = {
  domain: process.env.NODE_ENV === 'production' ? '.tamagui.dev' : 'localhost',
  path: '/',
  sameSite: 'none',
  secure: true,
}
