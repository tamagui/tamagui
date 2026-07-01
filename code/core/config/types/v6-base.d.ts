import { shorthands } from '@tamagui/shorthands/v6';
export * from './v5-base';
export { shorthands };
export declare const defaultConfig: {
    media: {
        readonly touchable: {
            pointer: string;
        };
        readonly hoverable: {
            hover: string;
        };
        readonly 'max-xxl': {
            readonly maxWidth: number;
        };
        readonly 'max-xl': {
            readonly maxWidth: number;
        };
        readonly 'max-lg': {
            readonly maxWidth: number;
        };
        readonly 'max-md': {
            readonly maxWidth: number;
        };
        readonly 'max-sm': {
            readonly maxWidth: number;
        };
        readonly 'max-xs': {
            readonly maxWidth: number;
        };
        readonly 'max-xxs': {
            readonly maxWidth: number;
        };
        readonly 'max-xxxs': {
            readonly maxWidth: number;
        };
        readonly 'max-200': {
            readonly maxWidth: number;
        };
        readonly 'max-100': {
            readonly maxWidth: number;
        };
        readonly xxxs: {
            readonly minWidth: number;
        };
        readonly xxs: {
            readonly minWidth: number;
        };
        readonly xs: {
            readonly minWidth: number;
        };
        readonly sm: {
            readonly minWidth: number;
        };
        readonly md: {
            readonly minWidth: number;
        };
        readonly lg: {
            readonly minWidth: number;
        };
        readonly xl: {
            readonly minWidth: number;
        };
        readonly xxl: {
            readonly minWidth: number;
        };
        readonly 'max-height-lg': {
            readonly maxHeight: number;
        };
        readonly 'max-height-md': {
            readonly maxHeight: number;
        };
        readonly 'max-height-sm': {
            readonly maxHeight: number;
        };
        readonly 'max-height-xs': {
            readonly maxHeight: number;
        };
        readonly 'max-height-xxs': {
            readonly maxHeight: number;
        };
        readonly 'max-height-xxxs': {
            readonly maxHeight: number;
        };
        readonly 'max-height-200': {
            readonly maxHeight: number;
        };
        readonly 'max-height-100': {
            readonly maxHeight: number;
        };
        readonly 'height-sm': {
            readonly minHeight: number;
        };
        readonly 'height-md': {
            readonly minHeight: number;
        };
        readonly 'height-lg': {
            readonly minHeight: number;
        };
    };
    shorthands: {
        text: "textAlign";
        b: "bottom";
        bg: "backgroundColor";
        content: "alignContent";
        grow: "flexGrow";
        h: "height";
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
        w: "width";
        z: "zIndex";
    };
    themes: import("@tamagui/themes/v5").V5Themes;
    tokens: {
        color: any;
        radius: any;
        zIndex: {
            0: number;
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
        };
        space: {
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
        size: {
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
        body: import("@tamagui/web").FillInFont<import("@tamagui/web").GenericFont, 9 | 15 | 1 | 10 | 3 | 2 | 5 | 6 | 16 | 11 | 12 | 14 | 4 | 7 | 8 | 13 | "true">;
        heading: import("@tamagui/web").FillInFont<import("@tamagui/web").GenericFont, 9 | 15 | 1 | 10 | 3 | 2 | 5 | 6 | 16 | 11 | 12 | 14 | 4 | 7 | 8 | 13 | "true">;
    };
    selectionStyles: (theme: any) => {
        backgroundColor: any;
        color: any;
    } | null;
    settings: {
        mediaQueryDefaultActive: {
            touchable: boolean;
            hoverable: boolean;
            'max-xxl': boolean;
            'max-xl': boolean;
            'max-lg': boolean;
            'max-md': boolean;
            'max-sm': boolean;
            'max-xs': boolean;
            'max-xxs': boolean;
            'max-xxxs': boolean;
            xxxs: boolean;
            xxs: boolean;
            xs: boolean;
            sm: boolean;
            md: boolean;
            lg: boolean;
            xl: boolean;
            xxl: boolean;
            'max-height-sm': boolean;
            'max-height-md': boolean;
            'max-height-lg': boolean;
            'height-sm': boolean;
            'height-md': boolean;
            'height-lg': boolean;
        };
        defaultFont: string;
        fastSchemeChange: true;
        shouldAddPrefersColorThemes: true;
        allowedStyleValues: "somewhat-strict-web";
        addThemeClassName: "html";
        onlyAllowShorthands: true;
        styleCompat: "web";
    };
};
//# sourceMappingURL=v6-base.d.ts.map