export type StyleTokenCategory = 'size' | 'space' | 'radius' | 'zIndex' | 'fontSize';
export type RuntimeTokenCategory = StyleTokenCategory | 'color' | 'font' | 'fontFamily';
export declare const tokenCategoryByProperty: Readonly<Record<string, StyleTokenCategory>>;
export declare function getTokenCategoryForProperty(property: string): RuntimeTokenCategory | undefined;
//# sourceMappingURL=tokenCategories.d.ts.map