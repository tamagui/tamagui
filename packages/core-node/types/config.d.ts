import { ConfigListener, TamaguiInternalConfig } from './types';
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
export declare const getTokens: () => import("./types").CreateTokens<import("./createVariable").Variable<import("./createVariable").VariableValue>>;
export declare const getThemes: () => {
    [x: string]: {
        [x: string]: import("./createVariable").Variable<import("./createVariable").VariableValue>;
        background?: import("./createVariable").Variable<import("./createVariable").VariableValue> | undefined;
        backgroundHover?: import("./createVariable").Variable<import("./createVariable").VariableValue> | undefined;
        backgroundPress?: import("./createVariable").Variable<import("./createVariable").VariableValue> | undefined;
        backgroundFocus?: import("./createVariable").Variable<import("./createVariable").VariableValue> | undefined;
        color?: import("./createVariable").Variable<import("./createVariable").VariableValue> | undefined;
        colorHover?: import("./createVariable").Variable<import("./createVariable").VariableValue> | undefined;
        colorPress?: import("./createVariable").Variable<import("./createVariable").VariableValue> | undefined;
        colorFocus?: import("./createVariable").Variable<import("./createVariable").VariableValue> | undefined;
        borderColor?: import("./createVariable").Variable<import("./createVariable").VariableValue> | undefined;
        borderColorHover?: import("./createVariable").Variable<import("./createVariable").VariableValue> | undefined;
        borderColorPress?: import("./createVariable").Variable<import("./createVariable").VariableValue> | undefined;
        borderColorFocus?: import("./createVariable").Variable<import("./createVariable").VariableValue> | undefined;
        shadowColor?: import("./createVariable").Variable<import("./createVariable").VariableValue> | undefined;
        shadowColorHover?: import("./createVariable").Variable<import("./createVariable").VariableValue> | undefined;
        shadowColorPress?: import("./createVariable").Variable<import("./createVariable").VariableValue> | undefined;
        shadowColorFocus?: import("./createVariable").Variable<import("./createVariable").VariableValue> | undefined;
    };
};
export declare const configListeners: Set<ConfigListener>;
export declare const onConfiguredOnce: (cb: ConfigListener) => void;
export declare const updateConfig: (key: string, value: any) => void;
//# sourceMappingURL=config.d.ts.map