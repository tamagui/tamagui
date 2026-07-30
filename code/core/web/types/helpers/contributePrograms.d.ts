import { type LonghandProgram } from '@tamagui/style-grammar';
import type { GetStyleState } from '../types';
import { type GrammarRuntimeContext } from './grammarConfig';
export declare function ensureGrammarContext(styleState: GetStyleState): GrammarRuntimeContext;
/**
 * Returns true when the value was consumed as programs. False means the caller
 * proceeds down the existing plain-value path.
 */
export declare function contributeStylePrograms(styleState: GetStyleState, key: string, val: string): boolean;
/** mergeStyle calls this so a later plain value replaces any program it covers */
export declare function deleteProgramsForStyleKey(programs: Map<string, LonghandProgram>, key: string): void;
//# sourceMappingURL=contributePrograms.d.ts.map