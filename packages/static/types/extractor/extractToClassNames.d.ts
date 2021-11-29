/// <reference types="node" />
import * as t from '@babel/types';
import { TamaguiOptions } from '../types';
import { Extractor } from './createExtractor';
export declare const CONCAT_CLASSNAME_IMPORT = "concatClassName";
export declare function extractToClassNames({ loader, extractor, source, sourcePath, options, shouldPrintDebug, threaded, cssPath, }: {
    loader: any;
    extractor: Extractor;
    source: string | Buffer;
    sourcePath: string;
    options: TamaguiOptions;
    shouldPrintDebug: boolean;
    cssPath: string;
    threaded?: boolean;
}): null | {
    js: string | Buffer;
    styles: string;
    stylesPath?: string;
    ast: t.File;
    map: any;
};
//# sourceMappingURL=extractToClassNames.d.ts.map