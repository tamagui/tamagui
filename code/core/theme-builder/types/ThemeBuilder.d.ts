import type { MaskDefinitions, PaletteDefinitions, TemplateDefinitions, ThemeDefinitions } from '@tamagui/create-theme';
import type { Narrow } from '@tamagui/web';
export type ThemeBuilderInternalState = {
    palettes?: PaletteDefinitions;
    templates?: TemplateDefinitions;
    themes?: ThemeDefinitions;
    masks?: MaskDefinitions;
};
type ObjectStringKeys<A extends Object | undefined> = A extends Object ? Exclude<keyof A, symbol | number> : never;
type GetGeneratedThemeFromTemplate<Template, TD> = {
    [key in keyof Template]: string;
};
type GetParentTheme<P, Themes extends ThemeDefinitions | undefined> = P extends string ? P extends keyof Themes ? Themes[P] : GetParentName<P> extends keyof Themes ? Themes[GetParentName<P>] : GetParentName<GetParentName<P>> extends keyof Themes ? Themes[GetParentName<GetParentName<P>>] : GetParentName<GetParentName<GetParentName<P>>> extends keyof Themes ? Themes[GetParentName<GetParentName<GetParentName<P>>>] : never : never;
type GetGeneratedTheme<TD, S extends ThemeBuilderInternalState> = TD extends {
    theme: infer T;
} ? T : TD extends {
    parent: infer P;
} ? GetGeneratedTheme<GetParentTheme<P, S['themes']>, S> : TD extends {
    template: infer T;
} ? T extends keyof S['templates'] ? GetGeneratedThemeFromTemplate<S['templates'][T], TD> : TD : TD;
type ThemeBuilderBuildResult<S extends ThemeBuilderInternalState> = {
    [Key in keyof S['themes']]: GetGeneratedTheme<S['themes'][Key], S>;
};
type GetParentName<N extends string> = N extends `${infer A}_${infer B}_${infer C}_${infer D}_${string}` ? `${A}_${B}_${C}_${D}` : N extends `${infer A}_${infer B}_${infer C}_${string}` ? `${A}_${B}_${C}` : N extends `${infer A}_${infer B}_${string}` ? `${A}_${B}` : N extends `${infer A}_${string}` ? `${A}` : never;
export declare class ThemeBuilder<State extends ThemeBuilderInternalState = ThemeBuilderInternalState> {
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
    _addedThemes: {
        type: 'themes' | 'childThemes';
        args: any;
    }[];
    addThemes<const T extends ThemeDefinitions<ObjectStringKeys<State['masks']>>>(themes: T): ThemeBuilder<Omit<State, "themes"> & {
        themes: T;
    }>;
    addComponentThemes<CTD extends Narrow<ThemeDefinitions<ObjectStringKeys<State['masks']>>>>(childThemeDefinition: CTD, options?: {
        avoidNestingWithin?: string[];
    }): this;
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