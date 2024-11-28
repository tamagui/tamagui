import type { ColorScheme, ThemeParsed, ThemeProps } from '../types';
type ThemeListener = (name: string | null, themeManager: ThemeManager, forced: boolean | 'self') => void;
export type SetActiveThemeProps = {
    className?: string;
    parentManager?: ThemeManager | null;
    name?: string | null;
    theme?: any;
    reset?: boolean;
};
export type ThemeManagerState = {
    name: string;
    parentName?: string;
    theme?: ThemeParsed | null;
    isComponent?: boolean;
    isSchemeFixed?: boolean;
    className?: string;
    scheme?: ColorScheme;
};
export declare function getHasThemeUpdatingProps(props: ThemeProps): boolean;
export declare class ThemeManager {
    props: ThemeProps;
    id: number;
    themeListeners: Set<ThemeListener>;
    parentManager: ThemeManager | null;
    state: ThemeManagerState;
    constructor(props?: ThemeProps, parentManager?: ThemeManager | 'root' | null | undefined);
    updateStateFromProps(props?: ThemeProps & {
        forceTheme?: ThemeParsed;
    }, shouldNotify?: boolean): ThemeManagerState | undefined;
    getParents(): ThemeManager[];
    updateState(nextState: ThemeManagerState, shouldNotify?: boolean): void;
    getStateIfChanged(props?: ThemeProps, state?: ThemeManagerState | null, parentManager?: ThemeManager | null): ThemeManagerState | null | undefined;
    getStateShouldChange(nextState: ThemeManagerState | null, state?: ThemeManagerState | null): boolean;
    getState(props?: ThemeProps, parentManager?: ThemeManager | null): ThemeManagerState | null;
    _allKeys: Set<string> | null;
    get allKeys(): Set<string>;
    notify(forced?: boolean): void;
    _selfListener?: ThemeListener;
    selfUpdate(): void;
    onChangeTheme(cb: ThemeListener, debugId?: number | true): () => void;
}
type MaybeThemeManager = ThemeManager | undefined;
export declare function getManagers(themeManager?: ThemeManager | null): readonly [MaybeThemeManager[], MaybeThemeManager[]];
export {};
//# sourceMappingURL=ThemeManager.d.ts.map