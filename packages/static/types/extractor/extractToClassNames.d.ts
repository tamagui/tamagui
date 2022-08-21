/// <reference types="node" />
import * as t from '@babel/types';
import type { TamaguiOptions } from '../types.js';
import { Extractor } from './createExtractor.js';
export declare type ExtractedResponse = {
    js: string | Buffer;
    styles: string;
    stylesPath?: string;
    ast: t.File;
    map: any;
};
export declare function extractToClassNames({ extractor, source, sourcePath, options, shouldPrintDebug, }: {
    extractor: Extractor;
    source: string | Buffer;
    sourcePath: string;
    options: TamaguiOptions;
    shouldPrintDebug: boolean | 'verbose';
}): Promise<ExtractedResponse | null>;
//# sourceMappingURL=extractToClassNames.d.ts.map