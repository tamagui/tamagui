<<<<<<< HEAD
import React from 'react';
export declare const TamaguiLogo: React.ForwardRefExoticComponent<{
    showWords?: boolean;
    downscale?: number;
    animated?: boolean;
} & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase | "fullscreen"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    elevation?: number | import("tamagui").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    elevation?: number | import("tamagui").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    elevation?: number | import("tamagui").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> & React.RefAttributes<any>>;
=======
import type { JSX } from "react/jsx-runtime";
import type { XStackProps } from "tamagui";
type LogoProps = {
	showWords?: boolean;
	downscale?: number;
	animated?: boolean;
	ref?: any;
} & XStackProps;
export declare const TamaguiLogo: ({ showWords, downscale, animated, ref,...props }: LogoProps) => JSX.Element;
export {};

>>>>>>> master
//# sourceMappingURL=TamaguiLogo.d.ts.map