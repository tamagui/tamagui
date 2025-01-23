import type { ThemeDefinition, ThemeParsed } from '@tamagui/web';
type MutateThemeOptions = {
    mutationType: 'replace' | 'update' | 'add';
    insertCSS?: boolean;
    avoidUpdate?: boolean;
};
type PartialTheme = Partial<Record<keyof ThemeDefinition, any>>;
export type MutateOneThemeProps = {
    name: string;
    theme: PartialTheme;
};
type Batch = boolean | string;
export declare function mutateThemes({ themes, batch, insertCSS, ...props }: Omit<MutateThemeOptions, 'mutationType'> & {
    themes: MutateOneThemeProps[];
    batch?: Batch;
}): {
    themes: Record<string, ThemeParsed>;
    themesRaw: Record<string, ThemeParsed>;
    cssRules: string[];
};
export declare function _mutateTheme(props: MutateThemeOptions & MutateOneThemeProps): {
    themeRaw: ThemeParsed;
    theme: {};
    cssRules: string[];
} | undefined;
export {};
//# sourceMappingURL=_mutateTheme.d.ts.map