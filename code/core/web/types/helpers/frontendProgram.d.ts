import type { ParsedValue } from '@tamagui/style-grammar';
import type { FrontendProgramValue } from '../internalRuntimeTypes';
import type { GetStyleState } from '../types';
export type { FrontendProgramValue } from '../internalRuntimeTypes';
export declare function createFrontendProgram(property: string, value: ParsedValue): FrontendProgramValue;
export declare function isFrontendProgram(value: unknown): value is FrontendProgramValue;
/** consumed beside contributeStylePrograms in the forward pass */
export declare function contributeFrontendProgram(styleState: GetStyleState, sourceProp: string, program: FrontendProgramValue): boolean;
//# sourceMappingURL=frontendProgram.d.ts.map