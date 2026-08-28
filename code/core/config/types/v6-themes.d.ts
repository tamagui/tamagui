import { v6RemovedThemeNames, v6ThemeNameReplacements } from '@tamagui/style-grammar/runtime';
export type V6Theme<Theme> = {
    [Name in keyof Theme as Name extends (typeof v6RemovedThemeNames)[number] ? never : Name extends keyof typeof v6ThemeNameReplacements ? (typeof v6ThemeNameReplacements)[Name] : Name]: Theme[Name];
};
export type V6Themes<Themes extends Record<string, object>> = {
    [Name in keyof Themes]: V6Theme<Themes[Name]>;
};
/** Apply the v6 theme-key grammar to any generated theme pack. */
export declare function toV6Themes<Themes extends Record<string, object>>(themes: Themes): V6Themes<Themes>;
//# sourceMappingURL=v6-themes.d.ts.map