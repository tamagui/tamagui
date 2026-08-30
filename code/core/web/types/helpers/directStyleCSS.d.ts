import type { GetStyleState } from '../types';
export declare const canGenerateCSS: boolean;
/**
 * A border width was authored, so its edge needs `borderStyle: solid` unless
 * an authored border style owns the property by completion time. Requests key
 * off the authored (pre-expansion) property, matching the emitted class.
 */
export declare function requestBorderStyleDefault(state: GetStyleState, property: string, condition: number, identity: string, selector: string, wrapperSource: readonly string[] | undefined, wrapperStart: number, wrapperCount: number): void;
/** collect one contribution into its per-property program */
export declare function streamAtomic(state: GetStyleState, property: string, value: any, condition: number, identity: string, selector: string, wrapperSource: readonly string[] | undefined, wrapperStart: number, wrapperCount: number, original?: any, slot?: string): void;
/**
 * The CSS residue that genuinely cannot stream: border-style defaults resolve
 * against what the pass authored, property programs combine in precedence
 * order, transition longhands group into one record, and the
 * transform accumulator becomes the transform slot's base.
 */
export declare function completeStreamingCSS(state: GetStyleState): void;
export declare function flushDirectStyles(state: GetStyleState, clear?: boolean): void;
export declare function addComposition(state: GetStyleState, property: 'translate' | 'scale'): void;
export declare function clearFrameAtomic(state: GetStyleState, atomicKey: string): void;
//# sourceMappingURL=directStyleCSS.d.ts.map