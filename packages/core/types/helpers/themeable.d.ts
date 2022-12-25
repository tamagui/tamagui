import { ThemeName } from '../types';
export interface ThemeableProps {
    theme?: ThemeName | null;
    themeInverse?: boolean;
    themeReset?: boolean;
    componentName?: string;
    debug?: boolean | 'verbose';
}
export declare function themeable<Component extends (props: any) => any>(component: Component, opts?: {
    componentName?: string;
}): Component extends (props: infer P) => infer R ? (props: Omit<P, "theme" | "themeInverse"> & ThemeableProps) => R : unknown;
//# sourceMappingURL=themeable.d.ts.map