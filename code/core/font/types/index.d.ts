import type { CreateTamaguiProps } from '@tamagui/web';
type FontDefinition = NonNullable<CreateTamaguiProps['fonts']>[string];
export declare function addFont(props: {
    fontFamilyName: string;
    fontFamily: FontDefinition;
    insertCSS?: boolean;
    update?: boolean;
}): {
    fontFamily: import("@tamagui/web").GenericFont<string | number | symbol>;
    fontFamilyToken?: undefined;
    fontDeclaration?: undefined;
} | {
    fontFamily?: undefined;
    fontFamilyToken: import("@tamagui/web").GenericFont<string | number | symbol>;
    fontDeclaration: {
        [x: string]: {
            name: string;
            declarations: string[];
            language: string;
        };
    };
} | undefined;
export {};
//# sourceMappingURL=index.d.ts.map