import type { BuildThemeSuiteProps } from './types';
export declare function createStudioThemes(props: BuildThemeSuiteProps): {
    themeBuilder: import("./ThemeBuilder").ThemeBuilder<any>;
    themes: Record<"dark" | "light" | `dark_${string}` | `light_${string}`, {
        [x: string]: string;
    }>;
};
//# sourceMappingURL=createStudioThemes.d.ts.map