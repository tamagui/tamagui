import React from 'react';
import { FontLanguages, FontTokens } from '../types';
declare type FontFamilies = FontTokens extends `$${infer Token}` ? Token : never;
export declare type LanguageContextType = Partial<{
    [key in FontFamilies]: FontLanguages | 'default';
}>;
export declare type FontLanguageProps = LanguageContextType & {
    children?: React.ReactNode;
};
export {};
//# sourceMappingURL=FontLanguage.types.d.ts.map