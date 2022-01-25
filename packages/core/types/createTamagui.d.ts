import { Variable } from './createVariable';
import { CreateTamaguiConfig, GenericTamaguiConfig, MediaQueryKey, TamaguiInternalConfig, TamaguiProviderProps } from './types';
export declare type CreateTamaguiProps = TamaguiProviderProps & Partial<Omit<GenericTamaguiConfig, 'themes' | 'tokens'>> & {
    tokens: GenericTamaguiConfig['tokens'];
    themes: {
        [key: string]: {
            [key: string]: string | number | Variable;
        };
    };
    mediaQueryDefaultActive?: MediaQueryKey[];
};
export declare function createTamagui<Conf extends CreateTamaguiProps>(config: Conf): Conf extends CreateTamaguiConfig<infer A, infer B, infer C, infer D> ? TamaguiInternalConfig<A, B, C, D> : unknown;
//# sourceMappingURL=createTamagui.d.ts.map