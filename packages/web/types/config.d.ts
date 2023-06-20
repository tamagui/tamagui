import { ConfigListener, TamaguiInternalConfig, Token, Tokens, TokensMerged } from './types';
export declare const setConfig: (next: TamaguiInternalConfig) => void;
export declare const setConfigFont: (name: string, font: any, fontParsed: any) => void;
export declare const getConfig: () => TamaguiInternalConfig;
export declare const getTokens: ({ prefixed, }?: {
    /**
     * Force either with $ or without $ prefix
     */
    prefixed?: boolean | undefined;
}) => TokensMerged;
export declare const getToken: (value: Token, group?: keyof Tokens, useVariable?: boolean) => any;
export declare const getTokenValue: (value: Token, group?: keyof Tokens) => any;
/**
 * Note: this is the same as `getTokens`
 */
export declare const useTokens: ({ prefixed, }?: {
    /**
     * Force either with $ or without $ prefix
     */
    prefixed?: boolean | undefined;
}) => TokensMerged;
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
export declare const getFont: (name: string) => import("./types").GenericFont<string | number>;
//# sourceMappingURL=config.d.ts.map