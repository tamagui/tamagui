import { type FrontendClassPlanEntry, type FrontendClassSink } from '@tamagui/core/internal-runtime';
import { type GrammarConfigView } from '@tamagui/style-grammar/tooling/candidate';
/**
 * Claim a from/via/to, bg-linear-to-*, filter, ring, inset, or drop-shadow candidate.
 * Emits variant props to the sink so `composedResolver` can compose them.
 */
export declare function tryCompose(candidate: string, config: GrammarConfigView, sink: FrontendClassSink): boolean | null | undefined;
/** Record transform properties as variant props for composedResolver. */
export declare function noteTailwindTransform(sink: FrontendClassSink, entry: FrontendClassPlanEntry): boolean;
/** Record a claimed boxShadow so composedResolver can stack ring + shadow. */
export declare function noteBoxShadow(sink: FrontendClassSink, value: unknown, modifiers?: readonly string[]): boolean;
//# sourceMappingURL=compose.d.ts.map