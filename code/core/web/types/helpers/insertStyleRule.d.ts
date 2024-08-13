import type { DedupedThemes, RulesToInsert, TokensParsed } from '../types';
export declare const insertedTransforms: {};
export declare const getAllSelectors: () => Record<string, string>;
export declare const getAllRules: () => string[];
export declare const getAllTransforms: () => {};
export declare function listenForSheetChanges(): void;
export declare function scanAllSheets(collectThemes?: boolean, tokens?: TokensParsed): DedupedThemes | undefined;
export declare function updateRules(identifier: string, rules: string[]): boolean | undefined;
export declare function setNonce(_: string): void;
export declare function insertStyleRules(rulesToInsert: RulesToInsert): void;
export declare function shouldInsertStyleRules(identifier: string): boolean;
//# sourceMappingURL=insertStyleRule.d.ts.map