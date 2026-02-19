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
/**
 * Inserts a CSS import statement into JS code, placing it after any
 * 'use client' or 'use server' directives at the top of the file.
 */
export declare function insertCssImport(jsContent: string, cssImport: string): string;
export declare const build: (options: CLIResolvedOptions & {
    target?: "web" | "native" | "both";
    dir?: string;
    include?: string;
    exclude?: string;
    output?: string;
    expectOptimizations?: number;
    runCommand?: string[];
    dryRun?: boolean;
}) => Promise<BuildResult>;
//# sourceMappingURL=build.d.ts.map