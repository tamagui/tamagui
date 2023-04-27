import { ConfigListener, TamaguiInternalConfig, TokensMerged } from './types.js';
export declare const setConfig: (next: TamaguiInternalConfig) => void;
export declare const setConfigFont: (name: string, font: any, fontParsed: any) => void;
export declare const getConfig: () => TamaguiInternalConfig;
export declare const getConfigIfDefined: () => TamaguiInternalConfig | null;
export declare const getTokens: ({ prefixed, }?: {
    /**
     * Force either with $ or without $ prefix
     */
    prefixed?: boolean | undefined;
}) => TokensMerged;
/**
 * Note: this is the same as `getTokens`
 */
export declare const useTokens: () => TokensMerged;
export declare const getThemes: () => {
    [x: string]: {
        [x: string]: import("./createVariable.js").Variable<any>;
        background?: import("./createVariable.js").Variable<any> | undefined;
        backgroundHover?: import("./createVariable.js").Variable<any> | undefined;
        backgroundPress?: import("./createVariable.js").Variable<any> | undefined;
        backgroundFocus?: import("./createVariable.js").Variable<any> | undefined;
        color?: import("./createVariable.js").Variable<any> | undefined;
        colorHover?: import("./createVariable.js").Variable<any> | undefined;
        colorPress?: import("./createVariable.js").Variable<any> | undefined;
        colorFocus?: import("./createVariable.js").Variable<any> | undefined;
        borderColor?: import("./createVariable.js").Variable<any> | undefined;
        borderColorHover?: import("./createVariable.js").Variable<any> | undefined;
        borderColorPress?: import("./createVariable.js").Variable<any> | undefined;
        borderColorFocus?: import("./createVariable.js").Variable<any> | undefined;
        shadowColor?: import("./createVariable.js").Variable<any> | undefined;
        shadowColorHover?: import("./createVariable.js").Variable<any> | undefined;
        shadowColorPress?: import("./createVariable.js").Variable<any> | undefined;
        shadowColorFocus?: import("./createVariable.js").Variable<any> | undefined;
    };
};
export declare const configListeners: Set<ConfigListener>;
export declare const onConfiguredOnce: (cb: ConfigListener) => void;
export declare const updateConfig: (key: string, value: any) => void;
export declare const getFont: (name: string) => import("./types.js").GenericFont<string | number>;
//# sourceMappingURL=config.d.ts.map