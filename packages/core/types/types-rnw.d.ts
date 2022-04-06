/// <reference types="react" />
declare type RNWCursorValue = 'alias' | 'all-scroll' | 'auto' | 'cell' | 'context-menu' | 'copy' | 'crosshair' | 'default' | 'grab' | 'grabbing' | 'help' | 'pointer' | 'progress' | 'wait' | 'text' | 'vertical-text' | 'move' | 'none' | 'no-drop' | 'not-allowed' | 'zoom-in' | 'zoom-out' | 'col-resize' | 'e-resize' | 'ew-resize' | 'n-resize' | 'ne-resize' | 'ns-resize' | 'nw-resize' | 'row-resize' | 's-resize' | 'se-resize' | 'sw-resize' | 'w-resize' | 'nesw-resize' | 'nwse-resize';
declare type RNWWebAccessibilityRole = 'adjustable' | 'article' | 'banner' | 'blockquote' | 'button' | 'code' | 'complementary' | 'contentinfo' | 'deletion' | 'emphasis' | 'figure' | 'form' | 'header' | 'image' | 'imagebutton' | 'insertion' | 'keyboardkey' | 'label' | 'link' | 'list' | 'listitem' | 'main' | 'navigation' | 'none' | 'region' | 'search' | 'strong' | 'summary' | 'text';
export interface RNWViewProps {
    dataSet?: any;
    target?: any;
    rel?: any;
    download?: any;
    accessibilityRole?: RNWWebAccessibilityRole;
    href?: string;
    hrefAttrs?: {
        target?: '_blank' | '_self' | '_top' | 'blank' | 'self' | 'top';
        rel?: string;
        download?: boolean;
    };
    onMouseDown?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onMouseUp?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onMouseEnter?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onMouseLeave?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
    onScroll?: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
    onScrollShouldSetResponder?: unknown;
    onScrollShouldSetResponderCapture?: unknown;
    onSelectionChangeShouldSetResponder?: unknown;
    onSelectionChangeShouldSetResponderCapture?: unknown;
}
export interface RNWTextProps {
    dir?: 'ltr' | 'rtl' | 'auto';
    focusable?: boolean;
    accessibilityRole?: RNWWebAccessibilityRole;
    accessibilityState?: {
        busy?: boolean;
        checked?: boolean | 'mixed';
        disabled?: boolean;
        expanded?: boolean;
        grabbed?: boolean;
        hidden?: boolean;
        invalid?: boolean;
        pressed?: boolean;
        readonly?: boolean;
        required?: boolean;
        selected?: boolean;
    };
    href?: string;
    hrefAttrs?: {
        target?: '_blank' | '_self' | '_top' | 'blank' | 'self' | 'top';
        rel?: string;
        download?: boolean;
    };
    onMouseEnter?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onMouseLeave?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
    onMoveShouldSetResponder?: unknown;
    onMoveShouldSetResponderCapture?: unknown;
    onResponderEnd?: unknown;
    onResponderGrant?: unknown;
    onResponderMove?: unknown;
    onResponderReject?: unknown;
    onResponderRelease?: unknown;
    onResponderStart?: unknown;
    onResponderTerminate?: unknown;
    onResponderTerminationRequest?: unknown;
    onScrollShouldSetResponder?: unknown;
    onScrollShouldSetResponderCapture?: unknown;
    onSelectionChangeShouldSetResponder?: unknown;
    onSelectionChangeShouldSetResponderCapture?: unknown;
    onStartShouldSetResponder?: unknown;
    onStartShouldSetResponderCapture?: unknown;
}
export interface RNWViewStyle {
    cursor?: RNWCursorValue;
    transitionProperty?: string;
    display?: 'flex' | 'inline-flex' | 'none';
}
export interface RNWTextStyle {
    userSelect?: 'all' | 'auto' | 'contain' | 'none' | 'text';
}
export {};
//# sourceMappingURL=types-rnw.d.ts.map