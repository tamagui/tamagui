import * as t from '@babel/types';
import type { TamaguiOptions } from '../types';
import type { Extractor } from './createExtractor';
export type ExtractedResponse = {
    js: string | Buffer;
    styles: string;
    stylesPath?: string;
    ast: t.File;
    map: any;
    stats: {
        styled: number;
        flattened: number;
        optimized: number;
        found: number;
    };
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