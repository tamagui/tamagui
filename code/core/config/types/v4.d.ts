export { shorthands } from '@tamagui/shorthands/v4';
export { createThemes } from '@tamagui/theme-builder';
export { tamaguiThemes, tokens } from '@tamagui/themes/v4';
export { animations } from './v4-animations';
export { createSystemFont, fonts } from './v4-fonts';
export { breakpoints, media, mediaQueryDefaultActive } from './v4-media';
export { defaultThemes as themes } from '@tamagui/themes/v4';
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
    defaultSize: string;
    fastSchemeChange: true;
    shouldAddPrefersColorThemes: true;
    allowedStyleValues: "somewhat-strict-web";
    addThemeClassName: "html";
    onlyAllowShorthands: true;
    styleCompat: "legacy";
    defaultPosition: "relative";
};
export declare const defaultConfig: {
    animations: import("@tamagui/web").AnimationDriver<{
        '0ms': string;
        '30ms': string;
        '50ms': string;
        '75ms': string;
        '100ms': string;
        '200ms': string;
        '250ms': string;
        '300ms': string;
        '400ms': string;
        '500ms': string;
        superBouncy: string;
        bouncy: string;
        kindaBouncy: string;
        superLazy: string;
        lazy: string;
        medium: string;
        slowest: string;
        slow: string;
        quick: string;
        quickLessBouncy: string;
        tooltip: string;
        quicker: string;
        quickerLessBouncy: string;
        quickest: string;
        quickestLessBouncy: string;
    }>;
    media: {
        readonly maxXs: {
            readonly maxWidth: number;
        };
        readonly max2xs: {
            readonly maxWidth: number;
        };
        readonly maxSm: {
            readonly maxWidth: number;
        };
        readonly maxMd: {
            readonly maxWidth: number;
        };
        readonly maxLg: {
            readonly maxWidth: number;
        };
        readonly maxXl: {
            readonly maxWidth: number;
        };
        readonly max2Xl: {
            readonly maxWidth: number;
        };
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
    themes: import("@tamagui/themes/types/generated-v4").Themes;
    tokens: {
        readonly radius: {
            0: number;
            1: number;
            2: number;
            3: number;
            4: number;
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
        body: import("@tamagui/web").FillInFont<import("@tamagui/web").GenericFont, 2 | 9 | 15 | 1 | 10 | 3 | 5 | 6 | 16 | 11 | 12 | 14 | 4 | 7 | 8 | 13>;
        heading: import("@tamagui/web").FillInFont<import("@tamagui/web").GenericFont, 2 | 9 | 15 | 1 | 10 | 3 | 5 | 6 | 16 | 11 | 12 | 14 | 4 | 7 | 8 | 13>;
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
        defaultSize: string;
        fastSchemeChange: true;
        shouldAddPrefersColorThemes: true;
        allowedStyleValues: "somewhat-strict-web";
        addThemeClassName: "html";
        onlyAllowShorthands: true;
        styleCompat: "legacy";
        defaultPosition: "relative";
    };
};
//# sourceMappingURL=v4.d.ts.map