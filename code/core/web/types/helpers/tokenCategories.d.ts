export type StyleTokenCategory = 'size' | 'space' | 'radius' | 'zIndex' | 'fontSize';
export declare const tokenCategoryByProperty: Record<string, StyleTokenCategory>;
export type RuntimeTokenCategory = StyleTokenCategory | 'color' | 'font' | 'fontFamily';
export declare function getTokenCategoryForProperty(property: string): RuntimeTokenCategory | undefined;
//# sourceMappingURL=tokenCategories.d.ts.map