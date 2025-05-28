import { type BabelFileResult } from '@babel/core';
import type { TamaguiOptions } from '../types';
export declare function extractToNative(sourceFileName: string, sourceCode: string, options: TamaguiOptions): BabelFileResult;
export declare function getBabelPlugin(): any;
export declare function getBabelParseDefinition(options: TamaguiOptions): {
    name: string;
    visitor: {
        Program: {
            enter(this: any, root: any): void;
        };
    };
};
//# sourceMappingURL=extractToNative.d.ts.map