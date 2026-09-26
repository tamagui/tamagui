/**
 * Tailwind authoring for Tamagui.
 *
 * Components here render through the same runtime as `@tamagui/core` — same
 * config, tokens, themes, media, events, refs, accessibility, animations, and
 * normalized style output. Only the authoring syntax differs, and it is selected
 * by which package a component was imported from, never by a global setting.
 *
 * This entry is runtime-only. The official Tailwind scanner and build integration
 * live behind `@tamagui/tailwind/vite` and are never reachable from here.
 */
import { createFrontendHTML, createFrontendViews } from '@tamagui/core/internal-runtime'
import { tailwindStyleFrontend } from './frontend'
import type { TailwindHTML, TailwindText, TailwindView } from './types'

const frontendViews = createFrontendViews(tailwindStyleFrontend)

/**
 * The tailwind View and Text. Composed utilities (ring, gradient, filter,
 * shadow, transform, text-shadow) are folded by the descriptor's `compose` hook
 * during the className walk, so these carry no resolver of their own.
 */
export const View = frontendViews.View as unknown as TailwindView

export const Text = frontendViews.Text as unknown as TailwindText

/**
 * The semantic elements. Identical to `html` from `tamagui` down to the element
 * defaults, differing only in that a class string is the styling input.
 */
export const html = createFrontendHTML(tailwindStyleFrontend) as unknown as TailwindHTML

export { styled } from './styled'
export { parseStaticStyle, tailwindStyleFrontend } from './frontend'
export type * from './types'
