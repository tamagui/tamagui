import type { MatchMedia } from '@tamagui/web'

import { NativeMediaQueryList } from './mediaQueryList.native'

export const matchMedia: MatchMedia = (query) => {
  return new NativeMediaQueryList(query)
}
