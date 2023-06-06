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
type GetGeneratedThemeFromTemplate<Template> = {
    [key in keyof Template]: string;
};
type GetGeneratedTheme<TD extends any, S extends ThemeBuilderState> = TD extends {
    theme: infer T;
} ? T : TD extends {
    parent: infer P;
} ? P : TD extends {
    template: infer T;
} ? T extends keyof S['templates'] ? GetGeneratedThemeFromTemplate<S['templates'][T]> : TD : TD;
type GetGeneratedThemes<S extends ThemeBuilderState> = {
    [Key in keyof S['themes']]: GetGeneratedTheme<S['themes'][Key], S>;
};
declare class ThemeBuilder<State extends ThemeBuilderState> {
    state: State;
    constructor(state: State);
    addPalettes<const P extends PaletteDefinitions>(palettes: P): ThemeBuilder<State & {
        readonly palettes: P;
    }>;
    addTemplates<const T extends TemplateDefinitions>(templates: T): ThemeBuilder<State & {
        templates: T;
    }>;
    addMasks<const T extends MaskDefinitions>(masks: T): ThemeBuilder<State & {
        masks: T;
    }>;
    addThemes<const T extends ThemeDefinitions<ObjectStringKeys<State['masks']>>>(themes: T): ThemeBuilder<State & {
        themes: T;
    }>;
    addChildThemes<const CTD extends ThemeDefinitions<ObjectStringKeys<State['masks']>>>(childThemeDefinition: CTD, options?: {
        avoidNestingWithin?: string[];
    }): ThemeBuilder<State & {
        themes: { [key in `${Exclude<keyof NonNullable<State["themes"]>, number | symbol>}_${Exclude<keyof CTD, number | symbol>}`]: CTD & {
            parent: key extends `${infer ParentName}_${string}` ? ParentName : never;
        }; };
    }>;
    build(): GetGeneratedThemes<State>;
}
export declare function createThemeBuilder(): ThemeBuilder<{}>;
export {};
//# sourceMappingURL=ThemeBuilder.d.ts.map