import React from 'react';
import type { LinkProps } from 'solito/link';
import type { AnchorProps } from 'tamagui';
export type TextLinkProps = Pick<LinkProps, 'href' | 'target'> & AnchorProps;
export declare const TextLink: React.ForwardRefExoticComponent<Pick<LinkProps, "href" | "target"> & Omit<import("tamagui").TextNonStyleProps, keyof import("@tamagui/web").TextStylePropsBase | "unstyled" | "size"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
    unstyled?: boolean | undefined;
    size?: import("tamagui").FontSizeTokens | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
    unstyled?: boolean | undefined;
    size?: import("tamagui").FontSizeTokens | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("tamagui").FontSizeTokens | undefined;
}>> & import("tamagui").AnchorExtraProps & React.RefAttributes<HTMLAnchorElement>>;
//# sourceMappingURL=TestSolito.d.ts.map