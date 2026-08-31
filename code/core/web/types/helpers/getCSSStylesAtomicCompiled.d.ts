import type { GetStyleState, ViewStyleObject } from "../types";
export declare const canGenerateCSS = false;
export declare function streamAtomic(_state: GetStyleState, _property: string, _value: any, _condition: number, _identity: string, _selector: string, _wrapperSource: readonly string[] | undefined, _wrapperStart: number, _wrapperCount: number, _original?: any, _slot?: string): void;
export declare function completeStreamingCSS(_state: GetStyleState): void;
export declare function requestBorderStyleDefault(_state: GetStyleState, _property: string, _condition: number, _identity: string, _selector: string, _wrapperSource: readonly string[] | undefined, _wrapperStart: number, _wrapperCount: number): void;
export declare function flushDirectStyles(_state: GetStyleState, _clear?: boolean): void;
export declare function addComposition(_state: GetStyleState, _property: "translate" | "scale"): void;
export declare function clearFrameAtomic(_state: GetStyleState, _atomicKey: string): void;
export declare function buildAtomicSlotCSS(): undefined;
export declare function getCSSStylesAtomic(_style: ViewStyleObject): never[];
export declare function getCSSStyleAtomic(): undefined;
//# sourceMappingURL=getCSSStylesAtomicCompiled.d.ts.map