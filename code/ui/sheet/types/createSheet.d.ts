import type { GetProps, StackProps, TamaguiComponent, TamaguiComponentExpectingVariants } from '@tamagui/core';
import type { ForwardRefExoticComponent, FunctionComponent, RefAttributes } from 'react';
import type { View } from 'react-native';
import type { SheetProps, SheetScopedProps } from './types';
type SharedSheetProps = {
    open?: boolean;
};
type BaseProps = StackProps & SharedSheetProps;
type SheetStyledComponent = TamaguiComponentExpectingVariants<BaseProps, SharedSheetProps>;
export declare function createSheet<H extends TamaguiComponent | SheetStyledComponent, F extends TamaguiComponent | SheetStyledComponent, O extends TamaguiComponent | SheetStyledComponent>({ Handle, Frame, Overlay }: {
    Handle: H;
    Frame: F;
    Overlay: O;
}): ForwardRefExoticComponent<{
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: ((open: boolean) => void) | import("react").Dispatch<import("react").SetStateAction<boolean>>;
    position?: number;
    defaultPosition?: number;
    snapPoints?: (string | number)[];
    snapPointsMode?: import("./types").SnapPointsMode;
    onPositionChange?: import("./types").PositionChangeHandler;
    children?: import("react").ReactNode;
    dismissOnOverlayPress?: boolean;
    dismissOnSnapToBottom?: boolean;
    forceRemoveScrollEnabled?: boolean;
    animationConfig?: import("@tamagui/core").AnimatedNumberStrategy;
    unmountChildrenWhenHidden?: boolean;
    native?: "ios"[] | boolean;
    animation?: import("@tamagui/core").AnimationProp;
    handleDisableScroll?: boolean;
    disableDrag?: boolean;
    modal?: boolean;
    zIndex?: number;
    portalProps?: import("@tamagui/portal").PortalProps;
    moveOnKeyboardChange?: boolean;
    containerComponent?: React.ComponentType<any>;
} & {
    __scopeSheet?: import("@tamagui/create-context").Scope<any>;
} & RefAttributes<View>> & {
    Controlled: FunctionComponent<Omit<SheetProps, "open" | "onOpenChange"> & RefAttributes<View>> & {
        Frame: ForwardRefExoticComponent<SheetScopedProps<Omit<GetProps<F>, keyof {
            /**
             * By default the sheet adds a view below its bottom that extends down another 50%,
             * this is useful if your Sheet has a spring animation that bounces "past" the top when
             * opening, preventing it from showing the content underneath.
             */
            disableHideBottomOverflow?: boolean;
            /**
             * Adds padding accounting for the currently offscreen content, so if you put a flex element inside
             * the sheet, it will always flex to the height of the visible amount of the sheet. If this is not
             * turned on, the inner content is always set to the max height of the sheet.
             */
            adjustPaddingForOffscreenContent?: boolean;
        }> & {
            /**
             * By default the sheet adds a view below its bottom that extends down another 50%,
             * this is useful if your Sheet has a spring animation that bounces "past" the top when
             * opening, preventing it from showing the content underneath.
             */
            disableHideBottomOverflow?: boolean;
            /**
             * Adds padding accounting for the currently offscreen content, so if you put a flex element inside
             * the sheet, it will always flex to the height of the visible amount of the sheet. If this is not
             * turned on, the inner content is always set to the max height of the sheet.
             */
            adjustPaddingForOffscreenContent?: boolean;
        }>>;
        Overlay: import("react").MemoExoticComponent<(propsIn: SheetScopedProps<GetProps<typeof Overlay>>) => null>;
        Handle: TamaguiComponent<any, any, any, any, SharedSheetProps, {}> | TamaguiComponent<any, any, any, {}, {}, {}>;
        ScrollView: ForwardRefExoticComponent<Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & import("react-native").ScrollViewProps, keyof import("@tamagui/core").StackStyleBase | "fullscreen" | "contentContainerStyle"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
        }> & {
            fullscreen?: boolean | undefined;
        } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
        }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
        }> & {
            fullscreen?: boolean | undefined;
        } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
        }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
        }, {
            fullscreen?: boolean | undefined;
        }>> & RefAttributes<import("react-native").ScrollView>>;
    };
    Frame: ForwardRefExoticComponent<SheetScopedProps<Omit<GetProps<F>, keyof {
        /**
         * By default the sheet adds a view below its bottom that extends down another 50%,
         * this is useful if your Sheet has a spring animation that bounces "past" the top when
         * opening, preventing it from showing the content underneath.
         */
        disableHideBottomOverflow?: boolean;
        /**
         * Adds padding accounting for the currently offscreen content, so if you put a flex element inside
         * the sheet, it will always flex to the height of the visible amount of the sheet. If this is not
         * turned on, the inner content is always set to the max height of the sheet.
         */
        adjustPaddingForOffscreenContent?: boolean;
    }> & {
        /**
         * By default the sheet adds a view below its bottom that extends down another 50%,
         * this is useful if your Sheet has a spring animation that bounces "past" the top when
         * opening, preventing it from showing the content underneath.
         */
        disableHideBottomOverflow?: boolean;
        /**
         * Adds padding accounting for the currently offscreen content, so if you put a flex element inside
         * the sheet, it will always flex to the height of the visible amount of the sheet. If this is not
         * turned on, the inner content is always set to the max height of the sheet.
         */
        adjustPaddingForOffscreenContent?: boolean;
    }>>;
    Overlay: import("react").MemoExoticComponent<(propsIn: SheetScopedProps<GetProps<typeof Overlay>>) => null>;
    Handle: TamaguiComponent<any, any, any, any, SharedSheetProps, {}> | TamaguiComponent<any, any, any, {}, {}, {}>;
    ScrollView: ForwardRefExoticComponent<Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & import("react-native").ScrollViewProps, keyof import("@tamagui/core").StackStyleBase | "fullscreen" | "contentContainerStyle"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
    }> & {
        fullscreen?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
    }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
    }> & {
        fullscreen?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
    }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
    }, {
        fullscreen?: boolean | undefined;
    }>> & RefAttributes<import("react-native").ScrollView>>;
};
export {};
//# sourceMappingURL=createSheet.d.ts.map