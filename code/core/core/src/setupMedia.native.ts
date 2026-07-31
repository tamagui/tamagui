import { createMedia } from '@tamagui/react-native-media-driver'

export function setupMedia<Media extends Record<string, any>>(media: Media): Media {
  return createMedia(media)
}
