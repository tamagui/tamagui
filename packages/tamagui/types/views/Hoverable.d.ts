import React from 'react';
declare type SpanProps = React.DOMAttributes<HTMLSpanElement>;
export declare type HoverableProps = {
    children?: any;
    disableUntilSettled?: boolean;
    hoverDelay?: number;
    onHoverIn?: () => void;
    onHoverOut?: () => void;
    onHoverMove?: () => void;
    onPressIn?: SpanProps['onMouseDown'];
    onPressOut?: SpanProps['onClick'];
};
export declare type HoverableHandle = {
    close: () => void;
};
export declare const Hoverable: React.ForwardRefExoticComponent<HoverableProps & React.RefAttributes<HoverableHandle>>;
export {};
//# sourceMappingURL=Hoverable.d.ts.map