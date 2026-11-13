import type { BuildThemeSuiteProps } from './types.js';
export declare function createStudioThemes(props: BuildThemeSuiteProps): {
    themeBuilder: import("./ThemeBuilder.js").ThemeBuilder<any>;
    themes: Record<"dark" | "light" | `dark_${string}` | `light_${string}`, {
        [x: string]: string;
    } & Record<string, string>>;
};
//# sourceMappingURL=createStudioThemes.d.ts.map