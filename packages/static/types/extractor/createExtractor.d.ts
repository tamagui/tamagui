import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import type { TamaguiInternalConfig } from '@tamagui/core';
import { ExtractorParseProps } from '../types';
export declare type Extractor = ReturnType<typeof createExtractor>;
export declare function createExtractor(): {
    getTamagui(): TamaguiInternalConfig<import("@tamagui/core").CreateTokens<import("@tamagui/core").VariableVal>, {
        [key: string]: Partial<import("@tamagui/core").TamaguiBaseTheme> & {
            [key: string]: import("@tamagui/core").VariableVal;
        };
    }, {}, {
        [x: string]: {
            [key: string]: string | number;
        };
    }, {
        [key: string]: string | {
            [key: string]: any;
        };
    }>;
    parse: (fileOrPath: NodePath<t.Program> | t.File, { config, importsWhitelist, evaluateVars, shouldPrintDebug, sourcePath, onExtractTag, getFlattenedNode, disable, disableExtraction, disableExtractInlineMedia, disableExtractVariables, disableDebugAttr, prefixLogs, ...props }: ExtractorParseProps) => {
        flattened: number;
        optimized: number;
        modified: number;
    } | null;
};
//# sourceMappingURL=createExtractor.d.ts.map