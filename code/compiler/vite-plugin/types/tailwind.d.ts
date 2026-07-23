import { type GrammarSourceConfig } from '@tamagui/style-grammar';
export declare const TAILWIND_VERSION = "4.3.0";
export declare const TAILWIND_VIRTUAL_ID = "virtual:tamagui-tailwind.css";
export declare const TAILWIND_RESOLVED_ID = "\0virtual:tamagui-tailwind.css";
export declare function wrapWithTamaguiLayer(css: string): string;
export declare function isTamaguiCoreResetCSS(id: string): boolean;
export declare function layerTamaguiCoreResetCSS(id: string, css: string, hybridEnabled: boolean): string | null;
type HybridConfig = GrammarSourceConfig & {
    settings?: {
        styleMode?: string;
    };
};
export type TailwindHybridState = ReturnType<typeof createTailwindHybridState>;
export type TailwindWatchEvent = 'create' | 'update' | 'delete';
export declare function createTailwindHybridState(): {
    clear: () => void;
    configure: (nextRoot: string, nextGeneration: number, config: HybridConfig | null | undefined, onDependency: (file: string) => void, onSourceGlob?: (glob: string) => void) => Promise<boolean>;
    removeSource: (id: string) => Promise<boolean>;
    scanSource: (id: string, source: string) => Promise<boolean>;
    readonly enabled: boolean;
    readonly layerTamagui: boolean;
    readonly css: string;
    readonly candidateCount: number;
};
export declare function updateTailwindForWatchChange(state: TailwindHybridState, id: string, event: TailwindWatchEvent, configure: () => Promise<boolean>): Promise<boolean>;
export {};
//# sourceMappingURL=tailwind.d.ts.map