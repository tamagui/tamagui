import { type TamaguiElement, type ViewProps } from '@tamagui/style';
import type { FunctionComponent, Ref } from 'react';
import type { View as RNView } from '@tamagui/react-native-types';
import { useAnimatedPosition } from './SheetContext';
import type { SheetProps } from './types';
export * from './types';
type SheetStyleShorthandProps = {
    h?: ViewProps['height'];
    o?: ViewProps['opacity'];
    pos?: ViewProps['position'];
};
export declare const SheetHandle: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
    open?: boolean | undefined;
}>, "scope" | keyof SheetStyleShorthandProps | keyof import("@tamagui/style").StackNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps, "scope"> & {
    scope?: import("./types").SheetScopes;
}, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps, "scope"> & {
    scope?: import("./types").SheetScopes;
}, import("@tamagui/style").StackStyleBase, {
    open?: boolean | undefined;
}, import("@tamagui/style").StaticConfigPublic>;
export declare const SheetOverlay: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
    open?: boolean | undefined;
}>, "scope" | keyof SheetStyleShorthandProps | keyof import("@tamagui/style").StackNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps, "scope"> & {
    scope?: import("./types").SheetScopes;
}, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps, "scope"> & {
    scope?: import("./types").SheetScopes;
}, import("@tamagui/style").StackStyleBase, {
    open?: boolean | undefined;
}, import("@tamagui/style").StaticConfigPublic>;
type ExtraContainerProps = {
    /**
     * Adds padding accounting for the currently offscreen content, so if you put a flex element inside
     * the sheet, it will always flex to the height of the visible amount of the sheet. If this is not
     * turned on, the inner content is always set to the max height of the sheet.
     */
    adjustPaddingForOffscreenContent?: boolean;
};
export declare const SheetContainer: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "adjustPaddingForOffscreenContent" | "scope" | keyof SheetStyleShorthandProps | keyof import("@tamagui/style").StackNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps & ExtraContainerProps, "scope"> & {
    scope?: import("./types").SheetScopes;
}, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps & ExtraContainerProps, "scope"> & {
    scope?: import("./types").SheetScopes;
}, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
type ExtraBackgroundProps = {
    /**
     * Disables the default background extension below the sheet. Leave this off
     * when a spring can overshoot on open so page content never shows through.
     */
    disableHideBottomOverflow?: boolean;
};
export declare const SheetBackground: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "disableHideBottomOverflow" | "scope" | keyof SheetStyleShorthandProps | keyof import("@tamagui/style").StackNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps & ExtraBackgroundProps, "scope"> & {
    scope?: import("./types").SheetScopes;
}, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps & ExtraBackgroundProps, "scope"> & {
    scope?: import("./types").SheetScopes;
}, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
export declare const SheetRoot: import("@tamagui/compose-refs").RefComponent<RNView, SheetProps>;
export declare const SheetControlled: FunctionComponent<Omit<SheetProps, "onOpenChange" | "open"> & {
    ref?: Ref<RNView>;
}> & {
    Container: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "adjustPaddingForOffscreenContent" | "scope" | keyof SheetStyleShorthandProps | keyof import("@tamagui/style").StackNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps & ExtraContainerProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps & ExtraContainerProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
    Background: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "disableHideBottomOverflow" | "scope" | keyof SheetStyleShorthandProps | keyof import("@tamagui/style").StackNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps & ExtraBackgroundProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps & ExtraBackgroundProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
    Overlay: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
        open?: boolean | undefined;
    }>, "scope" | keyof SheetStyleShorthandProps | keyof import("@tamagui/style").StackNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/style").StackStyleBase, {
        open?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic>;
    Handle: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
        open?: boolean | undefined;
    }>, "scope" | keyof SheetStyleShorthandProps | keyof import("@tamagui/style").StackNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/style").StackStyleBase, {
        open?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic>;
    ScrollView: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, import("@tamagui/style").StackStyleBase, {}>, string | number> & Omit<Omit<import("@tamagui/style").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        h?: import("@tamagui/style").FlatStyleValue<number | "unset" | import("@tamagui/react-native-types").AnimatedNode | import("@tamagui/style").GetThemeValueForKey<"height"> | null | undefined>;
        o?: import("@tamagui/style").FlatStyleValue<"unset" | import("@tamagui/react-native-types").AnimatableNumericValue | import("@tamagui/style").GetThemeValueForKey<"opacity"> | undefined>;
        pos?: import("@tamagui/style").FlatStyleValue<"absolute" | "fixed" | "relative" | "static" | "sticky" | "unset" | undefined>;
    }, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/scroll-view").ScrollViewRef, import("@tamagui/style").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef> & Omit<Omit<import("@tamagui/style").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        h?: import("@tamagui/style").FlatStyleValue<number | "unset" | import("@tamagui/react-native-types").AnimatedNode | import("@tamagui/style").GetThemeValueForKey<"height"> | null | undefined>;
        o?: import("@tamagui/style").FlatStyleValue<"unset" | import("@tamagui/react-native-types").AnimatableNumericValue | import("@tamagui/style").GetThemeValueForKey<"opacity"> | undefined>;
        pos?: import("@tamagui/style").FlatStyleValue<"absolute" | "fixed" | "relative" | "static" | "sticky" | "unset" | undefined>;
    }, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/style").StackStyleBase, {}, {
        acceptsClassName: true;
        neverFlatten: true;
    }>;
};
export declare const Sheet: ((props: Omit<{
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: import("react").Dispatch<import("react").SetStateAction<boolean>> | ((open: boolean) => void);
    position?: number;
    defaultPosition?: number;
    snapPoints?: (string | number)[];
    snapPointsMode?: import("./types").SnapPointsMode;
    onPositionChange?: import("./types").PositionChangeHandler;
    children?: import("react").ReactNode;
    dismissOnOverlayPress?: boolean;
    dismissOnSnapToBottom?: boolean;
    disableRemoveScroll?: boolean;
    transitionConfig?: import("@tamagui/style").AnimatedNumberStrategy;
    preferAdaptParentOpenState?: boolean;
    unmountChildrenWhenHidden?: boolean;
    disableHideWhenClosed?: boolean;
    native?: 'ios'[] | boolean;
    transition?: import("@tamagui/style").TransitionProp;
    handleDisableScroll?: boolean;
    disableDrag?: boolean;
    modal?: boolean;
    zIndex?: number;
    portalProps?: import("@tamagui/portal").PortalProps;
    moveOnKeyboardChange?: boolean;
    containerComponent?: React.ComponentType<any>;
    onTransition?: (e: import("./types").SheetTransitionEvent) => void;
}, "scope"> & {
    scope?: import("./types").SheetScopes;
} & import("@tamagui/compose-refs").RefProp<RNView>) => import("react").ReactNode) & {
    displayName?: string;
    propTypes?: any;
} & {
    Container: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "adjustPaddingForOffscreenContent" | "scope" | keyof SheetStyleShorthandProps | keyof import("@tamagui/style").StackNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps & ExtraContainerProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps & ExtraContainerProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
    Background: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "disableHideBottomOverflow" | "scope" | keyof SheetStyleShorthandProps | keyof import("@tamagui/style").StackNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps & ExtraBackgroundProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps & ExtraBackgroundProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
    Overlay: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
        open?: boolean | undefined;
    }>, "scope" | keyof SheetStyleShorthandProps | keyof import("@tamagui/style").StackNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/style").StackStyleBase, {
        open?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic>;
    Handle: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
        open?: boolean | undefined;
    }>, "scope" | keyof SheetStyleShorthandProps | keyof import("@tamagui/style").StackNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/style").StackStyleBase, {
        open?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic>;
    ScrollView: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, import("@tamagui/style").StackStyleBase, {}>, string | number> & Omit<Omit<import("@tamagui/style").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        h?: import("@tamagui/style").FlatStyleValue<number | "unset" | import("@tamagui/react-native-types").AnimatedNode | import("@tamagui/style").GetThemeValueForKey<"height"> | null | undefined>;
        o?: import("@tamagui/style").FlatStyleValue<"unset" | import("@tamagui/react-native-types").AnimatableNumericValue | import("@tamagui/style").GetThemeValueForKey<"opacity"> | undefined>;
        pos?: import("@tamagui/style").FlatStyleValue<"absolute" | "fixed" | "relative" | "static" | "sticky" | "unset" | undefined>;
    }, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/scroll-view").ScrollViewRef, import("@tamagui/style").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef> & Omit<Omit<import("@tamagui/style").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        h?: import("@tamagui/style").FlatStyleValue<number | "unset" | import("@tamagui/react-native-types").AnimatedNode | import("@tamagui/style").GetThemeValueForKey<"height"> | null | undefined>;
        o?: import("@tamagui/style").FlatStyleValue<"unset" | import("@tamagui/react-native-types").AnimatableNumericValue | import("@tamagui/style").GetThemeValueForKey<"opacity"> | undefined>;
        pos?: import("@tamagui/style").FlatStyleValue<"absolute" | "fixed" | "relative" | "static" | "sticky" | "unset" | undefined>;
    }, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/style").StackStyleBase, {}, {
        acceptsClassName: true;
        neverFlatten: true;
    }>;
    Root: import("@tamagui/compose-refs").RefComponent<RNView, SheetProps>;
    Controlled: FunctionComponent<Omit<SheetProps, "onOpenChange" | "open"> & {
        ref?: Ref<RNView>;
    }> & {
        Container: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "adjustPaddingForOffscreenContent" | "scope" | keyof SheetStyleShorthandProps | keyof import("@tamagui/style").StackNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps & ExtraContainerProps, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps & ExtraContainerProps, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
        Background: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "disableHideBottomOverflow" | "scope" | keyof SheetStyleShorthandProps | keyof import("@tamagui/style").StackNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps & ExtraBackgroundProps, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps & ExtraBackgroundProps, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
        Overlay: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
            open?: boolean | undefined;
        }>, "scope" | keyof SheetStyleShorthandProps | keyof import("@tamagui/style").StackNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/style").StackStyleBase, {
            open?: boolean | undefined;
        }, import("@tamagui/style").StaticConfigPublic>;
        Handle: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
            open?: boolean | undefined;
        }>, "scope" | keyof SheetStyleShorthandProps | keyof import("@tamagui/style").StackNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & SheetStyleShorthandProps, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/style").StackStyleBase, {
            open?: boolean | undefined;
        }, import("@tamagui/style").StaticConfigPublic>;
        ScrollView: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, import("@tamagui/style").StackStyleBase, {}>, string | number> & Omit<Omit<import("@tamagui/style").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
            h?: import("@tamagui/style").FlatStyleValue<number | "unset" | import("@tamagui/react-native-types").AnimatedNode | import("@tamagui/style").GetThemeValueForKey<"height"> | null | undefined>;
            o?: import("@tamagui/style").FlatStyleValue<"unset" | import("@tamagui/react-native-types").AnimatableNumericValue | import("@tamagui/style").GetThemeValueForKey<"opacity"> | undefined>;
            pos?: import("@tamagui/style").FlatStyleValue<"absolute" | "fixed" | "relative" | "static" | "sticky" | "unset" | undefined>;
        }, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/scroll-view").ScrollViewRef, import("@tamagui/style").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef> & Omit<Omit<import("@tamagui/style").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
            h?: import("@tamagui/style").FlatStyleValue<number | "unset" | import("@tamagui/react-native-types").AnimatedNode | import("@tamagui/style").GetThemeValueForKey<"height"> | null | undefined>;
            o?: import("@tamagui/style").FlatStyleValue<"unset" | import("@tamagui/react-native-types").AnimatableNumericValue | import("@tamagui/style").GetThemeValueForKey<"opacity"> | undefined>;
            pos?: import("@tamagui/style").FlatStyleValue<"absolute" | "fixed" | "relative" | "static" | "sticky" | "unset" | undefined>;
        }, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/style").StackStyleBase, {}, {
            acceptsClassName: true;
            neverFlatten: true;
        }>;
    };
    useAnimatedPosition: typeof useAnimatedPosition;
};
//# sourceMappingURL=Sheet.d.ts.map