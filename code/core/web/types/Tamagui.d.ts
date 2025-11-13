import * as Helpers from '@tamagui/helpers';
export declare const Tamagui: {
    Helpers: typeof Helpers;
    get mediaState(): {
        [x: string]: boolean;
        [x: number]: boolean;
    };
    get config(): import("./types").TamaguiInternalConfig;
    get insertedRules(): string[];
    get allSelectors(): Record<string, string>;
    get identifierToValue(): Map<string, any>;
} | undefined;
export declare const getValueFromIdentifier: (identifier: string) => any;
export declare const setIdentifierValue: (identifier: string, value: any) => void;
//# sourceMappingURL=Tamagui.d.ts.map