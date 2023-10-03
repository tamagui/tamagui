import { StaticConfig, ThemeableProps } from '../types';
export declare function themeable<Component extends (props: any) => any>(component: Component, staticConfig?: Partial<StaticConfig>): Component extends (props: infer P) => infer R ? (props: Omit<P, "theme" | "themeInverse"> & ThemeableProps) => R : unknown;
//# sourceMappingURL=themeable.d.ts.map