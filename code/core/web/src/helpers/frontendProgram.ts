// The internal frontend-program contribution channel: another style frontend
// (the Tailwind package) hands getSplitStyles a pre-parsed (property, program)
// pair that contributes at the EXACT forward-pass position the equivalent
// authored string would — same displacement, same decision-21 merge, same
// clause order and registry spellings, verbatim.
//
// Internal BY CONSTRUCTION, not by documentation: values are only recognized
// through a module-private WeakSet, so the sole way to mint one is
// createFrontendProgram, which is exported only from the internal-runtime
// entry. A structurally identical object from user code is not a member and
// contributes nothing. (A symbol marker would be weaker: symbols can be
// recovered from a value via getOwnPropertySymbols and reused.)

import type { ParsedValue } from '@tamagui/style-grammar/runtime'

import type { FrontendProgramValue } from '../internalRuntimeTypes'
import type { GetStyleState } from '../types'
import { contributeFrontendValue, type MergeStyle } from './directStyle'

export type { FrontendProgramValue } from '../internalRuntimeTypes'

const minted = new WeakSet<FrontendProgramValue>()

export function createFrontendProgram(
  property: string,
  value: ParsedValue
): FrontendProgramValue {
  const program: FrontendProgramValue = { property, value }
  minted.add(program)
  return program
}

export function isFrontendProgram(value: unknown): value is FrontendProgramValue {
  return (
    typeof value === 'object' &&
    value !== null &&
    minted.has(value as FrontendProgramValue)
  )
}

/** consumed beside direct flat strings in the forward pass */
export function contributeFrontendProgram(
  styleState: GetStyleState,
  program: FrontendProgramValue,
  merge: MergeStyle
): boolean {
  return contributeFrontendValue(styleState, program.property, program.value, merge)
}
