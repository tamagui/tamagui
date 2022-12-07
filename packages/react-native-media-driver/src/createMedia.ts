import { setupMatchMedia } from '@tamagui/core'
import { matchMedia } from './matchMedia'

export function createMedia<A extends Object>(media: A): A{
  setupMatchMedia(matchMedia)
  return media
}
