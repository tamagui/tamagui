import { type ParsedValue } from '@tamagui/style-grammar';
import type { GetStyleState } from '../types';
import { type GrammarRuntimeContext } from './grammarConfig';
export declare function ensureGrammarContext(styleState: GetStyleState): GrammarRuntimeContext;
export declare function canAppendParsedProgram(styleState: GetStyleState, prop: string): boolean;
/**
 * Claims every longhand for one parsed contribution. Ordinary flat values
 * replace the whole program. Converted legacy condition props append clauses
 * at their authored position and lift an earlier plain value into the base.
 */
export declare function contributeParsedProgram(styleState: GetStyleState, prop: string, value: ParsedValue, sourceProp?: string): void;
/**
 * Returns true when the value was consumed as programs. False means the caller
 * proceeds down the existing plain-value path.
 */
export declare function contributeStylePrograms(styleState: GetStyleState, key: string, val: string): boolean;
/** mergeStyle calls this so a later plain value replaces any program it covers */
/**
 * A later plain BASE write on a program-owned longhand restates the program's
 * base clause instead of destroying the program (decision 21): the styled
 * hover survives a call-site `bg="red"`, whether that override arrives as a
 * flat value, a plain prop, or a `style` object. Returns true when the value
 * was fully absorbed and the caller must skip its own store write. Values
 * that cannot become a payload fall back to wholesale replacement so nothing
 * mixes stores.
 */
export declare function absorbPlainIntoPrograms(styleState: GetStyleState, key: string, val: unknown): boolean;
//# sourceMappingURL=contributePrograms.d.ts.map