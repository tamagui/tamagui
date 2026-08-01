import { type ParsedValue } from '@tamagui/style-grammar';
import type { GetStyleState } from '../types';
import { type GrammarRuntimeContext } from './grammarConfig';
export declare function ensureGrammarContext(styleState: GetStyleState): GrammarRuntimeContext;
export declare function plainValueToPayload(value: unknown, longhand: string): string | null;
/** Clear lifecycle metadata when a plain value displaces a program. */
export declare function clearProgramLifecycleForProp(styleState: GetStyleState, prop: string): void;
/**
 * Claims every longhand for one parsed contribution. Later contributions
 * replace the base and any condition sets they restate while preserving the
 * other clauses already accumulated for that longhand.
 */
export declare function contributeParsedProgram(styleState: GetStyleState, prop: string, value: ParsedValue, sourceProp?: string): void;
/**
 * Returns true when the value was consumed as programs. False means the caller
 * proceeds down the existing plain-value path.
 */
export declare function contributeStylePrograms(styleState: GetStyleState, key: string, val: string): boolean;
/**
 * Numeric values on the transform family contribute base-only programs so the
 * family always composes in the canonical CSS order (translate, rotate,
 * scale). Without this, a numeric x beside a string rotate falls into the
 * legacy tail and its order against the family entries flips. Numbers stay
 * literal (px/deg by declaration unit), never config-resolved.
 */
export declare function contributeTransformNumber(styleState: GetStyleState, key: string, val: number): boolean;
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