/// <reference types="node" />
import * as t from '@babel/types';
import type { TamaguiOptions } from '../types.js';
import { Extractor } from './createExtractor.js';
export type ExtractedResponse = {
    js: string | Buffer;
    styles: string;
    stylesPath?: string;
    ast: t.File;
    map: any;
};
export type ExtractToClassNamesProps = {
    extractor: Extractor;
    source: string | Buffer;
    sourcePath?: string;
    options: TamaguiOptions;
    shouldPrintDebug: boolean | 'verbose';
};
export declare function extractToClassNames({ extractor, source, sourcePath, options, shouldPrintDebug, }: ExtractToClassNamesProps): Promise<ExtractedResponse | null>;
//# sourceMappingURL=extractToClassNames.d.ts.map