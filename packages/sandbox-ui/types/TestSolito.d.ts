/// <reference types="react" />
import type { LinkCoreProps } from 'solito/link';
import type { AnchorProps } from 'tamagui';
export type TextLinkProps = Pick<LinkCoreProps, 'href' | 'target'> & AnchorProps;
export declare const TextLink: import("react").ForwardRefExoticComponent<Pick<LinkCoreProps, "href" | "target"> & Omit<import("tamagui").TextNonStyleProps, "size" | keyof import("@tamagui/web").TextStylePropsBase | "unstyled"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
    size?: import("tamagui").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
    size?: import("tamagui").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").TextStylePropsBase, {
    size?: import("tamagui").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}>> & import("tamagui").AnchorExtraProps & import("react").RefAttributes<HTMLAnchorElement>>;
//# sourceMappingURL=TestSolito.d.ts.map