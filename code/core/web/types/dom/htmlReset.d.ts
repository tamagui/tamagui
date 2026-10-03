/**
 * Zero-specificity reset for html.* hosts, generated from the `display`
 * column of the tag table. Every host carries `is_DOM` (see
 * `htmlStaticConfig.ts`); `:where()` keeps these rules at zero specificity
 * so page CSS like `p { margin: 1em }` still reaches html.* on web.
 * No rule sets `display`: block vs inline stays with the browser
 * stylesheet, which is what keeps `html.p` a block and `[hidden]` working.
 */
export declare const htmlResetCSS = ":where(.is_DOM) { margin: 0; padding: 0; }\n:where(a.is_DOM, b.is_DOM, bdi.is_DOM, bdo.is_DOM, br.is_DOM, code.is_DOM, del.is_DOM, em.is_DOM, i.is_DOM, img.is_DOM, ins.is_DOM, kbd.is_DOM, label.is_DOM, mark.is_DOM, s.is_DOM, span.is_DOM, strong.is_DOM, sub.is_DOM, sup.is_DOM, u.is_DOM) { text-decoration: none; }\n:where(button.is_DOM, input.is_DOM, select.is_DOM, textarea.is_DOM) { border-style: solid; }";
//# sourceMappingURL=htmlReset.d.ts.map