/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */
import { type StyleObject } from '@tamagui/helpers';
import type { GetStyleState, ViewStyleObject } from '../types';
export { styleToCSS } from './styleToCSS';
export declare const canGenerateCSS: boolean;
export type AtomicSlotEntry = [
    property: string,
    value: any,
    condition: number,
    identity: string,
    selector: string,
    wrapperSource: readonly string[] | undefined,
    wrapperStart: number,
    wrapperCount: number,
    original?: any
];
export type SlotIdentity = [
    identifier: string,
    rules: string[],
    value: any,
    styleObject?: unknown
];
export declare function requestBorderStyleDefault(state: GetStyleState, property: string, condition: number, identity: string, selector: string, wrapperSource: readonly string[] | undefined, wrapperStart: number, wrapperCount: number): void;
export declare function streamAtomic(state: GetStyleState, property: string, value: any, condition: number, identity: string, selector: string, wrapperSource: readonly string[] | undefined, wrapperStart: number, wrapperCount: number, original?: any, slot?: string): void;
export declare function completeStreamingCSS(state: GetStyleState): void;
export declare function flushDirectStyles(state: GetStyleState, clear?: boolean): void;
export declare function addComposition(state: GetStyleState, property: 'translate' | 'scale'): void;
export declare function clearFrameAtomic(state: GetStyleState, atomicKey: string): void;
export declare function getCSSStylesAtomic(style: ViewStyleObject): StyleObject[];
export declare function getCSSStyleAtomic(key: string, val: any, condition?: string, wrappers?: readonly string[], identity?: string, direct?: boolean, identityKey?: string, classRepetitions?: number): StyleObject | undefined;
export declare function buildAtomicSlotCSS(atomicKey: string, entries: readonly AtomicSlotEntry[], signature: string): SlotIdentity | undefined;
//# sourceMappingURL=getCSSStylesAtomic.d.ts.map