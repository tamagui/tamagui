import { ReactElement } from 'react';
export declare type ThemeableProps = {
    theme?: string | null;
    themeInverse?: boolean;
};
export declare const themeable: ThemeableHOC;
export interface ThemeableHOC {
    <R extends ReactElement<any, any> | null, P extends ThemeableProps = {}>(component: (props: P) => R): (props: P) => R;
}
//# sourceMappingURL=themeable.d.ts.map