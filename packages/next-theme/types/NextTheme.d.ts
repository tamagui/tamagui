import React from 'react';
export interface UseThemeProps {
    themes: string[];
    forcedTheme?: string;
    setTheme: (theme: string) => void;
    toggleTheme: () => void;
    theme?: string;
    resolvedTheme?: string;
    systemTheme?: 'dark' | 'light';
}
export interface ThemeProviderProps {
    themes?: string[];
    forcedTheme?: string;
    enableSystem?: boolean;
    systemTheme?: string;
    disableTransitionOnChange?: boolean;
    enableColorScheme?: boolean;
    storageKey?: string;
    defaultTheme?: string;
    attribute?: string | 'class';
    value?: ValueObject;
    onChangeTheme?: (name: string) => void;
}
export declare const useTheme: () => UseThemeProps;
interface ValueObject {
    [themeName: string]: string;
}
export declare const useRootTheme: () => [string, React.Dispatch<React.SetStateAction<string>>];
export declare const NextThemeProvider: React.FC<ThemeProviderProps>;
export {};
//# sourceMappingURL=NextTheme.d.ts.map