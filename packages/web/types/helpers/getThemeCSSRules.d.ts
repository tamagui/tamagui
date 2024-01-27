import type { CreateTamaguiProps, ThemeParsed } from '../types';
export declare function getThemeCSSRules(props: {
    config: CreateTamaguiProps;
    themeName: string;
    theme: ThemeParsed;
    names: string[];
    hasDarkLight?: boolean;
    themesNamesToIndexes: Record<string, number>;
}): {
    themes: string[];
    selection: [] | [string, string];
};
//# sourceMappingURL=getThemeCSSRules.d.ts.map