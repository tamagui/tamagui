import { MaskOptions } from './types';
export type Palette = string[];
export type Template = {
    [key: string]: number;
};
type ThemeUsingMask<Masks = string> = MaskOptions & {
    mask: Masks;
};
type ThemeUsingTemplate = {
    palette: string;
    template: string;
};
type ThemePreDefined = {
    theme: {
        [key: string]: string;
    };
};
export type Theme<Masks = string> = ThemePreDefined | ThemeUsingTemplate | ThemeUsingMask<Masks>;
type ThemeWithParent<Masks = string> = Theme<Masks> & {
    parent: string;
};
type PaletteDefinitions = {
    [key: string]: Palette;
};
type ThemeDefinitions<Masks extends string = string> = {
    [key: string]: Theme<Masks> | ThemeWithParent<Masks>[];
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
type ObjectStringKeys<A extends Object | undefined> = A extends Object ? Exclude<keyof A, symbol | number> : never;
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
    addThemes<T extends ThemeDefinitions<ObjectStringKeys<State['masks']>>>(themes: T): ThemeBuilder<State & {
        themes: T;
    }>;
    addChildThemes<CTD extends ThemeDefinitions<ObjectStringKeys<State['masks']>>>(childThemeDefinition: CTD, options?: {
        avoidNestingWithin?: string[];
    }): ThemeBuilder<State & {
        themes: { [key in `${Exclude<keyof NonNullable<State["themes"]>, number | symbol>}_${Exclude<keyof CTD, number | symbol>}`]: CTD; };
    }>;
    build(): {};
}
export declare function createThemeBuilder(): ThemeBuilder<{}>;
export {};
//# sourceMappingURL=ThemeBuilder.d.ts.map