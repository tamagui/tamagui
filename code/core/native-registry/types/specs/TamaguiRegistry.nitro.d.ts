import type { HybridObject } from "react-native-nitro-modules";
/**
* Typed surface of the native registry.
*
* The engine is deliberately generic: it knows nothing about Tamagui themes
* beyond "a named state per scope selects which slot props apply". Tamagui
* semantics (theme names, scope wiring, compiler output) live in JS.
*
* Two methods are NOT in this spec because they take values Nitro cannot
* type: `link(shadowNode, slots, scopeId) -> number` and internal raw-JSI
* registration. They are registered as raw hybrid methods in C++ and typed
* on the JS side in index.native.ts.
*
* Threading: every method must be called from the JS thread. The engine is
* single-threaded by contract and holds no locks.
*/
export interface TamaguiRegistry extends HybridObject<{
	ios: "c++";
	android: "c++";
}> {
	/**
	* Set the active state name for a scope ('' = root scope) and commit the
	* matching slot props for every affected linked view in one ShadowTree
	* transaction.
	*/
	setStateName(scopeId: string, stateName: string): void;
	/** Read the active state name for a scope ('' = root). */
	getStateName(scopeId: string): string;
	/** Drop a scope entry (cleanup when a scope provider unmounts). */
	removeScope(scopeId: string): void;
	/** Unlink by the id returned from link(). Safe to call twice. */
	unlink(id: number): void;
	/** Number of currently linked views. */
	getViewCount(): number;
	/**
	* Number of ShadowTree commits performed. Benchmark honesty counter: a
	* measurement where this does not increase never exercised the fast path.
	*/
	getCommitCount(): number;
	/**
	* Number of linked views skipped during commits because their slots had no
	* entry for the active state name. Always 0 when the compiler emitted
	* exhaustive keys; anything else is an upstream bug, not a runtime
	* condition to recover from.
	*/
	getMissCount(): number;
}

//# sourceMappingURL=TamaguiRegistry.nitro.d.ts.map