import type { TextParentStyles } from '@tamagui/text';
import { textParentProps } from '@tamagui/text';
import type { ColorTokens, GetProps, SizeTokens, VariantSpreadExtras } from '@tamagui/web';
import type { FunctionComponent, JSX, ReactNode } from 'react';
type IconProp = JSX.Element | FunctionComponent<{
    color?: any;
    size?: any;
}> | null;
/**
 * The three props every part shares. A styled component that declares this
 * context reads these from an ancestor and, for any it was passed directly,
 * republishes them to its own descendants — which is the whole mechanism for
 * getting size and color from a ListItem down to its text and icons.
 */
export declare const ListItemContext: import("@tamagui/web").StyledContext<{
    size?: SizeTokens | true;
    variant?: 'outlined';
    color?: ColorTokens | string;
}, "color" | "size" | "variant">;
export declare const listItemSizeVariant: (val: SizeTokens | true, { tokens }: VariantSpreadExtras<any>) => {
    minHeight: number | import("@tamagui/web").Variable<any>;
    paddingHorizontal: import("@tamagui/web").Variable<any> | import("@tamagui/web").Variable<string> | import("@tamagui/web").Variable<number> | import("@tamagui/web").Variable<import("@tamagui/web").PxValue> | import("@tamagui/web").Variable<import("@tamagui/web").VariableValGeneric>;
    paddingVertical: number;
    gap: number;
};
export declare const ListItemFrame: FunctionComponent<Omit<import("@tamagui/web").StackNonStyleProps, "disabled" | "size" | "variant" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{
    disabled?: boolean | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
    ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    disabled?: boolean | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        disabled?: boolean | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const ListItemText: FunctionComponent<Omit<import("@tamagui/web").TextNonStyleProps, "size" | "variant" | keyof import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithFlatVariantValues<{
    size?: import("@tamagui/web").FontSize | undefined;
    variant?: "outlined" | undefined;
}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & {
    ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
    size?: import("@tamagui/web").FontSize | undefined;
    variant?: "outlined" | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const ListItemSubtitle: FunctionComponent<Omit<import("@tamagui/web").TextNonStyleProps, "size" | "variant" | keyof import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithFlatVariantValues<{
    size?: string | number | boolean | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | (string & {}) | undefined;
    variant?: "outlined" | undefined;
}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & {
    ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
    size?: string | number | boolean | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | (string & {}) | undefined;
    variant?: "outlined" | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: string | number | boolean | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | (string & {}) | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const ListItemTitle: FunctionComponent<Omit<import("@tamagui/web").TextNonStyleProps, "size" | "variant" | keyof import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithFlatVariantValues<{
    size?: import("@tamagui/web").FontSize | undefined;
    variant?: "outlined" | undefined;
}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & {
    ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
    size?: import("@tamagui/web").FontSize | undefined;
    variant?: "outlined" | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export type ListItemIconProps = {
    children: ReactNode;
    size?: SizeTokens | true;
    scaleIcon?: number;
};
export declare const ListItemIcon: ({ children, size, scaleIcon }: ListItemIconProps) => any;
/**
 * The props `useListItem` reads and replaces, so exactly what its result omits.
 */
type ListItemConsumedProps = {
    children?: ReactNode;
    icon?: IconProp;
    iconAfter?: IconProp;
    iconSize?: SizeTokens | true;
    scaleIcon?: number;
    subTitle?: ReactNode;
    title?: ReactNode;
};
export type ListItemBehaviorProps = TextParentStyles & ListItemConsumedProps & {
    color?: ColorTokens | string;
    size?: SizeTokens | true;
};
/**
 * What `useListItem` returns: the caller's props minus the ones it consumed.
 * Spelled out rather than cast, so a skin that spreads the result onto a frame
 * is type-checked on exactly what it will receive.
 */
export type UseListItemProps<Props extends ListItemBehaviorProps> = Omit<Omit<Props, keyof TextParentStyles | keyof typeof textParentProps>, keyof ListItemConsumedProps> & {
    children: ReactNode;
    color?: Props['color'];
};
/**
 * ListItem behavior: theming the icon props and assembling title, subtitle, and
 * children into the frame's single child. Flat text styles are handed directly
 * to generated text, while size and color still reach the parts through the
 * styled context.
 */
export declare function useListItem<Props extends ListItemBehaviorProps>(propsIn: Props): {
    props: UseListItemProps<Props>;
};
export type ListItemFrameProps = GetProps<typeof ListItemFrame>;
export {};
//# sourceMappingURL=ListItem.d.ts.map