import type { StaticConfig, TamaguiInternalConfig } from '../types';
export type StyleStaticConfig = {
    baseStyle: Record<string, any> | undefined;
    baseVariantProps: Record<string, any> | undefined;
    defaultProps: Record<string, any> | undefined;
    styledContextKeys: Set<string> | null;
    variants: StaticConfig['variants'];
    passthroughClassName: string | undefined;
};
/**
 * styled() takes styles and props in one options object. The styles belong to the
 * base layer the style pass writes before any prop, so call-site props and
 * variants always land on top of them; everything else stays a prop.
 *
 * Split lazily rather than in styled(), because classifying a key needs
 * `conf.shorthands` and styled() runs at module scope before createTamagui.
 */
export declare function getStyleStaticConfig(staticConfig: StaticConfig, conf: TamaguiInternalConfig): StyleStaticConfig;
//# sourceMappingURL=styleStaticConfig.d.ts.map