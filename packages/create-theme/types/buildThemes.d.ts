export declare function buildThemes(): ThemeBuilder<{}>;
type Palette = string[];
type Template = {
    [key: string]: number;
};
type Theme = {
    palette: string;
    template: string;
    parent?: string;
} | {
    mask: string;
    parent?: string;
};
type PaletteDefinitions = {
    [key: string]: Palette;
};
type ThemeDefinitions = {
    [key: string]: Theme | Theme[];
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
    }): ThemeBuilder<State & {
        themes: (({ [prop in `${Exclude<keyof NonNullable<State["themes"]>, number | symbol>}_${Exclude<keyof CT, number | symbol>}`]: { -readonly [P in keyof CT]: CT[P] extends infer T_1 ? { -readonly [P_1 in keyof T_1]: CT[P][P_1] extends infer T_2 ? { -readonly [P_2 in keyof T_2]: CT[P][P_1][P_2] extends infer T_3 ? { -readonly [P_3 in keyof T_3]: CT[P][P_1][P_2][P_3] extends infer T_4 ? { -readonly [P_4 in keyof T_4]: CT[P][P_1][P_2][P_3][P_4] extends infer T_5 ? { -readonly [P_5 in keyof T_5]: CT[P][P_1][P_2][P_3][P_4][P_5] extends infer T_6 ? { -readonly [P_6 in keyof T_6]: CT[P][P_1][P_2][P_3][P_4][P_5][P_6] extends infer T_7 ? { -readonly [P_7 in keyof T_7]: CT[P][P_1][P_2][P_3][P_4][P_5][P_6][P_7] extends infer T_8 ? { -readonly [P_8 in keyof T_8]: CT[P][P_1][P_2][P_3][P_4][P_5][P_6][P_7][P_8] extends infer T_9 ? { -readonly [P_9 in keyof T_9]: CT[P][P_1][P_2][P_3][P_4][P_5][P_6][P_7][P_8][P_9] extends infer T_10 ? { -readonly [P_10 in keyof T_10]: any; } : never; } : never; } : never; } : never; } : never; } : never; } : never; } : never; } : never; } : never; }; } extends infer T_11 ? T_11 extends { [prop in `${Exclude<keyof NonNullable<State["themes"]>, number | symbol>}_${Exclude<keyof CT, number | symbol>}`]: { -readonly [P in keyof CT]: CT[P] extends infer T_1 ? { -readonly [P_1 in keyof T_1]: CT[P][P_1] extends infer T_2 ? { -readonly [P_2 in keyof T_2]: CT[P][P_1][P_2] extends infer T_3 ? { -readonly [P_3 in keyof T_3]: CT[P][P_1][P_2][P_3] extends infer T_4 ? { -readonly [P_4 in keyof T_4]: CT[P][P_1][P_2][P_3][P_4] extends infer T_5 ? { -readonly [P_5 in keyof T_5]: CT[P][P_1][P_2][P_3][P_4][P_5] extends infer T_6 ? { -readonly [P_6 in keyof T_6]: CT[P][P_1][P_2][P_3][P_4][P_5][P_6] extends infer T_7 ? { -readonly [P_7 in keyof T_7]: CT[P][P_1][P_2][P_3][P_4][P_5][P_6][P_7] extends infer T_8 ? { -readonly [P_8 in keyof T_8]: CT[P][P_1][P_2][P_3][P_4][P_5][P_6][P_7][P_8] extends infer T_9 ? { -readonly [P_9 in keyof T_9]: CT[P][P_1][P_2][P_3][P_4][P_5][P_6][P_7][P_8][P_9] extends infer T_10 ? { -readonly [P_10 in keyof T_10]: any; } : never; } : never; } : never; } : never; } : never; } : never; } : never; } : never; } : never; } : never; }; } ? T_11 extends any ? (k: T_11) => void : never : never : never) extends (k: infer I) => void ? I : never) extends infer T ? { [key in keyof T]: (({ [prop in `${Exclude<keyof NonNullable<State["themes"]>, number | symbol>}_${Exclude<keyof CT, number | symbol>}`]: { -readonly [P in keyof CT]: CT[P] extends infer T_1 ? { -readonly [P_1 in keyof T_1]: CT[P][P_1] extends infer T_2 ? { -readonly [P_2 in keyof T_2]: CT[P][P_1][P_2] extends infer T_3 ? { -readonly [P_3 in keyof T_3]: CT[P][P_1][P_2][P_3] extends infer T_4 ? { -readonly [P_4 in keyof T_4]: CT[P][P_1][P_2][P_3][P_4] extends infer T_5 ? { -readonly [P_5 in keyof T_5]: CT[P][P_1][P_2][P_3][P_4][P_5] extends infer T_6 ? { -readonly [P_6 in keyof T_6]: CT[P][P_1][P_2][P_3][P_4][P_5][P_6] extends infer T_7 ? { -readonly [P_7 in keyof T_7]: CT[P][P_1][P_2][P_3][P_4][P_5][P_6][P_7] extends infer T_8 ? { -readonly [P_8 in keyof T_8]: CT[P][P_1][P_2][P_3][P_4][P_5][P_6][P_7][P_8] extends infer T_9 ? { -readonly [P_9 in keyof T_9]: CT[P][P_1][P_2][P_3][P_4][P_5][P_6][P_7][P_8][P_9] extends infer T_10 ? { -readonly [P_10 in keyof T_10]: any; } : never; } : never; } : never; } : never; } : never; } : never; } : never; } : never; } : never; } : never; }; } extends infer T_11 ? T_11 extends { [prop in `${Exclude<keyof NonNullable<State["themes"]>, number | symbol>}_${Exclude<keyof CT, number | symbol>}`]: { -readonly [P in keyof CT]: CT[P] extends infer T_1 ? { -readonly [P_1 in keyof T_1]: CT[P][P_1] extends infer T_2 ? { -readonly [P_2 in keyof T_2]: CT[P][P_1][P_2] extends infer T_3 ? { -readonly [P_3 in keyof T_3]: CT[P][P_1][P_2][P_3] extends infer T_4 ? { -readonly [P_4 in keyof T_4]: CT[P][P_1][P_2][P_3][P_4] extends infer T_5 ? { -readonly [P_5 in keyof T_5]: CT[P][P_1][P_2][P_3][P_4][P_5] extends infer T_6 ? { -readonly [P_6 in keyof T_6]: CT[P][P_1][P_2][P_3][P_4][P_5][P_6] extends infer T_7 ? { -readonly [P_7 in keyof T_7]: CT[P][P_1][P_2][P_3][P_4][P_5][P_6][P_7] extends infer T_8 ? { -readonly [P_8 in keyof T_8]: CT[P][P_1][P_2][P_3][P_4][P_5][P_6][P_7][P_8] extends infer T_9 ? { -readonly [P_9 in keyof T_9]: CT[P][P_1][P_2][P_3][P_4][P_5][P_6][P_7][P_8][P_9] extends infer T_10 ? { -readonly [P_10 in keyof T_10]: any; } : never; } : never; } : never; } : never; } : never; } : never; } : never; } : never; } : never; } : never; }; } ? T_11 extends any ? (k: T_11) => void : never : never : never) extends (k: infer I) => void ? I : never)[key]; } : never;
    }>;
    build(): {};
}
export {};
//# sourceMappingURL=buildThemes.d.ts.map