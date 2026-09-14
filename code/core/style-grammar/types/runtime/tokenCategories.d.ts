export declare const tokenCategoryNames: readonly ["", "space", "size", "radius", "zIndex", "color", "fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing"];
export type TokenCategoryName = Exclude<(typeof tokenCategoryNames)[number], "">;
export type TokenCategoryCode = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export declare const tokenCategorySpace = 1;
export declare const tokenCategorySize = 2;
export declare const tokenCategoryRadius = 3;
export declare const tokenCategoryZIndex = 4;
export declare const tokenCategoryColor = 5;
export declare const tokenCategoryFontFamily = 6;
export declare const tokenCategoryFontSize = 7;
export declare const tokenCategoryFontWeight = 8;
export declare const tokenCategoryLineHeight = 9;
export declare const tokenCategoryLetterSpacing = 10;
export declare const propToTokenCategoryCode: Readonly<Record<string, number>>;
export declare function getTokenCategoryName(code: number): TokenCategoryName | undefined;

//# sourceMappingURL=tokenCategories.d.ts.map