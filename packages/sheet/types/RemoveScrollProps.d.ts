import { ScopedProps } from '@tamagui/create-context';
import { RemoveScroll } from '@tamagui/remove-scroll';
import React from 'react';
export declare type types = {};
export declare type RemoveScrollProps = React.ComponentProps<typeof RemoveScroll>;
export declare type SheetScopedProps<A> = ScopedProps<A, 'Sheet'>;
export declare type ScrollBridge = {
    enabled: boolean;
    y: number;
    scrollStartY: number;
    drag: (dy: number) => void;
    release: (state: {
        dy: number;
        vy: number;
    }) => void;
};
//# sourceMappingURL=RemoveScrollProps.d.ts.map