import { ReactElement } from 'react';
import { ThemeName } from '../types';
export declare type ThemeableProps = {
    theme?: ThemeName | string | null;
    themeInverse?: boolean;
};
export declare const themeable: ThemeableHOC;
export interface ThemeableHOC {
    <R extends ReactElement<any, any> | null, P extends ThemeableProps = {}>(component: (props: P) => R): (props: P) => R;
}
//# sourceMappingURL=themeable.d.ts.map