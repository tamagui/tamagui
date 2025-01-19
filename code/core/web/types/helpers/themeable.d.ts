import type { StaticConfig, ThemeableProps } from '../types';
export declare function themeable<ComponentType extends (props: any) => any>(Component: ComponentType, staticConfig?: Partial<StaticConfig>): ComponentType extends (props: infer P) => infer R ? (props: Omit<P, "theme" | "themeInverse"> & ThemeableProps) => R : unknown;
//# sourceMappingURL=themeable.d.ts.map