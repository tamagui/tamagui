import type { ResolvedModuleId, SourceSpan } from './contracts';
export type BailoutCode = 'local/invalid-element-call' | 'local/unsupported-element-name' | 'local/unsupported-prop-key' | 'local/unsupported-child' | 'local/unsupported-expression' | 'local/unsupported-styled-definition' | 'local/dynamic-style-value' | 'local/unsafe-style-spread' | 'local/unsupported-target' | 'local/style-resolution-failed' | 'local/overlapping-edit' | 'local/non-object-spread' | 'local/static-evaluation-cycle' | 'local/parse-error' | 'linked/unresolved-component-binding' | 'linked/unresolved-binding' | 'linked/missing-initializer' | 'linked/unresolved-import' | 'linked/unresolved-component-config';
/**
 * The zero-runtime rule a diagnostic belongs to. Set by whichever site knows the
 * reason; `zeroRuleForBailout` supplies the default for the rest.
 */
export type ZeroRule = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export interface BailoutReason {
    code: BailoutCode;
    kind: 'local' | 'linked';
    message: string;
    span: SourceSpan;
    dependencyId?: ResolvedModuleId;
    component?: string;
    specifier?: string;
    prop?: string;
    /**
     * True when this diagnostic stopped its candidate from lowering. Zero mode
     * reports exactly these: a diagnostic recorded alongside a successful
     * lowering describes a dropped prop, not a retained runtime.
     */
    blocking?: boolean;
    /** Set where the reporting site knows better than the code-level default. */
    zeroRule?: ZeroRule;
    /** The design's fixed text for sites that have one, used verbatim. */
    zeroMessage?: string;
}
export declare function zeroRuleForBailout(reason: BailoutReason): ZeroRule;
export declare function localBailout(code: Extract<BailoutCode, `local/${string}`>, span: SourceSpan, message: string): BailoutReason;
export declare function linkedBailout(code: Extract<BailoutCode, `linked/${string}`>, span: SourceSpan, message: string, dependencyId?: ResolvedModuleId): BailoutReason;
//# sourceMappingURL=diagnostics.d.ts.map