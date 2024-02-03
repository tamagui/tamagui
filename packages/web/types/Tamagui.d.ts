import * as Helpers from '@tamagui/helpers';
export declare const Tamagui: {
    Helpers: typeof Helpers;
    getThemeManager: (id: number) => import("./helpers/ThemeManager").ThemeManager | undefined;
    readonly activeThemeManagers: Set<import("./helpers/ThemeManager").ThemeManager>;
    readonly mediaState: {
        [x: string]: boolean;
        [x: number]: boolean;
    };
    readonly config: import("./types").TamaguiInternalConfig;
    readonly insertedRules: string[];
    readonly allSelectors: Record<string, string>;
    readonly allTransforms: {};
    readonly identifierToValue: Map<string, any>;
} | undefined;
export declare const getValueFromIdentifier: (identifier: string) => any;
export declare const setIdentifierValue: (identifier: string, value: any) => void;
//# sourceMappingURL=Tamagui.d.ts.map