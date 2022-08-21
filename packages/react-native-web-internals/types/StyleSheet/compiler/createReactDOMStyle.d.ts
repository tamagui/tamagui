declare type Style = {
    [K in string]: any;
};
export declare const createTransformValue: (style: Style) => string;
declare const createReactDOMStyle: (style: Style, isInline?: boolean) => Style;
export default createReactDOMStyle;
//# sourceMappingURL=createReactDOMStyle.d.ts.map