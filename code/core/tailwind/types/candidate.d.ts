import { type FrontendClassPlan, type FrontendClassSink, type StyleFrontendConfig } from '@tamagui/core/internal-runtime';
import { type GrammarConfigView } from '@tamagui/style-grammar/tooling/candidate';
export declare function getStyleGrammarConfig(config: StyleFrontendConfig): GrammarConfigView;
export declare function isTokenValueProp(prop: string): boolean;
export declare function getTailwindClassPlan(candidate: string, config: StyleFrontendConfig): FrontendClassPlan;
export declare function resolveTailwindCandidate(candidate: string, config: StyleFrontendConfig, sink: FrontendClassSink): boolean | null;
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
//# sourceMappingURL=candidate.d.ts.map