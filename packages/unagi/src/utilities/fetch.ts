import { LIB_VERSION } from '../version.js'

const defaultHeaders = {
  'content-type': 'application/json',
  'user-agent': `Unagi ${LIB_VERSION}`,
}

type FetchInit = {
  body?: string
  method?: string
  headers?: Record<string, string>
}

export function fetchBuilder<T>(url: string, options: FetchInit = {}) {
  const requestInit = {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  }

  return async () => {
    const response = await fetch(url, requestInit)

    if (!response.ok) {
      throw response
    }

    const data = await response.json()

    return data as T
  }
}
