import type { StrictDOMAnchorProps, StrictDOMButtonProps, StrictDOMImageProps, StrictDOMInputProps, StrictDOMLabelProps, StrictDOMListItemProps, StrictDOMProps, StrictDOMTextAreaProps, StrictDOMVoidProps } from '@tamagui/dom';
import type { StackNonStyleProps, StackStyleBase, TamaguiElement, TamaguiTextElement, TextNonStyleProps, TextProps, TextStylePropsBase } from '../types.js';
import type { ViewProps } from '../views/View.js';
/** regular Tamagui non-style props win when the strict DOM contract names the same prop */
type MergeHTMLProps<DOMProps, TamaguiProps, TamaguiNonStyleProps> = Omit<DOMProps, keyof TamaguiNonStyleProps> & TamaguiProps;
export declare const html: {
    a: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMAnchorProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMAnchorProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    article: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    aside: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    b: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    bdi: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    bdo: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    blockquote: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    br: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMVoidProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMVoidProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    button: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMButtonProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMButtonProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    code: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    del: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    div: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    em: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    fieldset: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    footer: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    form: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    h1: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    h2: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    h3: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    h4: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    h5: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    h6: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    header: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    hr: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMVoidProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMVoidProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    i: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    img: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMImageProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMImageProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    input: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMInputProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMInputProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    ins: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    kbd: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    label: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMLabelProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMLabelProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    li: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMListItemProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMListItemProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    main: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    mark: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    nav: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    ol: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    optgroup: {
        (): never;
        displayName?: string;
    };
    option: {
        (): never;
        displayName?: string;
    };
    p: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    pre: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    s: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    section: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    select: {
        (): never;
        displayName?: string;
    };
    span: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    strong: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    sub: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    sup: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    textarea: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMTextAreaProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMTextAreaProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    u: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    ul: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
};
export {};
//# sourceMappingURL=html.native.d.ts.map