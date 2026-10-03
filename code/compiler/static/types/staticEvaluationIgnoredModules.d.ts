import type { Plugin } from 'esbuild';
export declare const tamaguiStaticEvaluationModules: Readonly<{
    readonly 'react-native-safe-area-context': null;
    readonly 'react-native-worklets': 'react-native-worklets/lib/module/mock.js';
}>;
export declare function getStaticEvaluationModuleReplacement(moduleName: string): "react-native-worklets/lib/module/mock.js" | null | undefined;
export declare function isIgnoredStaticEvaluationModule(moduleName: string, userIgnoredModules?: readonly string[]): boolean;
export declare function staticEvaluationIgnorePlugin(userIgnoredModules?: readonly string[]): Plugin;
//# sourceMappingURL=staticEvaluationIgnoredModules.d.ts.map