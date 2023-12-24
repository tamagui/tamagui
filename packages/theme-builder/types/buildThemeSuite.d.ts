import { ThemeBuilder } from './ThemeBuilder';
import { BuildThemeSuiteProps } from './types';
export declare function buildThemeSuite(props: BuildThemeSuiteProps): {
    [x: string]: any;
};
export declare function getThemeSuiteBuilder({ subThemes, templates, palettes, componentThemes, }: BuildThemeSuiteProps): ThemeBuilder<any>;
export type BuildBaseThemesResult = ReturnType<typeof buildThemeSuite>;
//# sourceMappingURL=buildThemeSuite.d.ts.map