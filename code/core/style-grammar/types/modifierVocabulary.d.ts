import type { GrammarConfigView } from "./candidate";
type KebabCase<Name extends string> = Name extends `${infer First}${infer Rest}` ? First extends Lowercase<First> ? `${First}${KebabCase<Rest>}` : `-${Lowercase<First>}${KebabCase<Rest>}` : Name;
declare const v6RenamedThemeNames: readonly ["accentBackground", "accentColor", "colorHover", "colorPress", "colorFocus", "backgroundHover", "backgroundPress", "backgroundFocus", "borderColor", "borderColorHover", "borderColorFocus", "borderColorPress", "outlineColor", "placeholderColor", "colorTransparent", "shadowColor"];
export declare const v6ThemeNameReplacements: { readonly [Name in (typeof v6RenamedThemeNames)[number]] : KebabCase<Name> };
export declare const v6RemovedThemeNames: readonly ["backgroundActive"];
export declare const configRevisionSymbol: unique symbol;
export declare const modifierKindState = 1;
export declare const modifierKindMedia = 2;
export declare const modifierKindPlatform = 3;
export declare const modifierKindTheme = 4;
export type CompiledModifierKind = 1 | 2 | 3 | 4;
export type CompiledModifierVocabulary = Readonly<Record<string, number>>;
export declare const modifierRefusalReservedContainerPrefix = 1;
export declare const modifierRefusalReservedGroupPrefix = 2;
export declare const modifierRefusalKindCollision = 3;
export type ModifierVocabularyRefusalCode = 1 | 2 | 3;
export type ModifierVocabularyRefusalHandler = (code: ModifierVocabularyRefusalCode, name: string, kind: CompiledModifierKind, existing: CompiledModifierKind | 0) => void;
type Names = readonly string[] | ReadonlySet<string> | Readonly<Record<string, unknown>>;
export declare function forEachModifierName(source: Names | undefined, visit: (name: string, rank: number) => void): void;
export declare function isRootThemeName(name: string): boolean;
export declare function compileModifierVocabulary(view: GrammarConfigView, onRefusal?: ModifierVocabularyRefusalHandler, onRegistered?: (name: string) => void): CompiledModifierVocabulary;
export {};

//# sourceMappingURL=modifierVocabulary.d.ts.map