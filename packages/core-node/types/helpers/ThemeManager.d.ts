import { ThemeParsed, ThemeProps } from '../types';
declare type ThemeListener = (name: string | null, themeManager: ThemeManager) => void;
export declare type SetActiveThemeProps = {
    className?: string;
    parentManager?: ThemeManager | null;
    name?: string | null;
    theme?: any;
    reset?: boolean;
};
export declare type ThemeManagerState = {
    name: string;
    theme?: ThemeParsed | null;
    className?: string;
    parentName?: string;
};
export declare function hasNoThemeUpdatingProps(props: ThemeProps): boolean;
export declare class ThemeManager {
    #private;
    props: ThemeProps;
    themeListeners: Set<ThemeListener>;
    parentManager: ThemeManager | null;
    state: ThemeManagerState;
    constructor(props?: ThemeProps, parentManager?: ThemeManager | 'root' | null | undefined);
    updateState(props?: ThemeProps & {
        forceTheme?: ThemeParsed;
    }, notify?: boolean): ThemeManagerState | undefined;
    getStateIfChanged(props?: ThemeProps, state?: ThemeManagerState, parentManager?: ThemeManager | null): ThemeManagerState | null;
    getState(props?: ThemeProps): ThemeManagerState | null;
    get allKeys(): Set<string>;
    getValue(key: string, state?: ThemeManagerState): import("..").Variable<any> | undefined;
    notify(): void;
    onChangeTheme(cb: ThemeListener): () => void;
}
export {};
//# sourceMappingURL=ThemeManager.d.ts.map