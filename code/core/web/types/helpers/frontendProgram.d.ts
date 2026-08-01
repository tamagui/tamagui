import type { ParsedValue } from '@tamagui/style-grammar';
import type { GetStyleState } from '../types';
export interface FrontendProgramValue {
    readonly property: string;
    readonly value: ParsedValue;
}
export declare function createFrontendProgram(property: string, value: ParsedValue): FrontendProgramValue;
export declare function isFrontendProgram(value: unknown): value is FrontendProgramValue;
/** consumed beside contributeStylePrograms in the forward pass */
export declare function contributeFrontendProgram(styleState: GetStyleState, sourceProp: string, program: FrontendProgramValue): boolean;
//# sourceMappingURL=frontendProgram.d.ts.map