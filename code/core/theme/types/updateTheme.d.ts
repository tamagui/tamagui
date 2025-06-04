import type { ThemeDefinition, ThemeName } from '@tamagui/web';
export declare function updateTheme({ name, theme, }: {
    name: ThemeName | (string & {});
    theme: Partial<Record<keyof ThemeDefinition, any>>;
}): {
    themeRaw: import("@tamagui/web").ThemeParsed;
    theme: {};
    cssRules: string[];
} | undefined;
//# sourceMappingURL=updateTheme.d.ts.map