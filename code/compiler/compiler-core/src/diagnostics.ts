import type { ResolvedModuleId, SourceSpan } from './contracts'

export type BailoutCode =
  | 'local/invalid-element-call'
  | 'local/unsupported-element-name'
  | 'local/unsupported-prop-key'
  | 'local/unsupported-child'
  | 'local/unsupported-expression'
  | 'local/unsupported-styled-definition'
  | 'local/dynamic-style-value'
  | 'local/unsafe-style-spread'
  | 'local/unsupported-target'
  | 'local/style-resolution-failed'
  | 'local/overlapping-edit'
  | 'local/non-object-spread'
  | 'local/static-evaluation-cycle'
  | 'local/parse-error'
  | 'linked/unresolved-component-binding'
  | 'linked/unresolved-binding'
  | 'linked/missing-initializer'
  | 'linked/unresolved-import'
  | 'linked/unresolved-component-config'

/**
 * The zero-runtime rule a diagnostic belongs to. Set by whichever site knows the
 * reason; `zeroRuleForBailout` supplies the default for the rest.
 */
export type ZeroRule = 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface BailoutReason {
  code: BailoutCode
  kind: 'local' | 'linked'
  message: string
  span: SourceSpan
  dependencyId?: ResolvedModuleId
  component?: string
  specifier?: string
  prop?: string
  /**
   * True when this diagnostic stopped its candidate from lowering. Zero mode
   * reports exactly these: a diagnostic recorded alongside a successful
   * lowering describes a dropped prop, not a retained runtime.
   */
  blocking?: boolean
  /** Set where the reporting site knows better than the code-level default. */
  zeroRule?: ZeroRule
  /** The design's fixed text for sites that have one, used verbatim. */
  zeroMessage?: string
}

/**
 * The rule a bailout code belongs to when its site did not name one. Ordinary
 * compiler mode ignores this entirely.
 */
const ZERO_RULE_BY_CODE: Record<BailoutCode, ZeroRule> = {
  'local/invalid-element-call': 2,
  'local/unsupported-element-name': 2,
  'local/unsupported-prop-key': 3,
  'local/unsupported-child': 3,
  'local/unsupported-expression': 3,
  'local/unsupported-styled-definition': 3,
  'local/dynamic-style-value': 3,
  'local/unsafe-style-spread': 1,
  'local/unsupported-target': 6,
  'local/style-resolution-failed': 3,
  'local/overlapping-edit': 6,
  'local/non-object-spread': 1,
  'local/static-evaluation-cycle': 3,
  'local/parse-error': 3,
  'linked/unresolved-component-binding': 2,
  'linked/unresolved-binding': 2,
  'linked/missing-initializer': 3,
  'linked/unresolved-import': 2,
  'linked/unresolved-component-config': 2,
}

export function zeroRuleForBailout(reason: BailoutReason): ZeroRule {
  return reason.zeroRule ?? ZERO_RULE_BY_CODE[reason.code]
}

export function localBailout(
  code: Extract<BailoutCode, `local/${string}`>,
  span: SourceSpan,
  message: string
): BailoutReason {
  return { code, kind: 'local', message, span }
}

export function linkedBailout(
  code: Extract<BailoutCode, `linked/${string}`>,
  span: SourceSpan,
  message: string,
  dependencyId?: ResolvedModuleId
): BailoutReason {
  return { code, kind: 'linked', message, span, dependencyId }
}
