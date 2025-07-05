import '@tamagui/polyfill-dev';
export * from './Menu';
export * from './createNativeMenu';
export * from './createMenu';
export type { MenuItemImageProps } from './createNativeMenu/createNativeMenuTypes';
export declare const Menu: {
    (props: import("./createMenu").MenuProps & {
        __scopeMenu?: string;
    }): import("react/jsx-runtime").JSX.Element;
    displayName: string;
} & {
    Anchor: {
        (props: import("./createMenu").MenuAnchorProps): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Portal: {
        (props: import("./createMenu").MenuPortalProps & {
            __scopeMenu?: string;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Content: import("react").ForwardRefExoticComponent<import("./createMenu").MenuContentProps & {
        __scopeMenu?: string;
    } & import("react").RefAttributes<HTMLElement | import("react-native").View>>;
    Group: import("tamagui").TamaguiComponent;
    Label: import("tamagui").TamaguiComponent;
    Item: import("tamagui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "__scopeMenu" | keyof import("./createMenu").MenuItemProps> & import("./createMenu").MenuItemProps & {
        __scopeMenu?: string;
    }, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("./createMenu").MenuItemProps & {
        __scopeMenu?: string;
    }, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    CheckboxItem: import("tamagui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "__scopeMenu" | keyof import("./createMenu").MenuCheckboxItemProps> & import("./createMenu").MenuCheckboxItemProps & {
        __scopeMenu?: string;
    }, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("./createMenu").MenuCheckboxItemProps & {
        __scopeMenu?: string;
    }, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    RadioGroup: import("tamagui").TamaguiComponent<Omit<any, "__scopeMenu" | keyof import("./createMenu").MenuRadioGroupProps> & import("./createMenu").MenuRadioGroupProps & {
        __scopeMenu?: string;
    }, any, import("./createMenu").MenuRadioGroupProps & {
        __scopeMenu?: string;
    }, {}, {}, {}>;
    RadioItem: import("tamagui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "__scopeMenu" | keyof import("./createMenu").MenuRadioItemProps> & import("./createMenu").MenuRadioItemProps & {
        __scopeMenu?: string;
    }, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("./createMenu").MenuRadioItemProps & {
        __scopeMenu?: string;
    }, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    ItemIndicator: import("tamagui").TamaguiComponent<Omit<any, "__scopeMenu" | keyof import("./createMenu").MenuItemIndicatorProps> & import("./createMenu").MenuItemIndicatorProps & {
        __scopeMenu?: string;
    }, any, import("./createMenu").MenuItemIndicatorProps & {
        __scopeMenu?: string;
    }, {}, {}, {}>;
    Separator: import("tamagui").TamaguiComponent;
    Arrow: import("tamagui").TamaguiComponent<import("./createMenu").MenuArrowProps & {
        __scopeMenu?: string;
    }, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & (import("tamagui").PopperArrowExtraProps & import("tamagui").TamaguiElement), import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Sub: import("react").FC<import("./createMenu").MenuSubProps & {
        __scopeMenu?: string;
    }>;
    SubTrigger: import("tamagui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    }>, "__scopeMenu" | keyof import("./createMenu").MenuSubTriggerProps> & import("./createMenu").MenuSubTriggerProps & {
        __scopeMenu?: string;
    }, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("./createMenu").MenuSubTriggerProps & {
        __scopeMenu?: string;
    }, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    SubContent: import("react").ForwardRefExoticComponent<import("./createMenu").MenuSubContentProps & {
        __scopeMenu?: string;
    } & import("react").RefAttributes<HTMLElement | import("react-native").View>>;
    ItemTitle: import("tamagui").TamaguiComponent<any, any, {} & void, {}, {}, {}>;
    ItemSubtitle: import("tamagui").TamaguiComponent<any, any, {} & void, {}, {}, {}>;
    ItemImage: import("react").ForwardRefExoticComponent<import("react-native").ImageProps & import("react").RefAttributes<import("react-native").Image>>;
    ItemIcon: import("tamagui").TamaguiComponent<any, any, {} & void, {}, {}, {}>;
};
//# sourceMappingURL=index.d.ts.map