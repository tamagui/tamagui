import type { CLIResolvedOptions } from '@tamagui/types';
export type BuildStats = {
    filesProcessed: number;
    optimized: number;
    flattened: number;
    styled: number;
    found: number;
};
export type TrackedFile = {
    path: string;
    hardlinkPath: string;
    mtimeAfterWrite: number;
};
export type BuildResult = {
    stats: BuildStats;
    trackedFiles: TrackedFile[];
};
export declare const build: (options: CLIResolvedOptions & {
    target?: "web" | "native" | "both";
    dir?: string;
    include?: string;
    exclude?: string;
    expectOptimizations?: number;
    runCommand?: string[];
}) => Promise<BuildResult>;
//# sourceMappingURL=build.d.ts.map