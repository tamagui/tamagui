import type { GetStyleState, ViewStyleObject } from '../types'

export const canGenerateCSS = false

export function streamAtomic(
  _state: GetStyleState,
  _property: string,
  _value: any,
  _condition: number,
  _identity: string,
  _selector: string,
  _wrapperSource: readonly string[] | undefined,
  _wrapperStart: number,
  _wrapperCount: number,
  _original?: any,
  _slot?: string
) {}

export function completeStreamingCSS(_state: GetStyleState) {}

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

export function buildAtomicSlotCSS() {
  return undefined
}

export function getCSSStylesAtomic(_style: ViewStyleObject) {
  return []
}

export function getCSSStyleAtomic() {
  return undefined
}
