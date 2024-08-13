type Scheme = 'light' | 'dark';
type SchemeSetting = 'system' | 'light' | 'dark';
export declare function getSystemTheme(): "light" | "dark";
export declare const HydrateTheme: () => import("react/jsx-runtime").JSX.Element | null;
export declare function useSystemTheme(): Scheme;
export declare function useUserTheme(): readonly [{
    systemTheme: SchemeSetting;
    userTheme: SchemeSetting;
    resolvedTheme: "light" | "dark";
}, (next: SchemeSetting) => void];
export declare function UserThemeProvider(props: {
    children: any;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map