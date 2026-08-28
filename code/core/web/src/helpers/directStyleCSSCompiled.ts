import type { GetStyleState } from '../types'

export const canGenerateCSS = false
export const directStyleSignature = () => ''

// one style contribution in the neutral output frame (type-only here: the
// compiled artifact completes every entry inline)
export interface StyleFrameEntry {
  property: string
  value: any
  condition: number
  identity: string
  selector: string
  wrappers: string[] | undefined
  original: any
  forceCSS: boolean
  sequence: number
  normalize: boolean
}

export function completeFrameCSS(_state: GetStyleState) {}
export function requestBorderStyleDefault(
  _state: GetStyleState,
  _property: string,
  _condition: number,
  _identity: string,
  _selector: string,
  _wrapperSource: readonly string[] | undefined,
  _wrapperStart: number,
  _wrapperCount: number
) {}
export function flushDirectStyles(_state: GetStyleState, _clear = false) {}
export function addComposition(_state: GetStyleState, _property: 'translate' | 'scale') {}
export function clearFrameAtomic(_state: GetStyleState, _atomicKey: string) {}
