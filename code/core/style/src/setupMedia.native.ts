import { matchMedia } from '@tamagui/react-native-media-driver'
import { setupMatchMedia } from '@tamagui/web'

export function setupMedia<Media extends Record<string, any>>(media: Media): Media {
  setupMatchMedia(matchMedia)
  return media
}
