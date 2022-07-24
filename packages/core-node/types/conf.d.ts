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
    [key: string]: string | {
        [key: string]: any;
    };
}, import("./types").GenericFonts>;
export declare const getTokens: () => import("./types").CreateTokens<import("./createVariable").Variable<any>>;
export declare const getThemes: () => {
    [key: string]: Partial<import("./types").TamaguiBaseTheme> & {
        [key: string]: import("./types").VariableVal;
    };
};
export declare const configListeners: Set<ConfigListener>;
export declare const onConfiguredOnce: (cb: ConfigListener) => void;
//# sourceMappingURL=conf.d.ts.map