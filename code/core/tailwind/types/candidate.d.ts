import { type FrontendClassPlan, type StyleFrontendConfig } from '@tamagui/core/internal-runtime';
import { type GrammarConfigView } from '@tamagui/style-grammar/runtime';
export declare function getStyleGrammarConfig(config: StyleFrontendConfig): GrammarConfigView;
export declare function isTokenValueProp(prop: string): boolean;
export declare function getTailwindClassPlan(candidate: string, config: StyleFrontendConfig): FrontendClassPlan;
export declare function resolveTailwindClassName(className: string, config: StyleFrontendConfig): Record<string, any>;
/**
 * Append a contribution at the end of the forward pass.
 *
 * Plain re-assignment keeps a key's FIRST insertion position, so a restated
 * shorthand would stay behind a longhand authored between the two occurrences:
 * `p-4 px-2 p-6` has to resolve `paddingLeft` from `p-6`, and `pt-2 p-4 pt-8` has to
 * resolve `paddingTop` from `pt-8`. Deleting the key first moves it to the end,
 * which is the authored order the shared per-longhand merge reads.
 */
export declare function setInAuthoredOrder(target: Record<string, any>, key: string, value: any): void;
/**
 * Tokenize a className into ordinary props and internal value-program contributions,
 * once per class per config.
 * User-defined tokens drive resolution; Tailwind's color/spacing scales are never
 * hardcoded. Classes the grammar does not claim stay in `className` verbatim, in
 * author order, so official Tailwind CSS still applies them on web.
 */
export declare function preprocessTailwindClassName(props: Record<string, any>, config: StyleFrontendConfig, preservePassthroughPosition?: boolean): Record<string, any>;
//# sourceMappingURL=candidate.d.ts.map