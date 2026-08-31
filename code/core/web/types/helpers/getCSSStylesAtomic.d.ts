/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */
import { type StyleObject } from '@tamagui/helpers';
import type { GetStyleState, ViewStyleObject } from '../types';
export { styleToCSS } from './styleToCSS';
export declare const canGenerateCSS: boolean;
type DirectAtomicState = GetStyleState & {
    flatAtomics?: Record<string, StyleObject>;
};
export type AtomicSlotEntry = [
    property: string,
    value: any,
    condition: number,
    identity: string,
    selector: string,
    wrappers: readonly string[] | undefined,
    original?: any,
    flags?: number
];
export type SlotIdentity = [
    identifier: string,
    rules: string[],
    value: any,
    styleObject?: unknown
];
export declare function registerAtomicSlot(state: DirectAtomicState, atomicKey: string, entries: readonly AtomicSlotEntry[]): void;
export declare function flushDirectStyles(state: GetStyleState, clear?: boolean): void;
export declare function addComposition(state: GetStyleState, property: 'translate' | 'scale'): void;
export declare function getCSSStylesAtomic(style: ViewStyleObject): StyleObject[];
export declare function getCSSStyleAtomic(key: string, val: any, condition?: string, wrappers?: readonly string[], identity?: string, direct?: boolean, identityKey?: string, classRepetitions?: number): StyleObject | undefined;
export declare function buildAtomicSlotCSS(atomicKey: string, entries: readonly AtomicSlotEntry[], signature: string): SlotIdentity | undefined;
//# sourceMappingURL=getCSSStylesAtomic.d.ts.map