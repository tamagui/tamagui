import { type StyleFrontend, type StyleFrontendConfig } from '@tamagui/core/internal-runtime';
/**
 * The Tailwind frontend descriptor.
 *
 * `preprocessProps` is the single Tailwind pass: it tokenizes `className` once and
 * emits ordinary props plus internal program contributions in authored order.
 * Everything after this point — value programs,
 * per-longhand forward merging, web lowering, native evaluation — is shared.
 *
 * Owned candidates are never string-merged: each contributes at its authored
 * position and the shared resolver's last-contribution-wins rule decides. That is
 * why `tailwind-merge` is not a dependency here.
 */
/**
 * Parse a static class string (a `styled()` base, a string variant value, a string
 * compound-variant style) into ordinary style props.
 */
export declare function parseStaticStyle(input: string, config: StyleFrontendConfig): Record<string, any>;
export declare const tailwindStyleFrontend: StyleFrontend;
//# sourceMappingURL=frontend.d.ts.map