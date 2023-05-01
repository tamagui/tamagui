import * as Helpers from '@tamagui/helpers';
declare class TamaguiManager {
    Helpers: typeof Helpers;
    get mediaState(): {
        [x: string]: boolean;
        [x: number]: boolean;
    };
    get config(): import("./types").TamaguiInternalConfig;
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