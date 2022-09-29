import { ConfigListener, TamaguiInternalConfig, Tokens } from './types';
export declare const setConfig: (next: TamaguiInternalConfig) => void;
export declare const setConfigFont: (name: string, font: any, fontParsed: any) => void;
export declare const getHasConfigured: () => boolean;
export declare const getConfig: () => TamaguiInternalConfig<import("./types").CreateTokens<import("./types").VariableVal>, {
    [key: string]: Partial<import("./types").TamaguiBaseTheme> & {
        [key: string]: import("./types").VariableVal;
    };
}, {}, {
    [key: string]: {
        [key: string]: string | number;
    };
}, {
    [key: string]: string | any[] | {
        [key: string]: any;
    };
}, import("./types").GenericFonts>;
export declare const getTokens: () => Tokens;
/**
 * Note: this is the same as `getTokens`
 */
export declare const useTokens: () => Tokens;
export declare const getThemes: () => {
    [x: string]: {
        [x: string]: import("./createVariable").Variable<any>;
        background?: import("./createVariable").Variable<any> | undefined;
        backgroundHover?: import("./createVariable").Variable<any> | undefined;
        backgroundPress?: import("./createVariable").Variable<any> | undefined;
        backgroundFocus?: import("./createVariable").Variable<any> | undefined;
        color?: import("./createVariable").Variable<any> | undefined;
        colorHover?: import("./createVariable").Variable<any> | undefined;
        colorPress?: import("./createVariable").Variable<any> | undefined;
        colorFocus?: import("./createVariable").Variable<any> | undefined;
        borderColor?: import("./createVariable").Variable<any> | undefined;
        borderColorHover?: import("./createVariable").Variable<any> | undefined;
        borderColorPress?: import("./createVariable").Variable<any> | undefined;
        borderColorFocus?: import("./createVariable").Variable<any> | undefined;
        shadowColor?: import("./createVariable").Variable<any> | undefined;
        shadowColorHover?: import("./createVariable").Variable<any> | undefined;
        shadowColorPress?: import("./createVariable").Variable<any> | undefined;
        shadowColorFocus?: import("./createVariable").Variable<any> | undefined;
    };
};
export declare const configListeners: Set<ConfigListener>;
export declare const onConfiguredOnce: (cb: ConfigListener) => void;
export declare const updateConfig: (key: string, value: any) => void;
//# sourceMappingURL=config.d.ts.map