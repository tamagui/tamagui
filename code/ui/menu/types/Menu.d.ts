import { type CreateBaseMenuProps } from '@tamagui/create-menu';
import React from 'react';
export declare function createMenu(params: CreateBaseMenuProps): React.FC<import("./createNonNativeMenu").MenuProps & {
    scope?: string;
} & Partial<import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuProps>> & {
    readonly Trigger: React.FC<Omit<import("@tamagui/web").ViewProps, "scope" | keyof import("./createNonNativeMenu").MenuTriggerProps> & import("./createNonNativeMenu").MenuTriggerProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement> & Partial<import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuTriggerProps>>;
    readonly Portal: React.FC<import("@tamagui/create-menu").MenuPortalProps & {
        scope?: string;
    } & Partial<React.FragmentProps>>;
    readonly Content: React.FC<import("./createNonNativeMenu").MenuContentProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement> & Partial<import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuContentProps>>;
    readonly Group: React.FC<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, keyof import("@tamagui/create-menu").MenuGroupProps> & import("@tamagui/create-menu").MenuGroupProps & React.RefAttributes<import("@tamagui/web").TamaguiElement> & Partial<import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuGroupProps>>;
    readonly Label: React.FC<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/web").FontSizeTokens | undefined;
    }>, keyof import("@tamagui/create-menu").MenuLabelProps> & import("@tamagui/create-menu").MenuLabelProps & React.RefAttributes<import("@tamagui/web").TamaguiTextElement> & Partial<import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuLabelProps>>;
    readonly Item: React.FC<import("@tamagui/create-menu").MenuItemProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement> & Partial<{
        children: React.ReactNode;
        textValue?: string;
        onSelect?: (event?: Event) => void;
    } & {
        disabled?: boolean;
        hidden?: boolean;
        destructive?: boolean;
        key: string;
    }>>;
    readonly CheckboxItem: React.FC<import("@tamagui/create-menu").MenuCheckboxItemProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement> & Partial<Omit<import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemProps, "onSelect"> & {
        checked?: boolean;
        onCheckedChange?: (checked: boolean) => void;
        value?: "mixed" | "on" | "off" | boolean;
        onValueChange?: (state: "mixed" | "on" | "off", prevState: "mixed" | "on" | "off") => void;
        key: string;
    }>>;
    readonly RadioGroup: React.FC<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof import("@tamagui/create-menu").MenuRadioGroupProps> & import("@tamagui/create-menu").MenuRadioGroupProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement> & Partial<{
        children: React.ReactNode;
    }>>;
    readonly RadioItem: React.FC<import("@tamagui/create-menu").MenuRadioItemProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement> & Partial<{
        children: React.ReactNode;
    }>>;
    readonly ItemIndicator: React.FC<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof import("@tamagui/create-menu").MenuItemIndicatorProps> & import("@tamagui/create-menu").MenuItemIndicatorProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement> & Partial<import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemIndicatorProps>>;
    readonly Separator: React.FC<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, keyof import("@tamagui/create-menu").MenuSeparatorProps> & import("@tamagui/create-menu").MenuSeparatorProps & React.RefAttributes<import("@tamagui/web").TamaguiElement> & Partial<import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuSeparatorProps>>;
    readonly Arrow: React.FC<import("@tamagui/create-menu").MenuArrowProps & React.RefAttributes<import("@tamagui/web").TamaguiElement> & Partial<import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuArrowProps>>;
    readonly Sub: React.FC<import("@tamagui/create-menu").MenuSubProps & {
        children?: React.ReactNode;
        open?: boolean;
        defaultOpen?: boolean;
        onOpenChange?(open: boolean): void;
    } & {
        scope?: string;
    } & Partial<import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuSubProps>>;
    readonly SubTrigger: React.FC<import("@tamagui/create-menu").MenuSubTriggerProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement> & Partial<{
        children: React.ReactNode;
        textValue?: string;
        onSelect?: (event?: Event) => void;
    } & {
        disabled?: boolean;
        hidden?: boolean;
        destructive?: boolean;
        key: string;
    } & {
        key: string;
    }>>;
    readonly SubContent: React.FC<import("@tamagui/create-menu").MenuSubContentProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement> & Partial<import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuSubContentProps>>;
    readonly ItemTitle: React.FC<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/web").FontSizeTokens | undefined;
    }>, keyof import("@tamagui/create-menu").MenuItemTitleProps> & import("@tamagui/create-menu").MenuItemTitleProps & React.RefAttributes<import("@tamagui/web").TamaguiTextElement> & Partial<import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemTitleProps>>;
    readonly ItemSubtitle: React.FC<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/web").FontSizeTokens | undefined;
    }>, keyof import("@tamagui/create-menu").MenuItemSubTitleProps> & import("@tamagui/create-menu").MenuItemSubTitleProps & React.RefAttributes<import("@tamagui/web").TamaguiTextElement> & Partial<import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemSubtitleProps>>;
    readonly ItemIcon: React.FC<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, `$${string}` | `$${number}` | import("@tamagui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>> & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<import("@tamagui/web").TamaguiElement> & Partial<import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemCommonProps>>;
    readonly ItemImage: React.FC<import("react-native").ImageProps & React.RefAttributes<import("react-native").Image> & Partial<import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemCommonProps & {
        source: import("react-native").ImageProps["source"];
        ios?: {
            style?: {
                tint?: string;
            };
            lazy?: boolean;
        };
    }>>;
};
//# sourceMappingURL=Menu.d.ts.map