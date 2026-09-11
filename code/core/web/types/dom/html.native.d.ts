import type { StrictDOMAnchorProps, StrictDOMButtonProps, StrictDOMImageProps, StrictDOMInputProps, StrictDOMLabelProps, StrictDOMListItemProps, StrictDOMProps, StrictDOMTextAreaProps, StrictDOMVoidProps } from '@tamagui/dom';
import type { StackNonStyleProps, StackStyleBase, TamaguiElement, TamaguiTextElement, TextNonStyleProps, TextProps, TextStylePropsBase } from '../types';
import type { ViewProps } from '../views/View';
/** regular Tamagui non-style props win when the strict DOM contract names the same prop */
type MergeHTMLProps<DOMProps, TamaguiProps, TamaguiNonStyleProps> = Omit<DOMProps, keyof TamaguiNonStyleProps> & TamaguiProps;
export declare const html: {
    a: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMAnchorProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMAnchorProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    article: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    aside: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    b: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    bdi: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    bdo: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    blockquote: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    br: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMVoidProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMVoidProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    button: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMButtonProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMButtonProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    code: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    del: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    div: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    em: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    fieldset: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    footer: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    form: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    h1: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    h2: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    h3: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    h4: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    h5: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    h6: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    header: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    hr: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMVoidProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMVoidProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    i: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    img: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMImageProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMImageProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    input: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMInputProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMInputProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    ins: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    kbd: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    label: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMLabelProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMLabelProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    li: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMListItemProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMListItemProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    main: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    mark: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    nav: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    ol: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    optgroup: {
        (): never;
        displayName?: string;
    };
    option: {
        (): never;
        displayName?: string;
    };
    p: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    pre: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    s: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    section: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
    select: {
        (): never;
        displayName?: string;
    };
    span: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    strong: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    sub: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    sup: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    textarea: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMTextAreaProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMTextAreaProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    u: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, TextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TextStylePropsBase, {}>;
    ul: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, ViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, StackStyleBase, {}>;
};
export {};
//# sourceMappingURL=html.native.d.ts.map