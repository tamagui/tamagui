export { shorthands } from '@tamagui/shorthands/v4';
export { createThemes } from '@tamagui/theme-builder';
export { tamaguiThemes, tokens } from '@tamagui/themes/v4';
export { animations } from './v4-animations';
export { createSystemFont, fonts } from './v4-fonts';
export { breakpoints, media, mediaQueryDefaultActive } from './v4-media';
declare const generatedThemes: Record<"light" | "dark" | "light_yellow" | "light_green" | "light_blue" | "light_red" | "dark_yellow" | "dark_green" | "dark_blue" | "dark_red" | "light_accent" | "dark_accent" | "dark_black" | "dark_white" | "light_black" | "light_white", {
    [x: string]: string;
    [x: number]: string;
    [x: symbol]: string;
}>;
export type TamaguiThemes = typeof generatedThemes;
/**
 * This is an optional production optimization: themes JS can get to 20Kb or more.
 * Tamagui has ~1Kb of logic to hydrate themes from CSS, so you can remove the JS.
 * So long as you server render your Tamagui CSS, this will save you bundle size:
 */
export declare const themes: TamaguiThemes;
export declare const selectionStyles: (theme: any) => {
    backgroundColor: any;
    color: any;
} | null;
export declare const settings: {
    mediaQueryDefaultActive: {
        '2xl': boolean;
        xl: boolean;
        lg: boolean;
        md: boolean;
        sm: boolean;
        xs: boolean;
        '2xs': boolean;
    };
    defaultFont: string;
    fastSchemeChange: true;
    shouldAddPrefersColorThemes: true;
    allowedStyleValues: "somewhat-strict-web";
    themeClassNameOnRoot: true;
    onlyAllowShorthands: true;
    maxDarkLightNesting: number;
};
export declare const defaultConfig: {
    animations: import("@tamagui/web").AnimationDriver<{
        '75ms': string;
        '100ms': string;
        '200ms': string;
        bouncy: string;
        superBouncy: string;
        lazy: string;
        medium: string;
        slow: string;
        quick: string;
        quicker: string;
        quickest: string;
        tooltip: string;
    }>;
    media: {
        readonly '2xl': {
            readonly minWidth: number;
        };
        readonly xl: {
            readonly minWidth: number;
        };
        readonly lg: {
            readonly minWidth: number;
        };
        readonly md: {
            readonly minWidth: number;
        };
        readonly sm: {
            readonly minWidth: number;
        };
        readonly xs: {
            readonly minWidth: number;
        };
        readonly '2xs': {
            readonly minWidth: number;
        };
    };
    shorthands: {
        text: "textAlign";
        b: "bottom";
        bg: "backgroundColor";
        content: "alignContent";
        grow: "flexGrow";
        items: "alignItems";
        justify: "justifyContent";
        l: "left";
        m: "margin";
        maxH: "maxHeight";
        maxW: "maxWidth";
        mb: "marginBottom";
        minH: "minHeight";
        minW: "minWidth";
        ml: "marginLeft";
        mr: "marginRight";
        mt: "marginTop";
        mx: "marginHorizontal";
        my: "marginVertical";
        p: "padding";
        pb: "paddingBottom";
        pl: "paddingLeft";
        pr: "paddingRight";
        pt: "paddingTop";
        px: "paddingHorizontal";
        py: "paddingVertical";
        r: "right";
        rounded: "borderRadius";
        select: "userSelect";
        self: "alignSelf";
        shrink: "flexShrink";
        t: "top";
        z: "zIndex";
    };
    themes: Record<"light" | "dark" | "light_yellow" | "light_green" | "light_blue" | "light_red" | "dark_yellow" | "dark_green" | "dark_blue" | "dark_red" | "light_accent" | "dark_accent" | "dark_black" | "dark_white" | "light_black" | "light_white", {
        [x: string]: string;
        [x: number]: string;
        [x: symbol]: string;
    }>;
    tokens: {
        readonly radius: {
            0: number;
            1: number;
            2: number;
            3: number;
            4: number;
            true: number;
            5: number;
            6: number;
            7: number;
            8: number;
            9: number;
            10: number;
            11: number;
            12: number;
        };
        readonly zIndex: {
            0: number;
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
        };
        readonly space: {
            0: number;
            0.25: number;
            0.5: number;
            0.75: number;
            1: number;
            1.5: number;
            2: number;
            2.5: number;
            3: number;
            3.5: number;
            4: number;
            true: number;
            4.5: number;
            5: number;
            6: number;
            7: number;
            8: number;
            9: number;
            10: number;
            11: number;
            12: number;
            13: number;
            14: number;
            15: number;
            16: number;
            17: number;
            18: number;
            19: number;
            20: number;
            [-0.25]: number;
            [-0.5]: number;
            [-0.75]: number;
            [-1]: number;
            [-1.5]: number;
            [-2]: number;
            [-2.5]: number;
            [-3]: number;
            [-3.5]: number;
            [-4]: number;
            "-true": number;
            [-4.5]: number;
            [-5]: number;
            [-6]: number;
            [-7]: number;
            [-8]: number;
            [-9]: number;
            [-10]: number;
            [-11]: number;
            [-12]: number;
            [-13]: number;
            [-14]: number;
            [-15]: number;
            [-16]: number;
            [-17]: number;
            [-18]: number;
            [-19]: number;
            [-20]: number;
        };
        readonly size: {
            $0: number;
            "$0.25": number;
            "$0.5": number;
            "$0.75": number;
            $1: number;
            "$1.5": number;
            $2: number;
            "$2.5": number;
            $3: number;
            "$3.5": number;
            $4: number;
            $true: number;
            "$4.5": number;
            $5: number;
            $6: number;
            $7: number;
            $8: number;
            $9: number;
            $10: number;
            $11: number;
            $12: number;
            $13: number;
            $14: number;
            $15: number;
            $16: number;
            $17: number;
            $18: number;
            $19: number;
            $20: number;
        };
    };
    fonts: {
        body: import("@tamagui/web").FillInFont<import("@tamagui/web").GenericFont, 2 | 9 | 15 | 1 | 10 | 5 | 14 | 11 | 12 | 16 | 3 | 4 | 6 | 7 | 8 | 13 | "true">;
        heading: import("@tamagui/web").FillInFont<import("@tamagui/web").GenericFont, 2 | 9 | 15 | 1 | 10 | 5 | 14 | 11 | 12 | 16 | 3 | 4 | 6 | 7 | 8 | 13 | "true">;
    };
    selectionStyles: (theme: any) => {
        backgroundColor: any;
        color: any;
    } | null;
    settings: {
        mediaQueryDefaultActive: {
            '2xl': boolean;
            xl: boolean;
            lg: boolean;
            md: boolean;
            sm: boolean;
            xs: boolean;
            '2xs': boolean;
        };
        defaultFont: string;
        fastSchemeChange: true;
        shouldAddPrefersColorThemes: true;
        allowedStyleValues: "somewhat-strict-web";
        themeClassNameOnRoot: true;
        onlyAllowShorthands: true;
        maxDarkLightNesting: number;
    };
};
//# sourceMappingURL=v4.d.ts.map