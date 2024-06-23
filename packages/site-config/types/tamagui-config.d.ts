import { themes } from './themes';
export { animations } from './animations';
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type FlattenUnion<T> = {
    [K in keyof UnionToIntersection<T>]: K extends keyof T ? T[K] extends any[] ? T[K] : T[K] extends object ? FlattenUnion<T[K]> : T[K] : UnionToIntersection<T>[K] | undefined;
};
export type Theme = FlattenUnion<(typeof themes)['light']>;
export type Themes = Record<keyof typeof themes, Theme>;
export declare const config: {
    defaultFont: string;
    shouldAddPrefersColorThemes: true;
    themeClassNameOnRoot: true;
    animations: import("@tamagui/core").AnimationDriver<{
        '75ms': {
            type: "timing";
            duration: number;
        };
        '100ms': {
            type: "timing";
            duration: number;
        };
        '200ms': {
            type: "timing";
            duration: number;
        };
        superBouncy: {
            type: "spring";
            damping: number;
            mass: number;
            stiffness: number;
        };
        bouncy: {
            type: "spring";
            damping: number;
            mass: number;
            stiffness: number;
        };
        kindaBouncy: {
            type: "spring";
            damping: number;
            mass: number;
            stiffness: number;
        };
        superLazy: {
            type: "spring";
            damping: number;
            mass: number;
            stiffness: number;
        };
        lazy: {
            type: "spring";
            damping: number;
            stiffness: number;
        };
        medium: {
            damping: number;
            stiffness: number;
            mass: number;
        };
        slowest: {
            type: "spring";
            damping: number;
            stiffness: number;
        };
        slow: {
            type: "spring";
            damping: number;
            stiffness: number;
        };
        quick: {
            type: "spring";
            damping: number;
            mass: number;
            stiffness: number;
        };
        tooltip: {
            type: "spring";
            damping: number;
            mass: number;
            stiffness: number;
        };
        quicker: {
            type: "spring";
            damping: number;
            mass: number;
            stiffness: number;
        };
        quickest: {
            damping: number;
            mass: number;
            stiffness: number;
        };
    }>;
    themes: Themes;
    media: {
        xl: {
            maxWidth: number;
        };
        lg_xl: {
            maxWidth: number;
        };
        lg: {
            maxWidth: number;
        };
        md: {
            maxWidth: number;
        };
        sm: {
            maxWidth: number;
        };
        xs: {
            maxWidth: number;
        };
        xxs: {
            maxWidth: number;
        };
        gtXs: {
            minWidth: number;
        };
        gtSm: {
            minWidth: number;
        };
        gtMd: {
            minWidth: number;
        };
        gtLg: {
            minWidth: number;
        };
        gtXl: {
            minWidth: number;
        };
        pointerFine: {
            pointer: string;
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
    tokens: {
        space: {
            0: import("@tamagui/core").Variable<number>;
            0.25: import("@tamagui/core").Variable<number>;
            0.5: import("@tamagui/core").Variable<number>;
            0.75: import("@tamagui/core").Variable<number>;
            1: import("@tamagui/core").Variable<number>;
            1.5: import("@tamagui/core").Variable<number>;
            2: import("@tamagui/core").Variable<number>;
            2.5: import("@tamagui/core").Variable<number>;
            3: import("@tamagui/core").Variable<number>;
            3.5: import("@tamagui/core").Variable<number>;
            4: import("@tamagui/core").Variable<number>;
            true: import("@tamagui/core").Variable<number>;
            4.5: import("@tamagui/core").Variable<number>;
            5: import("@tamagui/core").Variable<number>;
            6: import("@tamagui/core").Variable<number>;
            7: import("@tamagui/core").Variable<number>;
            8: import("@tamagui/core").Variable<number>;
            9: import("@tamagui/core").Variable<number>;
            10: import("@tamagui/core").Variable<number>;
            11: import("@tamagui/core").Variable<number>;
            12: import("@tamagui/core").Variable<number>;
            13: import("@tamagui/core").Variable<number>;
            14: import("@tamagui/core").Variable<number>;
            15: import("@tamagui/core").Variable<number>;
            16: import("@tamagui/core").Variable<number>;
            17: import("@tamagui/core").Variable<number>;
            18: import("@tamagui/core").Variable<number>;
            19: import("@tamagui/core").Variable<number>;
            20: import("@tamagui/core").Variable<number>;
            "-0.25": import("@tamagui/core").Variable<number>;
            "-0.5": import("@tamagui/core").Variable<number>;
            "-0.75": import("@tamagui/core").Variable<number>;
            "-1": import("@tamagui/core").Variable<number>;
            "-1.5": import("@tamagui/core").Variable<number>;
            "-2": import("@tamagui/core").Variable<number>;
            "-2.5": import("@tamagui/core").Variable<number>;
            "-3": import("@tamagui/core").Variable<number>;
            "-3.5": import("@tamagui/core").Variable<number>;
            "-4": import("@tamagui/core").Variable<number>;
            "-true": import("@tamagui/core").Variable<number>;
            "-4.5": import("@tamagui/core").Variable<number>;
            "-5": import("@tamagui/core").Variable<number>;
            "-6": import("@tamagui/core").Variable<number>;
            "-7": import("@tamagui/core").Variable<number>;
            "-8": import("@tamagui/core").Variable<number>;
            "-9": import("@tamagui/core").Variable<number>;
            "-10": import("@tamagui/core").Variable<number>;
            "-11": import("@tamagui/core").Variable<number>;
            "-12": import("@tamagui/core").Variable<number>;
            "-13": import("@tamagui/core").Variable<number>;
            "-14": import("@tamagui/core").Variable<number>;
            "-15": import("@tamagui/core").Variable<number>;
            "-16": import("@tamagui/core").Variable<number>;
            "-17": import("@tamagui/core").Variable<number>;
            "-18": import("@tamagui/core").Variable<number>;
            "-19": import("@tamagui/core").Variable<number>;
            "-20": import("@tamagui/core").Variable<number>;
        };
        size: {
            $0: import("@tamagui/core").Variable<number>;
            "$0.25": import("@tamagui/core").Variable<number>;
            "$0.5": import("@tamagui/core").Variable<number>;
            "$0.75": import("@tamagui/core").Variable<number>;
            $1: import("@tamagui/core").Variable<number>;
            "$1.5": import("@tamagui/core").Variable<number>;
            $2: import("@tamagui/core").Variable<number>;
            "$2.5": import("@tamagui/core").Variable<number>;
            $3: import("@tamagui/core").Variable<number>;
            "$3.5": import("@tamagui/core").Variable<number>;
            $4: import("@tamagui/core").Variable<number>;
            $true: import("@tamagui/core").Variable<number>;
            "$4.5": import("@tamagui/core").Variable<number>;
            $5: import("@tamagui/core").Variable<number>;
            $6: import("@tamagui/core").Variable<number>;
            $7: import("@tamagui/core").Variable<number>;
            $8: import("@tamagui/core").Variable<number>;
            $9: import("@tamagui/core").Variable<number>;
            $10: import("@tamagui/core").Variable<number>;
            $11: import("@tamagui/core").Variable<number>;
            $12: import("@tamagui/core").Variable<number>;
            $13: import("@tamagui/core").Variable<number>;
            $14: import("@tamagui/core").Variable<number>;
            $15: import("@tamagui/core").Variable<number>;
            $16: import("@tamagui/core").Variable<number>;
            $17: import("@tamagui/core").Variable<number>;
            $18: import("@tamagui/core").Variable<number>;
            $19: import("@tamagui/core").Variable<number>;
            $20: import("@tamagui/core").Variable<number>;
        };
        radius: {
            0: import("@tamagui/core").Variable<number>;
            2: import("@tamagui/core").Variable<number>;
            3: import("@tamagui/core").Variable<number>;
            1: import("@tamagui/core").Variable<number>;
            4: import("@tamagui/core").Variable<number>;
            8: import("@tamagui/core").Variable<number>;
            true: import("@tamagui/core").Variable<number>;
            12: import("@tamagui/core").Variable<number>;
            5: import("@tamagui/core").Variable<number>;
            7: import("@tamagui/core").Variable<number>;
            9: import("@tamagui/core").Variable<number>;
            10: import("@tamagui/core").Variable<number>;
            6: import("@tamagui/core").Variable<number>;
            11: import("@tamagui/core").Variable<number>;
        };
        zIndex: {
            0: import("@tamagui/core").Variable<number>;
            1: import("@tamagui/core").Variable<number>;
            2: import("@tamagui/core").Variable<number>;
            3: import("@tamagui/core").Variable<number>;
            4: import("@tamagui/core").Variable<number>;
            5: import("@tamagui/core").Variable<number>;
        };
        color: {
            yellow1Light: import("@tamagui/core").Variable<string>;
            yellow2Light: import("@tamagui/core").Variable<string>;
            yellow3Light: import("@tamagui/core").Variable<string>;
            yellow4Light: import("@tamagui/core").Variable<string>;
            yellow5Light: import("@tamagui/core").Variable<string>;
            yellow6Light: import("@tamagui/core").Variable<string>;
            yellow7Light: import("@tamagui/core").Variable<string>;
            yellow8Light: import("@tamagui/core").Variable<string>;
            yellow9Light: import("@tamagui/core").Variable<string>;
            yellow10Light: import("@tamagui/core").Variable<string>;
            yellow11Light: import("@tamagui/core").Variable<string>;
            yellow12Light: import("@tamagui/core").Variable<string>;
            red1Light: import("@tamagui/core").Variable<string>;
            red2Light: import("@tamagui/core").Variable<string>;
            red3Light: import("@tamagui/core").Variable<string>;
            red4Light: import("@tamagui/core").Variable<string>;
            red5Light: import("@tamagui/core").Variable<string>;
            red6Light: import("@tamagui/core").Variable<string>;
            red7Light: import("@tamagui/core").Variable<string>;
            red8Light: import("@tamagui/core").Variable<string>;
            red9Light: import("@tamagui/core").Variable<string>;
            red10Light: import("@tamagui/core").Variable<string>;
            red11Light: import("@tamagui/core").Variable<string>;
            red12Light: import("@tamagui/core").Variable<string>;
            purple1Light: import("@tamagui/core").Variable<string>;
            purple2Light: import("@tamagui/core").Variable<string>;
            purple3Light: import("@tamagui/core").Variable<string>;
            purple4Light: import("@tamagui/core").Variable<string>;
            purple5Light: import("@tamagui/core").Variable<string>;
            purple6Light: import("@tamagui/core").Variable<string>;
            purple7Light: import("@tamagui/core").Variable<string>;
            purple8Light: import("@tamagui/core").Variable<string>;
            purple9Light: import("@tamagui/core").Variable<string>;
            purple10Light: import("@tamagui/core").Variable<string>;
            purple11Light: import("@tamagui/core").Variable<string>;
            purple12Light: import("@tamagui/core").Variable<string>;
            pink1Light: import("@tamagui/core").Variable<string>;
            pink2Light: import("@tamagui/core").Variable<string>;
            pink3Light: import("@tamagui/core").Variable<string>;
            pink4Light: import("@tamagui/core").Variable<string>;
            pink5Light: import("@tamagui/core").Variable<string>;
            pink6Light: import("@tamagui/core").Variable<string>;
            pink7Light: import("@tamagui/core").Variable<string>;
            pink8Light: import("@tamagui/core").Variable<string>;
            pink9Light: import("@tamagui/core").Variable<string>;
            pink10Light: import("@tamagui/core").Variable<string>;
            pink11Light: import("@tamagui/core").Variable<string>;
            pink12Light: import("@tamagui/core").Variable<string>;
            orange1Light: import("@tamagui/core").Variable<string>;
            orange2Light: import("@tamagui/core").Variable<string>;
            orange3Light: import("@tamagui/core").Variable<string>;
            orange4Light: import("@tamagui/core").Variable<string>;
            orange5Light: import("@tamagui/core").Variable<string>;
            orange6Light: import("@tamagui/core").Variable<string>;
            orange7Light: import("@tamagui/core").Variable<string>;
            orange8Light: import("@tamagui/core").Variable<string>;
            orange9Light: import("@tamagui/core").Variable<string>;
            orange10Light: import("@tamagui/core").Variable<string>;
            orange11Light: import("@tamagui/core").Variable<string>;
            orange12Light: import("@tamagui/core").Variable<string>;
            green1Light: import("@tamagui/core").Variable<string>;
            green2Light: import("@tamagui/core").Variable<string>;
            green3Light: import("@tamagui/core").Variable<string>;
            green4Light: import("@tamagui/core").Variable<string>;
            green5Light: import("@tamagui/core").Variable<string>;
            green6Light: import("@tamagui/core").Variable<string>;
            green7Light: import("@tamagui/core").Variable<string>;
            green8Light: import("@tamagui/core").Variable<string>;
            green9Light: import("@tamagui/core").Variable<string>;
            green10Light: import("@tamagui/core").Variable<string>;
            green11Light: import("@tamagui/core").Variable<string>;
            green12Light: import("@tamagui/core").Variable<string>;
            gray1Light: import("@tamagui/core").Variable<string>;
            gray2Light: import("@tamagui/core").Variable<string>;
            gray3Light: import("@tamagui/core").Variable<string>;
            gray4Light: import("@tamagui/core").Variable<string>;
            gray5Light: import("@tamagui/core").Variable<string>;
            gray6Light: import("@tamagui/core").Variable<string>;
            gray7Light: import("@tamagui/core").Variable<string>;
            gray8Light: import("@tamagui/core").Variable<string>;
            gray9Light: import("@tamagui/core").Variable<string>;
            gray10Light: import("@tamagui/core").Variable<string>;
            gray11Light: import("@tamagui/core").Variable<string>;
            gray12Light: import("@tamagui/core").Variable<string>;
            blue1Light: import("@tamagui/core").Variable<string>;
            blue2Light: import("@tamagui/core").Variable<string>;
            blue3Light: import("@tamagui/core").Variable<string>;
            blue4Light: import("@tamagui/core").Variable<string>;
            blue5Light: import("@tamagui/core").Variable<string>;
            blue6Light: import("@tamagui/core").Variable<string>;
            blue7Light: import("@tamagui/core").Variable<string>;
            blue8Light: import("@tamagui/core").Variable<string>;
            blue9Light: import("@tamagui/core").Variable<string>;
            blue10Light: import("@tamagui/core").Variable<string>;
            blue11Light: import("@tamagui/core").Variable<string>;
            blue12Light: import("@tamagui/core").Variable<string>;
            yellow1Dark: import("@tamagui/core").Variable<string>;
            yellow2Dark: import("@tamagui/core").Variable<string>;
            yellow3Dark: import("@tamagui/core").Variable<string>;
            yellow4Dark: import("@tamagui/core").Variable<string>;
            yellow5Dark: import("@tamagui/core").Variable<string>;
            yellow6Dark: import("@tamagui/core").Variable<string>;
            yellow7Dark: import("@tamagui/core").Variable<string>;
            yellow8Dark: import("@tamagui/core").Variable<string>;
            yellow9Dark: import("@tamagui/core").Variable<string>;
            yellow10Dark: import("@tamagui/core").Variable<string>;
            yellow11Dark: import("@tamagui/core").Variable<string>;
            yellow12Dark: import("@tamagui/core").Variable<string>;
            red1Dark: import("@tamagui/core").Variable<string>;
            red2Dark: import("@tamagui/core").Variable<string>;
            red3Dark: import("@tamagui/core").Variable<string>;
            red4Dark: import("@tamagui/core").Variable<string>;
            red5Dark: import("@tamagui/core").Variable<string>;
            red6Dark: import("@tamagui/core").Variable<string>;
            red7Dark: import("@tamagui/core").Variable<string>;
            red8Dark: import("@tamagui/core").Variable<string>;
            red9Dark: import("@tamagui/core").Variable<string>;
            red10Dark: import("@tamagui/core").Variable<string>;
            red11Dark: import("@tamagui/core").Variable<string>;
            red12Dark: import("@tamagui/core").Variable<string>;
            purple1Dark: import("@tamagui/core").Variable<string>;
            purple2Dark: import("@tamagui/core").Variable<string>;
            purple3Dark: import("@tamagui/core").Variable<string>;
            purple4Dark: import("@tamagui/core").Variable<string>;
            purple5Dark: import("@tamagui/core").Variable<string>;
            purple6Dark: import("@tamagui/core").Variable<string>;
            purple7Dark: import("@tamagui/core").Variable<string>;
            purple8Dark: import("@tamagui/core").Variable<string>;
            purple9Dark: import("@tamagui/core").Variable<string>;
            purple10Dark: import("@tamagui/core").Variable<string>;
            purple11Dark: import("@tamagui/core").Variable<string>;
            purple12Dark: import("@tamagui/core").Variable<string>;
            pink1Dark: import("@tamagui/core").Variable<string>;
            pink2Dark: import("@tamagui/core").Variable<string>;
            pink3Dark: import("@tamagui/core").Variable<string>;
            pink4Dark: import("@tamagui/core").Variable<string>;
            pink5Dark: import("@tamagui/core").Variable<string>;
            pink6Dark: import("@tamagui/core").Variable<string>;
            pink7Dark: import("@tamagui/core").Variable<string>;
            pink8Dark: import("@tamagui/core").Variable<string>;
            pink9Dark: import("@tamagui/core").Variable<string>;
            pink10Dark: import("@tamagui/core").Variable<string>;
            pink11Dark: import("@tamagui/core").Variable<string>;
            pink12Dark: import("@tamagui/core").Variable<string>;
            orange1Dark: import("@tamagui/core").Variable<string>;
            orange2Dark: import("@tamagui/core").Variable<string>;
            orange3Dark: import("@tamagui/core").Variable<string>;
            orange4Dark: import("@tamagui/core").Variable<string>;
            orange5Dark: import("@tamagui/core").Variable<string>;
            orange6Dark: import("@tamagui/core").Variable<string>;
            orange7Dark: import("@tamagui/core").Variable<string>;
            orange8Dark: import("@tamagui/core").Variable<string>;
            orange9Dark: import("@tamagui/core").Variable<string>;
            orange10Dark: import("@tamagui/core").Variable<string>;
            orange11Dark: import("@tamagui/core").Variable<string>;
            orange12Dark: import("@tamagui/core").Variable<string>;
            green1Dark: import("@tamagui/core").Variable<string>;
            green2Dark: import("@tamagui/core").Variable<string>;
            green3Dark: import("@tamagui/core").Variable<string>;
            green4Dark: import("@tamagui/core").Variable<string>;
            green5Dark: import("@tamagui/core").Variable<string>;
            green6Dark: import("@tamagui/core").Variable<string>;
            green7Dark: import("@tamagui/core").Variable<string>;
            green8Dark: import("@tamagui/core").Variable<string>;
            green9Dark: import("@tamagui/core").Variable<string>;
            green10Dark: import("@tamagui/core").Variable<string>;
            green11Dark: import("@tamagui/core").Variable<string>;
            green12Dark: import("@tamagui/core").Variable<string>;
            gray1Dark: import("@tamagui/core").Variable<string>;
            gray2Dark: import("@tamagui/core").Variable<string>;
            gray3Dark: import("@tamagui/core").Variable<string>;
            gray4Dark: import("@tamagui/core").Variable<string>;
            gray5Dark: import("@tamagui/core").Variable<string>;
            gray6Dark: import("@tamagui/core").Variable<string>;
            gray7Dark: import("@tamagui/core").Variable<string>;
            gray8Dark: import("@tamagui/core").Variable<string>;
            gray9Dark: import("@tamagui/core").Variable<string>;
            gray10Dark: import("@tamagui/core").Variable<string>;
            gray11Dark: import("@tamagui/core").Variable<string>;
            gray12Dark: import("@tamagui/core").Variable<string>;
            blue1Dark: import("@tamagui/core").Variable<string>;
            blue2Dark: import("@tamagui/core").Variable<string>;
            blue3Dark: import("@tamagui/core").Variable<string>;
            blue4Dark: import("@tamagui/core").Variable<string>;
            blue5Dark: import("@tamagui/core").Variable<string>;
            blue6Dark: import("@tamagui/core").Variable<string>;
            blue7Dark: import("@tamagui/core").Variable<string>;
            blue8Dark: import("@tamagui/core").Variable<string>;
            blue9Dark: import("@tamagui/core").Variable<string>;
            blue10Dark: import("@tamagui/core").Variable<string>;
            blue11Dark: import("@tamagui/core").Variable<string>;
            blue12Dark: import("@tamagui/core").Variable<string>;
            white0: import("@tamagui/core").Variable<string>;
            white075: import("@tamagui/core").Variable<string>;
            white05: import("@tamagui/core").Variable<string>;
            white025: import("@tamagui/core").Variable<string>;
            black0: import("@tamagui/core").Variable<string>;
            black075: import("@tamagui/core").Variable<string>;
            black05: import("@tamagui/core").Variable<string>;
            black025: import("@tamagui/core").Variable<string>;
            white1: import("@tamagui/core").Variable<string>;
            white2: import("@tamagui/core").Variable<string>;
            white3: import("@tamagui/core").Variable<string>;
            white4: import("@tamagui/core").Variable<string>;
            white5: import("@tamagui/core").Variable<string>;
            white6: import("@tamagui/core").Variable<string>;
            white7: import("@tamagui/core").Variable<string>;
            white8: import("@tamagui/core").Variable<string>;
            white9: import("@tamagui/core").Variable<string>;
            white10: import("@tamagui/core").Variable<string>;
            white11: import("@tamagui/core").Variable<string>;
            white12: import("@tamagui/core").Variable<string>;
            black1: import("@tamagui/core").Variable<string>;
            black2: import("@tamagui/core").Variable<string>;
            black3: import("@tamagui/core").Variable<string>;
            black4: import("@tamagui/core").Variable<string>;
            black5: import("@tamagui/core").Variable<string>;
            black6: import("@tamagui/core").Variable<string>;
            black7: import("@tamagui/core").Variable<string>;
            black8: import("@tamagui/core").Variable<string>;
            black9: import("@tamagui/core").Variable<string>;
            black10: import("@tamagui/core").Variable<string>;
            black11: import("@tamagui/core").Variable<string>;
            black12: import("@tamagui/core").Variable<string>;
        };
    };
    mediaQueryDefaultActive: {
        xl: boolean;
        lg: boolean;
        md: boolean;
        sm: boolean;
        xs: boolean;
        xxs: boolean;
    };
    selectionStyles: (theme: Record<string, string>) => {
        backgroundColor: string;
        color: string;
    };
    settings: {
        allowedStyleValues: "somewhat-strict-web";
        autocompleteSpecificTokens: "except-special";
    };
    fonts: {
        heading: import("@tamagui/core").FillInFont<{
            size: {
                5: number;
                6: number;
                9: number;
                10: number;
            };
            transform: {
                6: "uppercase";
                7: "none";
            };
            weight: {
                6: string;
                7: string;
            };
            color: {
                6: string;
                7: string;
            };
            letterSpacing: {
                5: number;
                6: number;
                7: number;
                8: number;
                9: number;
                10: number;
                11: number;
                12: number;
                14: number;
                15: number;
            };
            face: {
                700: {
                    normal: string;
                };
                800: {
                    normal: string;
                };
                900: {
                    normal: string;
                };
            };
        }, 2 | 5 | 9 | 15 | 1 | 10 | 16 | 14 | 11 | 12 | 3 | 4 | 6 | 7 | 8 | 13 | "true">;
        headingDmSans: import("@tamagui/core").FillInFont<{
            size: {
                5: number;
                6: number;
                9: number;
                10: number;
            };
            transform: {
                6: "uppercase";
                7: "none";
            };
            weight: {
                6: string;
                7: string;
            };
            color: {
                6: string;
                7: string;
            };
            letterSpacing: {
                5: number;
                6: number;
                7: number;
                8: number;
                9: number;
                11: number;
            };
            face: {};
        }, 2 | 5 | 9 | 15 | 1 | 10 | 16 | 14 | 11 | 12 | 3 | 4 | 6 | 7 | 8 | 13 | "true">;
        headingDmSerifDisplay: import("@tamagui/core").FillInFont<{
            size: {
                5: number;
                6: number;
                7: number;
                8: number;
                9: number;
                10: number;
            };
            transform: {
                6: "uppercase";
                7: "none";
            };
            weight: {
                6: string;
                7: string;
            };
            color: {
                6: string;
                7: string;
            };
            letterSpacing: {
                5: number;
                6: number;
                7: number;
                8: number;
                9: number;
                10: number;
                11: number;
                12: number;
                14: number;
                15: number;
            };
            face: {};
        }, 2 | 5 | 9 | 15 | 1 | 10 | 16 | 14 | 11 | 12 | 3 | 4 | 6 | 7 | 8 | 13 | "true">;
        headingNohemi: import("@tamagui/core").FillInFont<{
            size: {
                5: number;
                6: number;
                9: number;
                10: number;
            };
            transform: {
                6: "uppercase";
                7: "none";
            };
            weight: {
                6: string;
                7: string;
            };
            color: {
                6: string;
                7: string;
            };
            letterSpacing: {
                5: number;
                6: number;
                7: number;
                9: number;
                12: number;
            };
            face: {};
        }, 2 | 5 | 9 | 15 | 1 | 10 | 16 | 14 | 11 | 12 | 3 | 4 | 6 | 7 | 8 | 13 | "true">;
        body: import("@tamagui/core").FillInFont<import("@tamagui/core").GenericFont, 2 | 5 | 9 | 15 | 1 | 10 | 16 | 14 | 11 | 12 | 3 | 4 | 6 | 7 | 8 | 13 | "true">;
        mono: {
            weight: {
                1: string;
            };
            size: {
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
                13: number;
                14: number;
                15: number;
                16: number;
            };
        };
        silkscreen: import("@tamagui/core").FillInFont<import("@tamagui/core").GenericFont, 2 | 5 | 9 | 15 | 1 | 10 | 16 | 14 | 11 | 12 | 3 | 4 | 6 | 7 | 8 | 13>;
        munro: import("@tamagui/core").GenericFont;
        cherryBomb: import("@tamagui/core").FillInFont<import("@tamagui/core").GenericFont, 2 | 5 | 9 | 15 | 1 | 10 | 16 | 14 | 11 | 12 | 3 | 4 | 6 | 7 | 8 | 13 | "true">;
    };
};
//# sourceMappingURL=tamagui-config.d.ts.map