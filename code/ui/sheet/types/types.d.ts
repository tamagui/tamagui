import type { AnimatedNumberStrategy, TransitionProp } from '@tamagui/core';
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
    /**
     * Disables the RemoveScroll behavior that prevents body scrolling while sheet is open.
     * By default, RemoveScroll is enabled when the sheet is open and modal.
     */
    disableRemoveScroll?: boolean;
    /**
     * @deprecated Use `disableRemoveScroll` instead. This prop will be removed in a future version.
     * Note: `disableRemoveScroll={true}` is equivalent to `forceRemoveScrollEnabled={false}`
     */
    forceRemoveScrollEnabled?: boolean;
    transitionConfig?: AnimatedNumberStrategy;
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
    transition?: TransitionProp;
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
    blockPan?: boolean;
    initialPosition?: number;
    isScrollablePositionLocked?: boolean;
    setScrollEnabled?: (enabled: boolean, lockTo?: number) => void;
    _lastTouchY?: number;
    scrollLockY?: number;
    forceScrollTo?: (y: number) => void;
    isAtTop?: boolean;
    snapToPosition?: (positionIndex: number) => void;
};
export interface KeyboardControllerSheetOptions {
    /**
     * Whether keyboard handling is enabled.
     * When false, the hook is a no-op.
     */
    enabled: boolean;
}
export interface KeyboardControllerSheetResult {
    /**
     * Whether keyboard-controller is available and enabled.
     */
    keyboardControllerEnabled: boolean;
    /**
     * Current keyboard height (0 when hidden).
     * On web or when keyboard-controller is not available, always 0.
     */
    keyboardHeight: number;
    /**
     * Whether the keyboard is currently visible.
     */
    isKeyboardVisible: boolean;
    /**
     * Dismiss the keyboard programmatically.
     * Called when sheet closes to dismiss the keyboard.
     */
    dismissKeyboard: () => void;
    /**
     * Ref to pause keyboard hide state updates (action-sheet pattern).
     * When true, keyboard hide events are ignored — keeps isKeyboardVisible=true
     * and keyboardHeight at their last values during drag.
     */
    pauseKeyboardHandler: React.RefObject<boolean>;
    /**
     * Flush any keyboard hide event that was suppressed while paused.
     * Call after drag ends to reconcile actual keyboard state.
     */
    flushPendingHide: () => void;
}
export {};
//# sourceMappingURL=types.d.ts.map