/// <reference types="react" />
type ColorScheme = 'dark' | 'light';
export declare const useRootTheme: ({ fallback }?: {
    fallback?: ColorScheme | undefined;
}) => readonly [ColorScheme, import("react").Dispatch<import("react").SetStateAction<ColorScheme>>];
export {};
//# sourceMappingURL=useRootTheme.d.ts.map