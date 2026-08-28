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
export declare function requestBorderStyleDefault(state: GetStyleState, property: string, cursor: {
    condition: number;
    key: string;
    selector: string;
    wrappers: string[];
} | null): void;
export declare function directStyleSignature(property: string, value: unknown, conditionKey?: string): string;
/**
 * Serialize the frame's CSS-destined slots: every slot when the pass emits
 * classes, only force-CSS entries otherwise. Consumed entries leave the frame;
 * whatever remains is the inline completion's input. Transition longhands
 * group into one record, and border widths synthesize a border-style default
 * unless an authored contribution owns the property.
 */
export declare function completeFrameCSS(state: GetStyleState): void;
export declare function flushDirectStyles(state: GetStyleState, clear?: boolean): void;
export declare function addComposition(state: GetStyleState, property: 'translate' | 'scale'): void;
export declare function clearFrameAtomic(state: GetStyleState, atomicKey: string): void;
//# sourceMappingURL=directStyleCSS.d.ts.map