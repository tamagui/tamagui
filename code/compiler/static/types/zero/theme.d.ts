import { type AstNode, type SourceEdit, type ZeroViolation } from '@tamagui/compiler-core';
import { type TamaguiInternalConfig } from '@tamagui/web';
import type { IslandThemeBridgeLayer } from './islands';
/**
 * Static `<Theme>` lowering.
 *
 * A `<Theme>` node is markup plus classes and nothing else once its name and its
 * direct theme-key values are known at build time. This resolves the name the
 * way the runtime resolves it, emits the same span the runtime emits, and turns
 * every value the parser cannot use into a violation rather than the warn-and-
 * drop the render path does.
 */
/**
 * One branch of a `<Theme name>`. `test` is the source text of the condition
 * that selects it, or null for the unconditional branch. A literal name is one
 * option with a null test.
 */
export interface ThemeNameOption {
    test: string | null;
    name: string | undefined;
}
export interface StaticThemeNode {
    element: AstNode;
    opening: AstNode;
    closing: AstNode | null;
    options: ThemeNameOption[];
    reset: boolean;
    contain: boolean;
    /** The compiled inline-value layer, when the node carries theme-key props. */
    layer: IslandThemeBridgeLayer | null;
}
/**
 * Folds one value per branch into a single expression. The branches are the
 * product in authored order and the last one is exhaustive, so it is the
 * ternary's else. Branches that agree collapse to a literal, which is what makes
 * an ordinary literal `<Theme name="dark">` emit a plain string.
 */
export declare function foldBranches(branches: {
    test: string | null;
    value: string;
}[]): string;
/** One resolved theme name, with the guard that selects it. */
export interface ThemeBranch {
    test: string | null;
    name: string;
    isNew: boolean;
}
/**
 * Every theme name an element's `<Theme>` ancestry can resolve to.
 *
 * The chain is root-most first and includes the element's own node when it has
 * one. Each node contributes its branches; the result is their product, walked
 * in authored order so a nested `<Theme name="blue">` resolves against whatever
 * its parent resolved to, exactly as `resolveThemeName` does at runtime.
 */
export declare function resolveThemeChain(chain: readonly StaticThemeNode[], rootThemeName: string, config: TamaguiInternalConfig): ThemeBranch[];
export interface StaticThemeReadResult {
    node: StaticThemeNode | null;
    violations: ZeroViolation[];
    /** The CSS rules the node's inline values need, keyed by their class name. */
    css: Map<string, string>;
}
/**
 * Reads one `<Theme>` element into its static description.
 *
 * Prop classification is `reservedThemeProps`, the same table the runtime reads,
 * so a name that becomes reserved later cannot mean a theme key here and a
 * reserved prop there.
 */
export declare function readStaticTheme(element: AstNode, id: string, source: string, config: TamaguiInternalConfig): StaticThemeReadResult;
/**
 * The span a static `<Theme>` lowers to.
 *
 * Same classes and same inline style the runtime span carries, because both are
 * read by the same CSS: the theme classes select the named theme's variables,
 * the inline-value class carries the direct props at the anchored specificity
 * that lets it beat them, and `display: contents` keeps the span out of layout.
 */
export declare function lowerStaticTheme(node: StaticThemeNode, chain: readonly StaticThemeNode[], rootThemeName: string, config: TamaguiInternalConfig, id: string): {
    edits: SourceEdit[];
    violations: ZeroViolation[];
};
//# sourceMappingURL=theme.d.ts.map