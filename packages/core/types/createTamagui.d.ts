import { Variable } from './createVariable';
import { AnimationHook, CreateTamaguiConfig, GenericTamaguiConfig, MediaQueryKey, TamaguiInternalConfig } from './types';
export declare type CreateTamaguiProps = Partial<Omit<GenericTamaguiConfig, 'themes' | 'tokens' | 'animations'>> & {
    animations?: {
        useAnimations: AnimationHook;
        animations: {
            [key: string]: any;
        };
        View?: any;
        Text?: any;
    };
    tokens: GenericTamaguiConfig['tokens'];
    themes: {
        [key: string]: {
            [key: string]: string | number | Variable;
        };
    };
    mediaQueryDefaultActive?: MediaQueryKey[];
};
export declare function createTamagui<Conf extends CreateTamaguiProps>(config: Conf): Conf extends Partial<CreateTamaguiConfig<infer A, infer B, infer C, infer D, infer E>> ? TamaguiInternalConfig<A, B, C, D, E> : unknown;
//# sourceMappingURL=createTamagui.d.ts.map