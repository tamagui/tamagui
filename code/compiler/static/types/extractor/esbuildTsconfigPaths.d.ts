import type { Plugin } from 'esbuild';
import { type TsConfigJsonResolved } from 'get-tsconfig';
type Tsconfig = Pick<TsConfigJsonResolved, 'compilerOptions'>;
export declare function createTsconfigPathsMatcher(tsconfig?: Tsconfig | string, cwd?: string): ((specifier: string) => string[]) | null;
export declare function TsconfigPathsPlugin(): Plugin;
export {};
//# sourceMappingURL=esbuildTsconfigPaths.d.ts.map