import type { CreateTamaguiProps } from '@tamagui/web';
export declare function addFont(props: {
    fontFamilyName: string;
    fontFamily: CreateTamaguiProps['fonts'][keyof CreateTamaguiProps['fonts']];
    insertCSS?: boolean;
    update?: boolean;
}): {
    fontFamily: import("@tamagui/web").GenericFont<string | number>;
    fontFamilyToken?: undefined;
    fontDeclaration?: undefined;
} | {
    fontFamilyToken: import("@tamagui/web").DeepVariableObject<import("@tamagui/web").GenericFont<string | number>>;
    fontDeclaration: {
        [x: string]: {
            name: string;
            declarations: string[];
            language: string;
        };
    };
    fontFamily?: undefined;
} | undefined;
//# sourceMappingURL=index.d.ts.map