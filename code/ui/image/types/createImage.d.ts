import type { ComponentType } from 'react';
import type { ImageResizeMode } from 'react-native';
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
        src?: string;
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
    getSize: typeof import("react-native").Image.getSize;
    getSizeWithHeaders: typeof import("react-native").Image.getSizeWithHeaders;
    prefetch: typeof import("react-native").Image.prefetch;
    prefetchWithMetadata: typeof import("react-native").Image.prefetchWithMetadata;
    abortPrefetch: typeof import("react-native").Image.abortPrefetch | undefined;
    queryCache: typeof import("react-native").Image.queryCache | undefined;
} & import("react").FC<import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & Omit<import("react-native").ImageProps, `$${string}` | `$${number}` | import("@tamagui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> | "source" | "resizeMode"> & {
    src?: string;
    source?: import("react-native").ImageSourcePropType;
    resizeMode?: ImageResizeMode;
    objectFit?: React.CSSProperties["objectFit"];
    objectPosition?: React.CSSProperties["objectPosition"];
} & Omit<import("react").ImgHTMLAttributes<HTMLImageElement>, `$${string}` | `$${number}` | import("@tamagui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> | "src"> & Omit<import("react").ImgHTMLAttributes<HTMLImageElement>, "style" | "height" | "width" | "src"> & Omit<GetProps<C>, `$${string}` | `$${number}` | import("@tamagui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "onLayout" | "rel" | "dir" | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> | "source" | "resizeMode" | "onError" | "onLoad" | "onLoadEnd" | "onLoadStart" | "progressiveRenderingEnabled" | "src" | "srcSet" | "loadingIndicatorSource" | "defaultSource" | "alt" | "crossOrigin" | "tintColor" | "referrerPolicy" | "blurRadius" | "capInsets" | "onProgress" | "onPartialLoad" | "resizeMethod" | "fadeDuration" | "objectPosition" | "decoding" | "fetchPriority" | "loading" | "sizes" | "useMap" | "defaultChecked" | "defaultValue" | "suppressContentEditableWarning" | "suppressHydrationWarning" | "accessKey" | "autoCapitalize" | "autoFocus" | "contentEditable" | "contextMenu" | "draggable" | "enterKeyHint" | "hidden" | "lang" | "nonce" | "slot" | "spellCheck" | "title" | "translate" | "radioGroup" | "about" | "datatype" | "inlist" | "prefix" | "property" | "resource" | "rev" | "typeof" | "vocab" | "autoCorrect" | "autoSave" | "color" | "itemProp" | "itemScope" | "itemType" | "itemID" | "itemRef" | "results" | "security" | "unselectable" | "popover" | "popoverTargetAction" | "popoverTarget" | "inert" | "inputMode" | "is" | "exportparts" | "part" | "aria-activedescendant" | "aria-atomic" | "aria-autocomplete" | "aria-braillelabel" | "aria-brailleroledescription" | "aria-colcount" | "aria-colindex" | "aria-colindextext" | "aria-colspan" | "aria-controls" | "aria-current" | "aria-describedby" | "aria-description" | "aria-details" | "aria-dropeffect" | "aria-errormessage" | "aria-flowto" | "aria-grabbed" | "aria-haspopup" | "aria-invalid" | "aria-keyshortcuts" | "aria-level" | "aria-multiline" | "aria-multiselectable" | "aria-orientation" | "aria-owns" | "aria-placeholder" | "aria-posinset" | "aria-pressed" | "aria-readonly" | "aria-relevant" | "aria-required" | "aria-roledescription" | "aria-rowcount" | "aria-rowindex" | "aria-rowindextext" | "aria-rowspan" | "aria-setsize" | "aria-sort" | "onCopyCapture" | "onCutCapture" | "onPasteCapture" | "onCompositionEnd" | "onCompositionEndCapture" | "onCompositionStart" | "onCompositionStartCapture" | "onCompositionUpdate" | "onCompositionUpdateCapture" | "onFocusCapture" | "onBlurCapture" | "onChangeCapture" | "onBeforeInputCapture" | "onInputCapture" | "onReset" | "onResetCapture" | "onSubmit" | "onSubmitCapture" | "onInvalid" | "onInvalidCapture" | "onLoadCapture" | "onErrorCapture" | "onKeyDownCapture" | "onKeyPress" | "onKeyPressCapture" | "onKeyUpCapture" | "onAbort" | "onAbortCapture" | "onCanPlay" | "onCanPlayCapture" | "onCanPlayThrough" | "onCanPlayThroughCapture" | "onDurationChange" | "onDurationChangeCapture" | "onEmptied" | "onEmptiedCapture" | "onEncrypted" | "onEncryptedCapture" | "onEnded" | "onEndedCapture" | "onLoadedData" | "onLoadedDataCapture" | "onLoadedMetadata" | "onLoadedMetadataCapture" | "onLoadStartCapture" | "onPause" | "onPauseCapture" | "onPlay" | "onPlayCapture" | "onPlaying" | "onPlayingCapture" | "onProgressCapture" | "onRateChange" | "onRateChangeCapture" | "onSeeked" | "onSeekedCapture" | "onSeeking" | "onSeekingCapture" | "onStalled" | "onStalledCapture" | "onSuspend" | "onSuspendCapture" | "onTimeUpdate" | "onTimeUpdateCapture" | "onVolumeChange" | "onVolumeChangeCapture" | "onWaiting" | "onWaitingCapture" | "onAuxClick" | "onAuxClickCapture" | "onClickCapture" | "onContextMenuCapture" | "onDoubleClickCapture" | "onDragCapture" | "onDragEndCapture" | "onDragEnterCapture" | "onDragExit" | "onDragExitCapture" | "onDragLeaveCapture" | "onDragOverCapture" | "onDragStartCapture" | "onDropCapture" | "onMouseDownCapture" | "onMouseMoveCapture" | "onMouseOutCapture" | "onMouseOverCapture" | "onMouseUpCapture" | "onSelect" | "onSelectCapture" | "onTouchCancelCapture" | "onTouchMoveCapture" | "onTouchStartCapture" | "onPointerOver" | "onPointerOverCapture" | "onPointerOut" | "onPointerOutCapture" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onScrollCapture" | "onScrollEnd" | "onScrollEndCapture" | "onWheelCapture" | "onAnimationStart" | "onAnimationStartCapture" | "onAnimationEnd" | "onAnimationEndCapture" | "onAnimationIteration" | "onAnimationIterationCapture" | "onToggle" | "onBeforeToggle" | "onTransitionCancel" | "onTransitionCancelCapture" | "onTransitionEnd" | "onTransitionEndCapture" | "onTransitionRun" | "onTransitionRunCapture" | "onTransitionStart" | "onTransitionStartCapture">>;
export {};
//# sourceMappingURL=createImage.d.ts.map