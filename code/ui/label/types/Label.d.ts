import type { GetProps } from '@tamagui/web';
import * as React from 'react';
export declare const LabelFrame: React.FunctionComponent<Omit<import("@tamagui/web").TextNonStyleProps, "size" | keyof import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
    size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
    size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").TextStylePropsBase, {
    size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
}>> & {
    ref?: React.Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
    size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export type LabelProps = GetProps<typeof LabelFrame> & {
    htmlFor?: string;
};
export declare const Label: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
    size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
}>, (HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").Text, import("@tamagui/web").TextNonStyleProps & void, import("@tamagui/web").TextStylePropsBase, {
    size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const useLabelContext: (element?: HTMLElement | null) => string | undefined;
//# sourceMappingURL=Label.d.ts.map