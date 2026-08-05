import type { StrictDOMAnchorProps, StrictDOMButtonProps, StrictDOMImageProps, StrictDOMInputProps, StrictDOMLabelProps, StrictDOMListItemProps, StrictDOMOptionGroupProps, StrictDOMOptionProps, StrictDOMProps, StrictDOMSelectProps, StrictDOMTextAreaProps, StrictDOMVoidProps } from '@tamagui/dom';
import type { DOMStyleProps } from './standalone';
/**
 * The semantic elements of the standalone Tamagui DOM entry.
 *
 * Each one accepts the strict DOM props for its element plus a `style()`
 * handle, and nothing else — the regular Tamagui style props are not part
 * of this entry. All of them throw: the compiler replaces them, so reaching
 * one means it did not run.
 */
export declare const html: {
    a: (props: StrictDOMAnchorProps & DOMStyleProps) => never;
    article: (props: StrictDOMProps & DOMStyleProps) => never;
    aside: (props: StrictDOMProps & DOMStyleProps) => never;
    b: (props: StrictDOMProps & DOMStyleProps) => never;
    bdi: (props: StrictDOMProps & DOMStyleProps) => never;
    bdo: (props: StrictDOMProps & DOMStyleProps) => never;
    blockquote: (props: StrictDOMProps & DOMStyleProps) => never;
    br: (props: StrictDOMVoidProps & DOMStyleProps) => never;
    button: (props: StrictDOMButtonProps & DOMStyleProps) => never;
    code: (props: StrictDOMProps & DOMStyleProps) => never;
    del: (props: StrictDOMProps & DOMStyleProps) => never;
    div: (props: StrictDOMProps & DOMStyleProps) => never;
    em: (props: StrictDOMProps & DOMStyleProps) => never;
    fieldset: (props: StrictDOMProps & DOMStyleProps) => never;
    footer: (props: StrictDOMProps & DOMStyleProps) => never;
    form: (props: StrictDOMProps & DOMStyleProps) => never;
    h1: (props: StrictDOMProps & DOMStyleProps) => never;
    h2: (props: StrictDOMProps & DOMStyleProps) => never;
    h3: (props: StrictDOMProps & DOMStyleProps) => never;
    h4: (props: StrictDOMProps & DOMStyleProps) => never;
    h5: (props: StrictDOMProps & DOMStyleProps) => never;
    h6: (props: StrictDOMProps & DOMStyleProps) => never;
    header: (props: StrictDOMProps & DOMStyleProps) => never;
    hr: (props: StrictDOMVoidProps & DOMStyleProps) => never;
    i: (props: StrictDOMProps & DOMStyleProps) => never;
    img: (props: StrictDOMImageProps & DOMStyleProps) => never;
    input: (props: StrictDOMInputProps & DOMStyleProps) => never;
    ins: (props: StrictDOMProps & DOMStyleProps) => never;
    kbd: (props: StrictDOMProps & DOMStyleProps) => never;
    label: (props: StrictDOMLabelProps & DOMStyleProps) => never;
    li: (props: StrictDOMListItemProps & DOMStyleProps) => never;
    main: (props: StrictDOMProps & DOMStyleProps) => never;
    mark: (props: StrictDOMProps & DOMStyleProps) => never;
    nav: (props: StrictDOMProps & DOMStyleProps) => never;
    ol: (props: StrictDOMProps & DOMStyleProps) => never;
    optgroup: (props: StrictDOMOptionGroupProps & DOMStyleProps) => never;
    option: (props: StrictDOMOptionProps & DOMStyleProps) => never;
    p: (props: StrictDOMProps & DOMStyleProps) => never;
    pre: (props: StrictDOMProps & DOMStyleProps) => never;
    s: (props: StrictDOMProps & DOMStyleProps) => never;
    section: (props: StrictDOMProps & DOMStyleProps) => never;
    select: (props: StrictDOMSelectProps & DOMStyleProps) => never;
    span: (props: StrictDOMProps & DOMStyleProps) => never;
    strong: (props: StrictDOMProps & DOMStyleProps) => never;
    sub: (props: StrictDOMProps & DOMStyleProps) => never;
    sup: (props: StrictDOMProps & DOMStyleProps) => never;
    textarea: (props: StrictDOMTextAreaProps & DOMStyleProps) => never;
    u: (props: StrictDOMProps & DOMStyleProps) => never;
    ul: (props: StrictDOMProps & DOMStyleProps) => never;
};
//# sourceMappingURL=standaloneHtml.d.ts.map