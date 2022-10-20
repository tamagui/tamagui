import type { StyleObject } from '@tamagui/helpers';
export declare const insertedTransforms: {};
export declare const getAllSelectors: () => Record<string, string>;
export declare const getAllRules: () => (boolean | string[])[];
export declare const getAllTransforms: () => {};
export declare function updateInserted(): void;
export declare function updateRules(identifier: string, rules: string[]): boolean;
export declare type PartialStyleObject = Pick<StyleObject, 'identifier' | 'property' | 'rules'>;
export declare type RulesToInsert = PartialStyleObject[];
export declare function insertStyleRules(rulesToInsert: RulesToInsert): void;
export declare function shouldInsertStyleRules(styleObject: PartialStyleObject): boolean;
//# sourceMappingURL=insertStyleRule.d.ts.map