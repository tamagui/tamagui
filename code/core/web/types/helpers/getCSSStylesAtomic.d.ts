/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */
import type { StyleObject } from '@tamagui/helpers';
import type { ViewStyleObject } from '../types';
export { styleToCSS } from './styleToCSS';
export declare function getCSSStylesAtomic(style: ViewStyleObject): StyleObject[];
export declare function getCSSStyleAtomic(key: string, val: any, condition?: string, wrappers?: readonly string[], identity?: string, direct?: boolean, identityKey?: string, classRepetitions?: number): StyleObject | undefined;
export type SlotIdentity = {
    identifier: string;
    rules: string[];
    value: any;
    /** finished wrapper, cached so a repeat build allocates nothing */
    styleObject?: unknown;
};
export interface AtomicSlotEntry {
    property: string;
    value: any;
    condition: number;
    identity: string;
    selector: string;
    wrappers: readonly string[] | undefined;
    /** authored value, carried only on deferred platform-pseudo passes so an
     * inline conversion preserves provenance */
    original?: any;
}
export declare function probeRawSlotIdentity(property: string, raw: unknown): SlotIdentity | undefined;
export declare function storeRawSlotIdentity(property: string, raw: unknown, identity: SlotIdentity): void;
export declare function buildAtomicSlotCSS(atomicKey: string, entries: readonly AtomicSlotEntry[], signature: string): SlotIdentity | undefined;
//# sourceMappingURL=getCSSStylesAtomic.d.ts.map