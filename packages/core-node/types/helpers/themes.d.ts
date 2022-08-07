import { CreateTamaguiProps, ThemeObject } from '../types';
export declare function ensureThemeVariable(theme: any, key: string): void;
export declare function proxyThemeToParents(themeName: string, theme: any, themes: CreateTamaguiProps['themes']): any;
export declare function getThemeCSSRules({ config, themeName, theme, names, }: {
    config: CreateTamaguiProps;
    themeName: string;
    theme: ThemeObject;
    names: string[];
}): string[];
//# sourceMappingURL=themes.d.ts.map