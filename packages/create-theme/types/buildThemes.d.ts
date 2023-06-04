export declare function buildThemes(): ThemeBuilder<{}>;
type Palette = string[];
type Template = {
    [key: string]: number;
};
type Theme = {
    palette: string;
    template: string;
} | {
    mask: string;
};
type PaletteDefinitions = {
    [key: string]: Palette;
};
type ThemeDefinitions = {
    [key: string]: Theme;
};
type TemplateDefinitions = {
    [key: string]: Template;
};
type MaskDefinitions = {
    [key: string]: Function;
};
type ThemeBuilderState = {
    palettes?: PaletteDefinitions;
    templates?: TemplateDefinitions;
    themes?: ThemeDefinitions;
    masks?: MaskDefinitions;
};
declare class ThemeBuilder<State extends ThemeBuilderState> {
    state: State;
    constructor(state: State);
    addPalettes<P extends PaletteDefinitions>(palettes: P): ThemeBuilder<State & {
        readonly palettes: P;
    }>;
    addTemplates<T extends TemplateDefinitions>(templates: T): ThemeBuilder<State & {
        templates: T;
    }>;
    addMasks<T extends MaskDefinitions>(masks: T): ThemeBuilder<State & {
        masks: T;
    }>;
    addThemes<T extends ThemeDefinitions>(themes: T): ThemeBuilder<State & {
        themes: T;
    }>;
    addChildThemes<CT extends ThemeDefinitions>(childThemeDefinition: CT, options?: {
        avoidNestingWithin?: string[];
    }): null;
    build(): this;
}
export {};
//# sourceMappingURL=buildThemes.d.ts.map