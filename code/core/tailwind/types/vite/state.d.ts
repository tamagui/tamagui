import { type GrammarSourceConfig } from '@tamagui/style-grammar/runtime';
export declare const TAILWIND_VERSION = "4.3.0";
export declare const TAILWIND_VIRTUAL_ID = "virtual:tamagui-tailwind.css";
export declare const TAILWIND_RESOLVED_ID = "\0virtual:tamagui-tailwind.css";
export declare function wrapWithTamaguiLayer(css: string): string;
export declare function isTamaguiCoreResetCSS(id: string): boolean;
export type TailwindScannerState = ReturnType<typeof createTailwindScannerState>;
export type TailwindWatchEvent = 'create' | 'update' | 'delete';
/**
 * The official Tailwind scanner and compiler, owned by `@tamagui/tailwind/vite`.
 *
 * It compiles only the candidates Tamagui's own grammar does not claim: claimed
 * candidates already became Tamagui atoms through the shared renderer, so emitting
 * them again would duplicate the rules and hand the cascade to whichever landed
 * last. There is no style-mode gate here — the state exists because the app
 * imported the Tailwind plugin.
 */
export declare function createTailwindScannerState(): {
    clear: () => void;
    configure: (nextRoot: string, nextGeneration: number, config: GrammarSourceConfig | null | undefined, onDependency: (file: string) => void, onSourceGlob?: (glob: string) => void) => Promise<boolean>;
    removeSource: (id: string) => Promise<boolean>;
    scanSource: (id: string, source: string) => Promise<boolean>;
    readonly enabled: boolean;
    readonly css: string;
    readonly candidateCount: number;
};
export declare function updateTailwindForWatchChange(state: TailwindScannerState, id: string, event: TailwindWatchEvent, configure: () => Promise<boolean>): Promise<boolean>;
//# sourceMappingURL=state.d.ts.map