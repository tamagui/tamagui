/// <reference types="react" />
declare type ThemeListener = (name: string | null, themeManager: ThemeManager) => void;
export declare type SetActiveThemeProps = {
    parentManager?: ThemeManager | null;
    name: string | null;
    theme?: any;
};
export declare class ThemeManager {
    name: string | null;
    keys: Map<any, Set<string>>;
    listeners: Map<any, Function>;
    themeListeners: Set<ThemeListener>;
    parentManager: ThemeManager | null;
    theme: null;
    get parentName(): string | null;
    update({ name, theme, parentManager }: SetActiveThemeProps): void;
    track(uuid: any, keys: Set<string>): void;
    notifyListeners(): void;
    onChangeTheme(cb: ThemeListener): () => void;
    onUpdate(uuid: any, cb: Function): () => void;
}
export declare const ThemeManagerContext: import("react").Context<ThemeManager>;
export {};
//# sourceMappingURL=ThemeManager.d.ts.map