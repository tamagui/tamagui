import type { CompiledStyle } from './standalone'
import { style } from './standalone'
import { html } from './standaloneHtml'

/**
 * Type tests for the standalone DOM entry.
 *
 * Checked by `tsc`, so every `@ts-expect-error` fails the build the moment the
 * error it expects stops happening. The one that matters most is the isolation
 * case: a standalone tag must not accept a regular Tamagui style prop, because
 * a separate entry that quietly grew the regular style surface would be the
 * same entry with extra steps.
 */

declare const props: <T>(value: T) => void
declare const active: boolean

// the example from the design record, verbatim
const root = style({
  display: 'flex',
  padding: 16,
  backgroundColor: 'surface hover:surface-hover',
})
const heading = style({ color: 'color', fontSize: 24 })

// css property checking happens here, once, and not on every jsx tag
// @ts-expect-error not a style property
style({ notAStyleProperty: 1 })
// @ts-expect-error padding takes a length, not a boolean
style({ padding: true })

// the handle is opaque: nothing in user code should read into it
// @ts-expect-error a compiled handle has no readable shape
props<string>(root.backgroundColor)
// @ts-expect-error and it is not just an object of styles
props<CompiledStyle>({ color: 'red' })

// a tag takes one handle, or a list where some are switched off
props<Parameters<typeof html.div>[0]>({ style: root })
props<Parameters<typeof html.div>[0]>({ style: [root, active && heading] })
props<Parameters<typeof html.div>[0]>({ style: [root, null, undefined] })

// element-specific props still apply, exactly as in the regular namespace
props<Parameters<typeof html.a>[0]>({ href: 'https://tamagui.dev', style: root })
// @ts-expect-error href belongs to an anchor
props<Parameters<typeof html.div>[0]>({ href: 'https://tamagui.dev' })
// @ts-expect-error a void element takes no children
props<Parameters<typeof html.br>[0]>({ children: 'text' })
// @ts-expect-error capture-phase props are not part of the strict contract
props<Parameters<typeof html.div>[0]>({ onKeyDownCapture: () => {} })

// and the isolation: no regular Tamagui style props on this entry
// @ts-expect-error backgroundColor is a regular Tamagui style prop
props<Parameters<typeof html.div>[0]>({ backgroundColor: 'red' })
// @ts-expect-error so is a shorthand
props<Parameters<typeof html.div>[0]>({ bg: 'red' })
// @ts-expect-error and so is a flat state program
props<Parameters<typeof html.div>[0]>({ opacity: '1 hover:0.5' })
// @ts-expect-error className belongs to the Tailwind frontend, not this one
props<Parameters<typeof html.div>[0]>({ className: 'p-4' })
