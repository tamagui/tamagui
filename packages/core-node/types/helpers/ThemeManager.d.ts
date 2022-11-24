/// <reference types="react" />
import { ThemeParsed, ThemeProps } from '../types';
declare type ThemeListener = (name: string | null, themeManager: ThemeManager) => void;
export declare type SetActiveThemeProps = {
    className?: string;
    parentManager?: ThemeManager | null;
    name?: string | null;
    theme?: any;
    reset?: boolean;
};
declare type ThemeManagerState = {
    name: string;
    theme?: ThemeParsed | null;
    className?: string;
    parentName?: string;
};
export declare class ThemeManager {
    #private;
    props: ThemeProps;
    ref?: any;
    themeListeners: Set<ThemeListener>;
    parentManager: ThemeManager | null;
    state: ThemeManagerState;
    constructor(props?: ThemeProps, parentManager?: ThemeManager | 'root' | null | undefined, ref?: any);
    updateState(props?: ThemeProps & {
        forceTheme?: ThemeParsed;
    }, notify?: boolean): ThemeManagerState | undefined;
    getStateIfChanged(props?: ThemeProps, state?: ThemeManagerState): ThemeManagerState | null;
    getState(props?: ThemeProps): ThemeManagerState | null;
    get allKeys(): Set<string>;
    getValue(key: string, state?: ThemeManagerState): import("..").Variable<any> | undefined;
    notify(): void;
    onChangeTheme(cb: ThemeListener): () => void;
}
export declare const ThemeManagerContext: import("react").Context<ThemeManager | null>;
export {};
//# sourceMappingURL=ThemeManager.d.ts.map