import type { Plugin } from 'esbuild';
import { type TsConfigJsonResolved } from 'get-tsconfig';
type Tsconfig = Pick<TsConfigJsonResolved, 'compilerOptions'>;
type TsconfigPathMatcher = (specifier: string) => string[];
export declare function createTsconfigPathsMatcher(tsconfig?: Tsconfig | string, cwd?: string): ((specifier: string) => string[]) | null;
export declare function loadTsconfigPathMatcher(tsconfig?: TsConfigJsonResolved | string): TsconfigPathMatcher;
export declare function TsconfigPathsPlugin(): Plugin;
export {};
//# sourceMappingURL=esbuildTsconfigPaths.d.ts.map