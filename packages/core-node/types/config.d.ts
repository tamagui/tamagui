import { ConfigListener, TamaguiInternalConfig, Tokens } from './types';
export declare const setConfig: (next: TamaguiInternalConfig) => void;
export declare const setConfigFont: (name: string, font: any, fontParsed: any) => void;
export declare const getConfig: () => TamaguiInternalConfig<import("./types").CreateTokens<any>, {
    [key: string]: Partial<import("./types").TamaguiBaseTheme> & {
        [key: string]: any;
    };
}, import("./types").GenericShorthands, {
    [key: string]: {
        [key: string]: string | number;
    };
}, {
    [key: string]: string | any[] | {
        [key: string]: any;
    };
}, import("./types").GenericFonts>;
export declare const getTokens: (prefixed?: boolean) => Tokens;
/**
 * Note: this is the same as `getTokens`
 */
export declare const useTokens: (prefixed?: boolean) => Tokens;
export declare const getThemes: () => {
    [x: string]: {
        [x: string]: any;
        background?: any;
        backgroundHover?: any;
        backgroundPress?: any;
        backgroundFocus?: any;
        color?: any;
        colorHover?: any;
        colorPress?: any;
        colorFocus?: any;
        borderColor?: any;
        borderColorHover?: any;
        borderColorPress?: any;
        borderColorFocus?: any;
        shadowColor?: any;
        shadowColorHover?: any;
        shadowColorPress?: any;
        shadowColorFocus?: any;
    };
};
export declare const configListeners: Set<ConfigListener>;
export declare const onConfiguredOnce: (cb: ConfigListener) => void;
export declare const updateConfig: (key: string, value: any) => void;
export declare const getFont: (name: string) => import("./types").GenericFont<string | number>;
//# sourceMappingURL=config.d.ts.map