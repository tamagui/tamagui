export { canonicalClauseModifier, clauseConditionSetKey } from "./clauseIdentity";
import { type ModifierKind, type ModifierRegistryView } from "./valueTypes";
export { grammarMaxNonPlatformDepth } from "./valueTypes";
/**
* One clause's precedence as a single integer: a higher key wins, so
* comparison is plain `>`. Four bounded fields pack most-significant first:
*
* - bits 26-27: platform rank — none 0; web/native 1; ios/android/tv 2;
*   tvos/androidtv 3
* - bits 23-25: depth — distinct non-platform conditions, capped at 5
* - bits 20-22: category rank — media 0 < container 1 < theme 2 < group 3
*   < state 4
* - bits 0-19: rank inside the highest category — the state lifecycle table,
*   or a media/container key's config declaration index (a config would need
*   over a million media keys to overflow these bits)
*
* The CSS emitter deliberately caps a condition chain at five distinct
* non-platform conditions. The parser can represent longer chains, but they
* cannot be lowered while also giving platform clauses a finite specificity
* floor above every platform-less clause, so the shared key builder rejects
* them consistently on every surface.
*/
export type ClausePrecedenceKey = number;
export declare function packClausePrecedence(platformRank: number, depth: number, categoryRank: number, withinCategoryRank: number): ClausePrecedenceKey;
export type OrderedModifierNames = readonly string[] | ReadonlySet<string> | Readonly<Record<string, unknown>>;
export type ClausePrecedenceOrder = ReadonlyMap<string, number>;
export declare function createClausePrecedenceOrder(names: OrderedModifierNames | undefined): ClausePrecedenceOrder;
export declare function getClausePrecedenceKeyFromKinds(modifiers: readonly string[], kinds: readonly (ModifierKind | undefined)[], order: ClausePrecedenceOrder): ClausePrecedenceKey;
export declare function getClausePrecedenceKey(modifiers: readonly string[], registry: ModifierRegistryView, order: ClausePrecedenceOrder): ClausePrecedenceKey;
/** Target CSS class specificity, excluding IDs/elements: (0, result, 0). */
export declare function clauseTargetClassSpecificity(key: ClausePrecedenceKey): number;
/**
* Subject-class repetitions needed after self-state selectors contribute
* their pseudo/attribute specificity naturally. Theme and group scopes use
* :where(), while media/container wrappers contribute zero.
*/
export declare function clauseSubjectClassRepetitions(key: ClausePrecedenceKey, selfStateSpecificity: number): number;

//# sourceMappingURL=clausePrecedence.d.ts.map