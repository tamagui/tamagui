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
    Item: import("react").ForwardRefExoticComponent<import("./createMenu").MenuItemProps & {
        scope?: string;
    } & import("react").RefAttributes<import("tamagui").TamaguiElement>>;
    CheckboxItem: import("react").ForwardRefExoticComponent<import("./createMenu").MenuCheckboxItemProps & {
        scope?: string;
    } & import("react").RefAttributes<import("tamagui").TamaguiElement>>;
    RadioGroup: import("tamagui").TamaguiComponent<Omit<any, "scope" | keyof import("./createMenu").MenuRadioGroupProps> & import("./createMenu").MenuRadioGroupProps & {
        scope?: string;
    }, any, import("./createMenu").MenuRadioGroupProps & {
        scope?: string;
    }, {}, {}, {}>;
    RadioItem: import("react").ForwardRefExoticComponent<import("./createMenu").MenuRadioItemProps & {
        scope?: string;
    } & import("react").RefAttributes<import("tamagui").TamaguiElement>>;
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
    SubTrigger: import("react").ForwardRefExoticComponent<import("./createMenu").MenuSubTriggerProps & {
        scope?: string;
    } & import("react").RefAttributes<import("tamagui").TamaguiElement>>;
    SubContent: import("react").ForwardRefExoticComponent<import("./createMenu").MenuSubContentProps & {
        scope?: string;
    } & import("react").RefAttributes<HTMLElement | import("react-native").View>>;
    ItemTitle: import("tamagui").TamaguiComponent<any, any, {} & void, {}, {}, {}>;
    ItemSubtitle: import("tamagui").TamaguiComponent<any, any, {} & void, {}, {}, {}>;
    ItemImage: import("react").ForwardRefExoticComponent<import("react-native").ImageProps & import("react").RefAttributes<import("react-native").Image>>;
    ItemIcon: import("tamagui").TamaguiComponent;
};
//# sourceMappingURL=index.d.ts.map