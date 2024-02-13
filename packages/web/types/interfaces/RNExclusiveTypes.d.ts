/// <reference types="react" />
import type { GestureResponderHandlers, LayoutChangeEvent } from 'react-native';
type OnLayout = ((event: LayoutChangeEvent) => void) | undefined;
export interface WebOnlyProps {
    filter?: React.CSSProperties['filter'];
    backdropFilter?: React.CSSProperties['backdropFilter'];
    mixBlendMode?: React.CSSProperties['mixBlendMode'];
}
export interface RNExtraProps {
    focusable?: boolean;
    dataSet?: Record<string, string | number | undefined | null>;
    onScrollShouldSetResponder?: unknown;
    onScrollShouldSetResponderCapture?: unknown;
    onSelectionChangeShouldSetResponder?: unknown;
    onSelectionChangeShouldSetResponderCapture?: unknown;
    onLayout?: OnLayout;
    href?: string;
    hrefAttrs?: {
        target?: '_blank' | '_self' | '_top' | 'blank' | 'self' | 'top';
        rel?: string;
        download?: boolean;
    };
    elevationAndroid?: number | string;
}
export interface RNViewProps extends GestureResponderHandlers, RNExtraProps, WebOnlyProps {
    rel?: any;
    download?: any;
}
export interface RNTextProps extends RNExtraProps, WebOnlyProps {
    dir?: 'ltr' | 'rtl' | 'auto';
}
export type RNOnlyProps = 'onStartShouldSetResponder' | 'dataSet' | 'onScrollShouldSetResponder' | 'onScrollShouldSetResponderCapture' | 'onSelectionChangeShouldSetResponder' | 'onSelectionChangeShouldSetResponderCapture' | 'onLayout' | 'href' | 'hrefAttrs' | 'elevationAndroid' | 'rel' | 'download' | 'dir' | 'focusable' | 'onStartShouldSetResponder' | 'onMoveShouldSetResponder' | 'onResponderEnd' | 'onResponderGrant' | 'onResponderReject' | 'onResponderMove' | 'onResponderRelease' | 'onResponderStart' | 'onResponderTerminationRequest' | 'onResponderTerminate' | 'onStartShouldSetResponderCapture' | 'onMoveShouldSetResponderCapture';
export {};
//# sourceMappingURL=RNExclusiveTypes.d.ts.map