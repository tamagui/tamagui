import type { TamaguiOptions } from '@tamagui/static';
import type { Compiler, RuleSetRule } from 'webpack';
type PluginOptions = TamaguiOptions & {
    commonjs?: boolean;
    exclude?: RuleSetRule['exclude'];
    test?: RuleSetRule['test'];
    jsLoader?: any;
};
export declare class TamaguiPlugin {
    options: PluginOptions;
    pluginName: string;
    constructor(options?: PluginOptions);
    apply(compiler: Compiler): void;
}
export {};
//# sourceMappingURL=plugin.d.ts.map