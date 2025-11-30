import type { ViewProps } from '@tamagui/web';
import type { ImageResizeMode, ImageSourcePropType, Image as RNImage, ImageProps as RNImageProps } from 'react-native';
type RNImageType = typeof RNImage;
type KeyofViewProps = keyof ViewProps;
export type ImageProps = ViewProps & Omit<RNImageProps, KeyofViewProps | 'source' | 'resizeMode' | 'style'> & {
    /**
     * The image source URL or require() result.
     * Preferred over `source` for better web alignment.
     */
    src?: string;
    /**
     * @deprecated
     * use src instead
     */
    source?: ImageSourcePropType;
    /**
     * @deprecated
     * use objectFit instead
     */
    resizeMode?: ImageResizeMode;
    /**
     * How the image should be resized to fit its container.
     * Maps to CSS object-fit on web and resizeMode on native.
     */
    objectFit?: React.CSSProperties['objectFit'];
    /**
     * How the image should be positioned within its container.
     * Maps to CSS object-position on web.
     * On native, requires expo-image or similar for full support.
     */
    objectPosition?: React.CSSProperties['objectPosition'];
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height' | KeyofViewProps | 'src'> & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height' | 'style' | 'src'>;
export type ImageType = React.FC<Partial<ImageProps>> & {
    getSize: RNImageType['getSize'];
    getSizeWithHeaders: RNImageType['getSizeWithHeaders'];
    prefetch: RNImageType['prefetch'];
    prefetchWithMetadata: RNImageType['prefetchWithMetadata'];
    abortPrefetch: RNImageType['abortPrefetch'];
    queryCache: RNImageType['queryCache'];
};
export {};
//# sourceMappingURL=types.d.ts.map