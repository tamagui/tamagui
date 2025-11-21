import '@tamagui/polyfill-dev';
export * from './Menu';
export * from './createNativeMenu';
export * from './createMenu';
export type { MenuItemImageProps } from './createNativeMenu/createNativeMenuTypes';
export declare const Menu: {
    (props: import("./createMenu").MenuProps & {
        scope?: string;
    }): import("react/jsx-runtime").JSX.Element;
    displayName: string;
} & {
    Anchor: {
        (props: import("./createMenu").MenuAnchorProps): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Portal: {
        (props: import("./createMenu").MenuPortalProps & {
            scope?: string;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Content: import("react").ForwardRefExoticComponent<import("./createMenu").MenuContentProps & {
        scope?: string;
    } & import("react").RefAttributes<HTMLElement | import("react-native").View>>;
    Group: import("tamagui").TamaguiComponent;
    Label: import("tamagui").TamaguiComponent;
    Item: import("tamagui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "scope" | keyof import("./createMenu").MenuItemProps> & import("./createMenu").MenuItemProps & {
        scope?: string;
    }, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("./createMenu").MenuItemProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    CheckboxItem: import("tamagui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "scope" | keyof import("./createMenu").MenuCheckboxItemProps> & import("./createMenu").MenuCheckboxItemProps & {
        scope?: string;
    }, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("./createMenu").MenuCheckboxItemProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    RadioGroup: import("tamagui").TamaguiComponent<Omit<any, "scope" | keyof import("./createMenu").MenuRadioGroupProps> & import("./createMenu").MenuRadioGroupProps & {
        scope?: string;
    }, any, import("./createMenu").MenuRadioGroupProps & {
        scope?: string;
    }, {}, {}, {}>;
    RadioItem: import("tamagui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "scope" | keyof import("./createMenu").MenuRadioItemProps> & import("./createMenu").MenuRadioItemProps & {
        scope?: string;
    }, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("./createMenu").MenuRadioItemProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    ItemIndicator: import("tamagui").TamaguiComponent<Omit<any, "scope" | keyof import("./createMenu").MenuItemIndicatorProps> & import("./createMenu").MenuItemIndicatorProps & {
        scope?: string;
    }, any, import("./createMenu").MenuItemIndicatorProps & {
        scope?: string;
    }, {}, {}, {}>;
    Separator: import("tamagui").TamaguiComponent;
    Arrow: import("react").ForwardRefExoticComponent<import("./createMenu").MenuArrowProps & import("react").RefAttributes<import("tamagui").TamaguiElement>>;
    Sub: import("react").FC<import("./createMenu").MenuSubProps & {
        scope?: string;
    }>;
    SubTrigger: import("tamagui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, "scope" | keyof import("./createMenu").MenuSubTriggerProps> & import("./createMenu").MenuSubTriggerProps & {
        scope?: string;
    }, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("./createMenu").MenuSubTriggerProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    SubContent: import("react").ForwardRefExoticComponent<import("./createMenu").MenuSubContentProps & {
        scope?: string;
    } & import("react").RefAttributes<HTMLElement | import("react-native").View>>;
    ItemTitle: import("tamagui").TamaguiComponent<any, any, {} & void, {}, {}, {}>;
    ItemSubtitle: import("tamagui").TamaguiComponent<any, any, {} & void, {}, {}, {}>;
    ItemImage: import("react").ForwardRefExoticComponent<import("react-native").ImageProps & import("react").RefAttributes<import("react-native").Image>>;
    ItemIcon: import("tamagui").TamaguiComponent<any, any, {} & void, {}, {}, {}>;
};
//# sourceMappingURL=index.d.ts.map