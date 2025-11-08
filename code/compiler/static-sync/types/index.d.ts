/**
 * @tamagui/static-sync
 *
 * Synchronous API for Tamagui static extraction using synckit.
 * Wraps @tamagui/static's worker implementation to provide sync APIs
 * required by Babel plugins which cannot use async functions.
 *
 * This package uses synckit to convert async worker calls into synchronous ones.
 */
import type { BabelFileResult } from '@babel/core';
import type { TamaguiOptions } from '@tamagui/types';
export type { ExtractedResponse, TamaguiProjectInfo, } from '@tamagui/static';
export type { TamaguiOptions } from '@tamagui/types';
export declare const getPragmaOptions: (props: {
    source: string;
    path: string;
}) => any;
/**
 * Load Tamagui build configuration synchronously
 * This is only used for loading tamagui.build.ts config
 */
export declare function loadTamaguiBuildConfigSync(tamaguiOptions: Partial<TamaguiOptions> | undefined): TamaguiOptions;
/**
 * Extract Tamagui components to className-based CSS for web (synchronous)
 */
export declare function extractToClassNamesSync(params: {
    source: string | Buffer;
    sourcePath?: string;
    options: TamaguiOptions;
    shouldPrintDebug?: boolean | 'verbose';
}): any;
/**
 * Extract Tamagui components to React Native StyleSheet format (synchronous)
 */
export declare function extractToNativeSync(sourceFileName: string, sourceCode: string, options: TamaguiOptions): BabelFileResult;
/**
 * Get babel plugin that uses synchronous extraction
 */
export declare function getBabelPlugin(): any;
//# sourceMappingURL=index.d.ts.map