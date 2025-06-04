import type { ThemeDefinition } from '@tamagui/web';
export declare function replaceTheme({ name, theme, }: {
    name: string;
    theme: Partial<Record<keyof ThemeDefinition, any>>;
}): {
    themeRaw: import("@tamagui/web").ThemeParsed;
    theme: {};
    cssRules: string[];
} | undefined;
//# sourceMappingURL=replaceTheme.d.ts.map