import { Variable } from './createVariable';
import { AnimationDriver, CreateTamaguiConfig, GenericTamaguiConfig, MediaQueryKey, TamaguiInternalConfig } from './types';
export declare type CreateTamaguiProps = Partial<Omit<GenericTamaguiConfig, 'themes' | 'tokens' | 'animations'>> & {
    animations?: AnimationDriver<any>;
    tokens: GenericTamaguiConfig['tokens'];
    themes: {
        [key: string]: {
            [key: string]: string | number | Variable;
        };
    };
    mediaQueryDefaultActive?: MediaQueryKey[];
    cssStyleSeparator?: string;
    maxDarkLightNesting?: number;
};
export declare function createTamagui<Conf extends CreateTamaguiProps>(config: Conf): Conf extends Partial<CreateTamaguiConfig<infer A, infer B, infer C, infer D, infer E>> ? TamaguiInternalConfig<A, B, C, D, E> : unknown;
//# sourceMappingURL=createTamagui.d.ts.map