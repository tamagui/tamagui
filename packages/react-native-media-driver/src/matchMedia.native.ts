import type { MatchMedia } from '@tamagui/web'

import { NativeMediaQueryList } from './mediaQueryList'

export const matchMedia: MatchMedia = (query) => {
  return new NativeMediaQueryList(query)
}
