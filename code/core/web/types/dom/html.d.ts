import type { StrictDOMAnchorProps, StrictDOMButtonProps, StrictDOMImageProps, StrictDOMInputProps, StrictDOMLabelProps, StrictDOMListItemProps, StrictDOMOptionGroupProps, StrictDOMOptionProps, StrictDOMProps, StrictDOMSelectProps, StrictDOMTextAreaProps, StrictDOMVoidProps } from '@tamagui/dom';
import type { StackNonStyleProps, TamaguiElement, TamaguiTextElement, TextNonStyleProps, WithThemeAndShorthands } from '../types.js';
import type { TamaguiStyleProps } from './styleTypes.js';
/** regular Tamagui non-style props win when the strict DOM contract names the same prop */
type MergeHTMLProps<DOMProps, TamaguiProps, TamaguiNonStyleProps> = Omit<DOMProps, keyof TamaguiNonStyleProps> & TamaguiProps;
/**
 * The html.* style surface: the web contract from `./styleTypes` (not the
 * react-native-typed `StackStyleBase` / `TextStylePropsBase`) with theme
 * values, shorthands and clause forms, over the regular Tamagui non-style
 * props per backing kind.
 */
type HtmlStyle = WithThemeAndShorthands<TamaguiStyleProps>;
type HtmlTextProps = TextNonStyleProps & HtmlStyle;
type HtmlViewProps = StackNonStyleProps & HtmlStyle;
export declare const html: {
    a: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMAnchorProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMAnchorProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    article: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    aside: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    b: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    bdi: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    bdo: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    blockquote: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    br: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMVoidProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMVoidProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    button: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMButtonProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMButtonProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    code: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    del: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    div: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    em: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    fieldset: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    footer: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    form: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    h1: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    h2: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    h3: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    h4: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    h5: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    h6: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    header: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    hr: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMVoidProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMVoidProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    i: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    img: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMImageProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMImageProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    input: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMInputProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMInputProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    ins: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    kbd: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    label: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMLabelProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMLabelProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    li: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMListItemProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMListItemProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    main: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    mark: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    nav: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    ol: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    optgroup: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMOptionGroupProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMOptionGroupProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    option: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMOptionProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMOptionProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    p: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    pre: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    s: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    section: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    select: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMSelectProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMSelectProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    span: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    strong: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    sub: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    sup: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    textarea: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMTextAreaProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMTextAreaProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    u: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    ul: import("../index.js").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
};
export {};
//# sourceMappingURL=html.d.ts.map