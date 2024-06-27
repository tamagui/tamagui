type CookieOptions = {
  key: string
  value: string
  path?: string
  domain?: string
  expiration?: number // in seconds
  secure?: boolean
  httpOnly?: boolean
  sameSite?: 'strict' | 'lax' | 'none' | 'Strict' | 'Lax' | 'None' | boolean
}

export function createCookie(options: CookieOptions) {
  let cookie = `${options.key}=${encodeURIComponent(options.value)}`
  if (options.expiration) {
    const date = new Date()
    date.setTime(date.getTime() + options.expiration * 1000)
    cookie += `; Expires=${date.toUTCString()}`
  }
  if (options.path) {
    cookie += `; Path=${options.path}`
  }
  if (options.domain) {
    cookie += `; Domain=${options.domain}`
  }
  if (options.secure) {
    cookie += '; Secure'
  }
  if (options.httpOnly) {
    cookie += '; HttpOnly'
  }
  if (options.sameSite) {
    cookie += `; SameSite=${options.sameSite === true ? 'strict' : options.sameSite}`
  }
  return cookie
}

export function setCookie(headers: Headers, options: CookieOptions) {
  headers.append('Set-Cookie', createCookie(options))
}

export function removeCookie(headers: Headers, key: string) {
  headers.delete(key)
}

export function getCookie(headers: Headers, key: string): string | null {
  const cookies = headers.getSetCookie()
  if (!cookies) return null
  for (const cookie of cookies) {
    const [cookieKey, cookieValue] = cookie.split('=')
    if (cookieKey === key) {
      return decodeURIComponent(cookieValue)
    }
  }
  return null
}
