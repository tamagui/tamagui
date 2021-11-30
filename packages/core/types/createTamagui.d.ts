import { Variable } from './createVariable';
import { CreateTamaguiConfig, GenericTamaguiConfig, MediaQueryKey, TamaguiInternalConfig, TamaguiProviderProps } from './types';
export declare type CreateTamaguiProps = TamaguiProviderProps & Omit<GenericTamaguiConfig, 'themes'> & {
    themes: {
        [key: string]: {
            [key: string]: string | number | Variable;
        };
    };
    mediaQueryDefaultActive?: MediaQueryKey[];
};
export declare const getHasConfigured: () => boolean;
export declare const getTamagui: () => TamaguiInternalConfig<import("./types").CreateTokens<string | number | Variable>, {
    [key: string]: {
        bg: string | Variable;
        bg2: string | Variable;
        bg3: string | Variable;
        bg4: string | Variable;
        color: string | Variable;
        color2: string | Variable;
        color3: string | Variable;
        color4: string | Variable;
        borderColor: string | Variable;
        borderColor2: string | Variable;
        shadowColor: string | Variable;
        shadowColor2: string | Variable;
    };
}, {}, {
    [x: string]: {
        [key: string]: string | number;
    };
}>;
export declare const getTokens: () => import("./types").CreateTokens<Variable>;
export declare const getThemes: () => {
    [key: string]: {
        bg: string | Variable;
        bg2: string | Variable;
        bg3: string | Variable;
        bg4: string | Variable;
        color: string | Variable;
        color2: string | Variable;
        color3: string | Variable;
        color4: string | Variable;
        borderColor: string | Variable;
        borderColor2: string | Variable;
        shadowColor: string | Variable;
        shadowColor2: string | Variable;
    };
};
declare type ConfigListener = (conf: TamaguiInternalConfig) => void;
export declare const onConfiguredOnce: (cb: ConfigListener) => void;
export declare function createTamagui<Conf extends CreateTamaguiProps>(config: Conf): Conf extends CreateTamaguiConfig<infer A, infer B, infer C, infer D> ? TamaguiInternalConfig<A, B, C, D> : unknown;
export declare function getThemeParentClassName(themeName?: string | null): string;
export {};
//# sourceMappingURL=createTamagui.d.ts.map