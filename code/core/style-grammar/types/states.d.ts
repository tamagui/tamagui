export type StateTier = "pseudo" | "component";
export interface StateEntry {
	/** canonical state name — the vocabulary word. */
	state: string;
	/** how the state is applied: a core pseudo-style prop, or a DOM attribute. */
	tier: StateTier;
	/** canonical Tailwind modifier (e.g. 'press', 'data-[state=open]'). */
	modifier: string;
	/** the core pseudo-style prop that applies it (tier === 'pseudo'). */
	pseudoProp?: string;
	/** the web attribute selector the behavior emits (tier === 'component'). */
	selector?: string;
	/** additional modifier spellings that resolve to the canonical one. */
	aliases?: readonly string[];
}
export declare const stateVocabulary: readonly StateEntry[];
export type StateName = (typeof stateVocabulary)[number]["state"];
export declare const stateNames: readonly string[];
export declare const stateToModifier: Readonly<Record<string, string>>;
export declare const modifierToState: Readonly<Record<string, string>>;
export declare const stateToSelector: Readonly<Record<string, string>>;
export declare const stateToPseudoProp: Readonly<Record<string, string>>;
export declare const componentStateNames: readonly string[];

//# sourceMappingURL=states.d.ts.map