import type { GetStyleState } from '../types';
export declare const canGenerateCSS = false;
export declare const directStyleSignature: () => string;
export interface StyleFrameEntry {
    property: string;
    value: any;
    condition: number;
    identity: string;
    selector: string;
    wrappers: string[] | undefined;
    original: any;
    forceCSS: boolean;
    sequence: number;
    normalize: boolean;
}
export declare function completeFrameCSS(_state: GetStyleState): void;
export declare function requestBorderStyleDefault(_state: GetStyleState, _property: string, _condition: number, _identity: string, _selector: string, _wrapperSource: readonly string[] | undefined, _wrapperStart: number, _wrapperCount: number): void;
export declare function flushDirectStyles(_state: GetStyleState, _clear?: boolean): void;
export declare function addComposition(_state: GetStyleState, _property: 'translate' | 'scale'): void;
export declare function clearFrameAtomic(_state: GetStyleState, _atomicKey: string): void;
//# sourceMappingURL=directStyleCSSCompiled.d.ts.map