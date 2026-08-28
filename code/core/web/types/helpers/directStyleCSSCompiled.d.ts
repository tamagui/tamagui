import type { GetStyleState } from '../types';
export declare const canGenerateCSS = false;
export declare const directStyleSignature: () => string;
export declare function streamAtomic(_state: GetStyleState, _property: string, _value: any, _condition: number, _identity: string, _selector: string, _wrapperSource: readonly string[] | undefined, _wrapperStart: number, _wrapperCount: number, _weak: boolean, _original?: any): void;
export declare function completeStreamingCSS(_state: GetStyleState): void;
export declare function requestBorderStyleDefault(_state: GetStyleState, _property: string, _condition: number, _identity: string, _selector: string, _wrapperSource: readonly string[] | undefined, _wrapperStart: number, _wrapperCount: number): void;
export declare function flushDirectStyles(_state: GetStyleState, _clear?: boolean): void;
export declare function addComposition(_state: GetStyleState, _property: 'translate' | 'scale'): void;
export declare function clearFrameAtomic(_state: GetStyleState, _atomicKey: string): void;
//# sourceMappingURL=directStyleCSSCompiled.d.ts.map