import { defaultTemplates } from './defaultTemplates';
import { type ThemeBuilder } from './ThemeBuilder';
import type { BuildPalettes, BuildTemplates, BuildThemeSuiteProps } from './types';
export declare function createStudioThemes(props: BuildThemeSuiteProps): {
    themeBuilder: ThemeBuilder<any>;
    themes: Record<"dark" | "light" | `dark_${string}` | `light_${string}`, {
        [x: string]: string;
    }>;
};
/**
 * TODO
 *
 *  - we avoidNestingWithin accent, but sometimes want it eg v4-tamagui grandChildren
 *    a good default would be to IF palette is set, dont nest, IF only template, nest
 *    needs to update both runtime logic and types
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
export type CreateThemesProps<Accent extends BaseThemeDefinition<Extra> | undefined = undefined, GrandChildrenThemes extends SimpleThemesDefinition | undefined = undefined, Extra extends ExtraThemeValuesByScheme = ExtraThemeValuesByScheme, ChildrenThemes extends SimpleThemesDefinition = SimpleThemesDefinition, ComponentThemes extends SimpleThemesDefinition = SimpleThemesDefinition, Templates extends BuildTemplates = typeof defaultTemplates> = {
    base: BaseThemeDefinition<Extra>;
    accent?: Accent;
    childrenThemes?: ChildrenThemes;
    grandChildrenThemes?: GrandChildrenThemes;
    templates?: Templates;
    componentThemes?: ComponentThemes;
    colorsToTheme?: (props: {
        colors: string[];
        name: string;
        scheme?: 'light' | 'dark';
    }) => Record<string, string>;
};
export declare function createThemes<Extra extends ExtraThemeValuesByScheme, SubThemes extends SimpleThemesDefinition, ComponentThemes extends SimpleThemesDefinition, GrandChildrenThemes extends SimpleThemesDefinition | undefined = undefined, Accent extends BaseThemeDefinition<Extra> | undefined = undefined>(props: CreateThemesProps<Accent, GrandChildrenThemes, Extra, SubThemes, ComponentThemes>): Record<"dark" | "light" | ((Accent extends undefined ? false : true) extends infer T ? T extends (Accent extends undefined ? false : true) ? T extends true ? "light_accent" | "dark_accent" : never : never : never) | (keyof SubThemes extends string ? `dark_${(GrandChildrenThemes extends undefined ? undefined : Record<keyof GrandChildrenThemes, any>) extends infer T_1 ? T_1 extends (GrandChildrenThemes extends undefined ? undefined : Record<keyof GrandChildrenThemes, any>) ? T_1 extends undefined ? string & keyof SubThemes : NamesWithChildrenNames<string & keyof SubThemes, keyof T_1> : never : never}` | `light_${(GrandChildrenThemes extends undefined ? undefined : Record<keyof GrandChildrenThemes, any>) extends infer T_2 ? T_2 extends (GrandChildrenThemes extends undefined ? undefined : Record<keyof GrandChildrenThemes, any>) ? T_2 extends undefined ? string & keyof SubThemes : NamesWithChildrenNames<string & keyof SubThemes, keyof T_2> : never : never}` : never), { [ThemeKey in "accentBackground" | "accentColor" | "background0" | "background02" | "background04" | "background06" | "background08" | "color1" | "color2" | "color3" | "color4" | "color5" | "color6" | "color7" | "color8" | "color9" | "color10" | "color11" | "color12" | "color0" | "color02" | "color04" | "color06" | "color08" | "background" | "backgroundHover" | "backgroundPress" | "backgroundFocus" | "borderColor" | "borderColorHover" | "borderColorPress" | "borderColorFocus" | "color" | "colorHover" | "colorPress" | "colorFocus" | "colorTransparent" | "placeholderColor" | "outlineColor" | keyof Extra["dark"] | ((Accent extends undefined ? false : true) extends infer T_3 ? T_3 extends (Accent extends undefined ? false : true) ? T_3 extends true ? "accent0" | "accent2" | "accent1" | "accent3" | "accent4" | "accent5" | "accent6" | "accent7" | "accent8" | "accent9" | "accent10" | "accent11" | "accent12" : never : never : never)]: string; }>;
export declare const getLastBuilder: () => ThemeBuilder<import("./ThemeBuilder").ThemeBuilderInternalState> | null;
type NamesWithChildrenNames<ParentNames extends string, ChildNames> = ParentNames | (ChildNames extends string ? `${ParentNames}_${ChildNames}` : never);
export declare function createSimpleThemeBuilder<Extra extends ExtraThemeValuesByScheme, Templates extends BuildTemplates, Palettes extends SimplePaletteDefinitions, ChildrenThemes extends Record<string, {
    template: keyof Templates extends string ? keyof Templates : never;
    palette?: string;
}>, GrandChildrenThemes extends undefined | Record<string, {
    template: keyof Templates extends string ? keyof Templates : never;
    palette?: string;
}>, HasAccent extends boolean = false, ComponentThemes extends SimpleThemesDefinition | false = false, FullTheme = {
    [ThemeKey in keyof Templates['light_base'] | keyof Extra['dark'] | (HasAccent extends true ? `accent${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}` : never)]: string;
}, ThemeNames extends string = 'light' | 'dark' | (HasAccent extends true ? 'light_accent' | 'dark_accent' : never) | (keyof ChildrenThemes extends string ? `${'light' | 'dark'}_${GrandChildrenThemes extends undefined ? keyof ChildrenThemes : NamesWithChildrenNames<keyof ChildrenThemes, keyof GrandChildrenThemes>}` : never)>(props: {
    palettes?: Palettes;
    accentTheme?: HasAccent;
    templates?: Templates;
    childrenThemes?: ChildrenThemes;
    grandChildrenThemes?: GrandChildrenThemes;
    componentThemes?: ComponentThemes;
    extra?: Extra;
}): {
    themeBuilder: ThemeBuilder<any>;
    themes: Record<ThemeNames, FullTheme>;
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