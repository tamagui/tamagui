import type { MediaQueryObject} from '@tamagui/web';
import { setupMatchMedia } from '@tamagui/web'

import { matchMedia } from './matchMedia'

export function createMedia<
  A extends {
    [key: string]: MediaQueryObject
  }
>(media: A): A {
  // this should ideally return a diff object that is then passed to createTamagui
  // but works for now we dont really support swapping out media drivers
  setupMatchMedia(matchMedia)
  return media
}
