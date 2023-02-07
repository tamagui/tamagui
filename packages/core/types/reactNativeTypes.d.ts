import type { GestureResponderHandlers, LayoutChangeEvent } from 'react-native';
type OnLayout = ((event: LayoutChangeEvent) => void) | undefined;
type RNExtraProps = {
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
};
export interface RNViewProps extends GestureResponderHandlers, RNExtraProps {
    rel?: any;
    download?: any;
}
export interface RNTextProps extends RNExtraProps {
    dir?: 'ltr' | 'rtl' | 'auto';
    focusable?: boolean;
}
export {};
//# sourceMappingURL=reactNativeTypes.d.ts.map