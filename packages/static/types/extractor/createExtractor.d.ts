import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { ExtractorParseProps } from '../types';
export declare type Extractor = ReturnType<typeof createExtractor>;
export declare function createExtractor(): {
    getTamagui(): TamaguiInternalConfig;
    parse: (fileOrPath: NodePath<t.Program> | t.File, { config, importsWhitelist, evaluateVars, shouldPrintDebug, sourcePath, onExtractTag, getFlattenedNode, disable, disableExtraction, disableExtractInlineMedia, disableExtractVariables, disableDebugAttr, prefixLogs, excludeProps, target, ...props }: ExtractorParseProps) => {
        flattened: number;
        optimized: number;
        modified: number;
        found: number;
    } | null;
};
//# sourceMappingURL=createExtractor.d.ts.map