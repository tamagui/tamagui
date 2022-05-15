import { YStackProps } from '@tamagui/stacks';
import * as React from 'react';
import { View } from 'react-native';
declare type SelectItemI = {
    name: string;
    value: any;
};
declare type SelectGroupI = {
    [key: string]: {
        name: string;
    };
};
export declare type UseSelectProps<Item extends SelectItemI, Group extends SelectGroupI> = {
    items: Item[];
    groups: {
        [Key in keyof Group]: Group[Key];
    };
};
declare type UseSelect = {
    item: SelectItemI;
    group: SelectGroupI[keyof SelectGroupI];
};
export declare const useSelect: <Item extends SelectItemI, Group extends SelectGroupI>(props: UseSelectProps<Item, Group>, mountArgs: any[]) => UseSelect;
declare type GenericElement = HTMLElement | View;
declare type Direction = 'ltr' | 'rtl';
export declare type SelectTriggerProps = YStackProps;
export declare const SelectTrigger: React.ForwardRefExoticComponent<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | undefined;
}>> & React.RefAttributes<GenericElement>>;
export interface SelectProps {
    use: UseSelect;
    children?: React.ReactNode;
    value?: string;
    defaultValue?: string;
    onValueChange?(value: string): void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
    dir?: Direction;
    name?: string;
    autoComplete?: string;
}
export declare const Select: React.FC<SelectProps>;
export {};
//# sourceMappingURL=Select.d.ts.map