import { TamaguiInternalConfig } from './types';
declare class TamaguiManager {
    config: TamaguiInternalConfig | null;
    rnw: Record<string, any>;
    get allSelectors(): {};
    get identifierToValue(): Map<string, any>;
}
export declare const Tamagui: TamaguiManager;
export declare const getValueFromIdentifier: (identifier: string) => any;
export declare const setIdentifierValue: (identifier: string, value: any) => void;
export {};
//# sourceMappingURL=Tamagui.d.ts.map