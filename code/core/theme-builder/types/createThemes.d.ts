import type { Template } from '@tamagui/create-theme';
import { defaultTemplates } from './defaultTemplates';
import { type ThemeBuilder } from './ThemeBuilder';
import type { BuildPalettes, BuildTemplates } from './types';
/**
 * GrandChildren theme nesting logic implementation:
 *  - IF palette is set: treat as palette theme (don't nest into accent family)
 *  - IF only template: nest into color children, but avoid base themes (light, dark)
 *    to prevent conflicts with top-level accent theme
 */
type ExtraThemeValues = Record<string, string>;
type ExtraThemeValuesByScheme<Values extends ExtraThemeValues = ExtraThemeValues> = {
    dark: Values;
    light: Values;
};
type SimpleThemeDefinition = {
    palette?: Palette;
    template?: string;
};
type BaseThemeDefinition<Extra extends ExtraThemeValuesByScheme> = {
    palette: Palette;
    template?: string;
    extra?: Extra;
};
export type SimpleThemesDefinition = Record<string, SimpleThemeDefinition>;
type SimplePaletteDefinitions = Record<string, string[]>;
type SinglePalette = string[];
type SchemePalette = {
    light: SinglePalette;
    dark: SinglePalette;
};
type Palette = SinglePalette | SchemePalette;
/** Props for getTheme callback */
export type GetThemeProps = {
    name: string;
    theme: Record<string, string>;
    scheme?: 'light' | 'dark';
    parentName: string;
    parentNames: string[];
    level: number;
    palette?: string[];
    template?: Template;
};
export type CreateThemesProps<Accent extends BaseThemeDefinition<Extra> | undefined = undefined, GrandChildrenThemes extends SimpleThemesDefinition | undefined = undefined, Extra extends ExtraThemeValuesByScheme = ExtraThemeValuesByScheme, ChildrenThemes extends SimpleThemesDefinition = SimpleThemesDefinition, ComponentThemes extends SimpleThemesDefinition = SimpleThemesDefinition, Templates extends BuildTemplates = typeof defaultTemplates, GetThemeReturn extends Record<string, string | number> = Record<string, string>> = {
    base: BaseThemeDefinition<Extra>;
    accent?: Accent;
    childrenThemes?: ChildrenThemes;
    grandChildrenThemes?: GrandChildrenThemes;
    templates?: Templates;
    componentThemes?: ComponentThemes;
    getTheme?: (props: GetThemeProps) => GetThemeReturn;
};
export declare function createThemes<Extra extends ExtraThemeValuesByScheme, SubThemes extends SimpleThemesDefinition, ComponentThemes extends SimpleThemesDefinition, GrandChildrenThemes extends SimpleThemesDefinition | undefined, Accent extends BaseThemeDefinition<Extra> | undefined, Templates extends BuildTemplates, GetThemeReturn extends Record<string, string | number>>(props: CreateThemesProps<Accent, GrandChildrenThemes, Extra, SubThemes, ComponentThemes, Templates, GetThemeReturn> & {
    getTheme: (props: GetThemeProps) => GetThemeReturn;
}): ReturnType<typeof createSimpleThemeBuilder<Extra, typeof defaultTemplates, SimplePaletteDefinitions, {
    [K in keyof SubThemes]: {
        template: string;
        palette?: string;
    };
}, GrandChildrenThemes extends undefined ? undefined : Record<keyof GrandChildrenThemes, any>, Accent extends undefined ? false : true, ComponentThemes, GetThemeReturn>>['themes'];
export declare function createThemes<Extra extends ExtraThemeValuesByScheme = ExtraThemeValuesByScheme, SubThemes extends SimpleThemesDefinition = SimpleThemesDefinition, ComponentThemes extends SimpleThemesDefinition = SimpleThemesDefinition, GrandChildrenThemes extends SimpleThemesDefinition | undefined = undefined, Accent extends BaseThemeDefinition<Extra> | undefined = undefined, Templates extends BuildTemplates = typeof defaultTemplates>(props: CreateThemesProps<Accent, GrandChildrenThemes, Extra, SubThemes, ComponentThemes, Templates> & {
    getTheme?: undefined;
}): ReturnType<typeof createSimpleThemeBuilder<Extra, typeof defaultTemplates, SimplePaletteDefinitions, {
    [K in keyof SubThemes]: {
        template: string;
        palette?: string;
    };
}, GrandChildrenThemes extends undefined ? undefined : Record<keyof GrandChildrenThemes, any>, Accent extends undefined ? false : true, ComponentThemes, Record<string, string>>>['themes'];
export declare const getLastBuilder: () => ThemeBuilder<import("./ThemeBuilder").ThemeBuilderInternalState, Record<string, string>> | null;
type NamesWithChildrenNames<ParentNames extends string, ChildNames> = ParentNames | (ChildNames extends string ? `${ParentNames}_${ChildNames}` : never);
export declare function createSimpleThemeBuilder<Extra extends ExtraThemeValuesByScheme, Templates extends BuildTemplates, Palettes extends SimplePaletteDefinitions, ChildrenThemes extends Record<string, {
    template: string;
    palette?: string;
}>, GrandChildrenThemes extends undefined | Record<string, {
    template: string;
    palette?: string;
}>, HasAccent extends boolean = false, ComponentThemes extends SimpleThemesDefinition | false = false, GetThemeReturn extends Record<string, string | number> = Record<string, string>, FullTheme extends Record<string, string | number> = {
    [ThemeKey in keyof Templates['light_base'] | keyof Extra['dark'] | (HasAccent extends true ? `accent${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}` : never)]: string;
}, ThemeNames extends string = 'light' | 'dark' | (HasAccent extends true ? 'light_accent' | 'dark_accent' : never) | (keyof ChildrenThemes extends string ? `${'light' | 'dark'}_${GrandChildrenThemes extends undefined ? keyof ChildrenThemes : NamesWithChildrenNames<keyof ChildrenThemes, keyof GrandChildrenThemes>}` : never)>(props: {
    palettes?: Palettes;
    accentTheme?: HasAccent;
    templates?: Templates;
    childrenThemes?: ChildrenThemes;
    grandChildrenThemes?: GrandChildrenThemes;
    componentThemes?: ComponentThemes;
    extra?: Extra;
    accentExtra?: Extra;
    getTheme?: (props: GetThemeProps) => GetThemeReturn;
}): {
    themeBuilder: ThemeBuilder<any>;
    themes: Record<ThemeNames, FullTheme & GetThemeReturn>;
};
export declare const getComponentThemes: (components: SimpleThemesDefinition) => {
    [k: string]: {
        parent: string;
        template: string;
    };
};
export declare function createPalettes(palettes: BuildPalettes): SimplePaletteDefinitions;
export {};
//# sourceMappingURL=createThemes.d.ts.map