import * as Helpers from '@tamagui/helpers';
import { TamaguiInternalConfig } from './types';
declare class TamaguiManager {
    rnw: any;
    Helpers: typeof Helpers;
    get config(): TamaguiInternalConfig<import("./types").CreateTokens<import("./types").VariableVal>, {
        [key: string]: Partial<import("./types").TamaguiBaseTheme> & {
            [key: string]: import("./types").VariableVal;
        };
    }, {}, {
        [x: string]: {
            [key: string]: string | number;
        };
    }, {
        [key: string]: string | {
            [key: string]: any;
        };
    }, {
        [key: string]: import("./types").GenericFont<string | number>;
    }>;
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