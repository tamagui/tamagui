import type { CreateTamaguiProps } from '@tamagui/web';
export declare function addFont(props: {
    fontFamilyName: string;
    fontFamily: CreateTamaguiProps['fonts'][keyof CreateTamaguiProps['fonts']];
    insertCSS?: boolean;
    update?: boolean;
}): {
    fontFamily: import("@tamagui/web").GenericFont<string | number | symbol>;
    fontFamilyToken?: undefined;
    fontDeclaration?: undefined;
} | {
    fontFamily?: undefined;
    fontFamilyToken: never;
    fontDeclaration: {
        [x: string]: {
            name: string;
            declarations: string[];
            language: string;
        };
    };
} | undefined;
//# sourceMappingURL=index.d.ts.map