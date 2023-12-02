import { BuildTheme, ScaleTypeName } from './types';
export declare const getThemeSuiteScale: (theme: BuildTheme, accent?: boolean) => ScaleType;
export type ScaleType<A extends ScaleTypeName = ScaleTypeName> = {
    name: string;
    createdFrom?: A;
    lumScale: {
        light: Array<number>;
        dark: Array<number>;
    };
    satScale?: {
        light: Array<number>;
        dark: Array<number>;
    };
};
export declare const scaleTypes: Record<ScaleTypeName, ScaleType>;
//# sourceMappingURL=buildThemeSuiteScales.d.ts.map