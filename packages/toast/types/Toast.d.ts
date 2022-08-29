import { TamaguiElement } from '@tamagui/core';
import * as React from 'react';
declare type SwipeDirection = 'up' | 'down' | 'left' | 'right';
interface ToastProviderProps {
    children?: React.ReactNode;
    label?: string;
    duration?: number;
    swipeDirection?: SwipeDirection;
    swipeThreshold?: number;
}
declare const ToastProvider: React.FC<ToastProviderProps>;
declare type PrimitiveOrderedListProps = any;
interface ToastViewportProps extends PrimitiveOrderedListProps {
    hotkey?: string[];
    label?: string;
}
declare const ToastViewport: React.ForwardRefExoticComponent<Pick<ToastViewportProps, keyof ToastViewportProps> & React.RefAttributes<TamaguiElement>>;
declare type ToastElement = ToastImplElement;
interface ToastProps extends Omit<ToastImplProps, keyof ToastImplPrivateProps> {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
    forceMount?: true;
}
declare const Toast: React.ForwardRefExoticComponent<Pick<ToastProps, keyof ToastProps> & React.RefAttributes<TamaguiElement>>;
declare type SwipeEvent = {
    currentTarget: EventTarget & ToastElement;
} & Omit<CustomEvent<{
    originalEvent: React.PointerEvent;
    delta: {
        x: number;
        y: number;
    };
}>, 'currentTarget'>;
declare type ToastImplElement = TamaguiElement;
declare type DismissableLayerProps = any;
declare type ToastImplPrivateProps = {
    open: boolean;
    onClose(): void;
};
declare type PrimitiveListItemProps = any;
interface ToastImplProps extends ToastImplPrivateProps, PrimitiveListItemProps {
    type?: 'foreground' | 'background';
    duration?: number;
    onEscapeKeyDown?: DismissableLayerProps['onEscapeKeyDown'];
    onSwipeStart?(event: SwipeEvent): void;
    onSwipeMove?(event: SwipeEvent): void;
    onSwipeCancel?(event: SwipeEvent): void;
    onSwipeEnd?(event: SwipeEvent): void;
}
declare type PrimitiveDivProps = any;
interface ToastTitleProps extends PrimitiveDivProps {
}
declare const ToastTitle: React.ForwardRefExoticComponent<Pick<ToastTitleProps, string | number> & React.RefAttributes<TamaguiElement>>;
interface ToastDescriptionProps extends PrimitiveDivProps {
}
declare const ToastDescription: React.ForwardRefExoticComponent<Pick<ToastDescriptionProps, string | number> & React.RefAttributes<TamaguiElement>>;
interface ToastActionProps extends ToastCloseProps {
    altText: string;
}
declare const ToastAction: React.ForwardRefExoticComponent<Pick<ToastActionProps, keyof ToastActionProps> & React.RefAttributes<TamaguiElement>>;
declare type PrimitiveButtonProps = any;
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