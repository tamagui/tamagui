/// <reference types="react" />
import { ThemeObject, Themes } from './types';
declare type ThemeListener = (name: string | null, themeManager: ThemeManager) => void;
export declare type SetActiveThemeProps = {
    className?: string;
    parentManager?: ThemeManager | null;
    name?: string | null;
    theme?: any;
};
export declare class ThemeManager {
    #private;
    name: string | null;
    theme: ThemeObject | null;
    parentManager: ThemeManager | null;
    keys: Map<any, Set<string>>;
    listeners: Map<any, Function>;
    themeListeners: Set<ThemeListener>;
    className: string | null;
    constructor(name?: string | null, theme?: ThemeObject | null, parentManager?: ThemeManager | null);
    get parentName(): string | null;
    get fullName(): string;
    getValue(key: string): import("./types").VariableVal | undefined;
    update({ name, theme, className }?: SetActiveThemeProps): boolean;
    getNextTheme(opts?: {
        themes?: Themes;
        name?: string | null;
        componentName?: string | null;
    }, props?: any): {
        name: string;
        theme: Partial<import("./types").TamaguiBaseTheme> & {
            [key: string]: import("./types").VariableVal;
        };
        className: string;
    } | {
        name: string | null;
        theme: (Partial<import("./types").TamaguiBaseTheme> & {
            [key: string]: import("./types").VariableVal;
        }) | null;
        className?: undefined;
    };
    track(uuid: any, keys: Set<string>): void;
    notifyListeners(): void;
    onChangeTheme(cb: ThemeListener): () => void;
    onUpdate(uuid: any, cb: Function): () => void;
}
export declare const ThemeManagerContext: import("react").Context<ThemeManager | null>;
export declare const emptyManager: ThemeManager;
export {};
//# sourceMappingURL=ThemeManager.d.ts.map