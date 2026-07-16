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

export interface BailoutReason {
  code: BailoutCode
  kind: 'local' | 'linked'
  message: string
  span: SourceSpan
  dependencyId?: ResolvedModuleId
  component?: string
  specifier?: string
  prop?: string
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
