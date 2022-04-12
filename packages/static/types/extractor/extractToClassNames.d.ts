/// <reference types="node" />
import * as t from '@babel/types';
import { LoaderContext } from 'webpack';
import { TamaguiOptions } from '../types';
import { Extractor } from './createExtractor';
export declare type ExtractedResponse = {
    js: string | Buffer;
    styles: string;
    stylesPath?: string;
    ast: t.File;
    map: any;
};
export declare function extractToClassNames({ loader, extractor, source, sourcePath, options, shouldPrintDebug, threaded, cssPath, }: {
    loader: LoaderContext<any>;
    extractor: Extractor;
    source: string | Buffer;
    sourcePath: string;
    options: TamaguiOptions;
    shouldPrintDebug: boolean;
    cssPath: string;
    threaded?: boolean;
}): ExtractedResponse | null;
//# sourceMappingURL=extractToClassNames.d.ts.map