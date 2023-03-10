import { TamaguiElement } from '@tamagui/core';
import type { Scope } from '@tamagui/create-context';
import * as React from 'react';
declare const Collection: {
    readonly Provider: React.FC<{
        children?: React.ReactNode;
        scope: any;
    }>;
    readonly Slot: React.ForwardRefExoticComponent<import("@tamagui/collection/types/Collection").CollectionProps & React.RefAttributes<TamaguiElement>>;
    readonly ItemSlot: React.ForwardRefExoticComponent<{
        children: React.ReactNode;
        scope: any;
    } & React.RefAttributes<TamaguiElement>>;
}, useCollection: (scope: any) => () => {
    ref: React.RefObject<TamaguiElement>;
}[];
type SwipeDirection = 'vertical' | 'up' | 'down' | 'horizontal' | 'left' | 'right';
type ToastProviderContextValue = {
    id: string;
    label: string;
    duration: number;
    swipeDirection: SwipeDirection;
    swipeThreshold: number;
    toastCount: number;
    viewport: TamaguiElement | null;
    onViewportChange(viewport: TamaguiElement): void;
    onToastAdd(): void;
    onToastRemove(): void;
    isFocusedToastEscapeKeyDownRef: React.MutableRefObject<boolean>;
    isClosePausedRef: React.MutableRefObject<boolean>;
};
type ScopedProps<P> = P & {
    __scopeToast?: Scope;
};
declare const createToastContext: <ContextValueType extends object | null>(rootComponentName: string, defaultContext?: ContextValueType | undefined) => readonly [{
    (props: ContextValueType & {
        scope: Scope<ContextValueType>;
        children: React.ReactNode;
    }): JSX.Element;
    displayName: string;
}, (consumerName: string, scope: Scope<ContextValueType | undefined>, options?: {
    warn?: boolean | undefined;
    fallback?: Partial<ContextValueType> | undefined;
} | undefined) => ContextValueType], createToastScope: import("@tamagui/create-context").CreateScope;
declare const useToastProviderContext: (consumerName: string, scope: Scope<ToastProviderContextValue | undefined>, options?: {
    warn?: boolean | undefined;
    fallback?: Partial<ToastProviderContextValue> | undefined;
} | undefined) => ToastProviderContextValue;
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
    /**
     * @defaultValue unique generated identifier
     */
    id?: string;
}
declare const ToastProvider: React.FC<ToastProviderProps>;
export { ToastProvider, useToastProviderContext, Collection, useCollection, createToastScope, createToastContext, };
export type { ScopedProps, ToastProviderProps, SwipeDirection };
//# sourceMappingURL=Provider.d.ts.map