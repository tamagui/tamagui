import { ThemeDefinition } from './types';
export declare function updateTheme({ name, theme, }: {
    name: string;
    theme: Partial<Record<keyof ThemeDefinition, any>>;
}): {
    theme: {
        [x: string]: import("./createVariable").Variable<any>;
        background?: import("./createVariable").Variable<any> | undefined;
        backgroundHover?: import("./createVariable").Variable<any> | undefined;
        backgroundPress?: import("./createVariable").Variable<any> | undefined;
        backgroundFocus?: import("./createVariable").Variable<any> | undefined;
        color?: import("./createVariable").Variable<any> | undefined;
        colorHover?: import("./createVariable").Variable<any> | undefined;
        colorPress?: import("./createVariable").Variable<any> | undefined;
        colorFocus?: import("./createVariable").Variable<any> | undefined;
        borderColor?: import("./createVariable").Variable<any> | undefined;
        borderColorHover?: import("./createVariable").Variable<any> | undefined;
        borderColorPress?: import("./createVariable").Variable<any> | undefined;
        borderColorFocus?: import("./createVariable").Variable<any> | undefined;
        shadowColor?: import("./createVariable").Variable<any> | undefined;
        shadowColorHover?: import("./createVariable").Variable<any> | undefined;
        shadowColorPress?: import("./createVariable").Variable<any> | undefined;
        shadowColorFocus?: import("./createVariable").Variable<any> | undefined;
    };
    cssRules?: undefined;
} | {
    theme: any;
    cssRules: string[];
};
//# sourceMappingURL=updateTheme.d.ts.map