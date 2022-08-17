import { ReactNode } from 'react';
import type { HelmetData as HeadData } from 'react-helmet-async';
import { ResolvedUnagiConfig } from '../../types.js';
declare type HtmlOptions = {
    children: ReactNode;
    template: string;
    htmlAttrs?: Record<string, string>;
    bodyAttrs?: Record<string, string>;
    unagiConfig: ResolvedUnagiConfig;
};
export declare function Html({ children, template, htmlAttrs, bodyAttrs, unagiConfig }: HtmlOptions): JSX.Element;
export declare function applyHtmlHead(html: string, head: HeadData, template: string): string;
export {};
//# sourceMappingURL=Html.d.ts.map