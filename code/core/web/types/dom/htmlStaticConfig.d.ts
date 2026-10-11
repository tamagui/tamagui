import type { StaticConfig } from '../types';
/**
 * The static configs for the regular-Tamagui `html` namespace (see the
 * generated `html.tsx`, which spreads these instead of `viewStaticConfig` /
 * `textStaticConfig`).
 *
 * html.* hosts used to spread those two configs, so on web they carried
 * `is_View` / `is_Text` and the design-system rules behind those classes
 * (`display: flex` / `display: inline`) beat the browser stylesheet:
 * `html.p`, `html.h1`..`html.h6` and `html.pre` rendered inline. These configs
 * carry `isDOM` instead, which `getSplitStyles` maps to the `is_DOM` host
 * class, whose `:where()` reset (see `htmlReset.ts`) never sets `display` and
 * leaves it to the browser.
 *
 * The text-backed config keeps `isText` and the text variants: that flag also
 * drives font classes, the `inText` ancestor channel and the dev-only raw
 * string warning, all of which still apply to real text elements. Only the
 * emitted host class changed.
 */
export declare const htmlStaticConfig: StaticConfig;
export declare const htmlTextStaticConfig: StaticConfig;
//# sourceMappingURL=htmlStaticConfig.d.ts.map