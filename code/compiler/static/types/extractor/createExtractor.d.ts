import type { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import type { ExtractorOptions, ExtractorParseProps, TamaguiOptions } from '../types';
import type { TamaguiProjectInfo } from './bundleConfig';
import { cleanupBeforeExit } from './getStaticBindingsForScope';
export type Extractor = ReturnType<typeof createExtractor>;
type FileOrPath = NodePath<t.Program> | t.File;
export declare function createExtractor({ logger, platform }?: ExtractorOptions): {
    options: {
        logger: import("../types").Logger;
    };
    cleanupBeforeExit: typeof cleanupBeforeExit;
    loadTamagui: (props: TamaguiOptions) => Promise<TamaguiProjectInfo | null>;
    loadTamaguiSync: (props: TamaguiOptions) => TamaguiProjectInfo | null;
    getTamagui(): import("@tamagui/web").TamaguiInternalConfig | null | undefined;
    parseSync: (f: FileOrPath, props: ExtractorParseProps) => {
        styled: number;
        flattened: number;
        optimized: number;
        modified: number;
        found: number;
    } | null;
    parse: (f: FileOrPath, props: ExtractorParseProps) => Promise<{
        styled: number;
        flattened: number;
        optimized: number;
        modified: number;
        found: number;
    } | null>;
};
export {};
//# sourceMappingURL=createExtractor.d.ts.map