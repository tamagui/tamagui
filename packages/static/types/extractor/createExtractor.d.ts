import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { TamaguiInternalConfig } from '@tamagui/core-node';
import { ExtractorParseProps } from '../types';
export declare type Extractor = ReturnType<typeof createExtractor>;
export declare function createExtractor(): {
    getTamagui(): TamaguiInternalConfig<import("@tamagui/core-node").CreateTokens<any>, {
        [key: string]: Partial<import("@tamagui/core-node").TamaguiBaseTheme> & {
            [key: string]: any;
        };
    }, {}, {
        [x: string]: {
            [key: string]: string | number;
        };
    }, {
        [key: string]: string | {
            [key: string]: any;
        };
    }, import("@tamagui/core-node").GenericFonts>;
    parse: (fileOrPath: NodePath<t.Program> | t.File, { config, importsWhitelist, evaluateVars, shouldPrintDebug, sourcePath, onExtractTag, onStyleRule, getFlattenedNode, disable, disableExtraction, disableExtractInlineMedia, disableExtractVariables, disableDebugAttr, extractStyledDefinitions, prefixLogs, excludeProps, target, ...props }: ExtractorParseProps) => {
        styled: number;
        flattened: number;
        optimized: number;
        modified: number;
        found: number;
    } | null;
};
//# sourceMappingURL=createExtractor.d.ts.map