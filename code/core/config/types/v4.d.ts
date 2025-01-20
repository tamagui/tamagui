export { createThemes } from '@tamagui/theme-builder';
export { shorthands } from '@tamagui/shorthands/v4';
export { media, mediaQueryDefaultActive } from './media';
export { animations } from './v4-animations';
export { createSystemFont, fonts } from './v4-fonts';
export { tamaguiThemes, tokens } from '@tamagui/themes/v4';
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
        xxs: boolean;
    };
    defaultFont: string;
    fastSchemeChange: true;
    shouldAddPrefersColorThemes: true;
    allowedStyleValues: "somewhat-strict-web";
    themeClassNameOnRoot: true;
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
            readonly maxWidth: number;
        };
        readonly xl: {
            readonly maxWidth: number;
        };
        readonly lg: {
            readonly maxWidth: number;
        };
        readonly md: {
            readonly maxWidth: number;
        };
        readonly sm: {
            readonly maxWidth: number;
        };
        readonly xs: {
            readonly maxWidth: number;
        };
        readonly xxs: {
            readonly maxWidth: number;
        };
    };
    shorthands: {
        readonly ussel: "userSelect";
        readonly cur: "cursor";
        readonly pe: "pointerEvents";
        readonly col: "color";
        readonly ff: "fontFamily";
        readonly fos: "fontSize";
        readonly fost: "fontStyle";
        readonly fow: "fontWeight";
        readonly ls: "letterSpacing";
        readonly lh: "lineHeight";
        readonly ta: "textAlign";
        readonly tt: "textTransform";
        readonly ww: "wordWrap";
        readonly ac: "alignContent";
        readonly ai: "alignItems";
        readonly als: "alignSelf";
        readonly b: "bottom";
        readonly bg: "backgroundColor";
        readonly bbc: "borderBottomColor";
        readonly bblr: "borderBottomLeftRadius";
        readonly bbrr: "borderBottomRightRadius";
        readonly bbw: "borderBottomWidth";
        readonly blc: "borderLeftColor";
        readonly blw: "borderLeftWidth";
        readonly bc: "borderColor";
        readonly br: "borderRadius";
        readonly bs: "borderStyle";
        readonly brw: "borderRightWidth";
        readonly brc: "borderRightColor";
        readonly btc: "borderTopColor";
        readonly btlr: "borderTopLeftRadius";
        readonly btrr: "borderTopRightRadius";
        readonly btw: "borderTopWidth";
        readonly bw: "borderWidth";
        readonly dsp: "display";
        readonly f: "flex";
        readonly fb: "flexBasis";
        readonly fd: "flexDirection";
        readonly fg: "flexGrow";
        readonly fs: "flexShrink";
        readonly fw: "flexWrap";
        readonly h: "height";
        readonly jc: "justifyContent";
        readonly l: "left";
        readonly m: "margin";
        readonly mah: "maxHeight";
        readonly maw: "maxWidth";
        readonly mb: "marginBottom";
        readonly mih: "minHeight";
        readonly miw: "minWidth";
        readonly ml: "marginLeft";
        readonly mr: "marginRight";
        readonly mt: "marginTop";
        readonly mx: "marginHorizontal";
        readonly my: "marginVertical";
        readonly o: "opacity";
        readonly ov: "overflow";
        readonly p: "padding";
        readonly pb: "paddingBottom";
        readonly pl: "paddingLeft";
        readonly pos: "position";
        readonly pr: "paddingRight";
        readonly pt: "paddingTop";
        readonly px: "paddingHorizontal";
        readonly py: "paddingVertical";
        readonly r: "right";
        readonly shac: "shadowColor";
        readonly shar: "shadowRadius";
        readonly shof: "shadowOffset";
        readonly shop: "shadowOpacity";
        readonly t: "top";
        readonly w: "width";
        readonly zi: "zIndex";
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
            xxs: boolean;
        };
        defaultFont: string;
        fastSchemeChange: true;
        shouldAddPrefersColorThemes: true;
        allowedStyleValues: "somewhat-strict-web";
        themeClassNameOnRoot: true;
        maxDarkLightNesting: number;
    };
};
//# sourceMappingURL=v4.d.ts.map