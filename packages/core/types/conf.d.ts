import { ConfigListener, TamaguiInternalConfig } from './types';
export declare let conf: TamaguiInternalConfig | null;
export declare const setConfig: (next: TamaguiInternalConfig) => void;
export declare const getHasConfigured: () => boolean;
export declare const getTamagui: () => TamaguiInternalConfig<import("./types").CreateTokens<string | number | import("./createVariable").Variable>, {
    [key: string]: {
        bg: string | import("./createVariable").Variable;
        bg2: string | import("./createVariable").Variable;
        bg3: string | import("./createVariable").Variable;
        bg4: string | import("./createVariable").Variable;
        color: string | import("./createVariable").Variable;
        color2: string | import("./createVariable").Variable;
        color3: string | import("./createVariable").Variable;
        color4: string | import("./createVariable").Variable;
        borderColor: string | import("./createVariable").Variable;
        borderColor2: string | import("./createVariable").Variable;
        shadowColor: string | import("./createVariable").Variable;
        shadowColor2: string | import("./createVariable").Variable;
    };
}, {}, {
    [x: string]: {
        [key: string]: string | number;
    };
}>;
export declare const getTokens: () => import("./types").CreateTokens<import("./createVariable").Variable>;
export declare const getThemes: () => {
    [key: string]: {
        bg: string | import("./createVariable").Variable;
        bg2: string | import("./createVariable").Variable;
        bg3: string | import("./createVariable").Variable;
        bg4: string | import("./createVariable").Variable;
        color: string | import("./createVariable").Variable;
        color2: string | import("./createVariable").Variable;
        color3: string | import("./createVariable").Variable;
        color4: string | import("./createVariable").Variable;
        borderColor: string | import("./createVariable").Variable;
        borderColor2: string | import("./createVariable").Variable;
        shadowColor: string | import("./createVariable").Variable;
        shadowColor2: string | import("./createVariable").Variable;
    };
};
export declare const configListeners: Set<ConfigListener>;
export declare const onConfiguredOnce: (cb: ConfigListener) => void;
//# sourceMappingURL=conf.d.ts.map