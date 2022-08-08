import { ThemeObject } from './types';
export declare function addTheme({ name: themeName, theme: themeIn, insertCSS, update, }: {
    name: string;
    theme: ThemeObject;
    insertCSS?: boolean;
    update?: boolean;
}): {
    theme: any;
    cssRules: string[];
};
//# sourceMappingURL=addTheme.d.ts.map