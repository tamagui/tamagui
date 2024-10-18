import { _disableMediaTouch } from '../hooks/useMedia'

export function log(...args: any[]) {
  if (process.env.NODE_ENV === 'production') return
  _disableMediaTouch(true)
  try {
    if (process.env.TAMAGUI_TARGET === 'web') {
      return console.info(...args)
    }
    // react native doesn't log in the cli unless it's log
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    return console.log(...args)
  } finally {
    _disableMediaTouch(false)
  }
}
