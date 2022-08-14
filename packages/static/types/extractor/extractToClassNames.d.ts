/// <reference types="node" />
import * as t from '@babel/types';
import { TamaguiOptions } from '../types';
import { Extractor } from './createExtractor';
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