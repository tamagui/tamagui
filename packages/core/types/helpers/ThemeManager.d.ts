/// <reference types="react" />
import { ThemeParsed, Themes } from '../types';
declare type ThemeListener = (name: string | null, themeManager: ThemeManager) => void;
export declare type SetActiveThemeProps = {
    className?: string;
    parentManager?: ThemeManager | null;
    name?: string | null;
    theme?: any;
};
export declare type GetNextThemeProps = {
    themes?: Themes;
    name?: string | null;
    componentName?: string | null;
    reset?: boolean;
};
export declare class ThemeManager {
    name: string;
    className: string;
    theme: ThemeParsed | null;
    parentManager: ThemeManager | null;
    reset: boolean;
    keys: Map<any, Set<string>>;
    listeners: Map<any, Function>;
    themeListeners: Set<ThemeListener>;
    constructor(name?: string, className?: string, theme?: ThemeParsed | null, parentManager?: ThemeManager | null, reset?: boolean);
    get didChangeTheme(): boolean | null;
    get parentName(): string | null;
    get fullName(): string;
    getValue(key: string): import("..").Variable<import("..").VariableValue> | undefined;
    isTracking(uuid: Object): boolean;
    update({ name, theme, className }?: SetActiveThemeProps, force?: boolean): boolean;
    getNextTheme(props?: GetNextThemeProps, debug?: any): {
        name: string;
        theme: ThemeParsed | null;
        className: string | undefined;
    };
    getClassName(name: string): string;
    track(uuid: any, keys: Set<string>): void;
    notifyListeners(): void;
    onChangeTheme(cb: ThemeListener): () => void;
    onUpdate(uuid: any, cb: Function): () => void;
}
export declare const ThemeManagerContext: import("react").Context<ThemeManager | null>;
export declare const emptyManager: ThemeManager;
export {};
//# sourceMappingURL=ThemeManager.d.ts.map