export type CoreStateModifierName = "hover" | "press" | "focus" | "focus-visible" | "focus-within" | "disabled" | "enter" | "exit";
export declare const coreStateModifierNames: readonly CoreStateModifierName[];
export declare const canonicalStateModifierNames: readonly string[];
export declare const stateModifierSelectors: readonly string[];
/**
* Every alternate spelling of a core state modifier, and the one it means.
*
* This table is the only place an alias is written down. The web runtime used
* to re-map `pressed`, `starting` and `ending` inline while resolving a
* condition, which meant `parseValue` reported them as unregistered modifiers
* and the runtime styled them anyway. `stateVocabulary` in states.ts already
* calls all four aliases, so the two tables agree.
*/
export declare const modifierAliases: Readonly<Record<string, string>>;
/** the shared identifier rule for parameterized modifier names */
export declare function isModifierName(text: string, start: number, end: number): boolean;
/** canonical spelling used by every clause identity and matching consumer */
export declare function canonicalClauseModifier(name: string): string;

//# sourceMappingURL=stateModifiers.d.ts.map