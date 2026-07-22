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
    getSize: typeof import("react-native").Image.getSize;
    getSizeWithHeaders: typeof import("react-native").Image.getSizeWithHeaders;
    prefetch: typeof import("react-native").Image.prefetch;
    prefetchWithMetadata: typeof import("react-native").Image.prefetchWithMetadata;
    abortPrefetch: typeof import("react-native").Image.abortPrefetch | undefined;
    queryCache: typeof import("react-native").Image.queryCache | undefined;
} & import("react").FC<import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & Omit<import("react-native").ImageProps, "$android" | "$androidtv" | "$ios" | "$native" | "$tv" | "$tvos" | "$web" | "resizeMode" | "source" | import("@tamagui/web").GroupMediaKeys | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>> & {
    src?: string | number;
    source?: import("react-native").ImageSourcePropType;
    resizeMode?: ImageResizeMode;
    objectFit?: React.CSSProperties['objectFit'];
    objectPosition?: React.CSSProperties['objectPosition'];
} & Omit<import("react").ImgHTMLAttributes<HTMLImageElement>, "$android" | "$androidtv" | "$ios" | "$native" | "$tv" | "$tvos" | "$web" | "src" | import("@tamagui/web").GroupMediaKeys | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>> & Omit<import("react").ImgHTMLAttributes<HTMLImageElement>, "height" | "src" | "style" | "width"> & Omit<GetProps<C>, "$android" | "$androidtv" | "$ios" | "$native" | "$tv" | "$tvos" | "$web" | "about" | "accessKey" | "alt" | "aria-activedescendant" | "aria-atomic" | "aria-autocomplete" | "aria-braillelabel" | "aria-brailleroledescription" | "aria-colcount" | "aria-colindex" | "aria-colindextext" | "aria-colspan" | "aria-controls" | "aria-current" | "aria-describedby" | "aria-description" | "aria-details" | "aria-dropeffect" | "aria-errormessage" | "aria-flowto" | "aria-grabbed" | "aria-haspopup" | "aria-invalid" | "aria-keyshortcuts" | "aria-level" | "aria-multiline" | "aria-multiselectable" | "aria-orientation" | "aria-owns" | "aria-placeholder" | "aria-posinset" | "aria-pressed" | "aria-readonly" | "aria-relevant" | "aria-required" | "aria-roledescription" | "aria-rowcount" | "aria-rowindex" | "aria-rowindextext" | "aria-rowspan" | "aria-setsize" | "aria-sort" | "autoCapitalize" | "autoCorrect" | "autoFocus" | "autoSave" | "blurRadius" | "capInsets" | "color" | "contentEditable" | "contextMenu" | "crossOrigin" | "datatype" | "decoding" | "defaultChecked" | "defaultSource" | "defaultValue" | "dir" | "draggable" | "enterKeyHint" | "exportparts" | "fadeDuration" | "fetchPriority" | "hidden" | "inert" | "inlist" | "inputMode" | "is" | "itemID" | "itemProp" | "itemRef" | "itemScope" | "itemType" | "lang" | "loading" | "loadingIndicatorSource" | "nonce" | "objectPosition" | "onAbort" | "onAbortCapture" | "onAnimationEnd" | "onAnimationEndCapture" | "onAnimationIteration" | "onAnimationIterationCapture" | "onAnimationStart" | "onAnimationStartCapture" | "onAuxClick" | "onAuxClickCapture" | "onBeforeInputCapture" | "onBeforeToggle" | "onBlurCapture" | "onCanPlay" | "onCanPlayCapture" | "onCanPlayThrough" | "onCanPlayThroughCapture" | "onChangeCapture" | "onClickCapture" | "onCompositionEnd" | "onCompositionEndCapture" | "onCompositionStart" | "onCompositionStartCapture" | "onCompositionUpdate" | "onCompositionUpdateCapture" | "onContextMenuCapture" | "onCopyCapture" | "onCutCapture" | "onDoubleClickCapture" | "onDragCapture" | "onDragEndCapture" | "onDragEnterCapture" | "onDragExit" | "onDragExitCapture" | "onDragLeaveCapture" | "onDragOverCapture" | "onDragStartCapture" | "onDropCapture" | "onDurationChange" | "onDurationChangeCapture" | "onEmptied" | "onEmptiedCapture" | "onEncrypted" | "onEncryptedCapture" | "onEnded" | "onEndedCapture" | "onError" | "onErrorCapture" | "onFocusCapture" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onInputCapture" | "onInvalid" | "onInvalidCapture" | "onKeyDownCapture" | "onKeyPress" | "onKeyPressCapture" | "onKeyUpCapture" | "onLayout" | "onLoad" | "onLoadCapture" | "onLoadEnd" | "onLoadStart" | "onLoadStartCapture" | "onLoadedData" | "onLoadedDataCapture" | "onLoadedMetadata" | "onLoadedMetadataCapture" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onMouseDownCapture" | "onMouseMoveCapture" | "onMouseOutCapture" | "onMouseOverCapture" | "onMouseUpCapture" | "onPartialLoad" | "onPasteCapture" | "onPause" | "onPauseCapture" | "onPlay" | "onPlayCapture" | "onPlaying" | "onPlayingCapture" | "onPointerOut" | "onPointerOutCapture" | "onPointerOver" | "onPointerOverCapture" | "onProgress" | "onProgressCapture" | "onRateChange" | "onRateChangeCapture" | "onReset" | "onResetCapture" | "onScrollCapture" | "onScrollEnd" | "onScrollEndCapture" | "onSeeked" | "onSeekedCapture" | "onSeeking" | "onSeekingCapture" | "onSelect" | "onSelectCapture" | "onStalled" | "onStalledCapture" | "onSubmit" | "onSubmitCapture" | "onSuspend" | "onSuspendCapture" | "onTimeUpdate" | "onTimeUpdateCapture" | "onToggle" | "onTouchCancelCapture" | "onTouchMoveCapture" | "onTouchStartCapture" | "onTransitionCancel" | "onTransitionCancelCapture" | "onTransitionEnd" | "onTransitionEndCapture" | "onTransitionRun" | "onTransitionRunCapture" | "onTransitionStart" | "onTransitionStartCapture" | "onVolumeChange" | "onVolumeChangeCapture" | "onWaiting" | "onWaitingCapture" | "onWheelCapture" | "part" | "popover" | "popoverTarget" | "popoverTargetAction" | "prefix" | "progressiveRenderingEnabled" | "property" | "radioGroup" | "referrerPolicy" | "rel" | "resizeMethod" | "resizeMode" | "resource" | "results" | "rev" | "security" | "sizes" | "slot" | "source" | "spellCheck" | "src" | "srcSet" | "suppressContentEditableWarning" | "suppressHydrationWarning" | "tintColor" | "title" | "translate" | "typeof" | "unselectable" | "useMap" | "vocab" | import("@tamagui/web").GroupMediaKeys | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>>>;
export {};
//# sourceMappingURL=createImage.d.ts.map