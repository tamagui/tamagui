import { type TamaguiOptions } from '@tamagui/static';
export type MetroTamaguiOptions = TamaguiOptions & {
    /**
     * When true, writes CSS to .tamagui/css/ files and imports them,
     * letting Metro handle CSS bundling. When false (default), CSS is
     * injected inline via JS at runtime.
     * @default false
     */
    cssInterop?: boolean;
};
type MetroConfigInput = {
    resolver?: any;
    transformer?: any;
    transformerPath?: string;
    [key: string]: any;
};
export declare function withTamagui(metroConfig: MetroConfigInput, optionsIn?: MetroTamaguiOptions): MetroConfigInput;
export {};
//# sourceMappingURL=index.d.ts.map