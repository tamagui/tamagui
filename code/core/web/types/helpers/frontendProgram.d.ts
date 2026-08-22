import type { ParsedValue } from '@tamagui/style-grammar/runtime';
import type { FrontendProgramValue } from '../internalRuntimeTypes';
import type { GetStyleState } from '../types';
import { type MergeStyle } from './directStyle';
export type { FrontendProgramValue } from '../internalRuntimeTypes';
export declare function createFrontendProgram(property: string, value: ParsedValue): FrontendProgramValue;
export declare function isFrontendProgram(value: unknown): value is FrontendProgramValue;
/** consumed beside direct flat strings in the forward pass */
export declare function contributeFrontendProgram(styleState: GetStyleState, program: FrontendProgramValue, merge: MergeStyle): boolean;
//# sourceMappingURL=frontendProgram.d.ts.map