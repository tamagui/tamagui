import type { GrammarConfigView } from "./candidate";
import type { ModifierRegistryView } from "./valueTypes";
type Names = readonly string[] | ReadonlySet<string> | Readonly<Record<string, unknown>>;
export interface ModifierRegistryResult {
	registry: ModifierRegistryView;
	/** one human-readable line per name collision, in registration order */
	diagnostics: string[];
}
export interface CreateModifierRegistryOptions {
	/**
	* The media keys that measure a size, so `@key` is a meaningful container
	* query. A `hover` or `pointer` media key measures nothing a container has, and
	* `@container (hover: none)` is valid syntax with no meaning, so those keys have
	* no `@` form.
	*
	* Overrides the view's derived `containerSizeNames`. When NEITHER is
	* supplied the sizes are unknown: no container modifier registers and a
	* diagnostic says so — an unknowable set refuses rather than over-claims.
	* A caller with genuinely no container concept passes `[]` explicitly.
	*/
	containerSizeNames?: Names;
}
/**
* Every built-in interaction/state modifier spelling: the modifiers of the core
* pseudo-style props, their aliases, and the component-tier state words the
* behavior packages expose through DOM attributes.
*/
export declare const stateModifierNames: readonly string[];
export interface GroupModifier {
	/** the state the parent group must be in, always a built-in state modifier */
	state: string;
	/** the group name, or null for the nearest unnamed group */
	group: string | null;
}
/**
* Parameterized group modifiers use Tailwind's spelling: `group-hover` for the
* nearest unnamed group and `group-hover/card` for a named one. The state part
* must be a built-in state modifier; the name part is an identifier. Returns
* null for anything else, which is what makes the spelling a single source of
* truth for both registration and lowering.
*/
export declare function parseGroupModifier(name: string): GroupModifier | null;
export interface ContainerModifier {
	/** the size condition; the registry only accepts a registered media name here */
	size: string;
	/** the container name, or null for the nearest container */
	container: string | null;
}
/**
* Container query modifiers own the `@` prefix: `@sm` targets the nearest
* container and `@sm/card` a named one (plan decisions 17-18). Plain `sm:` stays
* a viewport media query, which is why the prefix is reserved.
*
* This parses the spelling only. Whether `size` names a registered media key is
* config-dependent, so the registry checks that on lookup and lowering resolves
* the query text — the same split groups use for their state part.
*/
export declare function parseContainerModifier(name: string): ContainerModifier | null;
export declare function createModifierRegistry(view: GrammarConfigView, options?: CreateModifierRegistryOptions): ModifierRegistryResult;
export {};

//# sourceMappingURL=modifierRegistry.d.ts.map