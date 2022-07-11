import { StyleObject } from '@tamagui/helpers';
export declare const insertedTransforms: {};
export declare const getAllSelectors: () => {};
export declare const getInsertedRules: () => unknown[];
export declare const getAllTransforms: () => {};
export declare function updateInserted(): void;
export declare function updateInsertedCache(identifier: string, rules: string[]): boolean;
export declare type PartialStyleObject = Pick<StyleObject, 'identifier' | 'property' | 'rules'>;
export declare type RulesToInsert = PartialStyleObject[];
export declare function insertStyleRules(rulesToInsert: RulesToInsert): void;
//# sourceMappingURL=insertStyleRule.d.ts.map