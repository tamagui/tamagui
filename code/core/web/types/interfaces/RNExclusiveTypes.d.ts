import type { GestureResponderHandlers, LayoutChangeEvent, TextLayoutEventData, NativeSyntheticEvent } from 'react-native';
type OnLayout = ((event: LayoutChangeEvent) => void) | undefined;
type OnTextLayout = ((event: NativeSyntheticEvent<TextLayoutEventData>) => void) | undefined;
export interface RNExtraProps {
    onScrollShouldSetResponder?: unknown;
    onScrollShouldSetResponderCapture?: unknown;
    onSelectionChangeShouldSetResponder?: unknown;
    onSelectionChangeShouldSetResponderCapture?: unknown;
    onLayout?: OnLayout;
    elevationAndroid?: number | string;
}
export interface RNViewProps extends GestureResponderHandlers, RNExtraProps {
    rel?: any;
    download?: any;
}
export interface RNTextProps extends RNExtraProps {
    dir?: 'ltr' | 'rtl' | 'auto';
    onTextLayout?: OnTextLayout;
}
export type RNOnlyProps = 'onStartShouldSetResponder' | 'dataSet' | 'onScrollShouldSetResponder' | 'onScrollShouldSetResponderCapture' | 'onSelectionChangeShouldSetResponder' | 'onSelectionChangeShouldSetResponderCapture' | 'onLayout' | 'onTextLayout' | 'href' | 'hrefAttrs' | 'elevationAndroid' | 'rel' | 'download' | 'dir' | 'focusable' | 'onStartShouldSetResponder' | 'onMoveShouldSetResponder' | 'onResponderEnd' | 'onResponderGrant' | 'onResponderReject' | 'onResponderMove' | 'onResponderRelease' | 'onResponderStart' | 'onResponderTerminationRequest' | 'onResponderTerminate' | 'onStartShouldSetResponderCapture' | 'onMoveShouldSetResponderCapture';
export {};
//# sourceMappingURL=RNExclusiveTypes.d.ts.map