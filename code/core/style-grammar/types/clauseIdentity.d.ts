import { type FlatScanErrorCode } from "./scanFlatValue";
export type ClauseIdentityErrorCode = FlatScanErrorCode | "empty-modifier" | "empty-payload";
export interface ClauseIdentityHandler<Context> {
	segment(ctx: Context, start: number, end: number, isBase: boolean): void;
	chain?(ctx: Context, start: number, end: number): void;
	modifier?(ctx: Context, start: number, end: number, canonical: string): void;
	clause?(ctx: Context, start: number, chainEnd: number, payloadStart: number, end: number, slot: string): void;
	error?(ctx: Context, code: ClauseIdentityErrorCode, index: number): void;
	word?(ctx: Context, start: number, end: number, isChain: boolean): void;
}
export interface GroupModifier {
	state: string;
	group: string | null;
}
export declare const stateModifierNames: readonly string[];
/** the shared identifier rule for parameterized modifier names */
export declare function isModifierName(text: string, start: number, end: number): boolean;
/** parses the config-independent spelling of a named or unnamed group modifier */
export declare function parseGroupModifier(name: string): GroupModifier | null;
/** canonical spelling used by every clause identity and matching consumer */
export declare function canonicalClauseModifier(name: string): string;
/** order-insensitive identity for the distinct canonical modifiers in a clause */
export declare function clauseConditionSetKey(modifiers: readonly string[]): string;
/**
* Reduces one flat value to config-independent clause identity in the lexer's
* single pass. Consumers receive source spans, canonical alias spellings, and
* the unordered clause slot without re-scanning or classifying modifiers.
*/
export declare function reduceFlatValueIdentity<Context>(source: string, handler: ClauseIdentityHandler<Context>, consumer: Context): void;

//# sourceMappingURL=clauseIdentity.d.ts.map