import type { ResolvedModuleId, SourceSpan } from './contracts';
import type { BailoutReason, ZeroRule } from './diagnostics';
import type { LoweredModulePlan } from './lower';
import type { SourceEdit } from './output';
/**
 * Zero-runtime reference erasure and the rule-mapped diagnostics that gate it.
 *
 * A passing lowering plan already proved every Tamagui use in this module became
 * host markup. That fact is stronger than anything a bundler can derive, so the
 * compiler removes the now-dead references before the bundler records this
 * module's dependencies. Metro fixes its dependency graph at resolution time and
 * does no export-level shaking, so nothing later in the pipeline can do this.
 */
export type { ZeroRule };
export type ZeroViolationCode = 'zero/static-island-import' | 'zero/side-effect-import' | 'zero/live-tamagui-reference' | 'zero/design-state-read' | 'zero/runtime-provider' | BailoutReason['code'];
export interface ZeroViolation {
    rule: ZeroRule;
    code: ZeroViolationCode;
    span: SourceSpan;
    message: string;
    component?: string;
}
/** The last line of every zero-runtime failure, in both gates. */
export declare const ZERO_FAILURE_FOOTER = "Fix every site or move the owning module to a declared full-runtime island. Zero-runtime never retains one component as a fallback.";
/**
 * The JavaScript design-state surface. A reference to any of these in a zero
 * graph is rule 7: the value only exists once a runtime has parsed the config.
 */
export declare const ZERO_DESIGN_STATE_APIS: Set<string>;
/** Root providers. Their use is illegal in a zero graph, never erasable. */
export declare const ZERO_PROVIDER_EXPORTS: Set<string>;
/**
 * The four public animated-number hooks. They are the one opt-in runtime a zero
 * graph may keep, and only through the leaf module: the public barrel would drag
 * the config-bound driver resolution in with them.
 */
export declare const ZERO_ANIMATED_NUMBER_HOOKS: Set<string>;
export declare const ZERO_ANIMATED_NUMBER_MODULE = "@tamagui/animations-css/animated-number";
export interface ZeroRuleParams {
    component?: string;
    expression?: string;
    prop?: string;
    detail?: string;
    api?: string;
}
/** The rule map's developer messages, verbatim. */
export declare function zeroRuleMessage(rule: ZeroRule, params: ZeroRuleParams): string;
export declare const ZERO_PROVIDER_MESSAGE = "[tamagui zero-runtime] Rule 4: TamaguiProvider is not used by a zero-runtime root. The bundler loads generated CSS and the compiler lowers static Theme nodes. Remove this provider or make this entry full-runtime.";
export declare function zeroThemeBoundaryMessage(component: string, prop: string): string;
export declare function zeroConfigDriverMessage(name: string, outputStyle: unknown): string;
export declare function zeroIslandThemeMessage(entry: string): string;
/**
 * The lowering plan's own diagnostics, read as zero-runtime violations.
 *
 * Only the diagnostics that stopped a candidate from lowering count: one
 * recorded next to a successful lowering describes a dropped prop and leaves no
 * runtime behind.
 */
export declare function zeroViolationsFromPlan(plan: LoweredModulePlan): ZeroViolation[];
export interface ZeroErasureInput {
    id: ResolvedModuleId;
    source: string;
    /** Edits already committed by lowering. A reference inside one is consumed. */
    loweredEdits: readonly SourceEdit[];
    /** True when this import specifier names the zero-forbidden Tamagui surface. */
    isTamaguiSpecifier(specifier: string): boolean;
    /** Returns the island id when this specifier names a declared island module. */
    islandIdFor(specifier: string): string | null;
}
export interface ZeroErasureResult {
    edits: SourceEdit[];
    removedModules: string[];
    removedBindings: string[];
    erasedStyledDefinitions: string[];
    /**
     * Erased declarators this module also exported. The build-wide gate proves
     * every importer of them inside the zero entry graph was itself transformed.
     */
    erasedExports: string[];
    /** Hooks rewritten to the animated-number leaf, by their imported name. */
    rewrittenAnimatedNumberHooks: string[];
    liveBindings: string[];
    violations: ZeroViolation[];
}
export declare function planZeroErasure(input: ZeroErasureInput): ZeroErasureResult;
//# sourceMappingURL=zero.d.ts.map