import { Image as RNImage } from 'react-native'
import { createImage } from './createImage'
import type { ImageType } from './types'

export const Image: ImageType = createImage({
  Component: RNImage,
})
