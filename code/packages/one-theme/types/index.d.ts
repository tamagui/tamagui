import type { SchemeSetting } from './types';
export { useSystemTheme } from './useSystemTheme';
export declare const HydrateTheme: () => import("react/jsx-runtime").JSX.Element | null;
export declare function useUserTheme(): readonly [{
    systemTheme: SchemeSetting;
    userTheme: SchemeSetting;
    resolvedTheme: "light" | "dark";
}, (next: SchemeSetting) => void];
export declare function UserThemeProvider(props: {
    children: any;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=index.d.ts.map