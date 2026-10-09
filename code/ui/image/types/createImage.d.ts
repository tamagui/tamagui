import type { ComponentType } from 'react';
import type { ImageResizeMode } from '@tamagui/react-native-types';
import type { ImageProps } from './types';
type GetProps<T> = T extends ComponentType<infer P> ? P : never;
export type CreateImageOptions<C extends ComponentType<any>> = {
    /**
     * The underlying image component to use.
     * Can be React Native Image, expo-image, react-native-fast-image, or any compatible component.
     */
    Component: C;
    /**
     * Map objectFit CSS values to the component's resize mode prop.
     * Default maps to React Native's resizeMode.
     */
    mapObjectFitToResizeMode?: (objectFit: string) => string;
    /**
     * The prop name used for resize mode.
     * Default: 'resizeMode' (React Native)
     * expo-image uses: 'contentFit'
     */
    resizeModePropName?: string;
    /**
     * The prop name used for object position.
     * Default: undefined (React Native doesn't support it)
     * expo-image uses: 'contentPosition'
     */
    objectPositionPropName?: string;
    /**
     * Custom source transformation.
     * Useful for expo-image which has a different source format.
     */
    transformSource?: (props: {
        src?: string | number;
        source?: any;
        width?: any;
        height?: any;
    }) => any;
};
/**
 * Create a custom Image component with a pluggable underlying implementation.
 *
 * @example
 * Using with expo-image
 * import { Image as ExpoImage } from 'expo-image'
 * import { createImage } from '@tamagui/image'
 *
 * export const Image = createImage({
 *   Component: ExpoImage,
 *   resizeModePropName: 'contentFit',
 *   objectPositionPropName: 'contentPosition',
 * })
 *
 * Now you get all expo-image props (transition, placeholder, etc.)
 * plus Tamagui's unified API (src, objectFit, objectPosition)
 * <Image
 *   src="https://example.com/photo.jpg"
 *   objectFit="cover"
 *   transition={300}
 *   placeholder={blurhash}
 * />
 */
