export { canonicalClauseModifier, clauseConditionSetKey } from "./clauseIdentity";
import { type ModifierKind, type ModifierRegistryView } from "./valueTypes";
export { grammarMaxNonPlatformDepth } from "./valueTypes";
/** one packed key compared as platform, depth, then every canonical atom rank */
export type ClausePrecedenceKey = number;
export declare function packClausePrecedence(platformRank: number, atomRanks: readonly number[]): ClausePrecedenceKey;
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