import { ConfigListener, TamaguiInternalConfig } from './types';
export declare let conf: TamaguiInternalConfig | null;
export declare const setConfig: (next: TamaguiInternalConfig) => void;
export declare const getHasConfigured: () => boolean;
export declare const getTamagui: () => TamaguiInternalConfig<import("./types").CreateTokens<string | number | import("./createVariable").Variable>, {
    [key: string]: {
        background: string | import("./createVariable").Variable;
        backgroundHover: string | import("./createVariable").Variable;
        backgroundPress: string | import("./createVariable").Variable;
        backgroundFocus: string | import("./createVariable").Variable;
        color: string | import("./createVariable").Variable;
        colorHover: string | import("./createVariable").Variable;
        colorPress: string | import("./createVariable").Variable;
        colorFocus: string | import("./createVariable").Variable;
        borderColor: string | import("./createVariable").Variable;
        borderColorHover: string | import("./createVariable").Variable;
        borderColorPress: string | import("./createVariable").Variable;
        borderColorFocus: string | import("./createVariable").Variable;
        shadowColor: string | import("./createVariable").Variable;
        shadowColorHover: string | import("./createVariable").Variable;
        shadowColorPress: string | import("./createVariable").Variable;
        shadowColorFocus: string | import("./createVariable").Variable;
    };
}, {}, {
    [x: string]: {
        [key: string]: string | number;
    };
}, {
    [key: string]: string | {
        [key: string]: any;
    };
}>;
export declare const getTokens: () => import("./types").CreateTokens<import("./createVariable").Variable>;
export declare const getThemes: () => {
    [key: string]: {
        background: string | import("./createVariable").Variable;
        backgroundHover: string | import("./createVariable").Variable;
        backgroundPress: string | import("./createVariable").Variable;
        backgroundFocus: string | import("./createVariable").Variable;
        color: string | import("./createVariable").Variable;
        colorHover: string | import("./createVariable").Variable;
        colorPress: string | import("./createVariable").Variable;
        colorFocus: string | import("./createVariable").Variable;
        borderColor: string | import("./createVariable").Variable;
        borderColorHover: string | import("./createVariable").Variable;
        borderColorPress: string | import("./createVariable").Variable;
        borderColorFocus: string | import("./createVariable").Variable;
        shadowColor: string | import("./createVariable").Variable;
        shadowColorHover: string | import("./createVariable").Variable;
        shadowColorPress: string | import("./createVariable").Variable;
        shadowColorFocus: string | import("./createVariable").Variable;
    };
};
export declare const configListeners: Set<ConfigListener>;
export declare const onConfiguredOnce: (cb: ConfigListener) => void;
//# sourceMappingURL=conf.d.ts.map