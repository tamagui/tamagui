import type { Plugin } from 'esbuild';
interface Tsconfig {
    compilerOptions?: {
        baseUrl?: string;
        paths?: Record<string, string[]>;
    };
}
export declare function TsconfigPathsPlugin(): Plugin;
export declare function loadCompilerOptionsFromTsconfig(tsconfig?: Tsconfig | string): import("typescript").CompilerOptions;
export {};
//# sourceMappingURL=esbuildTsconfigPaths.d.ts.map