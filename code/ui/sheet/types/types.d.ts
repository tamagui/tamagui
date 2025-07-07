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
    /**
     * Control the index of the position in the `snapPoints` array
     */
    position?: number;
    /**
     * Initial position from the `snapPoints` array
     */
    defaultPosition?: number;
    /**
     * Array of pixels or percents the Sheet will attempt to move to when dragged.
     * The first is the topmost and default when first opened via open prop.
     */
    snapPoints?: (string | number)[];
    snapPointsMode?: SnapPointsMode;
    onPositionChange?: PositionChangeHandler;
    children?: ReactNode;
    dismissOnOverlayPress?: boolean;
    dismissOnSnapToBottom?: boolean;
    forceRemoveScrollEnabled?: boolean;
    animationConfig?: AnimatedNumberStrategy;
    /**
     * By default Sheet will prefer the open prop over a parent component that is
     * controlling it via Adapt. In general if you want to Adapt to a sheet, you'd
     * leave the open prop undefined. If you'd like to have the parent override the
     * prop you've set manually on Sheet, set this to true.
     */
    preferAdaptParentOpenState?: boolean;
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
    hasScrollableContent: boolean;
    drag: (dy: number) => void;
    release: (state: {
        dragAt: number;
        vy: number;
    }) => void;
    scrollLock: boolean;
    isParentDragging: boolean;
    onParentDragging: (props: (val: boolean) => void) => () => void;
    setParentDragging: (val: boolean) => void;
    onFinishAnimate?: () => void;
};
export {};
//# sourceMappingURL=types.d.ts.map