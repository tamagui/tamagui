export declare function getDefaultTamaguiConfig(platform?: 'native' | 'web'): {
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
        readonly bc: "backgroundColor";
        readonly bg: "backgroundColor";
        readonly bbc: "borderBottomColor";
        readonly bblr: "borderBottomLeftRadius";
        readonly bbrr: "borderBottomRightRadius";
        readonly bbw: "borderBottomWidth";
        readonly blc: "borderLeftColor";
        readonly blw: "borderLeftWidth";
        readonly boc: "borderColor";
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
    fonts: {
        heading: {
            family: string;
            size: {
                1: number;
            };
            lineHeight: {
                1: number;
            };
            transform: {};
            weight: {
                1: string;
            };
            color: {
                1: string;
            };
            letterSpacing: {
                1: number;
            };
        };
        body: {
            family: string;
            size: {
                1: number;
            };
            lineHeight: {
                1: number;
            };
            transform: {};
            weight: {
                1: string;
            };
            color: {
                1: string;
            };
            letterSpacing: {
                1: number;
            };
        };
    };
    themes: {
        light: {
            background: import("@tamagui/core").Variable<string>;
            color: import("@tamagui/core").Variable<string>;
        };
        dark: {
            background: import("@tamagui/core").Variable<string>;
            color: import("@tamagui/core").Variable<string>;
        };
        dark_blue: {
            background: string;
            color: string;
        };
        dark_Card: {
            background: string;
            color: string;
        };
        dark_Button: {
            background: string;
            color: string;
        };
        dark_blue_Button: {
            background: string;
            color: string;
        };
        dark_red: {
            background: string;
            color: string;
        };
        dark_red_alt1: {
            background: string;
            color: string;
        };
        dark_red_Button: {
            background: string;
            color: string;
        };
        dark_yellow_Button: {
            background: string;
            color: string;
        };
        dark_red_active_ListItem: {
            background: string;
            color: string;
        };
        dark_red_alt2: {
            background: string;
            color: string;
        };
        dark_red_alt2_Button: {
            background: string;
            color: string;
        };
        red: {
            background: string;
            color: string;
        };
    };
    tokens: {
        color: {
            white: import("@tamagui/core").Variable<string>;
            black: import("@tamagui/core").Variable<string>;
        };
        space: {
            [x: string]: import("@tamagui/core").Variable<number>;
            [x: number]: import("@tamagui/core").Variable<number>;
            [x: symbol]: import("@tamagui/core").Variable<number>;
        };
        size: {
            0: import("@tamagui/core").Variable<number>;
            9: import("@tamagui/core").Variable<number>;
            18: import("@tamagui/core").Variable<number>;
            15: import("@tamagui/core").Variable<number>;
            1: import("@tamagui/core").Variable<number>;
            20: import("@tamagui/core").Variable<number>;
            10: import("@tamagui/core").Variable<number>;
            2: import("@tamagui/core").Variable<number>;
            4: import("@tamagui/core").Variable<number>;
            8: import("@tamagui/core").Variable<number>;
            0.25: import("@tamagui/core").Variable<number>;
            0.5: import("@tamagui/core").Variable<number>;
            0.75: import("@tamagui/core").Variable<number>;
            1.5: import("@tamagui/core").Variable<number>;
            2.5: import("@tamagui/core").Variable<number>;
            3: import("@tamagui/core").Variable<number>;
            3.5: import("@tamagui/core").Variable<number>;
            true: import("@tamagui/core").Variable<number>;
            4.5: import("@tamagui/core").Variable<number>;
            5: import("@tamagui/core").Variable<number>;
            5.5: import("@tamagui/core").Variable<number>;
            6: import("@tamagui/core").Variable<number>;
            6.5: import("@tamagui/core").Variable<number>;
            7: import("@tamagui/core").Variable<number>;
            7.6: import("@tamagui/core").Variable<number>;
            8.5: import("@tamagui/core").Variable<number>;
            9.5: import("@tamagui/core").Variable<number>;
            11: import("@tamagui/core").Variable<number>;
            12: import("@tamagui/core").Variable<number>;
            13: import("@tamagui/core").Variable<number>;
            14: import("@tamagui/core").Variable<number>;
            16: import("@tamagui/core").Variable<number>;
            17: import("@tamagui/core").Variable<number>;
            19: import("@tamagui/core").Variable<number>;
        };
        radius: {
            1: import("@tamagui/core").Variable<number>;
            0: import("@tamagui/core").Variable<number>;
            9: import("@tamagui/core").Variable<number>;
            10: import("@tamagui/core").Variable<number>;
            2: import("@tamagui/core").Variable<number>;
            4: import("@tamagui/core").Variable<number>;
            8: import("@tamagui/core").Variable<number>;
            3: import("@tamagui/core").Variable<number>;
            5: import("@tamagui/core").Variable<number>;
            6: import("@tamagui/core").Variable<number>;
            7: import("@tamagui/core").Variable<number>;
            11: import("@tamagui/core").Variable<number>;
            12: import("@tamagui/core").Variable<number>;
        };
        zIndex: {
            1: import("@tamagui/core").Variable<number>;
            0: import("@tamagui/core").Variable<number>;
            2: import("@tamagui/core").Variable<number>;
            4: import("@tamagui/core").Variable<number>;
            3: import("@tamagui/core").Variable<number>;
            5: import("@tamagui/core").Variable<number>;
        };
    } & Omit<{
        color: {
            white: import("@tamagui/core").Variable<string>;
            black: import("@tamagui/core").Variable<string>;
        };
        radius: {
            1: import("@tamagui/core").Variable<number>;
            0: import("@tamagui/core").Variable<number>;
            9: import("@tamagui/core").Variable<number>;
            10: import("@tamagui/core").Variable<number>;
            2: import("@tamagui/core").Variable<number>;
            4: import("@tamagui/core").Variable<number>;
            8: import("@tamagui/core").Variable<number>;
            3: import("@tamagui/core").Variable<number>;
            5: import("@tamagui/core").Variable<number>;
            6: import("@tamagui/core").Variable<number>;
            7: import("@tamagui/core").Variable<number>;
            11: import("@tamagui/core").Variable<number>;
            12: import("@tamagui/core").Variable<number>;
        };
        zIndex: {
            1: import("@tamagui/core").Variable<number>;
            0: import("@tamagui/core").Variable<number>;
            2: import("@tamagui/core").Variable<number>;
            4: import("@tamagui/core").Variable<number>;
            3: import("@tamagui/core").Variable<number>;
            5: import("@tamagui/core").Variable<number>;
        };
        space: {
            [x: string]: import("@tamagui/core").Variable<any>;
            [x: number]: import("@tamagui/core").Variable<any>;
            [x: symbol]: import("@tamagui/core").Variable<any>;
        };
        size: {
            0: import("@tamagui/core").Variable<number>;
            9: import("@tamagui/core").Variable<number>;
            18: import("@tamagui/core").Variable<number>;
            15: import("@tamagui/core").Variable<number>;
            1: import("@tamagui/core").Variable<number>;
            20: import("@tamagui/core").Variable<number>;
            10: import("@tamagui/core").Variable<number>;
            2: import("@tamagui/core").Variable<number>;
            4: import("@tamagui/core").Variable<number>;
            8: import("@tamagui/core").Variable<number>;
            0.25: import("@tamagui/core").Variable<number>;
            0.5: import("@tamagui/core").Variable<number>;
            0.75: import("@tamagui/core").Variable<number>;
            1.5: import("@tamagui/core").Variable<number>;
            2.5: import("@tamagui/core").Variable<number>;
            3: import("@tamagui/core").Variable<number>;
            3.5: import("@tamagui/core").Variable<number>;
            true: import("@tamagui/core").Variable<number>;
            4.5: import("@tamagui/core").Variable<number>;
            5: import("@tamagui/core").Variable<number>;
            5.5: import("@tamagui/core").Variable<number>;
            6: import("@tamagui/core").Variable<number>;
            6.5: import("@tamagui/core").Variable<number>;
            7: import("@tamagui/core").Variable<number>;
            7.6: import("@tamagui/core").Variable<number>;
            8.5: import("@tamagui/core").Variable<number>;
            9.5: import("@tamagui/core").Variable<number>;
            11: import("@tamagui/core").Variable<number>;
            12: import("@tamagui/core").Variable<number>;
            13: import("@tamagui/core").Variable<number>;
            14: import("@tamagui/core").Variable<number>;
            16: import("@tamagui/core").Variable<number>;
            17: import("@tamagui/core").Variable<number>;
            19: import("@tamagui/core").Variable<number>;
        };
    }, "color" | "space" | "size" | "radius" | "zIndex">;
    media: {
        xs: {
            maxWidth: number;
        };
        sm: {
            maxWidth: number;
        };
        md: {
            maxWidth: number;
        };
        lg: {
            maxWidth: number;
        };
        xl: {
            maxWidth: number;
        };
        xxl: {
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
        short: {
            maxHeight: number;
        };
        tall: {
            minHeight: number;
        };
        hoverNone: {
            hover: string;
        };
        pointerCoarse: {
            pointer: string;
        };
    };
    settings: {
        shouldAddPrefersColorThemes: boolean;
        defaultFont: string;
        themeClassNameOnRoot: boolean;
    };
};
//# sourceMappingURL=index.d.ts.map