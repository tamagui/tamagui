import { ThemeParsed, ThemeProps } from '../types';
type ThemeListener = (name: string | null, themeManager: ThemeManager, forced: boolean) => void;
export type SetActiveThemeProps = {
    className?: string;
    parentManager?: ThemeManager | null;
    name?: string | null;
    theme?: any;
    reset?: boolean;
};
export type ThemeManagerState = {
    name: string;
    theme?: ThemeParsed | null;
    className?: string;
    parentName?: string;
    componentName?: string;
    inverse?: boolean;
};
export declare function getHasThemeUpdatingProps(props: ThemeProps): string | boolean | undefined;
export declare class ThemeManager {
    props: ThemeProps;
    id: number;
    isComponent: boolean;
    themeListeners: Set<ThemeListener>;
    parentManager: ThemeManager | null;
    state: ThemeManagerState;
    scheme: 'light' | 'dark' | null;
    constructor(props?: ThemeProps, parentManagerIn?: ThemeManager | 'root' | null | undefined);
    updateStateFromProps(props?: ThemeProps & {
        forceTheme?: ThemeParsed;
    }, shouldNotify?: boolean): true | ThemeManagerState | undefined;
    updateState(nextState: ThemeManagerState, shouldNotify?: boolean): void;
    getStateIfChanged(props?: ThemeProps, state?: ThemeManagerState | null, parentManager?: ThemeManager | null): ThemeManagerState | null | undefined;
    getStateShouldChange(nextState: ThemeManagerState | null, state?: ThemeManagerState | null): boolean;
    getState(props?: ThemeProps, parentManager?: ThemeManager | null): ThemeManagerState | null;
    _allKeys: Set<string> | null;
    get allKeys(): Set<string>;
    notify(forced?: boolean): void;
    onChangeTheme(cb: ThemeListener, debugId?: number): () => void;
}
export declare function getNonComponentParentManager(themeManager?: ThemeManager | null): readonly [ThemeManager | null, string[]];
export {};
//# sourceMappingURL=ThemeManager.d.ts.map