import type { ColorTokens, GetProps, SizeTokens } from '@tamagui/web';
import type { FunctionComponent, JSX, ReactNode } from 'react';
type IconProp = JSX.Element | FunctionComponent<{
    color?: any;
    size?: any;
}> | null;
type ListItemVariant = 'outlined';
export type ListItemExtraProps = {
    icon?: IconProp;
    iconAfter?: IconProp;
    scaleIcon?: number;
    title?: ReactNode;
    subTitle?: ReactNode;
    iconSize?: SizeTokens | true;
    color?: ColorTokens | string;
};
export type ListItemProps = GetProps<typeof ListItemFrame> & ListItemExtraProps;
declare const ListItemFrame: FunctionComponent<Omit<import("@tamagui/web").StackNonStyleProps, "color" | "disabled" | "size" | "variant" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    color?: string | undefined;
    disabled?: boolean | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    color?: string | undefined;
    disabled?: boolean | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    color?: string | undefined;
    disabled?: boolean | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
}>> & {
    ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    color?: string | undefined;
    disabled?: boolean | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        color?: string | undefined;
        disabled?: boolean | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
declare const ListItemIcon: (props: {
    children: React.ReactNode;
    size?: SizeTokens | true;
    scaleIcon?: number;
}) => any;
export declare const ListItem: FunctionComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    color?: string | undefined;
    disabled?: boolean | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
}>, keyof ListItemExtraProps> & ListItemExtraProps & {
    ref?: import("react").Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/web").StaticComponentObject<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    color?: string | undefined;
    disabled?: boolean | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
}>, keyof ListItemExtraProps> & ListItemExtraProps, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/web").StackNonStyleProps & ListItemExtraProps, import("@tamagui/web").StackStyleBase, {
    color?: string | undefined;
    disabled?: boolean | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        color?: string | undefined;
        disabled?: boolean | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
    }>, keyof ListItemExtraProps> & ListItemExtraProps, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/web").StackNonStyleProps & ListItemExtraProps, import("@tamagui/web").StackStyleBase, {
        color?: string | undefined;
        disabled?: boolean | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
} & {
    Apply: import("react").Provider<{
        size?: SizeTokens | true;
        variant?: ListItemVariant;
        color?: ColorTokens | string;
    }> & import("react").ProviderExoticComponent<Partial<{
        size?: SizeTokens | true;
        variant?: ListItemVariant;
        color?: ColorTokens | string;
    }> & {
        children?: ReactNode;
        scope?: string;
    }>;
    Frame: FunctionComponent<Omit<import("@tamagui/web").StackNonStyleProps, "color" | "disabled" | "size" | "variant" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        color?: string | undefined;
        disabled?: boolean | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        color?: string | undefined;
        disabled?: boolean | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        color?: string | undefined;
        disabled?: boolean | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
    }>> & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        color?: string | undefined;
        disabled?: boolean | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
            color?: string | undefined;
            disabled?: boolean | undefined;
            size?: false | import("@tamagui/web").Size | undefined;
            variant?: "outlined" | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    Text: FunctionComponent<Omit<import("@tamagui/web").TextNonStyleProps, "size" | "variant" | keyof import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
        size?: import("@tamagui/web").FontSize | undefined;
        variant?: "outlined" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
        size?: import("@tamagui/web").FontSize | undefined;
        variant?: "outlined" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
        variant?: "outlined" | undefined;
    }>> & {
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
    Subtitle: FunctionComponent<Omit<import("@tamagui/web").TextNonStyleProps, "size" | "variant" | keyof import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
        size?: number | boolean | `${number}rem` | `$${string}` | `$${number}` | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | undefined;
        variant?: "outlined" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
        size?: number | boolean | `${number}rem` | `$${string}` | `$${number}` | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | undefined;
        variant?: "outlined" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").TextStylePropsBase, {
        size?: number | boolean | `${number}rem` | `$${string}` | `$${number}` | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | undefined;
        variant?: "outlined" | undefined;
    }>> & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: number | boolean | `${number}rem` | `$${string}` | `$${number}` | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
            size?: number | boolean | `${number}rem` | `$${string}` | `$${number}` | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | undefined;
            variant?: "outlined" | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    Icon: typeof ListItemIcon;
    Title: FunctionComponent<Omit<import("@tamagui/web").TextNonStyleProps, "size" | "variant" | keyof import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
        size?: import("@tamagui/web").FontSize | undefined;
        variant?: "outlined" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
        size?: import("@tamagui/web").FontSize | undefined;
        variant?: "outlined" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
        variant?: "outlined" | undefined;
    }>> & {
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
};
export {};
//# sourceMappingURL=ListItem.d.ts.map