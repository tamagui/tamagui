import type { ViewProps } from '@tamagui/web'
import type {
  ImageResizeMode,
  ImageSourcePropType,
  Image as RNImage,
  ImageProps as RNImageProps,
} from 'react-native'

type RNImageType = typeof RNImage

type KeyofViewProps = keyof ViewProps

export type ImageProps = ViewProps &
  Omit<RNImageProps, KeyofViewProps | 'source' | 'resizeMode' | 'style'> & {
    /**
     * @deprecated
     * use src instead
     */
    source?: ImageSourcePropType
    /**
     * @deprecated
     * use objectFit instead
     */
    resizeMode?: ImageResizeMode
    objectFit?: React.CSSProperties['objectFit']
    objectPosition?: React.CSSProperties['objectPosition']
  } & Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    'width' | 'height' | KeyofViewProps
  > &
  Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height' | 'style'>

export type ImageType = React.FC<Partial<ImageProps>> & {
  getSize: RNImageType['getSize']
  getSizeWithHeaders: RNImageType['getSizeWithHeaders']
  prefetch: RNImageType['prefetch']
  prefetchWithMetadata: RNImageType['prefetchWithMetadata']
  abortPrefetch: RNImageType['abortPrefetch']
  queryCache: RNImageType['queryCache']
}
