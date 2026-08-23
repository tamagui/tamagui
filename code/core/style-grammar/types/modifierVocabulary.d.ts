import type { GrammarConfigView } from "./candidate";
import type { ModifierKind } from "./valueTypes";
export declare const configRevisionSymbol: unique symbol;
export declare const modifierKindState = 1;
export declare const modifierKindMedia = 2;
export declare const modifierKindPlatform = 3;
export declare const modifierKindTheme = 4;
export type CompiledModifierKind = 1 | 2 | 3 | 4;
export type CompiledModifierVocabulary = Readonly<Record<string, CompiledModifierKind>>;
type Names = readonly string[] | ReadonlySet<string> | Readonly<Record<string, unknown>>;
export declare function forEachModifierName(source: Names | undefined, visit: (name: string) => void): void;
export declare function isRootThemeName(name: string): boolean;
export declare function modifierKindFromCode(code: CompiledModifierKind | undefined): ModifierKind | undefined;
export declare function compileModifierVocabulary(view: GrammarConfigView, diagnostics?: string[], completionNames?: string[]): CompiledModifierVocabulary;
export {};

//# sourceMappingURL=modifierVocabulary.d.ts.map