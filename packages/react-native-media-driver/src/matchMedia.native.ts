import { MatchMedia } from '@tamagui/web'

import { NativeMediaQueryList } from './mediaQueryList.js'

export const matchMedia: MatchMedia = (query) => {
  return new NativeMediaQueryList(query)
}
