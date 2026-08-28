import type { GetStyleState } from '../types';
export declare const canGenerateCSS: boolean;
export declare function directStyleSignature(property: string, value: unknown, conditionKey?: string): string;
export declare function directAtomic(state: GetStyleState, property: string, value: any, condition: number, conditionKey: string, conditionWrappers: string[] | undefined, conditionSelector: string, isDefault?: boolean): void;
export declare function emitBorderStyleDefault(state: GetStyleState, property: string, condition: number, conditionKey: string, conditionWrappers: string[] | undefined, conditionSelector: string): void;
export declare function flushDirectStyles(state: GetStyleState, clear?: boolean): void;
export declare function addComposition(state: GetStyleState, property: 'translate' | 'scale'): void;
export declare function clearDirectAtomic(state: GetStyleState, atomicKey: string): void;
//# sourceMappingURL=directStyleCSS.d.ts.map