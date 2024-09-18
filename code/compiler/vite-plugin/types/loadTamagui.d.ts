import type { Logger, TamaguiOptions } from '@tamagui/static';
declare const importStatic: () => Promise<typeof import("@tamagui/static/types/exports")>;
type StaticI = Awaited<ReturnType<typeof importStatic>>;
export declare let tamaguiOptions: TamaguiOptions | null;
export declare let Static: StaticI | null;
export declare let extractor: ReturnType<StaticI['createExtractor']> | null;
export declare let disableStatic: boolean;
export declare const getStatic: () => Promise<typeof import("@tamagui/static/types/exports")>;
export declare function loadTamaguiBuildConfig(optionsIn?: Partial<TamaguiOptions>, logger?: Logger): Promise<void>;
export {};
//# sourceMappingURL=loadTamagui.d.ts.map