import type { TamaguiInternalConfig, ThemeParsed, Variable } from '../types';
import type { ConfigRevisionState } from './grammarConfig';
export declare const themeUpdateStateKey = "_tmgInlineLayer";
export type ThemeUpdateValues = {
    values?: Record<string, any>;
    themes?: Record<string, Record<string, any> | undefined>;
};
export type ThemeUpdateLayerInfo = {
    key: string;
    generation: ConfigRevisionState;
    overridden: Set<string>;
    pairs: Record<string, {
        light: string | number;
        dark: string | number;
    }>;
};
export type ThemeUpdateState = {
    key: string;
    className: string | undefined;
    values: ThemeUpdateValues;
    getTheme(parentTheme: Record<string, Variable>, themeName: string | undefined, config: TamaguiInternalConfig): ThemeParsed;
};
//# sourceMappingURL=themeUpdateState.d.ts.map