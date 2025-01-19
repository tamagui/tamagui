import { type ThemeBuilder } from '@tamagui/theme-builder';
import type { BuildPalettes, BuildTemplates, BuildThemeSuiteProps } from '@tamagui/themes';
import { defaultTemplates } from './defaultTemplates';
export { defaultTemplates } from './defaultTemplates';
export { getThemeSuitePalettes, PALETTE_BACKGROUND_OFFSET } from './getThemeSuitePalettes';
export declare function createStudioThemes(props: BuildThemeSuiteProps): {
    themeBuilder: ThemeBuilder<any>;
    themes: Record<"dark" | "light" | `dark_${string}` | `light_${string}`, {
        [x: string]: string;
        [x: number]: string;
        [x: symbol]: string;
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
type SimpleThemesDefinition = Record<string, SimpleThemeDefinition>;
type SimplePaletteDefinitions = Record<string, string[]>;
type SinglePalette = string[];
type SchemePalette = {
    light: SinglePalette;
    dark: SinglePalette;
};
type Palette = SinglePalette | SchemePalette;
export type CreateThemeSuiteProps<Accent extends BaseThemeDefinition<Extra> | undefined = undefined, GrandChildrenThemes extends SimpleThemesDefinition | undefined = undefined, Extra extends ExtraThemeValuesByScheme = ExtraThemeValuesByScheme, ChildrenThemes extends SimpleThemesDefinition = SimpleThemesDefinition, ComponentThemes extends SimpleThemesDefinition = SimpleThemesDefinition, Templates extends BuildTemplates = typeof defaultTemplates> = {
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
export declare function createThemeSuite<Extra extends ExtraThemeValuesByScheme, SubThemes extends SimpleThemesDefinition, ComponentThemes extends SimpleThemesDefinition, GrandChildrenThemes extends SimpleThemesDefinition | undefined = undefined, Accent extends BaseThemeDefinition<Extra> | undefined = undefined>(props: CreateThemeSuiteProps<Accent, GrandChildrenThemes, Extra, SubThemes, ComponentThemes>): Record<"dark" | "light" | ((Accent extends undefined ? false : true) extends infer T ? T extends (Accent extends undefined ? false : true) ? T extends true ? "light_accent" | "dark_accent" : never : never : never) | (keyof SubThemes extends string ? `dark_${(GrandChildrenThemes extends undefined ? undefined : Record<keyof GrandChildrenThemes, any>) extends infer T_1 ? T_1 extends (GrandChildrenThemes extends undefined ? undefined : Record<keyof GrandChildrenThemes, any>) ? T_1 extends undefined ? string & keyof SubThemes : NamesWithChildrenNames<string & keyof SubThemes, keyof T_1> : never : never}` | `light_${(GrandChildrenThemes extends undefined ? undefined : Record<keyof GrandChildrenThemes, any>) extends infer T_2 ? T_2 extends (GrandChildrenThemes extends undefined ? undefined : Record<keyof GrandChildrenThemes, any>) ? T_2 extends undefined ? string & keyof SubThemes : NamesWithChildrenNames<string & keyof SubThemes, keyof T_2> : never : never}` : never), { [ThemeKey in "accentBackground" | "accentColor" | "background0" | "background025" | "background05" | "background075" | "color1" | "color2" | "color3" | "color4" | "color5" | "color6" | "color7" | "color8" | "color9" | "color10" | "color11" | "color12" | "color0" | "color025" | "color05" | "color075" | "background" | "backgroundHover" | "backgroundPress" | "backgroundFocus" | "borderColor" | "borderColorHover" | "borderColorPress" | "borderColorFocus" | "color" | "colorHover" | "colorPress" | "colorFocus" | "colorTransparent" | "placeholderColor" | "outlineColor" | keyof Extra["dark"]]: string; }>;
export declare const getLastBuilder: () => ThemeBuilder<import("@tamagui/theme-builder").ThemeBuilderInternalState> | null;
type NamesWithChildrenNames<ParentNames extends string, ChildNames> = ParentNames | (ChildNames extends string ? `${ParentNames}_${ChildNames}` : never);
export declare function createSimpleThemeBuilder<Extra extends ExtraThemeValuesByScheme, Templates extends BuildTemplates, Palettes extends SimplePaletteDefinitions, ChildrenThemes extends Record<string, {
    template: keyof Templates extends string ? keyof Templates : never;
    palette?: string;
}>, GrandChildrenThemes extends undefined | Record<string, {
    template: keyof Templates extends string ? keyof Templates : never;
    palette?: string;
}>, HasAccent extends boolean, ComponentThemes extends SimpleThemesDefinition, FullTheme = {
    [ThemeKey in keyof Templates['light_base'] | keyof Extra['dark']]: string;
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
export declare const defaultComponentThemes: {
    ListItem: {
        template: string;
    };
    SelectTrigger: {
        template: string;
    };
    Card: {
        template: string;
    };
    Button: {
        template: string;
    };
    Checkbox: {
        template: string;
    };
    Switch: {
        template: string;
    };
    SwitchThumb: {
        template: string;
    };
    TooltipContent: {
        template: string;
    };
    Progress: {
        template: string;
    };
    RadioGroupItem: {
        template: string;
    };
    TooltipArrow: {
        template: string;
    };
    SliderTrackActive: {
        template: string;
    };
    SliderTrack: {
        template: string;
    };
    SliderThumb: {
        template: string;
    };
    Tooltip: {
        template: string;
    };
    ProgressIndicator: {
        template: string;
    };
    Input: {
        template: string;
    };
    TextArea: {
        template: string;
    };
};
export declare function createPalettes(palettes: BuildPalettes): SimplePaletteDefinitions;
//# sourceMappingURL=createThemeSuite.d.ts.map