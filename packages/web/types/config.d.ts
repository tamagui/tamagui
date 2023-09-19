import { ConfigListener, TamaguiInternalConfig, Token, Tokens, TokensMerged } from './types';
export declare const setConfig: (next: TamaguiInternalConfig) => void;
export declare const setConfigFont: (name: string, font: any, fontParsed: any) => void;
export declare const getConfig: () => TamaguiInternalConfig;
export declare function setTokens(_: TokensMerged): void;
export declare const getTokens: ({ prefixed, }?: {
    /**
     * Force either with $ or without $ prefix
     */
    prefixed?: boolean | undefined;
}) => TokensMerged;
export declare const getTokenObject: (value: Token, group?: keyof Tokens) => import("./createVariable").Variable<any>;
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
        [x: string]: import("./createVariable").Variable<import("./types").VariableVal>;
        background?: import("./createVariable").Variable<import("./types").VariableColorVal | undefined> | undefined;
        backgroundHover?: import("./createVariable").Variable<import("./types").VariableColorVal | undefined> | undefined;
        backgroundPress?: import("./createVariable").Variable<import("./types").VariableColorVal | undefined> | undefined;
        backgroundFocus?: import("./createVariable").Variable<import("./types").VariableColorVal | undefined> | undefined;
        color?: import("./createVariable").Variable<import("./types").VariableColorVal | undefined> | undefined;
        colorHover?: import("./createVariable").Variable<import("./types").VariableColorVal | undefined> | undefined;
        colorPress?: import("./createVariable").Variable<import("./types").VariableColorVal | undefined> | undefined;
        colorFocus?: import("./createVariable").Variable<import("./types").VariableColorVal | undefined> | undefined;
        borderColor?: import("./createVariable").Variable<import("./types").VariableColorVal | undefined> | undefined;
        borderColorHover?: import("./createVariable").Variable<import("./types").VariableColorVal | undefined> | undefined;
        borderColorPress?: import("./createVariable").Variable<import("./types").VariableColorVal | undefined> | undefined;
        borderColorFocus?: import("./createVariable").Variable<import("./types").VariableColorVal | undefined> | undefined;
        shadowColor?: import("./createVariable").Variable<import("./types").VariableColorVal | undefined> | undefined;
        shadowColorHover?: import("./createVariable").Variable<import("./types").VariableColorVal | undefined> | undefined;
        shadowColorPress?: import("./createVariable").Variable<import("./types").VariableColorVal | undefined> | undefined;
        shadowColorFocus?: import("./createVariable").Variable<import("./types").VariableColorVal | undefined> | undefined;
    };
};
export declare const configListeners: Set<ConfigListener>;
export declare const onConfiguredOnce: (cb: ConfigListener) => void;
export declare const updateConfig: (key: string, value: any) => void;
export declare const getFont: (name: string) => import("./types").GenericFont<string | number | symbol>;
type DevConfig = {
    visualizer?: boolean | {
        key?: string;
        delay?: number;
    };
};
export declare let devConfig: DevConfig | undefined;
export declare function setupDev(conf: DevConfig): void;
export {};
//# sourceMappingURL=config.d.ts.map