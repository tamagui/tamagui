export declare function buildThemes(): ThemeBuilder;
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
declare class ThemeBuilder {
    private state;
    constructor(state: ThemeBuilderState);
    addPalettes<P extends PaletteDefinitions>(palettes: P): ThemeBuilder;
    addTemplates<T extends TemplateDefinitions>(templates: T): ThemeBuilder;
    addMasks<T extends TemplateDefinitions>(masks: T): ThemeBuilder;
    addThemes<T extends ThemeDefinitions>(themes: T): ThemeBuilder;
    addChildThemes<CT extends ThemeDefinitions>(childThemes: CT): ThemeBuilder;
}
export {};
//# sourceMappingURL=buildThemes.d.ts.map