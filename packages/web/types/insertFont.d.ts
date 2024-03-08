import type { DeepVariableObject } from './createVariables';
import type { GenericFont } from './types';
/**
 * Runtime dynamic insert font
 */
declare function insertFont<A extends GenericFont>(name: string, fontIn: A): DeepVariableObject<A>;
export declare const updateFont: typeof insertFont;
export declare function parseFont<A extends GenericFont>(definition: A): DeepVariableObject<A>;
export declare function registerFontVariables(parsedFont: any): string[];
export {};
//# sourceMappingURL=insertFont.d.ts.map