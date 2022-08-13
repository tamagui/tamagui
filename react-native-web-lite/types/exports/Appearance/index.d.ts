export declare type ColorSchemeName = 'light' | 'dark';
export declare type AppearancePreferences = {
    colorScheme: ColorSchemeName;
};
declare type AppearanceListener = (preferences: AppearancePreferences) => void;
declare const Appearance: {
    getColorScheme(): ColorSchemeName;
    addChangeListener(listener: AppearanceListener): {
        remove: () => void;
    };
};
export default Appearance;
//# sourceMappingURL=index.d.ts.map