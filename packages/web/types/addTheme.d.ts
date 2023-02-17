import { ThemeDefinition } from './types.js';
export declare function addTheme(props: {
    name: string;
    theme: Partial<Record<keyof ThemeDefinition, any>>;
    insertCSS?: boolean;
    update?: boolean;
}): {
    theme: {
        [x: string]: import("./createVariable.js").Variable<any>;
        background?: import("./createVariable.js").Variable<any> | undefined;
        backgroundHover?: import("./createVariable.js").Variable<any> | undefined;
        backgroundPress?: import("./createVariable.js").Variable<any> | undefined;
        backgroundFocus?: import("./createVariable.js").Variable<any> | undefined;
        color?: import("./createVariable.js").Variable<any> | undefined;
        colorHover?: import("./createVariable.js").Variable<any> | undefined;
        colorPress?: import("./createVariable.js").Variable<any> | undefined;
        colorFocus?: import("./createVariable.js").Variable<any> | undefined;
        borderColor?: import("./createVariable.js").Variable<any> | undefined;
        borderColorHover?: import("./createVariable.js").Variable<any> | undefined;
        borderColorPress?: import("./createVariable.js").Variable<any> | undefined;
        borderColorFocus?: import("./createVariable.js").Variable<any> | undefined;
        shadowColor?: import("./createVariable.js").Variable<any> | undefined;
        shadowColorHover?: import("./createVariable.js").Variable<any> | undefined;
        shadowColorPress?: import("./createVariable.js").Variable<any> | undefined;
        shadowColorFocus?: import("./createVariable.js").Variable<any> | undefined;
    };
    cssRules?: undefined;
} | {
    theme: any;
    cssRules: string[];
};
//# sourceMappingURL=addTheme.d.ts.map