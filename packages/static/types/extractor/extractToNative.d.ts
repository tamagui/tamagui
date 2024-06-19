import { type BabelFileResult } from '@babel/core';
import type { TamaguiOptions } from '@tamagui/static';
export declare function extractToNative(sourceCode: string, options: TamaguiOptions): BabelFileResult;
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