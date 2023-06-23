import { Narrow } from '@tamagui/web';
import { CreateMask, CreateThemeOptions, MaskOptions } from './types';
export type Palette = string[];
type GenericTheme = {
    [key: string]: string;
};
export type Template = {
    [key: string]: number;
};
type ThemeUsingMask<Masks = string> = MaskOptions & {
    mask: Masks;
};
type ThemeUsingTemplate = CreateThemeOptions & {
    palette: string;
    template: string;
};
type ThemePreDefined = {
    theme: GenericTheme;
};
export type Theme<Masks = string> = ThemePreDefined | ThemeUsingTemplate | ThemeUsingMask<Masks>;
type ThemeWithParent<Masks = string> = Theme<Masks> & {
    parent: string;
};
type PaletteDefinitions = {
    [key: string]: Palette;
};
export type ThemeDefinition<Masks extends string = string> = Theme<Masks> | ThemeWithParent<Masks>[];
type UnionableString = string & {};
type ThemeDefinitions<Masks extends string = string> = {
    [key: string]: ThemeDefinition<Masks | UnionableString>;
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
type GetParentTheme<P, Themes extends ThemeDefinitions | undefined> = P extends string ? P extends keyof Themes ? Themes[P] : GetParentName<P> extends keyof Themes ? Themes[GetParentName<P>] : GetParentName<GetParentName<P>> extends keyof Themes ? Themes[GetParentName<GetParentName<P>>] : GetParentName<GetParentName<GetParentName<P>>> extends keyof Themes ? Themes[GetParentName<GetParentName<GetParentName<P>>>] : never : never;
type GetGeneratedTheme<TD extends any, S extends ThemeBuilderState> = TD extends {
    theme: infer T;
} ? T : TD extends {
    parent: infer P;
} ? GetGeneratedTheme<GetParentTheme<P, S['themes']>, S> : TD extends {
    template: infer T;
} ? T extends keyof S['templates'] ? GetGeneratedThemeFromTemplate<S['templates'][T]> : TD : TD;
type ThemeBuilderBuildResult<S extends ThemeBuilderState> = {
    [Key in keyof S['themes']]: GetGeneratedTheme<S['themes'][Key], S>;
};
type GetParentName<N extends string> = N extends `${infer A}_${infer B}_${infer C}_${infer D}_${string}` ? `${A}_${B}_${C}_${D}` : N extends `${infer A}_${infer B}_${infer C}_${string}` ? `${A}_${B}_${C}` : N extends `${infer A}_${infer B}_${string}` ? `${A}_${B}` : N extends `${infer A}_${string}` ? `${A}` : never;
export declare class ThemeBuilder<State extends ThemeBuilderState> {
    state: State;
    constructor(state: State);
    addPalettes<const P extends PaletteDefinitions>(palettes: P): ThemeBuilder<State & {
        palettes: P;
    }>;
    addTemplates<const T extends TemplateDefinitions>(templates: T): ThemeBuilder<State & {
        templates: T;
    }>;
    addMasks<const M extends MaskDefinitions>(masks: M): ThemeBuilder<State & {
        masks: M;
    }>;
    addThemes<const T extends ThemeDefinitions<ObjectStringKeys<State['masks']>>>(themes: T): ThemeBuilder<State & {
        themes: T;
    }>;
    addChildThemes<CTD extends Narrow<ThemeDefinitions<ObjectStringKeys<State['masks']>>>, const AvoidNestingWithin extends string[] = []>(childThemeDefinition: CTD, options?: {
        avoidNestingWithin?: AvoidNestingWithin;
    }): ThemeBuilder<State & {
        themes: { [key in `${Exclude<keyof NonNullable<State["themes"]>, number | symbol>}_${Exclude<keyof CTD, number | symbol>}`]: CTD & {
            parent: GetParentName<key>;
        }; };
    }>;
    build(): ThemeBuilderBuildResult<State>;
}
export declare function createThemeBuilder(): ThemeBuilder<{}>;
export {};
//# sourceMappingURL=ThemeBuilder.d.ts.map