import type { Plugin } from 'esbuild';
import { type TsConfigJsonResolved } from 'get-tsconfig';
type TsconfigPathMatcher = (specifier: string) => string[];
export declare function TsconfigPathsPlugin(): Plugin;
export declare function loadTsconfigPathMatcher(tsconfig?: TsConfigJsonResolved | string): TsconfigPathMatcher;
export {};
//# sourceMappingURL=esbuildTsconfigPaths.d.ts.map