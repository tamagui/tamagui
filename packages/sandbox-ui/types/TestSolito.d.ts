/// <reference types="react" />
import { LinkCoreProps } from 'solito/link';
import { AnchorProps } from 'tamagui';
export type TextLinkProps = Pick<LinkCoreProps, 'href' | 'target'> & AnchorProps;
export declare const TextLink: import("react").ForwardRefExoticComponent<Pick<LinkCoreProps, "href" | "target"> & Omit<import("tamagui").TextNonStyleProps, keyof import("@tamagui/web").TextStylePropsBase | "size" | "unstyled"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase & {
    size?: import("tamagui").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase & {
    size?: import("tamagui").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase & {
    size?: import("tamagui").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase & {
    size?: import("tamagui").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").TextStylePropsBase & {
    size?: import("tamagui").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}>> & {
    href?: string | undefined;
    target?: string | undefined;
    rel?: string | undefined;
} & import("react").RefAttributes<HTMLAnchorElement>>;
//# sourceMappingURL=TestSolito.d.ts.map