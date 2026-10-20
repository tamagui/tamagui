import { _disableMediaTouch } from '../hooks/useMedia'

const isProd = process.env.NODE_ENV === 'production'

export function log(...args: any[]) {
  if (!isProd && process.env.NODE_ENV === 'development') {
    _disableMediaTouch(true)
    try {
      if (process.env.TAMAGUI_TARGET === 'web') {
        return console.info(...args)
      }
      // react native doesn't log in the cli unless it's log
      return console.log(...args)
    } catch (err) {
      console.error(err)
    } finally {
      _disableMediaTouch(false)
    }
  }
}
