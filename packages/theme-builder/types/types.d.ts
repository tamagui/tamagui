export type BuildThemeSuiteProps = {
    baseTheme: BuildTheme;
    subThemes?: (BuildTheme | BuildThemeMask)[];
};
export type ScaleTypeName = 'radix' | 'radix-b' | 'radius-bold' | 'radius-bright' | 'linear' | 'pastel' | 'pastel-desaturating' | 'neon' | 'neon-bright' | 'neon-c';
export type BuildThemeBase = {
    id: string;
    name: string;
    errors?: string[];
};
export type BuildTheme = BuildThemeBase & {
    type: 'theme';
    color: string;
    scale: ScaleTypeName;
    contrast?: string;
    contrastColor?: string;
    contrastScale?: ScaleTypeName;
};
export type BuildMask = {
    id: string;
} & ({
    type: 'strengthen';
    strength: number;
} | {
    type: 'soften';
    strength: number;
} | {
    type: 'inverse';
} | {
    type: 'strengthenBorder';
    strength: number;
} | {
    type: 'softenBorder';
    strength: number;
});
export type BuildThemeMask = BuildThemeBase & {
    type: 'mask';
    masks: BuildMask[];
};
//# sourceMappingURL=types.d.ts.map