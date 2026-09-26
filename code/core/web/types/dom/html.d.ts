import type { StrictDOMAnchorProps, StrictDOMButtonProps, StrictDOMImageProps, StrictDOMInputProps, StrictDOMLabelProps, StrictDOMListItemProps, StrictDOMOptionGroupProps, StrictDOMOptionProps, StrictDOMProps, StrictDOMSelectProps, StrictDOMTextAreaProps, StrictDOMVoidProps } from '@tamagui/dom';
import type { StackNonStyleProps, TamaguiElement, TamaguiTextElement, TextNonStyleProps, WithThemeAndShorthands } from '../types';
import type { TamaguiStyleProps } from './styleTypes';
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
    a: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMAnchorProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMAnchorProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    article: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    aside: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    b: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    bdi: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    bdo: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    blockquote: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    br: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMVoidProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMVoidProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    button: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMButtonProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMButtonProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    code: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    del: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    div: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    em: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    fieldset: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    footer: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    form: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    h1: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    h2: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    h3: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    h4: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    h5: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    h6: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    header: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    hr: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMVoidProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMVoidProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    i: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    img: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMImageProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMImageProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    input: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMInputProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMInputProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    ins: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    kbd: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    label: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMLabelProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMLabelProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    li: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMListItemProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMListItemProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    main: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    mark: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    nav: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    ol: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    optgroup: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMOptionGroupProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMOptionGroupProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    option: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMOptionProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMOptionProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    p: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    pre: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    s: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    section: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    select: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMSelectProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMSelectProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
    span: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    strong: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    sub: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    sup: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    textarea: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMTextAreaProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMTextAreaProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    u: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlTextProps, TextNonStyleProps>, TamaguiTextElement, MergeHTMLProps<StrictDOMProps, TextNonStyleProps, TextNonStyleProps>, TamaguiStyleProps, {}>;
    ul: import("..").TamaguiComponent<MergeHTMLProps<StrictDOMProps, HtmlViewProps, StackNonStyleProps>, TamaguiElement, MergeHTMLProps<StrictDOMProps, StackNonStyleProps, StackNonStyleProps>, TamaguiStyleProps, {}>;
};
export {};
//# sourceMappingURL=html.d.ts.map