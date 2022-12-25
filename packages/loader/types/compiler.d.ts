import type { TamaguiOptions } from '@tamagui/static';
import type { LoaderContext } from 'webpack';
type Externals = any;
export declare class ChildCompiler {
    externals: Externals | undefined;
    constructor(externals: Externals);
    isChildCompiler(name: string | undefined): boolean;
    getCompiledSource(loader: LoaderContext<TamaguiOptions>): Promise<{
        source: string;
        dependencies: string[];
    }>;
}
export {};
//# sourceMappingURL=compiler.d.ts.map