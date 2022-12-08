import './polyfill';
import { TamaguiInternalConfig, ThemeName } from 'tamagui';
import { Components, DeepReadonly, DialogTypes, Palette, StudioDialogProps, Tab, ThemeCategory, ThemeParsed, ThemeVal } from './types';
export declare type State = ReturnType<typeof getDefaultInitialState>;
export declare const GlobalState: {
    theme: ThemeName;
    tab: Tab;
    dialog: keyof DialogTypes;
    dialogProps: StudioDialogProps;
    themeColorScale(): import("./types").Scale;
    config: TamaguiInternalConfig<import("@tamagui/core").CreateTokens<import("@tamagui/core").VariableVal>, {
        [key: string]: Partial<import("tamagui").TamaguiBaseTheme> & {
            [key: string]: import("@tamagui/core").VariableVal;
        };
    }, import("@tamagui/core").GenericShorthands, {
        [key: string]: {
            [key: string]: string | number;
        };
    }, {
        [key: string]: string | any[] | {
            [key: string]: any;
        };
    }, import("@tamagui/core").GenericFonts> | null;
    components: {
        components: Components;
    };
    themes: {
        themeId: string;
        column: number;
        row: number;
        isPinned: boolean;
        focusedKey: string;
        themes: Record<string, ThemeParsed>;
        themeVals: ThemeVal[];
        theme(): ThemeParsed;
        themesList(): ThemeParsed[];
        uniqueThemeIDsByCategory(): Record<ThemeCategory, Set<string>>;
        themeCombos(prefix?: string): ThemeParsed[];
        pseudo(): string;
        focusedVal(): ThemeVal | undefined;
        pseudoThemeVals(): ThemeVal[];
        componentName(): string;
        themeColor(): string | undefined;
    };
    colors: {
        paletteId: string;
        scaleId: string;
        curveId: string;
        selectedIndex: string;
        palettes: Record<string, Palette>;
        past: Record<string, Palette>[];
        future: Record<string, Palette>[];
        palette(): Palette;
        scale(name?: string): import("./types").Scale;
        curve(id?: string): import("./types").Curve;
        focusedHex(): string | undefined;
    };
};
export declare type GlobalStateI = DeepReadonly<typeof GlobalState>;
export declare const useGlobalState: () => GlobalStateI;
declare function getDefaultInitialState(): {
    theme: ThemeName;
    tab: Tab;
    dialog: keyof DialogTypes;
    dialogProps: StudioDialogProps;
    themeColorScale(): import("./types").Scale;
    config: TamaguiInternalConfig<import("@tamagui/core").CreateTokens<import("@tamagui/core").VariableVal>, {
        [key: string]: Partial<import("tamagui").TamaguiBaseTheme> & {
            [key: string]: import("@tamagui/core").VariableVal;
        };
    }, import("@tamagui/core").GenericShorthands, {
        [key: string]: {
            [key: string]: string | number;
        };
    }, {
        [key: string]: string | any[] | {
            [key: string]: any;
        };
    }, import("@tamagui/core").GenericFonts> | null;
    components: {
        components: Components;
    };
    themes: {
        themeId: string;
        column: number;
        row: number;
        isPinned: boolean;
        focusedKey: string;
        themes: Record<string, ThemeParsed>;
        themeVals: ThemeVal[];
        theme(): ThemeParsed;
        themesList(): ThemeParsed[];
        uniqueThemeIDsByCategory(): Record<ThemeCategory, Set<string>>;
        themeCombos(prefix?: string): ThemeParsed[];
        pseudo(): string;
        focusedVal(): ThemeVal | undefined;
        pseudoThemeVals(): ThemeVal[];
        componentName(): string;
        themeColor(): string | undefined;
    };
    colors: {
        paletteId: string;
        scaleId: string;
        curveId: string;
        selectedIndex: string;
        palettes: Record<string, Palette>;
        past: Record<string, Palette>[];
        future: Record<string, Palette>[];
        palette(): Palette;
        scale(name?: string): import("./types").Scale;
        curve(id?: string): import("./types").Curve;
        focusedHex(): string | undefined;
    };
};
export declare type GlobalStateType = typeof GlobalState;
export declare function setGlobalState(cb: (next: GlobalStateType) => void): void;
export {};
//# sourceMappingURL=useGlobalState.d.ts.map