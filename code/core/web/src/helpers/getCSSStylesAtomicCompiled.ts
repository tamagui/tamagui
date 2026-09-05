import type { GetStyleState, ViewStyleObject } from '../types'

export const canGenerateCSS = false

export function flushDirectStyles(_state: GetStyleState, _clear = false) {}

export function addComposition(_state: GetStyleState, _property: 'translate' | 'scale') {}

export function registerAtomicSlot() {}

export function buildAtomicSlotCSS() {
  return undefined
}

export function getCSSStylesAtomic(_style: ViewStyleObject) {
  return []
}

export function getCSSStyleAtomic() {
  return undefined
}
