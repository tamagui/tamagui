import { MediaQueryObject, setupMatchMedia } from '@tamagui/core'

import { matchMedia } from './matchMedia'

export function createMedia<
  A extends {
    [key: string]: MediaQueryObject
  }
>(media: A): A {
  setupMatchMedia(matchMedia)
  return media
}
