import { isWeb } from '@my/ui'
import { replaceLocalhost } from './getLocalhost.native'
import { Config } from '@my/shared-env'

export function _getBaseUrl() {
  if (isWeb && typeof window !== 'undefined') {
    console.log(typeof window)
    // browser should use relative path
    return ''
  }
  if (Config.publicUrl) {
    // overwrites the rest - set this on your native app deployment
    return `${Config.publicUrl}`
  }

  if (process.env.VERCEL_URL) {
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`
  }

  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export function getBaseUrl() {
  let url = _getBaseUrl()
  if (!isWeb) {
    url = replaceLocalhost(url)
  }
  return url
}