export declare function createImage<C extends ComponentType<any>>(options: CreateImageOptions<C>): import("react").FC<Partial<ImageProps>> & {
    getSize: {
        (uri: string): Promise<import("@tamagui/react-native-types").ImageSize>;
        (uri: string, success: (width: number, height: number) => void, failure?: (error: unknown) => void): void;
    };
    getSizeWithHeaders: {
        (uri: string, headers: {
            [$$Key$$: string]: string;
        }): Promise<import("@tamagui/react-native-types").ImageSize>;
        (uri: string, headers: {
            [$$Key$$: string]: string;
        }, success: (width: number, height: number) => void, failure?: (error: unknown) => void): void;
    };
    prefetch: (url: string) => Promise<boolean>;
    prefetchWithMetadata: (url: string, queryRootName: string, rootTag?: import("@tamagui/react-native-types").RootTag | undefined) => Promise<boolean>;
    abortPrefetch: import("@tamagui/react-native-types").ImageAndroid['abortPrefetch'];
    queryCache: (urls: Array<string>) => Promise<{
        [url: string]: 'memory' | 'disk' | 'disk/memory';
    }>;
} & import("react").FC<import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, never>> & import("@tamagui/web").WithFlatVariantValues<{}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & Omit<Readonly<Omit<Readonly<{
    defaultSource?: import("@tamagui/react-native-types").ImageSource | undefined;
    onPartialLoad?: (() => void) | undefined;
    onProgress?: ((event: import("@tamagui/react-native-types").ImageProgressEventIOS) => void) | undefined;
}>, "fadeDuration" | "loadingIndicatorSource" | "progressiveRenderingEnabled" | "resizeMethod" | "resizeMultiplier" | "style" | keyof import("@tamagui/react-native-types").ImagePropsBase> & Omit<Readonly<{
    loadingIndicatorSource?: (number | Readonly<import("@tamagui/react-native-types").ImageURISource>) | undefined;
    progressiveRenderingEnabled?: boolean | undefined;
    fadeDuration?: number | undefined;
    resizeMethod?: ('auto' | 'resize' | 'scale' | 'none') | undefined;
    resizeMultiplier?: number | undefined;
}>, "style" | keyof import("@tamagui/react-native-types").ImagePropsBase> & Omit<import("@tamagui/react-native-types").ImagePropsBase, "style"> & {
    style?: import("@tamagui/react-native-types").ImageStyleProp | undefined;
}>, "resizeMode" | "source" | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase> & {
    src?: string | number;
    source?: import("@tamagui/react-native-types").ImageSourcePropType;
    resizeMode?: ImageResizeMode;
    objectFit?: React.CSSProperties['objectFit'];
    objectPosition?: React.CSSProperties['objectPosition'];
} & Omit<import("react").ImgHTMLAttributes<HTMLImageElement>, "src" | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase> & Omit<import("react").ImgHTMLAttributes<HTMLImageElement>, "height" | "src" | "style" | "width"> & Omit<GetProps<C>, "about" | "accessKey" | "alt" | "aria-activedescendant" | "aria-atomic" | "aria-autocomplete" | "aria-braillelabel" | "aria-brailleroledescription" | "aria-colcount" | "aria-colindex" | "aria-colindextext" | "aria-colspan" | "aria-controls" | "aria-current" | "aria-describedby" | "aria-description" | "aria-details" | "aria-dropeffect" | "aria-errormessage" | "aria-flowto" | "aria-grabbed" | "aria-haspopup" | "aria-invalid" | "aria-keyshortcuts" | "aria-level" | "aria-multiline" | "aria-multiselectable" | "aria-orientation" | "aria-owns" | "aria-placeholder" | "aria-posinset" | "aria-pressed" | "aria-readonly" | "aria-relevant" | "aria-required" | "aria-roledescription" | "aria-rowcount" | "aria-rowindex" | "aria-rowindextext" | "aria-rowspan" | "aria-setsize" | "aria-sort" | "autoCapitalize" | "autoCorrect" | "autoFocus" | "autoSave" | "blurRadius" | "capInsets" | "contentEditable" | "contextMenu" | "crossOrigin" | "datatype" | "decoding" | "defaultChecked" | "defaultSource" | "defaultValue" | "dir" | "draggable" | "enterKeyHint" | "exportparts" | "fadeDuration" | "fetchPriority" | "focusable" | "hidden" | "inert" | "inlist" | "inputMode" | "internal_analyticTag" | "is" | "itemID" | "itemProp" | "itemRef" | "itemScope" | "itemType" | "lang" | "loading" | "loadingIndicatorSource" | "nonce" | "onAbort" | "onAbortCapture" | "onAnimationEnd" | "onAnimationEndCapture" | "onAnimationIteration" | "onAnimationIterationCapture" | "onAnimationStart" | "onAnimationStartCapture" | "onAuxClick" | "onAuxClickCapture" | "onBeforeInputCapture" | "onBeforeToggle" | "onCanPlay" | "onCanPlayCapture" | "onCanPlayThrough" | "onCanPlayThroughCapture" | "onChangeCapture" | "onCompositionEnd" | "onCompositionEndCapture" | "onCompositionStart" | "onCompositionStartCapture" | "onCompositionUpdate" | "onCompositionUpdateCapture" | "onContextMenuCapture" | "onCopyCapture" | "onCutCapture" | "onDoubleClickCapture" | "onDragCapture" | "onDragEndCapture" | "onDragEnterCapture" | "onDragExit" | "onDragExitCapture" | "onDragLeaveCapture" | "onDragOverCapture" | "onDragStartCapture" | "onDropCapture" | "onDurationChange" | "onDurationChangeCapture" | "onEmptied" | "onEmptiedCapture" | "onEncrypted" | "onEncryptedCapture" | "onEnded" | "onEndedCapture" | "onError" | "onErrorCapture" | "onInputCapture" | "onInvalid" | "onInvalidCapture" | "onKeyPress" | "onKeyPressCapture" | "onLayout" | "onLoad" | "onLoadCapture" | "onLoadEnd" | "onLoadStart" | "onLoadStartCapture" | "onLoadedData" | "onLoadedDataCapture" | "onLoadedMetadata" | "onLoadedMetadataCapture" | "onMouseDownCapture" | "onMouseMoveCapture" | "onMouseOutCapture" | "onMouseOverCapture" | "onMouseUpCapture" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onPartialLoad" | "onPasteCapture" | "onPause" | "onPauseCapture" | "onPlay" | "onPlayCapture" | "onPlaying" | "onPlayingCapture" | "onProgress" | "onProgressCapture" | "onRateChange" | "onRateChangeCapture" | "onReset" | "onResetCapture" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScrollCapture" | "onScrollEnd" | "onScrollEndCapture" | "onSeeked" | "onSeekedCapture" | "onSeeking" | "onSeekingCapture" | "onSelect" | "onSelectCapture" | "onStalled" | "onStalledCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onSubmit" | "onSubmitCapture" | "onSuspend" | "onSuspendCapture" | "onTimeUpdate" | "onTimeUpdateCapture" | "onToggle" | "onTransitionCancel" | "onTransitionCancelCapture" | "onTransitionEnd" | "onTransitionEndCapture" | "onTransitionRun" | "onTransitionRunCapture" | "onTransitionStart" | "onTransitionStartCapture" | "onVolumeChange" | "onVolumeChangeCapture" | "onWaiting" | "onWaitingCapture" | "onWheelCapture" | "part" | "popover" | "popoverTarget" | "popoverTargetAction" | "prefix" | "progressiveRenderingEnabled" | "property" | "radioGroup" | "referrerPolicy" | "rel" | "resizeMethod" | "resizeMode" | "resizeMultiplier" | "resource" | "results" | "rev" | "security" | "sizes" | "slot" | "source" | "spellCheck" | "src" | "srcSet" | "suppressContentEditableWarning" | "suppressHydrationWarning" | "tintColor" | "title" | "typeof" | "unselectable" | "useMap" | "vocab" | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase>>;
export {};
//# sourceMappingURL=createImage.d.ts.map