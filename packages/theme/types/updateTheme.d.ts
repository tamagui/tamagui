import type { ThemeDefinition, ThemeName } from '@tamagui/web';
export declare function updateTheme({ name, theme, }: {
    name: ThemeName | (string & {});
    theme: Partial<Record<keyof ThemeDefinition, any>>;
}): {
    theme: {
        [x: string]: import("@tamagui/web").Variable<any>;
        background?: import("@tamagui/web").Variable<any> | undefined;
        backgroundHover?: import("@tamagui/web").Variable<any> | undefined;
        backgroundPress?: import("@tamagui/web").Variable<any> | undefined;
        backgroundFocus?: import("@tamagui/web").Variable<any> | undefined;
        color?: import("@tamagui/web").Variable<any> | undefined;
        colorHover?: import("@tamagui/web").Variable<any> | undefined;
        colorPress?: import("@tamagui/web").Variable<any> | undefined;
        colorFocus?: import("@tamagui/web").Variable<any> | undefined;
        borderColor?: import("@tamagui/web").Variable<any> | undefined;
        borderColorHover?: import("@tamagui/web").Variable<any> | undefined;
        borderColorPress?: import("@tamagui/web").Variable<any> | undefined;
        borderColorFocus?: import("@tamagui/web").Variable<any> | undefined;
        shadowColor?: import("@tamagui/web").Variable<any> | undefined;
        shadowColorHover?: import("@tamagui/web").Variable<any> | undefined;
        shadowColorPress?: import("@tamagui/web").Variable<any> | undefined;
        shadowColorFocus?: import("@tamagui/web").Variable<any> | undefined;
    };
    cssRules?: undefined;
} | {
    theme: any;
    cssRules: string[];
} | undefined;
//# sourceMappingURL=updateTheme.d.ts.map