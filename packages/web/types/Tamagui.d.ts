import * as Helpers from '@tamagui/helpers';
declare class TamaguiManager {
    Helpers: typeof Helpers;
    get mediaState(): {
        [x: string]: boolean;
        [x: number]: boolean;
    };
    get config(): import("./types.js").TamaguiInternalConfig<import("./types.js").CreateTokens<import("./types.js").VariableVal>, {
        [key: string]: Partial<import("./types.js").TamaguiBaseTheme> & {
            [key: string]: import("./types.js").VariableVal;
        };
    }, import("./types.js").GenericShorthands, {
        [key: string]: {
            [key: string]: string | number;
        };
    }, {
        [key: string]: string | any[] | {
            [key: string]: any;
        };
    }, import("./types.js").GenericFonts>;
    get insertedRules(): string[];
    get allSelectors(): Record<string, string>;
    get allTransforms(): {};
    get identifierToValue(): Map<string, any>;
}
export declare const Tamagui: TamaguiManager;
export declare const getValueFromIdentifier: (identifier: string) => any;
export declare const setIdentifierValue: (identifier: string, value: any) => void;
export {};
//# sourceMappingURL=Tamagui.d.ts.map