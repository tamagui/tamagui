import { SpacerProps } from './createComponent';
import { Variable } from './createVariable';
import { AnimationDriver, CreateTamaguiConfig, GenericTamaguiConfig, MediaQueryKey, StackProps, TamaguiInternalConfig, TextProps } from './types';
export declare type CreateTamaguiProps = Partial<Omit<GenericTamaguiConfig, 'themes' | 'tokens' | 'animations'>> & {
    animations?: AnimationDriver<any>;
    tokens: GenericTamaguiConfig['tokens'];
    themes: {
        [key: string]: {
            [key: string]: string | number | Variable;
        };
    };
    defaultProps?: Record<string, any> & {
        Stack?: StackProps;
        Text?: TextProps;
        Spacer?: SpacerProps;
    };
    mediaQueryDefaultActive?: MediaQueryKey[];
    cssStyleSeparator?: string;
    maxDarkLightNesting?: number;
    shouldAddPrefersColorThemes?: boolean;
    themeClassNameOnRoot?: boolean;
};
export declare type InferTamaguiConfig<Conf extends CreateTamaguiProps> = Conf extends Partial<CreateTamaguiConfig<infer A, infer B, infer C, infer D, infer E, infer F>> ? TamaguiInternalConfig<A, B, C, D, E, F> : unknown;
export declare function createTamagui<Conf extends CreateTamaguiProps>(config: Conf): InferTamaguiConfig<Conf>;
export declare const reversedShorthands: Record<string, string>;
//# sourceMappingURL=createTamagui.d.ts.map