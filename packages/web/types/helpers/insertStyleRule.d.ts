import type { RulesToInsert, StyleObject } from '../types.js';
export declare const insertedTransforms: {};
export declare const getAllSelectors: () => Record<string, string>;
export declare const getAllRules: () => string[];
export declare const getAllTransforms: () => {};
export declare function listenForSheetChanges(): void;
export declare function scanAllSheets(): void;
export declare function updateRules(identifier: string, rules: string[]): boolean;
export declare function insertStyleRules(rulesToInsert: RulesToInsert): void;
export declare function shouldInsertStyleRules(styleObject: StyleObject): boolean;
//# sourceMappingURL=insertStyleRule.d.ts.map