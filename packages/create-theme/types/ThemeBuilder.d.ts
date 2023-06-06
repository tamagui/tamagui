import { CreateMask, MaskOptions } from './types';
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
type ThemeDefinition<Masks extends string = string> = Theme<Masks> | ThemeWithParent<Masks>[];
type ThemeDefinitions<Masks extends string = string> = {
    [key: string]: ThemeDefinition<Masks>;
};
type TemplateDefinitions = {
    [key: string]: Template;
};
type MaskDefinitions = {
    [key: string]: CreateMask | CreateMask['mask'];
};
type ThemeBuilderState = {
    palettes?: PaletteDefinitions;
    templates?: TemplateDefinitions;
    themes?: ThemeDefinitions;
    masks?: MaskDefinitions;
};
type ObjectStringKeys<A extends Object | undefined> = A extends Object ? Exclude<keyof A, symbol | number> : never;
type GetGeneratedTheme<TD extends ThemeDefinition, S extends ThemeBuilderState> = TD extends {
    theme: infer T;
} ? T : TD extends {
    mask: infer M;
} ? M : TD extends {
    palette: infer P;
    template: infer T;
} ? {
    p: P;
    t: T;
} : never;
type GetGeneratedThemes<S extends ThemeBuilderState> = {
    [Key in keyof S['themes']]: S['themes'][Key] extends ThemeDefinition ? GetGeneratedTheme<S['themes'][Key], S> : never;
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
    addThemes<T extends ThemeDefinitions<ObjectStringKeys<State['masks']>>>(themes: T): ThemeBuilder<State & {
        themes: T;
    }>;
    addChildThemes<CTD extends ThemeDefinitions<ObjectStringKeys<State['masks']>>>(childThemeDefinition: CTD, options?: {
        avoidNestingWithin?: string[];
    }): ThemeBuilder<State & {
        themes: { [key in `${Exclude<keyof NonNullable<State["themes"]>, number | symbol>}_${Exclude<keyof CTD, number | symbol>}`]: CTD; };
    }>;
    build(): GetGeneratedThemes<State>;
}
export declare function createThemeBuilder(): ThemeBuilder<{}>;
export {};
//# sourceMappingURL=ThemeBuilder.d.ts.map