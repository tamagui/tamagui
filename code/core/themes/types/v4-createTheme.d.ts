import { type ThemeBuilder } from '@tamagui/theme-builder';
import type { BuildPalettes, BuildTemplates, BuildThemeSuiteProps } from './types';
import { defaultTemplates } from './v4-defaultTemplates';
export { getThemeSuitePalettes, PALETTE_BACKGROUND_OFFSET } from './getThemeSuitePalettes';
export type * from './types';
export { defaultTemplates } from './v4-defaultTemplates';
type SimpleThemeDefinition = {
    colors?: ColorDefs;
    template?: string;
};
type BaseThemeDefinition = {
    colors: ColorDefs;
    template?: string;
};
type SimpleThemesDefinition = Record<string, SimpleThemeDefinition>;
type SimplePaletteDefinitions = Record<string, string[]>;
type Colors = string[];
type ColorsByScheme = {
    light: Colors;
    dark: Colors;
};
type ColorDefs = Colors | ColorsByScheme;
export type CreateThemesProps<SubThemes extends SimpleThemesDefinition = SimpleThemesDefinition, ComponentThemes extends SimpleThemesDefinition = SimpleThemesDefinition, Templates extends BuildTemplates = typeof defaultTemplates> = {
    base: BaseThemeDefinition;
    accent: BaseThemeDefinition;
    subThemes?: SubThemes;
    templates?: Templates;
    componentThemes?: ComponentThemes;
    colorsToTheme?: (props: {
        colors: string[];
        name: string;
        scheme?: 'light' | 'dark';
    }) => Record<string, string>;
};
export declare function createThemesWithSubThemes<SubThemes extends SimpleThemesDefinition, ComponentThemes extends SimpleThemesDefinition>(props: CreateThemesProps<SubThemes, ComponentThemes>): { [Key in "light" | "dark" | (keyof SubThemes extends string ? `light_${string & keyof SubThemes}` | `dark_${string & keyof SubThemes}` : never)]: {
    background0: string;
    background025: string;
    background05: string;
    background075: string;
    color1: string;
    color2: string;
    color3: string;
    color4: string;
    color5: string;
    color6: string;
    color7: string;
    color8: string;
    color9: string;
    color10: string;
    color11: string;
    color12: string;
    color0: string;
    color025: string;
    color05: string;
    color075: string;
    background: string;
    backgroundHover: string;
    backgroundPress: string;
    backgroundFocus: string;
    borderColor: string;
    borderColorHover: string;
    borderColorPress: string;
    borderColorFocus: string;
    color: string;
    colorHover: string;
    colorPress: string;
    colorFocus: string;
    colorTransparent: string;
    placeholderColor: string;
    outlineColor: string;
    shadowColor: string;
    shadowColorHover: string;
    shadowColorPress: string;
    shadowColorFocus: string;
    accentBackground: string;
    accentColor: string;
}; };
export declare function createThemes(props: BuildThemeSuiteProps): {
    themeBuilder: ThemeBuilder<any>;
    themes: {
        [x: `light_${string}`]: {
            [x: string]: string;
        };
        [x: `dark_${string}`]: {
            [x: string]: string;
        };
        light: {
            [x: string]: string;
        };
        dark: {
            [x: string]: string;
        };
    };
};
export declare function createSimpleThemeBuilder<Templates extends BuildTemplates, Palettes extends SimplePaletteDefinitions, SubThemes extends Record<string, {
    template: keyof Templates extends string ? keyof Templates : never;
    palette?: string;
}>, ComponentThemes extends SimpleThemesDefinition>({ subThemes, templates, palettes, componentThemes, }: {
    palettes?: Palettes;
    templates?: Templates;
    subThemes?: SubThemes;
    componentThemes?: ComponentThemes;
}): {
    themeBuilder: ThemeBuilder<any>;
    themes: {
        [Key in 'light' | 'dark' | (keyof SubThemes extends string ? `${'light' | 'dark'}_${keyof SubThemes}` : never)]: {
            [ThemeKey in keyof Templates['light_base']]: string;
        };
    };
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
//# sourceMappingURL=v4-createTheme.d.ts.map