import * as Helpers from '@tamagui/helpers';
declare class TamaguiManager {
    Helpers: typeof Helpers;
    get config(): import("./types").TamaguiInternalConfig<import("./types").CreateTokens<import("./types").VariableVal>, {
        [key: string]: Partial<import("./types").TamaguiBaseTheme> & {
            [key: string]: import("./types").VariableVal;
        };
    }, import("./types").GenericShorthands, {
        [key: string]: {
            [key: string]: string | number;
        };
    }, {
        [key: string]: string | any[] | {
            [key: string]: any;
        };
    }, import("./types").GenericFonts>;
    get insertedRules(): unknown[];
    get allSelectors(): {};
    get allTransforms(): {};
    get identifierToValue(): Map<string, any>;
}
export declare const Tamagui: TamaguiManager;
export declare const getValueFromIdentifier: (identifier: string) => any;
export declare const setIdentifierValue: (identifier: string, value: any) => void;
export {};
//# sourceMappingURL=Tamagui.d.ts.map