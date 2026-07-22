export * from './v6-base';
export { themes } from '@tamagui/themes/v5';
export type { V5Theme, V5ThemeNames, V5Themes } from '@tamagui/themes/v5';
/** the classic (v5) colors pack: generated v5 themes, colors live in the themes */
export declare const colors: {
    themes: import("@tamagui/themes/v5").V5Themes;
};
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
    fonts: {
        body: import("@tamagui/web").FillInFont<import("@tamagui/web").GenericFont, 9 | 15 | 1 | 10 | 3 | 2 | 5 | 6 | 16 | 11 | 12 | 14 | 4 | 7 | 8 | 13> & {
            size: {
                $xs: number;
                $sm: number;
                $base: number;
                $lg: number;
                $xl: number;
                $2xl: number;
                $3xl: number;
                $4xl: number;
                $5xl: number;
                $6xl: number;
                $7xl: number;
                $8xl: number;
                $9xl: number;
            };
            lineHeight: {
                $xs: number;
                $sm: number;
                $base: number;
                $lg: number;
                $xl: number;
                $2xl: number;
                $3xl: number;
                $4xl: number;
                $5xl: number;
                $6xl: number;
                $7xl: number;
                $8xl: number;
                $9xl: number;
            };
        };
        heading: import("@tamagui/web").FillInFont<import("@tamagui/web").GenericFont, 9 | 15 | 1 | 10 | 3 | 2 | 5 | 6 | 16 | 11 | 12 | 14 | 4 | 7 | 8 | 13> & {
            size: {
                $xs: number;
                $sm: number;
                $base: number;
                $lg: number;
                $xl: number;
                $2xl: number;
                $3xl: number;
                $4xl: number;
                $5xl: number;
                $6xl: number;
                $7xl: number;
                $8xl: number;
                $9xl: number;
            };
            lineHeight: {
                $xs: number;
                $sm: number;
                $base: number;
                $lg: number;
                $xl: number;
                $2xl: number;
                $3xl: number;
                $4xl: number;
                $5xl: number;
                $6xl: number;
                $7xl: number;
                $8xl: number;
                $9xl: number;
            };
        };
    };
    selectionStyles: (theme: any) => {
        backgroundColor: any;
        color: any;
    } | null;
    settings: {
        defaultSize: string;
        defaultTokens: {
            space: string;
            radius: string;
            zIndex: string;
            fontSize: string;
        };
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
    themes: import("@tamagui/themes/v5").V5Themes;
    tokens: {
        readonly space: {
            readonly $px: 1;
            readonly $0: 0;
            readonly '$0.5': 2;
            readonly $1: 4;
            readonly '$1.5': 6;
            readonly $2: 8;
            readonly '$2.5': 10;
            readonly $3: 12;
            readonly '$3.5': 14;
            readonly $4: 16;
            readonly $5: 20;
            readonly $6: 24;
            readonly $7: 28;
            readonly $8: 32;
            readonly $9: 36;
            readonly $10: 40;
            readonly $11: 44;
            readonly $12: 48;
            readonly $14: 56;
            readonly $16: 64;
            readonly $20: 80;
            readonly $24: 96;
            readonly $28: 112;
            readonly $32: 128;
            readonly $36: 144;
            readonly $40: 160;
            readonly $44: 176;
            readonly $48: 192;
            readonly $52: 208;
            readonly $56: 224;
            readonly $60: 240;
            readonly $64: 256;
            readonly $72: 288;
            readonly $80: 320;
            readonly $96: 384;
            readonly '-px': -1;
            readonly '-0.5': -2;
            readonly '-1': -4;
            readonly '-1.5': -6;
            readonly '-2': -8;
            readonly '-2.5': -10;
            readonly '-3': -12;
            readonly '-3.5': -14;
            readonly '-4': -16;
            readonly '-5': -20;
            readonly '-6': -24;
            readonly '-7': -28;
            readonly '-8': -32;
            readonly '-9': -36;
            readonly '-10': -40;
            readonly '-11': -44;
            readonly '-12': -48;
            readonly '-14': -56;
            readonly '-16': -64;
            readonly '-20': -80;
            readonly '-24': -96;
            readonly '-28': -112;
            readonly '-32': -128;
            readonly '-36': -144;
            readonly '-40': -160;
            readonly '-44': -176;
            readonly '-48': -192;
            readonly '-52': -208;
            readonly '-56': -224;
            readonly '-60': -240;
            readonly '-64': -256;
            readonly '-72': -288;
            readonly '-80': -320;
            readonly '-96': -384;
        };
        readonly size: {
            readonly $px: 1;
            readonly $0: 0;
            readonly '$0.5': 2;
            readonly $1: 4;
            readonly '$1.5': 6;
            readonly $2: 8;
            readonly '$2.5': 10;
            readonly $3: 12;
            readonly '$3.5': 14;
            readonly $4: 16;
            readonly $5: 20;
            readonly $6: 24;
            readonly $7: 28;
            readonly $8: 32;
            readonly $9: 36;
            readonly $10: 40;
            readonly $11: 44;
            readonly $12: 48;
            readonly $14: 56;
            readonly $16: 64;
            readonly $20: 80;
            readonly $24: 96;
            readonly $28: 112;
            readonly $32: 128;
            readonly $36: 144;
            readonly $40: 160;
            readonly $44: 176;
            readonly $48: 192;
            readonly $52: 208;
            readonly $56: 224;
            readonly $60: 240;
            readonly $64: 256;
            readonly $72: 288;
            readonly $80: 320;
            readonly $96: 384;
        };
        readonly radius: {
            readonly $none: 0;
            readonly $xs: 2;
            readonly $sm: 4;
            readonly $md: 6;
            readonly $lg: 8;
            readonly $xl: 12;
            readonly $2xl: 16;
            readonly $3xl: 24;
            readonly $4xl: 32;
            readonly $full: 9999;
            readonly 0: number;
            readonly 1: number;
            readonly 2: number;
            readonly 3: number;
            readonly 4: number;
            readonly 5: number;
            readonly 6: number;
            readonly 7: number;
            readonly 8: number;
            readonly 9: number;
            readonly 10: number;
            readonly 11: number;
            readonly 12: number;
        };
        readonly zIndex: {
            readonly $0: 0;
            readonly $1: 1;
            readonly $2: 2;
            readonly $3: 3;
            readonly $4: 4;
            readonly $5: 5;
            readonly $10: 10;
            readonly $20: 20;
            readonly $30: 30;
            readonly $40: 40;
            readonly $50: 50;
        };
    };
};
//# sourceMappingURL=v6-classic.d.ts.map