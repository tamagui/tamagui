import type { Plugin } from 'esbuild';
export declare function isIgnoredStaticEvaluationModule(moduleName: string, userIgnoredModules?: readonly string[]): boolean;
export declare function staticEvaluationIgnorePlugin(userIgnoredModules?: readonly string[]): Plugin;
//# sourceMappingURL=staticEvaluationIgnoredModules.d.ts.map