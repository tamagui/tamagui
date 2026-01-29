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
export type CreateThemesProps<Accent extends BaseThemeDefinition<Extra> | undefined = undefined, GrandChildrenThemes extends SimpleThemesDefinition | undefined = undefined, Extra extends ExtraThemeValuesByScheme = ExtraThemeValuesByScheme, ChildrenThemes extends SimpleThemesDefinition = SimpleThemesDefinition, ComponentThemes extends SimpleThemesDefinition | false = SimpleThemesDefinition, Templates extends BuildTemplates = typeof defaultTemplates, GetThemeReturn extends Record<string, string | number> = Record<string, string>> = {
    base: BaseThemeDefinition<Extra>;
    accent?: Accent;
    childrenThemes?: ChildrenThemes;
    grandChildrenThemes?: GrandChildrenThemes;
    templates?: Templates;
    /**
     * @deprecated component themes are no longer recommended - configure component styles directly via themes or component defaultProps instead
     */
    componentThemes?: ComponentThemes;
    getTheme?: (props: GetThemeProps) => GetThemeReturn;
};
export declare function createThemes<Extra extends ExtraThemeValuesByScheme, SubThemes extends SimpleThemesDefinition, ComponentThemes extends SimpleThemesDefinition | false, GrandChildrenThemes extends SimpleThemesDefinition | undefined, Accent extends BaseThemeDefinition<Extra> | undefined, Templates extends BuildTemplates, GetThemeReturn extends Record<string, string | number>>(props: CreateThemesProps<Accent, GrandChildrenThemes, Extra, SubThemes, ComponentThemes, Templates, GetThemeReturn> & {
    getTheme: (props: GetThemeProps) => GetThemeReturn;
}): ReturnType<typeof createSimpleThemeBuilder<Extra, typeof defaultTemplates, SimplePaletteDefinitions, {
    [K in keyof SubThemes]: {
        template: string;
        palette?: string;
    };
}, GrandChildrenThemes extends undefined ? undefined : Record<keyof GrandChildrenThemes, any>, Accent extends undefined ? false : true, ComponentThemes, GetThemeReturn>>['themes'];
export declare function createThemes<Extra extends ExtraThemeValuesByScheme = ExtraThemeValuesByScheme, SubThemes extends SimpleThemesDefinition = SimpleThemesDefinition, ComponentThemes extends SimpleThemesDefinition | false = SimpleThemesDefinition, GrandChildrenThemes extends SimpleThemesDefinition | undefined = undefined, Accent extends BaseThemeDefinition<Extra> | undefined = undefined, Templates extends BuildTemplates = typeof defaultTemplates>(props: CreateThemesProps<Accent, GrandChildrenThemes, Extra, SubThemes, ComponentThemes, Templates> & {
    getTheme?: undefined;
}): ReturnType<typeof createSimpleThemeBuilder<Extra, typeof defaultTemplates, SimplePaletteDefinitions, {
    [K in keyof SubThemes]: {
        template: string;
        palette?: string;
    };
}, GrandChildrenThemes extends undefined ? undefined : Record<keyof GrandChildrenThemes, any>, Accent extends undefined ? false : true, ComponentThemes, Record<string, string>>>['themes'];
export declare const getLastBuilder: () => ThemeBuilder<import("./ThemeBuilder").ThemeBuilderInternalState, Record<string, string>> | null;
/**
 * V4 version of createThemes - uses v4 theme ordering for backwards compatibility.
 * Use this for v4 themes (like v4-tamagui.ts).
 */
export declare function createV4Themes<Extra extends ExtraThemeValuesByScheme = ExtraThemeValuesByScheme, SubThemes extends SimpleThemesDefinition = SimpleThemesDefinition, ComponentThemes extends SimpleThemesDefinition | false = SimpleThemesDefinition, GrandChildrenThemes extends SimpleThemesDefinition | undefined = undefined, Accent extends BaseThemeDefinition<Extra> | undefined = undefined, Templates extends BuildTemplates = typeof defaultTemplates, GetThemeReturn extends Record<string, string | number> = Record<string, string>>(props: CreateThemesProps<Accent, GrandChildrenThemes, Extra, SubThemes, ComponentThemes, Templates, GetThemeReturn>): Record<"light" | "dark" | ((Accent extends undefined ? false : true) extends infer T ? T extends (Accent extends undefined ? false : true) ? T extends true ? "light_accent" | "dark_accent" : never : never : never) | (keyof SubThemes extends string ? `light_${(GrandChildrenThemes extends undefined ? undefined : Record<keyof GrandChildrenThemes, any>) extends infer T_1 ? T_1 extends (GrandChildrenThemes extends undefined ? undefined : Record<keyof GrandChildrenThemes, any>) ? T_1 extends undefined ? string & keyof SubThemes : NamesWithChildrenNames<string & keyof SubThemes, keyof T_1> : never : never}` | `dark_${(GrandChildrenThemes extends undefined ? undefined : Record<keyof GrandChildrenThemes, any>) extends infer T_2 ? T_2 extends (GrandChildrenThemes extends undefined ? undefined : Record<keyof GrandChildrenThemes, any>) ? T_2 extends undefined ? string & keyof SubThemes : NamesWithChildrenNames<string & keyof SubThemes, keyof T_2> : never : never}` : never), { [ThemeKey in "colorTransparent" | "color" | "colorHover" | "colorPress" | "colorFocus" | "placeholderColor" | "outlineColor" | "accentBackground" | "accentColor" | "background0" | "background02" | "background04" | "background06" | "background08" | "color1" | "color2" | "color3" | "color4" | "color5" | "color6" | "color7" | "color8" | "color9" | "color10" | "color11" | "color12" | "color0" | "color02" | "color04" | "color06" | "color08" | "background" | "backgroundHover" | "backgroundPress" | "backgroundFocus" | "borderColor" | "borderColorHover" | "borderColorPress" | "borderColorFocus" | keyof Extra["dark"] | ((Accent extends undefined ? false : true) extends infer T_3 ? T_3 extends (Accent extends undefined ? false : true) ? T_3 extends true ? "accent0" | "accent2" | "accent1" | "accent3" | "accent4" | "accent5" | "accent6" | "accent7" | "accent8" | "accent9" | "accent10" | "accent11" | "accent12" : never : never : never)]: string; } & GetThemeReturn>;
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
    /** @deprecated component themes are no longer recommended */
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
/**
 * V4 theme builder - preserves v4 ordering for backwards compatibility:
 * - Children and grandChildren themes are added FIRST
 * - Accent theme is added LAST with avoidNestingWithin for children themes
 *
 * Use this for v4 themes (like v4-tamagui.ts). The default createSimpleThemeBuilder
 * now uses v5 ordering.
 */
export declare function createV4ThemeBuilder<Extra extends ExtraThemeValuesByScheme, Templates extends BuildTemplates, Palettes extends SimplePaletteDefinitions, ChildrenThemes extends Record<string, {
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
    /** @deprecated component themes are no longer recommended */
    componentThemes?: ComponentThemes;
    extra?: Extra;
    accentExtra?: Extra;
    getTheme?: (props: GetThemeProps) => GetThemeReturn;
}): {
    themeBuilder: ThemeBuilder<any>;
    themes: Record<ThemeNames, FullTheme & GetThemeReturn>;
};
export {};
//# sourceMappingURL=createThemes.d.ts.map