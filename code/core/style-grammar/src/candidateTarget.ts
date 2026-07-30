export interface CandidateContribution {
  property: string
}

export interface CandidatePropertyMismatch {
  code: 'candidate-property-mismatch'
  candidate: string
  property: string
  contributedProperties: readonly string[]
  message: string
}

export type CandidateTargetResult<Contribution extends CandidateContribution> =
  | {
      ok: true
      contribution: Contribution
    }
  | {
      ok: false
      diagnostic: CandidatePropertyMismatch
    }

/**
 * selects the contribution addressed by an overloaded family prop.
 *
 * candidate resolution happens before this function, so both the compiler and
 * runtime pass the same family contributions here. A candidate is valid only
 * when it contributes to the authored property itself. This keeps shared
 * families such as `text-*` from accepting a color candidate for `fontSize`,
 * or a font-size candidate for `color`.
 */
export function resolveCandidateTarget<Contribution extends CandidateContribution>(
  property: string,
  candidate: string,
  contributions: readonly Contribution[]
): CandidateTargetResult<Contribution> {
  for (const contribution of contributions) {
    if (contribution.property === property) {
      return { ok: true, contribution }
    }
  }

  const contributedProperties: string[] = []
  for (const contribution of contributions) {
    if (!contributedProperties.includes(contribution.property)) {
      contributedProperties.push(contribution.property)
    }
  }

  return {
    ok: false,
    diagnostic: {
      code: 'candidate-property-mismatch',
      candidate,
      property,
      contributedProperties,
      message:
        contributedProperties.length === 0
          ? `"${candidate}" does not contribute to "${property}"`
          : `"${candidate}" contributes to ${contributedProperties.map((name) => `"${name}"`).join(', ')}, not "${property}"`,
    },
  }
}
