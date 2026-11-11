import type { CLIResolvedOptions } from '@tamagui/types';
export type BuildStats = {
    filesProcessed: number;
    optimized: number;
    flattened: number;
    styled: number;
    found: number;
    bailed: number;
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
 * Merges per-file extracted CSS into one deduplicated sheet. Rules are grouped
 * by atomic identifier and groups are ordered by identifier, the same order
 * Tamagui's runtime uses when it serializes rules (getAllRules). A group keeps
 * its rules in compiled order, so a `:where(:hover)` rule stays after the base
 * rule it overrides.
 */
export declare function mergeCssRules(cssParts: string[]): string;
/**
 * Inserts a CSS import statement into JS code, placing it after any
 * 'use client' or 'use server' directives at the top of the file.
 */
export declare function insertCssImport(jsContent: string, cssImport: string): string;
export declare const build: (options: CLIResolvedOptions & {
    target?: 'web' | 'native' | 'both';
    dir?: string;
    include?: string;
    exclude?: string;
    output?: string;
    outputAround?: boolean;
    cssOut?: string;
    expectOptimizations?: number;
    runCommand?: string[];
    dryRun?: boolean;
}) => Promise<BuildResult>;
//# sourceMappingURL=build.d.ts.map