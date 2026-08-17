import { type AppliedLoweredModule, type LoweredModulePlan, type SourceEdit, type ZeroViolation } from '@tamagui/compiler-core';
import { type TamaguiInternalConfig } from '@tamagui/web';
import type { IslandThemeBridge } from './islands';
/**
 * The zero-mode source transform.
 *
 * It runs after lowering has committed its edits and before the bundler records
 * this module's dependencies. It lowers static `<Theme>` into host markup plus
 * classes, assigns each island mount its theme bridge, and erases the Tamagui
 * references lowering consumed.
 */
export interface ZeroModuleTransformInput {
    id: string;
    source: string;
    /** The module's lowering plan. Erasure only runs on a plan with no violations. */
    plan: LoweredModulePlan;
    config: TamaguiInternalConfig;
    /** Specifier prefixes that name the Tamagui surface, e.g. `tamagui`. */
    isTamaguiSpecifier(specifier: string): boolean;
    /** Island id when a specifier resolves to a generated island loader. */
    resolveIslandLoader(specifier: string): {
        islandId: string;
    } | null;
    /** Island id when a specifier resolves to a declared island root module. */
    resolveIslandModule(specifier: string): string | null;
}
export interface ZeroModuleTransformResult {
    output: AppliedLoweredModule;
    edits: SourceEdit[];
    /** Deterministic bridge descriptors this module produced, by island id. */
    bridges: Map<string, IslandThemeBridge[]>;
    /** Inline-value CSS rules keyed by their generated class name. */
    bridgeCSS: Map<string, string>;
    violations: ZeroViolation[];
    erased: {
        modules: string[];
        bindings: string[];
        styledDefinitions: string[];
    };
}
export declare function transformZeroModule(input: ZeroModuleTransformInput): ZeroModuleTransformResult;
//# sourceMappingURL=transform.d.ts.map