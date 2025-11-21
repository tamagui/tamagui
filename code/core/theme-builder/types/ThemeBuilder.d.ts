import type { MaskDefinitions, PaletteDefinitions, Template, TemplateDefinitions, ThemeDefinitions } from '@tamagui/create-theme';
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
type ThemeBuilderBuildResult<S extends ThemeBuilderInternalState, FinalTheme extends Record<string, string | number> = Record<string, string>> = Record<string, string> extends FinalTheme ? FinalTheme extends Record<string, string> ? {
    [Key in keyof S['themes']]: GetGeneratedTheme<S['themes'][Key], S>;
} : {
    [Key in keyof S['themes']]: FinalTheme;
} : {
    [Key in keyof S['themes']]: FinalTheme;
};
type GetParentName<N extends string> = N extends `${infer A}_${infer B}_${infer C}_${infer D}_${string}` ? `${A}_${B}_${C}_${D}` : N extends `${infer A}_${infer B}_${infer C}_${string}` ? `${A}_${B}_${C}` : N extends `${infer A}_${infer B}_${string}` ? `${A}_${B}` : N extends `${infer A}_${string}` ? `${A}` : never;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
type FlattenUnion<T extends Record<string, string | number>> = Prettify<{
    [K in keyof UnionToIntersection<T>]: UnionToIntersection<T>[K];
}> extends infer R extends Record<string, string | number> ? R : never;
export declare class ThemeBuilder<State extends ThemeBuilderInternalState = ThemeBuilderInternalState, FinalTheme extends Record<string, string | number> = Record<string, string>> {
    state: State;
    private _getThemeFn?;
    constructor(state: State);
    addPalettes<const P extends PaletteDefinitions>(palettes: P): ThemeBuilder<State & {
        palettes: P;
    }, FinalTheme>;
    addTemplates<const T extends TemplateDefinitions>(templates: T): ThemeBuilder<State & {
        templates: T;
    }, FinalTheme>;
    addMasks<const M extends MaskDefinitions>(masks: M): ThemeBuilder<State & {
        masks: M;
    }, FinalTheme>;
    _addedThemes: {
        type: 'themes' | 'childThemes';
        args: any;
    }[];
    addThemes<const T extends ThemeDefinitions<ObjectStringKeys<State['masks']>>>(themes: T): ThemeBuilder<Omit<State, "themes"> & {
        themes: T;
    }, FinalTheme>;
    addComponentThemes<CTD extends Narrow<ThemeDefinitions<ObjectStringKeys<State['masks']>>>>(childThemeDefinition: CTD, options?: {
        avoidNestingWithin?: string[];
    }): this;
    addChildThemes<CTD extends Narrow<ThemeDefinitions<ObjectStringKeys<State['masks']>>>, const AvoidNestingWithin extends string[] = []>(childThemeDefinition: CTD, options?: {
        avoidNestingWithin?: AvoidNestingWithin;
    }): ThemeBuilder<State & {
        themes: { [key in `${Exclude<keyof NonNullable<State["themes"]>, number | symbol>}_${Exclude<keyof CTD, number | symbol>}`]: CTD & {
            parent: GetParentName<key>;
        }; };
    }, FinalTheme>;
    getTheme<NewTheme extends Record<string, string | number>>(fn: (props: {
        name: string;
        theme: GetGeneratedTheme<State['themes'][keyof State['themes']], State>;
        scheme?: 'light' | 'dark';
        parentName: string;
        parentNames: string[];
        level: number;
        palette?: string[];
        template?: Template;
    }) => NewTheme): ThemeBuilder<State, FlattenUnion<NewTheme>>;
    build(): ThemeBuilderBuildResult<State, FinalTheme>;
}
export declare function createThemeBuilder(): ThemeBuilder<{}, Record<string, string>>;
export {};
//# sourceMappingURL=ThemeBuilder.d.ts.map