import { TamaguiElement } from '@tamagui/core';
import * as React from 'react';
type SwipeDirection = 'up' | 'down' | 'left' | 'right';
interface ToastProviderProps {
    children?: React.ReactNode;
    /**
     * An author-localized label for each toast. Used to help screen reader users
     * associate the interruption with a toast.
     * @defaultValue 'Notification'
     */
    label?: string;
    /**
     * Time in milliseconds that each toast should remain visible for.
     * @defaultValue 5000
     */
    duration?: number;
    /**
     * Direction of pointer swipe that should close the toast.
     * @defaultValue 'right'
     */
    swipeDirection?: SwipeDirection;
    /**
     * Distance in pixels that the swipe must pass before a close is triggered.
     * @defaultValue 50
     */
    swipeThreshold?: number;
}
declare const ToastProvider: React.FC<ToastProviderProps>;
type PrimitiveOrderedListProps = any;
interface ToastViewportProps extends PrimitiveOrderedListProps {
    /**
     * The keys to use as the keyboard shortcut that will move focus to the toast viewport.
     * @defaultValue ['F8']
     */
    hotkey?: string[];
    /**
     * An author-localized label for the toast viewport to provide context for screen reader users
     * when navigating page landmarks. The available `{hotkey}` placeholder will be replaced for you.
     * @defaultValue 'Notifications ({hotkey})'
     */
    label?: string;
}
declare const ToastViewport: React.ForwardRefExoticComponent<Pick<ToastViewportProps, keyof ToastViewportProps> & React.RefAttributes<TamaguiElement>>;
type ToastElement = ToastImplElement;
interface ToastProps extends Omit<ToastImplProps, keyof ToastImplPrivateProps> {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
declare const Toast: React.ForwardRefExoticComponent<Pick<ToastProps, keyof ToastProps> & React.RefAttributes<TamaguiElement>>;
type SwipeEvent = {
    currentTarget: EventTarget & ToastElement;
} & Omit<CustomEvent<{
    originalEvent: React.PointerEvent;
    delta: {
        x: number;
        y: number;
    };
}>, 'currentTarget'>;
type ToastImplElement = TamaguiElement;
type DismissableLayerProps = any;
type ToastImplPrivateProps = {
    open: boolean;
    onClose(): void;
};
type PrimitiveListItemProps = any;
interface ToastImplProps extends ToastImplPrivateProps, PrimitiveListItemProps {
    type?: 'foreground' | 'background';
    /**
     * Time in milliseconds that toast should remain visible for. Overrides value
     * given to `ToastProvider`.
     */
    duration?: number;
    onEscapeKeyDown?: DismissableLayerProps['onEscapeKeyDown'];
    onSwipeStart?(event: SwipeEvent): void;
    onSwipeMove?(event: SwipeEvent): void;
    onSwipeCancel?(event: SwipeEvent): void;
    onSwipeEnd?(event: SwipeEvent): void;
}
type PrimitiveDivProps = any;
interface ToastTitleProps extends PrimitiveDivProps {
}
declare const ToastTitle: React.ForwardRefExoticComponent<Pick<ToastTitleProps, string | number> & React.RefAttributes<TamaguiElement>>;
interface ToastDescriptionProps extends PrimitiveDivProps {
}
declare const ToastDescription: React.ForwardRefExoticComponent<Pick<ToastDescriptionProps, string | number> & React.RefAttributes<TamaguiElement>>;
interface ToastActionProps extends ToastCloseProps {
    /**
     * A short description for an alternate way to carry out the action. For screen reader users
     * who will not be able to navigate to the button easily/quickly.
     * @example <ToastAction altText="Goto account settings to updgrade">Upgrade</ToastAction>
     * @example <ToastAction altText="Undo (Alt+U)">Undo</ToastAction>
     */
    altText: string;
}
declare const ToastAction: React.ForwardRefExoticComponent<Pick<ToastActionProps, keyof ToastActionProps> & React.RefAttributes<TamaguiElement>>;
type PrimitiveButtonProps = any;
interface ToastCloseProps extends PrimitiveButtonProps {
}
declare const ToastClose: React.ForwardRefExoticComponent<Pick<ToastCloseProps, string | number> & React.RefAttributes<TamaguiElement>>;
declare const Provider: React.FC<ToastProviderProps>;
declare const Viewport: React.ForwardRefExoticComponent<Pick<ToastViewportProps, keyof ToastViewportProps> & React.RefAttributes<TamaguiElement>>;
declare const Root: React.ForwardRefExoticComponent<Pick<ToastProps, keyof ToastProps> & React.RefAttributes<TamaguiElement>>;
declare const Title: React.ForwardRefExoticComponent<Pick<ToastTitleProps, string | number> & React.RefAttributes<TamaguiElement>>;
declare const Description: React.ForwardRefExoticComponent<Pick<ToastDescriptionProps, string | number> & React.RefAttributes<TamaguiElement>>;
declare const Action: React.ForwardRefExoticComponent<Pick<ToastActionProps, keyof ToastActionProps> & React.RefAttributes<TamaguiElement>>;
declare const Close: React.ForwardRefExoticComponent<Pick<ToastCloseProps, string | number> & React.RefAttributes<TamaguiElement>>;
export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastAction, ToastClose, Provider, Viewport, Root, Title, Description, Action, Close, };
export type { ToastProviderProps, ToastViewportProps, ToastProps, ToastTitleProps, ToastDescriptionProps, ToastActionProps, ToastCloseProps, };
//# sourceMappingURL=Toast.d.ts.map