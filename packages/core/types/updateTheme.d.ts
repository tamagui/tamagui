import { ThemeDefinition } from './types';
export declare function updateTheme({ name, theme, }: {
    name: string;
    theme: Partial<Record<keyof ThemeDefinition, any>>;
}): {
    theme: {
        [x: string]: any;
        background?: any;
        backgroundHover?: any;
        backgroundPress?: any;
        backgroundFocus?: any;
        color?: any;
        colorHover?: any;
        colorPress?: any;
        colorFocus?: any;
        borderColor?: any;
        borderColorHover?: any;
        borderColorPress?: any;
        borderColorFocus?: any;
        shadowColor?: any;
        shadowColorHover?: any;
        shadowColorPress?: any;
        shadowColorFocus?: any;
    };
    cssRules?: undefined;
} | {
    theme: any;
    cssRules: string[];
};
//# sourceMappingURL=updateTheme.d.ts.map