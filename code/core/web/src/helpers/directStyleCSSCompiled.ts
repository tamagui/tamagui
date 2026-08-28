import type { GetStyleState } from '../types'

export const canGenerateCSS = false
export const directStyleSignature = () => ''
export function directAtomic() {}
export function emitBorderStyleDefault() {}
export function flushDirectStyles(_state: GetStyleState, _clear = false) {}
export function addComposition(_state: GetStyleState, _property: 'translate' | 'scale') {}
export function clearDirectAtomic(_state: GetStyleState, _atomicKey: string) {}
