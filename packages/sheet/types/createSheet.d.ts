import { GetProps, StackProps, TamaguiComponent, TamaguiComponentExpectingVariants } from '@tamagui/core';
import { FunctionComponent, RefAttributes } from 'react';
import { View } from 'react-native';
import { SheetProps, SheetScopedProps } from './types';
type SharedSheetProps = {
    open?: boolean;
};
type BaseProps = StackProps & SharedSheetProps;
type SheetStyledComponent = TamaguiComponentExpectingVariants<BaseProps, SharedSheetProps>;
export declare function createSheet<H extends SheetStyledComponent | TamaguiComponent, F extends SheetStyledComponent | TamaguiComponent, O extends SheetStyledComponent | TamaguiComponent>({ Handle, Frame, Overlay }: {
    Handle: H;
    Frame: F;
    Overlay: O;
}): import("react").ForwardRefExoticComponent<{
    open?: boolean | undefined;
    defaultOpen?: boolean | undefined;
    onOpenChange?: (((open: boolean) => void) | import("react").Dispatch<import("react").SetStateAction<boolean>>) | undefined;
    position?: number | undefined;
    defaultPosition?: number | undefined;
    snapPoints?: number[] | undefined;
    onPositionChange?: import("./types").PositionChangeHandler | undefined;
    children?: import("react").ReactNode;
    dismissOnOverlayPress?: boolean | undefined;
    dismissOnSnapToBottom?: boolean | undefined;
    forceRemoveScrollEnabled?: boolean | undefined;
    animationConfig?: import("@tamagui/core").AnimatedNumberStrategy | undefined;
    unmountChildrenWhenHidden?: boolean | undefined;
    native?: boolean | "ios"[] | undefined;
    animation?: import("@tamagui/core").AnimationProp | undefined;
    handleDisableScroll?: boolean | undefined;
    disableDrag?: boolean | undefined;
    modal?: boolean | undefined;
    zIndex?: number | undefined;
    portalProps?: import("@tamagui/portal").PortalProps | undefined;
    moveOnKeyboardChange?: boolean | undefined;
} & {
    __scopeSheet?: import("@tamagui/create-context").Scope<any>;
} & RefAttributes<View>> & {
    Controlled: FunctionComponent<Omit<SheetProps, "open" | "onOpenChange"> & RefAttributes<View>> & {
        Frame: import("react").ForwardRefExoticComponent<import("react").PropsWithoutRef<SheetScopedProps<GetProps<F> & {
            disableHideBottomOverflow?: boolean | undefined;
        }>> & RefAttributes<unknown>>;
        Overlay: import("react").MemoExoticComponent<(propsIn: SheetScopedProps<GetProps<typeof Overlay>>) => null>;
        Handle: ({ __scopeSheet, ...props }: SheetScopedProps<GetProps<typeof Handle>>) => JSX.Element | null;
        ScrollView: import("react").ForwardRefExoticComponent<import("react-native").ScrollViewProps & Omit<StackProps, keyof import("react-native").ScrollViewProps> & Omit<{}, "fullscreen"> & {
            readonly fullscreen?: boolean | undefined;
        } & import("@tamagui/core").MediaProps<Partial<import("react-native").ScrollViewProps & Omit<StackProps, keyof import("react-native").ScrollViewProps> & Omit<{}, "fullscreen"> & {
            readonly fullscreen?: boolean | undefined;
        }>> & import("@tamagui/core").PseudoProps<Partial<import("react-native").ScrollViewProps & Omit<StackProps, keyof import("react-native").ScrollViewProps> & Omit<{}, "fullscreen"> & {
            readonly fullscreen?: boolean | undefined;
        }>> & RefAttributes<import("@tamagui/core").TamaguiElement>>;
    };
    Frame: import("react").ForwardRefExoticComponent<import("react").PropsWithoutRef<SheetScopedProps<GetProps<F> & {
        disableHideBottomOverflow?: boolean | undefined;
    }>> & RefAttributes<unknown>>;
    Overlay: import("react").MemoExoticComponent<(propsIn: SheetScopedProps<GetProps<typeof Overlay>>) => null>;
    Handle: ({ __scopeSheet, ...props }: SheetScopedProps<GetProps<typeof Handle>>) => JSX.Element | null;
    ScrollView: import("react").ForwardRefExoticComponent<import("react-native").ScrollViewProps & Omit<StackProps, keyof import("react-native").ScrollViewProps> & Omit<{}, "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
    } & import("@tamagui/core").MediaProps<Partial<import("react-native").ScrollViewProps & Omit<StackProps, keyof import("react-native").ScrollViewProps> & Omit<{}, "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<import("react-native").ScrollViewProps & Omit<StackProps, keyof import("react-native").ScrollViewProps> & Omit<{}, "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
    }>> & RefAttributes<import("@tamagui/core").TamaguiElement>>;
};
export {};
//# sourceMappingURL=createSheet.d.ts.map