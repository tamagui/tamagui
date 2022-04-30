import { ThemeName } from '../types';
export declare type ThemeableProps = {
    theme?: ThemeName | string | null;
    themeInverse?: boolean;
};
export declare function themeable<Component extends (props: any) => any>(component: Component, opts?: {
    componentName?: string;
}): Component extends (props: infer P) => infer R ? (props: Omit<P, "theme" | "themeInverse"> & {
    theme?: ThemeName | null | undefined;
    themeInverse?: boolean | undefined;
}) => R : unknown;
//# sourceMappingURL=themeable.d.ts.map