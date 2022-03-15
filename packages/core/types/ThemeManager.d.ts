/// <reference types="react" />
declare type ThemeListener = (name: string | null, themeManager: ThemeManager) => void;
export declare type SetActiveThemeProps = {
    parentName?: string | null;
    name: string | null;
    theme?: any;
};
export declare class ThemeManager {
    name: string | null;
    parentName: string | null;
    keys: Map<any, Set<string>>;
    listeners: Map<any, Function>;
    themeListeners: Set<ThemeListener>;
    theme: null;
    setActiveTheme({ name, theme, parentName }: SetActiveThemeProps): void;
    track(uuid: any, keys: Set<string>): void;
    update(): void;
    onChangeTheme(cb: ThemeListener): () => void;
    onUpdate(uuid: any, cb: Function): () => void;
}
export declare const ThemeManagerContext: import("react").Context<ThemeManager>;
export {};
//# sourceMappingURL=ThemeManager.d.ts.map