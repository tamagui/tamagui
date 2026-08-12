export { canonicalClauseModifier } from "./modifierRegistry";
import { type ModifierKind, type ModifierRegistryView } from "./valueTypes";
export { grammarMaxNonPlatformDepth } from "./valueTypes";
/**
* The CSS emitter deliberately caps a condition chain at five distinct
* non-platform conditions. The parser can represent longer chains, but they
* cannot be lowered while also giving platform clauses a finite specificity
* floor above every platform-less clause, so the shared comparator rejects
* them consistently on every surface.
*/
export type ClausePrecedenceKey = readonly [platformRank: number, depth: number, categoryRank: number, withinCategoryRank: number];
export type OrderedModifierNames = readonly string[] | ReadonlySet<string> | Readonly<Record<string, unknown>>;
export type ClausePrecedenceOrder = ReadonlyMap<string, number>;
export declare function createClausePrecedenceOrder(names: OrderedModifierNames | undefined): ClausePrecedenceOrder;
/** Order-insensitive set key used by every clause merge/emission slot. */
export declare function clauseConditionSetKey(modifiers: readonly string[]): string;
export declare function getClausePrecedenceKeyFromKinds(modifiers: readonly string[], kinds: readonly (ModifierKind | undefined)[], order: ClausePrecedenceOrder): ClausePrecedenceKey;
export declare function getClausePrecedenceKey(modifiers: readonly string[], registry: ModifierRegistryView, order: ClausePrecedenceOrder): ClausePrecedenceKey;
/** Ascending comparator: a positive result means `left` wins over `right`. */
export declare function compareClausePrecedence(left: ClausePrecedenceKey, right: ClausePrecedenceKey): number;
/** Target CSS class specificity, excluding IDs/elements: (0, result, 0). */
export declare function clauseTargetClassSpecificity(key: ClausePrecedenceKey): number;
/**
* Subject-class repetitions needed after self-state selectors contribute
* their pseudo/attribute specificity naturally. Theme and group scopes use
* :where(), while media/container wrappers contribute zero.
*/
export declare function clauseSubjectClassRepetitions(key: ClausePrecedenceKey, selfStateSpecificity: number): number;

//# sourceMappingURL=clausePrecedence.d.ts.map