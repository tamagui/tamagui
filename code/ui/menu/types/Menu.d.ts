import { type CreateBaseMenuProps } from '@tamagui/create-menu';
import React from 'react';
export declare function createMenu(params: CreateBaseMenuProps): React.FC<import("./createNonNativeMenu").MenuProps & {
    scope?: string;
} & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuProps> & {
    readonly Trigger: React.FC<Omit<import("@tamagui/web").ViewProps, "scope" | keyof import("./createNonNativeMenu").MenuTriggerProps> & import("./createNonNativeMenu").MenuTriggerProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuTriggerProps>;
    readonly Portal: React.FC<import("@tamagui/create-menu").MenuPortalProps & {
        scope?: string;
    } & {
        scope?: string;
    } & React.FragmentProps>;
    readonly Content: React.FC<import("./createNonNativeMenu").MenuContentProps & {
        scope?: string;
    } & React.RefAttributes<HTMLElement | import("react-native").View> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuContentProps>;
    readonly Group: React.FC<Omit<any, keyof import("@tamagui/create-menu").MenuGroupProps> & import("@tamagui/create-menu").MenuGroupProps & React.RefAttributes<any> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuGroupProps>;
    readonly Label: React.FC<Omit<any, keyof import("@tamagui/create-menu").MenuLabelProps> & import("@tamagui/create-menu").MenuLabelProps & React.RefAttributes<any> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuLabelProps>;
    readonly Item: React.FC<Omit<import("@tamagui/create-menu").MenuItemProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement>, "ref"> & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement> & {
        children: React.ReactNode;
        textValue?: string;
        onSelect?: (event?: Event) => void;
    } & {
        disabled?: boolean;
        hidden?: boolean;
        destructive?: boolean;
        key: string;
    }>;
    readonly CheckboxItem: React.FC<Omit<import("@tamagui/create-menu").MenuCheckboxItemProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement>, "ref"> & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement> & Omit<import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemProps, "onSelect"> & {
        checked?: boolean;
        onCheckedChange?: (checked: boolean) => void;
        value?: "mixed" | "on" | "off" | boolean;
        onValueChange?: (state: "mixed" | "on" | "off", prevState: "mixed" | "on" | "off") => void;
        key: string;
    }>;
    readonly RadioGroup: React.FC<any>;
    readonly RadioItem: React.FC<any>;
    readonly ItemIndicator: React.FC<Omit<Omit<any, "scope" | keyof import("@tamagui/create-menu").MenuItemIndicatorProps> & import("@tamagui/create-menu").MenuItemIndicatorProps & {
        scope?: string;
    }, string | number | symbol> & Omit<Omit<any, "scope" | keyof import("@tamagui/create-menu").MenuItemIndicatorProps> & import("@tamagui/create-menu").MenuItemIndicatorProps & {
        scope?: string;
    } & React.RefAttributes<any>, "ref"> & {
        scope?: string;
    } & React.RefAttributes<any> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemIndicatorProps>;
    readonly Separator: React.FC<Omit<any, keyof import("@tamagui/create-menu").MenuSeparatorProps> & import("@tamagui/create-menu").MenuSeparatorProps & React.RefAttributes<any>>;
    readonly Arrow: React.FC<Omit<import("@tamagui/create-menu").MenuArrowProps & React.RefAttributes<import("@tamagui/web").TamaguiElement>, "ref"> & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement>>;
    readonly Sub: React.FC<import("@tamagui/create-menu").MenuSubProps & {
        children?: React.ReactNode;
        open?: boolean;
        defaultOpen?: boolean;
        onOpenChange?(open: boolean): void;
    } & {
        scope?: string;
    } & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuSubProps>;
    readonly SubTrigger: React.FC<Omit<import("@tamagui/web").ViewProps, "scope" | "key" | keyof import("@tamagui/create-menu").MenuSubTriggerProps> & Omit<import("@tamagui/create-menu").MenuSubTriggerProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement>, "ref"> & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement> & {
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
    }>;
    readonly SubContent: React.FC<Omit<import("@tamagui/create-menu").MenuSubContentProps & {
        scope?: string;
    } & React.RefAttributes<HTMLElement | import("react-native").View>, "ref"> & {
        scope?: string;
    } & React.RefAttributes<HTMLElement | import("react-native").View> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuSubContentProps>;
    readonly ItemTitle: React.FC<Omit<any, keyof import("@tamagui/create-menu").MenuItemTitleProps> & import("@tamagui/create-menu").MenuItemTitleProps & React.RefAttributes<any> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemTitleProps>;
    readonly ItemSubtitle: React.FC<Omit<any, keyof import("@tamagui/create-menu").MenuItemSubTitleProps> & import("@tamagui/create-menu").MenuItemSubTitleProps & React.RefAttributes<any> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemSubtitleProps>;
    readonly ItemIcon: React.FC<Omit<any, `$${string}` | `$${number}` | import("@tamagui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>> & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<any> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemCommonProps>;
    readonly ItemImage: React.FC<import("react-native").ImageProps & React.RefAttributes<import("react-native").Image> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemCommonProps & {
        source: import("react-native").ImageProps["source"];
        ios?: {
            style?: {
                tint?: string;
            };
            lazy?: boolean;
        };
    }>;
};
//# sourceMappingURL=Menu.d.ts.map