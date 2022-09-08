import { GetProps, ReactComponentWithRef } from '@tamagui/core';
import { View } from 'react-native';
export declare const LabelFrame: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, "size"> & {
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, "size"> & {
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, "size"> & {
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}>>, import("@tamagui/core").TamaguiElement, import("@tamagui/core").TextPropsBase, {
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}>;
export declare type LabelProps = GetProps<typeof LabelFrame> & {
    htmlFor?: string;
};
export declare const Label: ReactComponentWithRef<LabelProps, HTMLButtonElement | View>;
export declare const useLabelContext: (element?: HTMLElement | null) => string | undefined;
//# sourceMappingURL=Label.d.ts.map