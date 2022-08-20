import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { ExtractorOptions, ExtractorParseProps, TamaguiOptions } from '../types';
import { cleanupBeforeExit } from './getStaticBindingsForScope';
import { TamaguiProjectInfo } from './loadTamagui';
export declare type Extractor = ReturnType<typeof createExtractor>;
declare type FileOrPath = NodePath<t.Program> | t.File;
export declare function createExtractor({ logger }?: ExtractorOptions): {
    options: {
        logger: import("../types").Logger;
    };
    cleanupBeforeExit: typeof cleanupBeforeExit;
    loadTamagui: (props: TamaguiOptions) => Promise<TamaguiProjectInfo>;
    loadTamaguiSync: (props: TamaguiOptions) => TamaguiProjectInfo;
    getTamagui(): import("@tamagui/core-node").TamaguiInternalConfig<import("@tamagui/core-node").CreateTokens<any>, {
        [key: string]: Partial<import("@tamagui/core-node").TamaguiBaseTheme> & {
            [key: string]: any;
        };
    }, {}, {
        [key: string]: {
            [key: string]: string | number;
        };
    }, {
        [key: string]: string | {
            [key: string]: any;
        };
    }, import("@tamagui/core-node").GenericFonts> | undefined;
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