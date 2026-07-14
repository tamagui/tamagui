import type { MetroCompilerFrontend } from './frontend';
export interface MetroGetTransformOptionsContext {
    dev: boolean;
    hot: boolean;
    platform: string | null;
}
export type MetroGetTransformOptions = (this: unknown, entryFiles: string[], transformOptions: MetroGetTransformOptionsContext, getDependencies: (path: string) => Promise<string[]>) => Promise<{
    transform?: Record<string, any>;
    [key: string]: any;
}>;
export declare function composeMetroGetTransformOptions(frontend: Pick<MetroCompilerFrontend, 'ensureValidCache'>, userGetTransformOptions?: MetroGetTransformOptions): MetroGetTransformOptions;
//# sourceMappingURL=transformOptions.d.ts.map