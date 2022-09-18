import { AnimatedNumberStrategy } from '@tamagui/core';
import { ScopedProps } from '@tamagui/create-context';
import { RemoveScroll } from '@tamagui/remove-scroll';
import React, { ReactNode } from 'react';
export declare type SheetProps = ScopedProps<{
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: OpenChangeHandler;
    position?: number;
    defaultPosition?: number;
    snapPoints?: number[];
    onPositionChange?: PositionChangeHandler;
    children?: ReactNode;
    dismissOnOverlayPress?: boolean;
    dismissOnSnapToBottom?: boolean;
    animationConfig?: AnimatedNumberStrategy;
    handleDisableScroll?: boolean;
    disableDrag?: boolean;
    modal?: boolean;
    zIndex?: number;
}, 'Sheet'>;
export declare type PositionChangeHandler = (position: number) => void;
declare type OpenChangeHandler = ((open: boolean) => void) | React.Dispatch<React.SetStateAction<boolean>>;
export declare type RemoveScrollProps = React.ComponentProps<typeof RemoveScroll>;
export declare type SheetScopedProps<A> = ScopedProps<A, 'Sheet'>;
export declare type ScrollBridge = {
    enabled: boolean;
    y: number;
    paneY: number;
    paneMinY: number;
    scrollStartY: number;
    drag: (dy: number) => void;
    release: (state: {
        dragAt: number;
        vy: number;
    }) => void;
    scrollLock: boolean;
    onFinishAnimate?: () => void;
};
export {};
//# sourceMappingURL=types.d.ts.map