import type { BuildThemeSuiteProps } from './types';
export declare function createStudioThemes(props: BuildThemeSuiteProps): {
    themeBuilder: import("./ThemeBuilder").ThemeBuilder<any>;
    themes: Record<"light" | "dark" | `light_${string}` | `dark_${string}`, {
        [x: string]: string;
    }>;
};
//# sourceMappingURL=createStudioThemes.d.ts.map