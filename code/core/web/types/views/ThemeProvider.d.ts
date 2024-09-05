export type ThemeProviderProps = {
    className?: string;
    defaultTheme: string;
    disableRootThemeClass?: boolean;
    /** @deprecated moved to createTamagui({ settings: { disableRootThemeClass } }) */
    themeClassNameOnRoot?: boolean;
    children?: any;
    reset?: boolean;
};
export declare const ThemeProvider: (props: ThemeProviderProps) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ThemeProvider.d.ts.map