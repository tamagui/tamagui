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
};
export declare class ThemeManager {
    #private;
    props?: ThemeProps | undefined;
    ref?: any;
    keys: Map<string, Set<string> | undefined>;
    themeListeners: Set<ThemeListener>;
    ogParentManager: ThemeManager | null;
    parentManager: ThemeManager | null;
    state: ThemeManagerState;
    constructor(parentManagerIn?: ThemeManager | 'root' | null | undefined, props?: ThemeProps | undefined, ref?: any);
    stateKey: string;
    updateState(props?: ThemeProps & {
        forceTheme?: ThemeParsed;
    }, forceUpdate?: boolean, notify?: boolean): boolean;
    getStateIfChanged(props?: ThemeProps | undefined): ThemeManagerState | null;
    getStateKey(props?: ThemeProps | undefined): string;
    get allKeys(): Set<string>;
    get parentName(): string | null;
    get fullName(): string;
    getValue(key: string): import("..").Variable<any> | undefined;
    isTracking(uuid: string): boolean;
    track(uuid: any, keys: Set<string>): void;
    notify(): void;
    onChangeTheme(cb: ThemeListener): () => void;
}
export declare const ThemeManagerContext: import("react").Context<ThemeManager | null>;
export {};
//# sourceMappingURL=ThemeManager.d.ts.map