import type { AnimatedNumberStrategy, AnimationProp } from '@tamagui/core';
import type { ScopedProps } from '@tamagui/create-context';
import type { PortalProps } from '@tamagui/portal';
import type { RemoveScroll } from '@tamagui/remove-scroll';
import type { ReactNode } from 'react';
import type React from 'react';
export type SheetProps = ScopedProps<{
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: OpenChangeHandler;
    position?: number;
    defaultPosition?: number;
    snapPoints?: (string | number)[];
    snapPointsMode?: SnapPointsMode;
    onPositionChange?: PositionChangeHandler;
    children?: ReactNode;
    dismissOnOverlayPress?: boolean;
    dismissOnSnapToBottom?: boolean;
    forceRemoveScrollEnabled?: boolean;
    animationConfig?: AnimatedNumberStrategy;
    /**
     * (experimental) Remove the children while hidden (to save some performance, but can cause issues with animations)
     */
    unmountChildrenWhenHidden?: boolean;
    /**
     * Adapts the sheet to use native sheet on the given platform (if available)
     */
    native?: 'ios'[] | boolean;
    /**
     * Pass if you're using the CSS animation driver
     */
    animation?: AnimationProp;
    handleDisableScroll?: boolean;
    disableDrag?: boolean;
    modal?: boolean;
    zIndex?: number;
    portalProps?: PortalProps;
    /**
     * Native-only flag that will make the sheet move up when the mobile keyboard opens so the focused input remains visible
     */
    moveOnKeyboardChange?: boolean;
    containerComponent?: React.ComponentType<any>;
}, 'Sheet'>;
export type PositionChangeHandler = (position: number) => void;
type OpenChangeHandler = ((open: boolean) => void) | React.Dispatch<React.SetStateAction<boolean>>;
export type RemoveScrollProps = React.ComponentProps<typeof RemoveScroll>;
export type SnapPointsMode = 'percent' | 'constant' | 'fit' | 'mixed';
export type SheetScopedProps<A> = ScopedProps<A, 'Sheet'>;
export type ScrollBridge = {
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