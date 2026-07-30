import { type LonghandProgram, type ParsedValue } from '@tamagui/style-grammar';
import type { GetStyleState } from '../types';
import { type GrammarRuntimeContext } from './grammarConfig';
export declare function ensureGrammarContext(styleState: GetStyleState): GrammarRuntimeContext;
export declare function canAppendParsedProgram(styleState: GetStyleState, prop: string): boolean;
/**
 * Claims every longhand for one parsed contribution. Ordinary flat values
 * replace the whole program. Converted legacy condition props append clauses
 * at their authored position and lift an earlier plain value into the base.
 */
export declare function contributeParsedProgram(styleState: GetStyleState, prop: string, value: ParsedValue, sourceProp?: string, appendClauses?: boolean): void;
/**
 * Returns true when the value was consumed as programs. False means the caller
 * proceeds down the existing plain-value path.
 */
export declare function contributeStylePrograms(styleState: GetStyleState, key: string, val: string): boolean;
/** mergeStyle calls this so a later plain value replaces any program it covers */
export declare function deleteProgramsForStyleKey(programs: Map<string, LonghandProgram>, key: string): void;
//# sourceMappingURL=contributePrograms.d.ts.map