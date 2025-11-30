import { type SizableTextProps } from '@tamagui/text';
import type { FontSizeTokens, GetProps, SizeTokens } from '@tamagui/web';
import type { FunctionComponent, ReactNode, JSX } from 'react';
type ListItemIconProps = {
    color?: any;
    size?: any;
};
type IconProp = JSX.Element | FunctionComponent<ListItemIconProps> | null;
export type ListItemExtraProps = {
    icon?: IconProp;
    iconAfter?: IconProp;
    scaleIcon?: number;
    title?: ReactNode;
    subTitle?: ReactNode;
    iconSize?: SizeTokens;
    fontWeight?: SizableTextProps['fontWeight'];
};
export type ListItemProps = GetProps<typeof ListItemFrame> & ListItemExtraProps;
declare const ListItemFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const ListItem: import("react").ForwardRefExoticComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
}>, keyof ListItemExtraProps> & ListItemExtraProps & import("react").RefAttributes<import("@tamagui/web").TamaguiElement>> & import("@tamagui/web").StaticComponentObject<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
}>, keyof ListItemExtraProps> & ListItemExtraProps, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps & ListItemExtraProps, import("@tamagui/web").StackStyleBase, {
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    }>, keyof ListItemExtraProps> & ListItemExtraProps, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps & ListItemExtraProps, import("@tamagui/web").StackStyleBase, {
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
} & {
    Frame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Text: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Subtitle: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: SizeTokens | FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Icon: (props: {
        children: React.ReactNode;
        size?: SizeTokens;
        scaleIcon?: number;
    }) => any;
    Title: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
};
export {};
//# sourceMappingURL=ListItem.d.ts.map