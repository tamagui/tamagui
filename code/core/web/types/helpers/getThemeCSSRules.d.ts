import type { CreateTamaguiProps, ThemeParsed, Variable } from '../types.js';
export declare function getSharedThemeCSSRule(colorTokens: Record<string, Variable>, keys: Iterable<string>): string | undefined;
export declare function getThemeCSSRules(props: {
    config: CreateTamaguiProps;
    themeName: string;
    theme: ThemeParsed;
    names: string[];
    hasDarkLight?: boolean;
    useMutatedVariables?: boolean;
    sharedKeys?: Set<string>;
}): string[];
//# sourceMappingURL=getThemeCSSRules.d.ts.map