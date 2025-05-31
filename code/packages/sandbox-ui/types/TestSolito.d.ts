import React from 'react';
import type { LinkProps } from 'solito/link';
import type { AnchorProps } from '@tamagui/ui';
export type TextLinkProps = Pick<LinkProps, 'href' | 'target'> & AnchorProps;
export declare const TextLink: React.ForwardRefExoticComponent<Pick<LinkProps, "target" | "href"> & Omit<import("@tamagui/ui").TextNonStyleProps, keyof import("@tamagui/web").TextStylePropsBase | "size" | "unstyled"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
    size?: import("@tamagui/ui").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
    size?: import("@tamagui/ui").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").TextStylePropsBase, {
    size?: import("@tamagui/ui").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}>> & import("@tamagui/ui").AnchorExtraProps & React.RefAttributes<HTMLAnchorElement>>;
//# sourceMappingURL=TestSolito.d.ts.map