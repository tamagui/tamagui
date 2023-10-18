import { AnimatePresenceProps } from '@tamagui/animate-presence';
import { ThemeableStackProps } from '@tamagui/stacks';
import { GetProps, Stack, StackProps } from '@tamagui/web';
import * as React from 'react';
interface CollapsibleProps extends StackProps {
    defaultOpen?: boolean;
    open?: boolean;
    disabled?: boolean;
    onOpenChange?(open: boolean): void;
}
type CollapsibleTriggerProps = GetProps<typeof Stack>;
declare const CollapsibleTriggerFrame: import("@tamagui/web").TamaguiComponent<StackProps, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackPropsBase, {}, {
    displayName: string | undefined;
    __baseProps: import("@tamagui/web").StackPropsBase;
    __variantProps: {};
}>;
declare const CollapsibleTrigger: import("@tamagui/web").TamaguiComponent<Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>> & import("@tamagui/web").MediaProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>>>, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackPropsBase, {}, {
    displayName: string | undefined;
    __baseProps: import("@tamagui/web").StackPropsBase;
    __variantProps: {};
}>;
interface CollapsibleContentProps extends AnimatePresenceProps, ThemeableStackProps {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
declare const CollapsibleContentFrame: import("@tamagui/web").TamaguiComponent<StackProps, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackPropsBase, {}, {
    displayName: string | undefined;
    __baseProps: import("@tamagui/web").StackPropsBase;
    __variantProps: {};
}>;
declare const CollapsibleContent: import("@tamagui/web").TamaguiComponent<CollapsibleContentProps & {
    __scopeCollapsible?: string | undefined;
} & Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>> & import("@tamagui/web").MediaProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>>>, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackPropsBase, {}, {
    displayName: string | undefined;
    __baseProps: import("@tamagui/web").StackPropsBase;
    __variantProps: {};
}>;
declare const Collapsible: React.ForwardRefExoticComponent<CollapsibleProps & {
    __scopeCollapsible?: string | undefined;
} & React.RefAttributes<import("@tamagui/web").TamaguiElement>> & {
    Trigger: import("@tamagui/web").TamaguiComponent<Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>> & import("@tamagui/web").MediaProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>>>, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackPropsBase, {}, {
        displayName: string | undefined;
        __baseProps: import("@tamagui/web").StackPropsBase;
        __variantProps: {};
    }>;
    Content: import("@tamagui/web").TamaguiComponent<CollapsibleContentProps & {
        __scopeCollapsible?: string | undefined;
    } & Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>> & import("@tamagui/web").MediaProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>>>, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackPropsBase, {}, {
        displayName: string | undefined;
        __baseProps: import("@tamagui/web").StackPropsBase;
        __variantProps: {};
    }>;
};
export { Collapsible, CollapsibleContent, CollapsibleContentFrame, CollapsibleTrigger, CollapsibleTriggerFrame, };
export type { CollapsibleContentProps, CollapsibleProps, CollapsibleTriggerProps };
//# sourceMappingURL=Collapsible.d.ts.map