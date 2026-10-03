/**
 * The cross-build CSS coordinator.
 *
 * A zero-runtime build owns exactly one CSS artifact. It holds the config CSS,
 * the zero entry's compiler atomic CSS, every island child build's atomic CSS,
 * and every theme-bridge class. `TAMAGUI_DID_OUTPUT_CSS` is derived from this
 * object's completeness, never set by an author, so the JavaScript stripping
 * fact and its replacement asset cannot diverge.
 */
export declare class ZeroCSSArtifact {
    #private;
    constructor(cssPath: string);
    get cssPath(): string;
    expectIslands(ids: readonly string[]): void;
    setConfigCSS(css: string): void;
    setZeroModuleCSS(moduleId: string, css: string): void;
    setIslandModuleCSS(islandId: string, moduleId: string, css: string): void;
    /** This island's collected rules, in deterministic module order. */
    islandCSS(islandId: string): string[];
    /** Marks an island as compiled even when it contributed no atomic rules. */
    markIslandComplete(islandId: string): void;
    /** Collected zero-graph module CSS, for an integration that persists it. */
    zeroModuleEntries(): [string, string][];
    bridgeEntries(): [string, string][];
    setBridgeRules(bridgeId: string, css: string): void;
    clearGraphs(): void;
    /** The missing pieces that block deriving TAMAGUI_DID_OUTPUT_CSS. */
    missing(): string[];
    isComplete(): boolean;
    /** Deterministic order: config, zero atomic, island atomic, bridge classes. */
    css(): string;
    hash(): string;
    /**
     * Writes the artifact and returns whether the derived
     * `TAMAGUI_DID_OUTPUT_CSS='1'` claim is now legal.
     */
    write(): {
        path: string;
        hash: string;
        complete: boolean;
        missing: string[];
    };
}
//# sourceMappingURL=artifact.d.ts.map