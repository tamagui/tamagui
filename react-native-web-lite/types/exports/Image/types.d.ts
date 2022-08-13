import { AnimationStyles, BorderStyles, InteractionStyles, LayoutStyles, ShadowStyles, TransformStyles } from '../../styleTypes';
import { ColorValue, GenericStyleProp } from '../../types';
import { ViewProps } from '../View/types';
declare type SourceObject = {
    body?: string;
    cache?: 'default' | 'reload' | 'force-cache' | 'only-if-cached';
    headers?: {
        [K in string]: string;
    };
    method?: string;
    scale?: number;
    uri: string;
    height?: number;
    width?: number;
};
export declare type ResizeMode = 'center' | 'contain' | 'cover' | 'none' | 'repeat' | 'stretch';
export declare type Source = number | string | SourceObject | Array<SourceObject>;
export declare type ImageStyle = {
    backgroundColor?: ColorValue;
    boxShadow?: string;
    filter?: string;
    opacity?: number;
    resizeMode?: ResizeMode;
    tintColor?: ColorValue;
} & AnimationStyles & BorderStyles & InteractionStyles & LayoutStyles & ShadowStyles & TransformStyles;
export declare type ImageProps = {
    blurRadius?: number;
    defaultSource?: Source;
    draggable?: boolean;
    onError?: (e: any) => void;
    onLayout?: (e: any) => void;
    onLoad?: (e: any) => void;
    onLoadEnd?: (e: any) => void;
    onLoadStart?: (e: any) => void;
    onProgress?: (e: any) => void;
    resizeMode?: ResizeMode;
    source?: Source;
    style?: GenericStyleProp<ImageStyle>;
} & ViewProps;
export {};
//# sourceMappingURL=types.d.ts.map