/// <reference types="react" />
import { TamaguiProviderProps } from '../types';
import { ThemeProviderProps } from '../views/ThemeProvider';
export declare function createTamaguiProvider({ getCSS, ...themeProps }: ThemeProviderProps & {
    getCSS: () => string;
}): ({ injectCSS, initialWindowMetrics, fallback, children, ...themePropsProvider }: TamaguiProviderProps) => JSX.Element;
//# sourceMappingURL=createTamaguiProvider.d.ts.map