import { type FrontendClassPlanEntry, type FrontendClassSink } from '@tamagui/core/internal-runtime';
import { type GrammarConfigView } from '@tamagui/style-grammar/tooling/candidate';
/** Re-emit Tailwind's CSS-variable transform family in its fixed matrix order. */
export declare function noteTailwindTransform(sink: FrontendClassSink, entry: FrontendClassPlanEntry): boolean;
/**
 * Claim a from/via/to, bg-linear-to-*, or ring-* candidate. `undefined` means
 * this is not a composer (the existing class plan runs). A boolean is the same
 * preserveRaw signal as resolveClassName.
 */
export declare function tryCompose(candidate: string, config: GrammarConfigView, sink: FrontendClassSink): boolean | null | undefined;
/** Record a claimed boxShadow so a later ring can stack instead of clobbering. */
export declare function noteBoxShadow(sink: FrontendClassSink, value: unknown, modifiers?: readonly string[]): boolean;
//# sourceMappingURL=compose.d.ts.map