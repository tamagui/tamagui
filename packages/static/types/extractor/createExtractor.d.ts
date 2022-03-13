import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import type { TamaguiInternalConfig } from '@tamagui/core';
import { ExtractorParseProps } from '../types';
export declare type Extractor = ReturnType<typeof createExtractor>;
export declare function createExtractor(): {
    getTamagui(): TamaguiInternalConfig<import("@tamagui/core").CreateTokens<string | number | import("@tamagui/core").Variable>, {
        [key: string]: {
            bg: string | import("@tamagui/core").Variable;
            bg2: string | import("@tamagui/core").Variable;
            bg3: string | import("@tamagui/core").Variable;
            bg4: string | import("@tamagui/core").Variable;
            color: string | import("@tamagui/core").Variable;
            color2: string | import("@tamagui/core").Variable;
            color3: string | import("@tamagui/core").Variable;
            color4: string | import("@tamagui/core").Variable;
            borderColor: string | import("@tamagui/core").Variable;
            borderColor2: string | import("@tamagui/core").Variable;
            shadowColor: string | import("@tamagui/core").Variable;
            shadowColor2: string | import("@tamagui/core").Variable;
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