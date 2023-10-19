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
    snapPoints?: (string | number)[] | undefined;
    snapPointsMode?: import("./types").SnapPointsMode | undefined;
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
            /**
             * By default the sheet adds a view below its bottom that extends down another 50%,
             * this is useful if your Sheet has a spring animation that bounces "past" the top when
             * opening, preventing it from showing the content underneath.
             */
            disableHideBottomOverflow?: boolean | undefined;
            /**
             * Adds padding accounting for the currently offscreen content, so if you put a flex element inside
             * the sheet, it will always flex to the height of the visible amount of the sheet. If this is not
             * turned on, the inner content is always set to the max height of the sheet.
             */
            adjustPaddingForOffscreenContent?: boolean | undefined;
        }>> & RefAttributes<unknown>>;
        Overlay: import("react").MemoExoticComponent<(propsIn: SheetScopedProps<GetProps<typeof Overlay>>) => null>;
        Handle: ({ __scopeSheet, ...props }: SheetScopedProps<GetProps<typeof Handle>>) => JSX.Element | null;
        ScrollView: import("react").ForwardRefExoticComponent<import("react-native").ScrollViewProps & Omit<StackProps, keyof import("react-native").ScrollViewProps> & {
            readonly fullscreen?: boolean | undefined;
        } & import("@tamagui/core").PseudoProps<Partial<import("react-native").ScrollViewProps & Omit<StackProps, keyof import("react-native").ScrollViewProps> & {
            readonly fullscreen?: boolean | undefined;
        }>> & import("@tamagui/core").MediaProps<Partial<import("react-native").ScrollViewProps & Omit<StackProps, keyof import("react-native").ScrollViewProps> & {
            readonly fullscreen?: boolean | undefined;
        }>> & RefAttributes<import("react-native").ScrollView>>;
    };
    Frame: import("react").ForwardRefExoticComponent<import("react").PropsWithoutRef<SheetScopedProps<GetProps<F> & {
        /**
         * By default the sheet adds a view below its bottom that extends down another 50%,
         * this is useful if your Sheet has a spring animation that bounces "past" the top when
         * opening, preventing it from showing the content underneath.
         */
        disableHideBottomOverflow?: boolean | undefined;
        /**
         * Adds padding accounting for the currently offscreen content, so if you put a flex element inside
         * the sheet, it will always flex to the height of the visible amount of the sheet. If this is not
         * turned on, the inner content is always set to the max height of the sheet.
         */
        adjustPaddingForOffscreenContent?: boolean | undefined;
    }>> & RefAttributes<unknown>>;
    Overlay: import("react").MemoExoticComponent<(propsIn: SheetScopedProps<GetProps<typeof Overlay>>) => null>;
    Handle: ({ __scopeSheet, ...props }: SheetScopedProps<GetProps<typeof Handle>>) => JSX.Element | null;
    ScrollView: import("react").ForwardRefExoticComponent<import("react-native").ScrollViewProps & Omit<StackProps, keyof import("react-native").ScrollViewProps> & {
        readonly fullscreen?: boolean | undefined;
    } & import("@tamagui/core").PseudoProps<Partial<import("react-native").ScrollViewProps & Omit<StackProps, keyof import("react-native").ScrollViewProps> & {
        readonly fullscreen?: boolean | undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<import("react-native").ScrollViewProps & Omit<StackProps, keyof import("react-native").ScrollViewProps> & {
        readonly fullscreen?: boolean | undefined;
    }>> & RefAttributes<import("react-native").ScrollView>>;
};
export {};
//# sourceMappingURL=createSheet.d.ts.map