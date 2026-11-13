import type { DeepVariableObject } from './createVariables.js';
import type { GenericFont } from './types.js';
/**
 * Runtime dynamic insert font
 */
export declare function insertFont<A extends GenericFont>(name: string, fontIn: A): DeepVariableObject<A>;
export declare const updateFont: typeof insertFont;
export declare function parseFont<A extends GenericFont>(definition: A): DeepVariableObject<A>;
export declare function registerFontVariables(parsedFont: any): string[];
//# sourceMappingURL=insertFont.d.ts.map