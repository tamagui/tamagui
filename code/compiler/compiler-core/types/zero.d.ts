import type { ResolvedModuleId, SourceSpan } from './contracts';
import type { SourceEdit } from './output';
/**
 * Zero-runtime reference erasure.
 *
 * A passing lowering plan already proved every Tamagui use in this module became
 * host markup. That fact is stronger than anything a bundler can derive, so the
 * compiler removes the now-dead references before the bundler records this
 * module's dependencies. Metro fixes its dependency graph at resolution time and
 * does no export-level shaking, so nothing later in the pipeline can do this.
 */
export interface ZeroViolation {
    code: 'zero/static-island-import' | 'zero/side-effect-import' | 'zero/live-tamagui-reference';
    span: SourceSpan;
    message: string;
}
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
    liveBindings: string[];
    violations: ZeroViolation[];
}
export declare function planZeroErasure(input: ZeroErasureInput): ZeroErasureResult;
//# sourceMappingURL=zero.d.ts.map