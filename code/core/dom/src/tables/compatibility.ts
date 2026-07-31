import type { CompatibilityRow } from './types'

/**
 * Every deliberate difference between the Tamagui DOM contract and the pinned
 * React Strict DOM release.
 *
 * The conformance test walks the RSD snapshot against the tables and requires
 * the keys claimed here to be exactly the differences it finds: an unclaimed
 * difference and a claim that is no longer a difference both fail. So this file
 * cannot drift in either direction, and refreshing the pin
 * (`bun scripts/extract-rsd-snapshot.ts`) surfaces whatever changed as a test
 * failure naming the exact key. Every key is spelled out for the same reason
 * — a pattern would quietly absorb the next element that starts differing.
 *
 * Style keys are `<platform>.<tag>.<property>`. Prop and event keys are the
 * prop name. A key belongs to exactly one row.
 */

/**
 * The pinned reference. The conformance test asserts this matches the snapshot,
 * so refreshing the pin without updating this line fails.
 */
export const RSD_REFERENCE: Readonly<{
  version: string
  commit: string
  date: string
}> = {
  version: '0.0.55',
  commit: 'c877f5c19b141e25c089d993b4cc584e669b6e39',
  date: '2026-06-23',
}

export const COMPATIBILITY: readonly CompatibilityRow[] = [
  {
    area: 'tag',
    subject: 'html.select, html.option, html.optgroup',
    keys: [],
    rsd: 'renders a view and text elements on native with no menu behaviour, and documents the tags as unsupported there',
    tamagui: 'native build error naming the tag',
    reason:
      'an element that renders but cannot open, select or report a value is a silent approximation, which the DOM contract rules out',
  },
  {
    area: 'tag',
    subject: 'html.form, html.fieldset',
    keys: [],
    rsd: 'documents form as unsupported on native',
    tamagui: 'renders as a native container, with no submission, validation or reset',
    reason:
      'the layout and accessibility of the container are correct on native; only submission is missing, and that is documented per prop',
  },
  {
    area: 'prop',
    subject: 'autoCapitalize, enterKeyHint, inputMode, spellCheck',
    keys: ['autoCapitalize', 'enterKeyHint', 'inputMode', 'spellCheck'],
    rsd: 'declared on every element, forwarded only by the text-entry factory',
    tamagui: 'declared on input and textarea only',
    reason:
      'they have no effect anywhere else on either platform, so the narrower type is the honest one',
  },
  {
    area: 'prop',
    subject: 'spellCheck on native',
    keys: [],
    rsd: 'documented as unsupported',
    tamagui: 'forwarded to the text-entry control, ios only',
    reason:
      'react native implements spellCheck on TextInput for ios; the RSD table predates it and its own runtime forwards the prop',
  },
  {
    area: 'prop',
    subject: 'aria-describedby',
    keys: [],
    rsd: 'documented as polyfilled on native, but its runtime does not map it',
    tamagui: 'web only, with a note pointing at aria-label',
    reason:
      'react native has no described-by relationship, so the table follows the runtime rather than the documentation',
  },
  {
    area: 'prop',
    subject: 'data-*',
    keys: ['data-*'],
    rsd: 'allows any data- prefixed prop at runtime but types none of them',
    tamagui: 'one data-* row, so the generated interfaces admit the whole prefix',
    reason:
      'the runtime already accepts them; leaving them untyped only means authors reach for a cast',
  },
  {
    area: 'prop',
    subject: 'data-layoutconformance',
    keys: ['data-layoutconformance'],
    rsd: 'opts an element subtree into W3C layout conformance on native',
    tamagui: 'not part of the contract',
    reason:
      'it is an escape hatch for a specific react native migration, not a DOM prop, and DOM mode targets one layout model',
  },
  {
    area: 'prop',
    subject: 'selected on html.option',
    keys: ['selected'],
    rsd: 'allowlisted, but not declared by its option props type',
    tamagui: 'not part of the contract',
    reason:
      'react warns on it and steers to value or defaultValue on the select, and select has no native rendering anyway',
  },
  {
    area: 'prop',
    subject: 'children on a void or text-only element',
    keys: [],
    rsd: 'types children as a react node on every element, including br, hr, img, input, textarea and option',
    tamagui:
      'types it as never on the five void elements and as string or number inside an option, from the content model in the tag table',
    reason:
      'the compiler already reports this nesting as a build error, and the same rule stated in the types reports it in the editor instead of at build time',
  },
  {
    area: 'event',
    subject: 'onSelectionChange',
    keys: ['onSelectionChange'],
    rsd: 'allowlisted and typed on input and textarea, then warned about as unsupported',
    tamagui: 'not part of the contract; the selection cache behind the ref polyfill stays internal',
    reason:
      'it is not a React DOM prop, so it does nothing on web and warns on native: no platform supports it',
  },
  {
    area: 'event',
    subject:
      'onMouseDown, onMouseEnter, onMouseLeave, onMouseMove, onMouseOut, onMouseOver, onMouseUp',
    keys: [],
    rsd: 'forwarded to native props react native ignores, marked TEMPORARY in its allowlist',
    tamagui: 'web only, with a diagnostic pointing at the matching pointer event',
    reason:
      'a handler that silently never fires is worse than a build error that names the cross-platform spelling',
  },
  {
    area: 'event',
    subject: 'onClick on native',
    keys: [],
    rsd: 'documented as unsupported, polyfilled in its runtime through the press event',
    tamagui: 'polyfilled through the press event, documented as a polyfill',
    reason:
      'the polyfill is real and useful; the payload subset it can fill in is documented instead of denied',
  },
  {
    area: 'style',
    subject: 'inline reset spelling',
    keys: [
      // the thirteen tags RSD gives its inline reset on web
      'web.a.textAlign',
      'web.a.textDecoration',
      'web.a.textDecorationLine',
      'web.b.textAlign',
      'web.b.textDecoration',
      'web.b.textDecorationLine',
      'web.bdi.textAlign',
      'web.bdi.textDecoration',
      'web.bdi.textDecorationLine',
      'web.bdo.textAlign',
      'web.bdo.textDecoration',
      'web.bdo.textDecorationLine',
      'web.code.textAlign',
      'web.code.textDecoration',
      'web.code.textDecorationLine',
      'web.em.textAlign',
      'web.em.textDecoration',
      'web.em.textDecorationLine',
      'web.i.textAlign',
      'web.i.textDecoration',
      'web.i.textDecorationLine',
      'web.label.textAlign',
      'web.label.textDecoration',
      'web.label.textDecorationLine',
      'web.mark.textAlign',
      'web.mark.textDecoration',
      'web.mark.textDecorationLine',
      'web.span.textAlign',
      'web.span.textDecoration',
      'web.span.textDecorationLine',
      'web.strong.textAlign',
      'web.strong.textDecoration',
      'web.strong.textDecorationLine',
      'web.sub.textAlign',
      'web.sub.textDecoration',
      'web.sub.textDecorationLine',
      'web.sup.textAlign',
      'web.sup.textDecoration',
      'web.sup.textDecorationLine',
    ],
    rsd: 'resets inline elements with textDecoration: none and textAlign: inherit',
    tamagui: 'resets with textDecorationLine: none and leaves textAlign alone',
    reason:
      'textDecorationLine is the one spelling that means the same thing on both platforms, and textAlign already inherits, so declaring it changes nothing',
  },
  {
    area: 'style',
    subject: 'element defaults RSD leaves to the browser on web',
    keys: [
      // br, del, ins, kbd, optgroup, option, s and u get no RSD web styles at all
      'web.br.margin',
      'web.br.padding',
      'web.br.textDecorationLine',
      'web.del.margin',
      'web.del.padding',
      'web.del.textDecorationLine',
      'web.ins.margin',
      'web.ins.padding',
      'web.ins.textDecorationLine',
      'web.kbd.fontFamily',
      'web.kbd.fontSize',
      'web.kbd.margin',
      'web.kbd.padding',
      'web.kbd.textDecorationLine',
      'web.optgroup.margin',
      'web.optgroup.padding',
      'web.option.margin',
      'web.option.padding',
      'web.s.margin',
      'web.s.padding',
      'web.s.textDecorationLine',
      'web.u.margin',
      'web.u.padding',
      'web.u.textDecorationLine',
      // and the rest lean on the browser stylesheet for their one decoration
      'web.b.fontWeight',
      'web.em.fontStyle',
      'web.h1.fontWeight',
      'web.h2.fontWeight',
      'web.h3.fontWeight',
      'web.h4.fontWeight',
      'web.h5.fontWeight',
      'web.h6.fontWeight',
      'web.i.fontStyle',
      'web.mark.backgroundColor',
      'web.mark.color',
    ],
    rsd: 'applies no default styles at all to br, del, ins, kbd, optgroup, option, s and u on web, and relies on the browser stylesheet for the bold, italic, monospace, strike, underline and highlight of every other tag',
    tamagui: 'applies the same element defaults on both platforms',
    reason:
      'one source has to render the same on web and native, which it cannot if half the defaults come from a browser stylesheet a css reset is free to remove',
  },
  {
    area: 'style',
    subject: 'html.a default styles',
    keys: ['native.a.color', 'native.a.textDecorationLine'],
    rsd: 'strips the underline on web and adds blue plus underline on native, so one source renders differently per platform',
    tamagui: 'applies the same inline reset on both platforms and adds no link colour',
    reason:
      'cross-platform parity is the point of the shared fixture, and a hardcoded link colour cannot follow a theme',
  },
  {
    area: 'style',
    subject: 'monospace font family',
    keys: [
      'web.code.fontFamily',
      'web.pre.fontFamily',
      'native.code.fontFamily',
      'native.kbd.fontFamily',
      'native.pre.fontFamily',
    ],
    rsd: 'writes monospace, "monospace" on web to cancel the browser size quirk, and picks Menlo on ios',
    tamagui: 'writes monospace on both platforms and cancels the size quirk with fontSize: 1em instead',
    reason:
      'the duplicated family name only exists to defeat the size quirk, which 1em does directly; the font family itself belongs to the theme, not to the tag',
  },
  {
    area: 'style',
    subject: 'overflow on html.code',
    keys: ['web.code.overflow'],
    rsd: 'shares one rule between code and pre, so inline code gets overflow: auto too',
    tamagui: 'scrolls pre only',
    reason: 'overflow does nothing on an inline element',
  },
  {
    area: 'style',
    subject: 'web css properties a Tamagui style prop cannot express',
    keys: [
      'web.a.wordWrap',
      'web.b.wordWrap',
      'web.bdi.wordWrap',
      'web.bdo.wordWrap',
      'web.code.wordWrap',
      'web.em.wordWrap',
      'web.h1.wordWrap',
      'web.h2.wordWrap',
      'web.h3.wordWrap',
      'web.h4.wordWrap',
      'web.h5.wordWrap',
      'web.h6.wordWrap',
      'web.i.wordWrap',
      'web.label.wordWrap',
      'web.mark.wordWrap',
      'web.span.wordWrap',
      'web.strong.wordWrap',
      'web.sub.wordWrap',
      'web.sup.wordWrap',
      'web.ol.listStyle',
      'web.ul.listStyle',
      'web.textarea.resize',
    ],
    rsd: 'sets overflow-wrap on inline text and headings, list-style: none on ol and ul, and resize: vertical on a textarea, all as plain stylex rules',
    tamagui: 'sets none of the three',
    reason:
      'Tamagui resolves none of these three property names, and an unresolved style prop does not quietly do nothing — it reaches the element as an attribute, which is a react warning and still no styling. list-style has no visible consequence anyway, because every view-backed element carries `.is_View { display: flex }`, so an li is never display: list-item and no marker is generated. The other two are cosmetic and web-only. Closing this means teaching the style pipeline the three properties, not working around it here',
  },
  {
    area: 'style',
    subject: 'html.img sizing',
    keys: [
      'web.img.aspectRatio',
      'web.img.objectFit',
      'web.img.margin',
      'web.img.padding',
      'web.img.textDecorationLine',
    ],
    rsd: 'derives the aspect ratio from the width and height attributes with attr(), which only lands in recent chromium, and gives img no inline reset',
    tamagui:
      'sets objectFit, resets img like any other inline element, and lets the compiler turn the width and height props into an aspect ratio on native',
    reason:
      'a css feature one engine supports cannot be the cross-platform contract, and the props are known at build time anyway; the inline reset still matters because an img inside an anchor otherwise inherits its underline',
  },
  {
    area: 'style',
    subject: 'universal native element defaults',
    keys: ['native.br.boxSizing', 'native.br.position', 'native.hr.boxSizing'],
    rsd: 'skips the shared native reset on br, and overrides boxSizing to border-box on hr',
    tamagui: 'applies the same native element defaults to every tag',
    reason:
      'br is not special, and neither override changes what renders: hr has no border or padding for border-box to measure differently',
  },
  {
    area: 'behavior',
    subject: 'invalid nesting',
    keys: [],
    rsd: 'reports nothing at build time; an invalid tree fails at runtime on native',
    tamagui:
      'compile diagnostic for statically knowable invalid nesting, from the content model in the tag table',
    reason:
      'the compiler already classifies every tag, so the error belongs at build time where the source is',
  },
  {
    area: 'behavior',
    subject: 'children as a render function',
    keys: [],
    rsd: 'supports a function child that receives the resolved native props',
    tamagui: 'not part of the contract',
    reason:
      'it exposes the native prop shape as public api and blocks compile-time literal-text wrapping',
  },
  {
    area: 'ref',
    subject: 'native element ref',
    keys: [],
    rsd: 'wraps every ref-ed host node in an Object.create view adding nodeName, viewport-scaled metrics and the tag polyfills',
    tamagui:
      'exposes the react native public instance, augmented lazily with nodeName plus the img and text-entry polyfills, and only when a ref was passed',
    reason:
      'the react native host instance already implements the documented Node and Element subset; viewport scaling belongs to the app, not the element',
  },
]
