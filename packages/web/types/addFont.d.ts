import { CreateTamaguiProps } from './types.js';
export declare function addFont(props: {
    fontFamilyName: string;
    fontFamily: CreateTamaguiProps['fonts'][keyof CreateTamaguiProps['fonts']];
    insertCSS?: boolean;
    update?: boolean;
}): {
    fontFamily: import("./types.js").GenericFont<string | number>;
    fontFamilyToken?: undefined;
    fontDeclaration?: undefined;
} | {
    fontFamilyToken: import("./createVariables.js").DeepVariableObject<import("./types.js").GenericFont<string | number>>;
    fontDeclaration: {
        [x: string]: {
            name: string;
            declarations: string[];
            language: string;
        };
    };
    fontFamily?: undefined;
} | undefined;
//# sourceMappingURL=addFont.d.ts.map