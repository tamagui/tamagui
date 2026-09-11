type KebabCase<Name extends string> = Name extends `${infer First}${infer Rest}` ? First extends Lowercase<First> ? `${First}${KebabCase<Rest>}` : `-${Lowercase<First>}${KebabCase<Rest>}` : Name;
declare const v6RenamedThemeNames: readonly ["accentBackground", "accentColor", "colorHover", "colorPress", "colorFocus", "backgroundHover", "backgroundPress", "backgroundFocus", "borderColor", "borderColorHover", "borderColorFocus", "borderColorPress", "outlineColor", "placeholderColor", "colorTransparent", "shadowColor"];
export declare const v6ThemeNameReplacements: { readonly [Name in (typeof v6RenamedThemeNames)[number]] : KebabCase<Name> };
export declare const v6RemovedThemeNames: readonly ["backgroundActive"];
export {};

//# sourceMappingURL=v6ThemeNames.d.ts.map