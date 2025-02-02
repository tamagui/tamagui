import type { ThemeDefinition, ThemeParsed } from '@tamagui/web';
export declare function addTheme(props: {
    name: string;
    theme: Partial<Record<keyof ThemeDefinition, any>>;
    insertCSS?: boolean;
}): {
    themeRaw: ThemeParsed;
    theme: {};
    cssRules: string[];
} | undefined;
//# sourceMappingURL=addTheme.d.ts.map