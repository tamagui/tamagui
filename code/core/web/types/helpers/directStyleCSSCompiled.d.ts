import type { GetStyleState } from '../types';
export declare const canGenerateCSS = false;
export declare const directStyleSignature: () => string;
export declare function directAtomic(): void;
export declare function emitBorderStyleDefault(): void;
export declare function flushDirectStyles(_state: GetStyleState, _clear?: boolean): void;
export declare function addComposition(_state: GetStyleState, _property: 'translate' | 'scale'): void;
export declare function clearDirectAtomic(_state: GetStyleState, _atomicKey: string): void;
//# sourceMappingURL=directStyleCSSCompiled.d.ts.map