import type { GetStyleState } from '../types';
export declare const canGenerateCSS: boolean;
export interface StyleFrameEntry {
    property: string;
    value: any;
    condition: number;
    identity: string;
    selector: string;
    wrappers: string[] | undefined;
    original: any;
    /** written while the pass could not emit classes but this property must
     * still become CSS (animated non-animatable style promotion) */
    forceCSS: boolean;
    /** last-write order, breaks equal-precedence ties on the inline path */
    sequence: number;
    /** run value normalization when the inline completion merges this entry */
    normalize: boolean;
}
/**
 * A border width was authored, so its edge needs `borderStyle: solid` unless
 * an authored border style owns the property by completion time. Requests key
 * off the authored (pre-expansion) property, matching the emitted class.
 */
export declare function requestBorderStyleDefault(state: GetStyleState, property: string, condition: number, identity: string, selector: string, wrapperSource: readonly string[] | undefined, wrapperStart: number, wrapperCount: number): void;
export declare function directStyleSignature(property: string, value: unknown, conditionKey?: string): string;
/**
 * Stream one CSS contribution. A property's first contribution serializes its
 * class immediately (the overwhelmingly common case pays one cached build and
 * no entry). A second contribution promotes the property to a combined slot,
 * finished at completion by precedence order - the deferred arrangement the
 * equal-specificity cascade tie-break requires (clauseOrderIndependence).
 */
export declare function streamAtomic(state: GetStyleState, property: string, value: any, condition: number, identity: string, selector: string, wrapperSource: readonly string[] | undefined, wrapperStart: number, wrapperCount: number, weak: boolean): void;
/**
 * The CSS residue that genuinely cannot stream: border-style defaults resolve
 * against what the pass authored, promoted multi-contribution slots combine
 * in precedence order, transition longhands group into one record, and the
 * transform accumulator becomes the transform slot's base.
 */
export declare function completeStreamingCSS(state: GetStyleState): void;
export declare function flushDirectStyles(state: GetStyleState, clear?: boolean): void;
export declare function addComposition(state: GetStyleState, property: 'translate' | 'scale'): void;
export declare function clearFrameAtomic(state: GetStyleState, atomicKey: string): void;
//# sourceMappingURL=directStyleCSS.d.ts.map