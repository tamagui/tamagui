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
import { createFrontendViews } from '@tamagui/core/internal-runtime'
import { tailwindStyleFrontend } from './frontend'
import { composedResolver } from './composedResolver'
import type { TailwindText, TailwindView } from './types'

const frontendViews = createFrontendViews(tailwindStyleFrontend)

/**
 * The tailwind View: className-resolved composed utilities (ring, gradient,
 * filter) are handled by variant props + `.resolve()` instead of imperative
 * compose.ts logic.
 */
export const View = (frontendViews.View as any).resolve(
  composedResolver
) as unknown as TailwindView

export const Text = (frontendViews.Text as any).resolve(
  composedResolver
) as unknown as TailwindText

export { styled } from './styled'
export { parseStaticStyle, tailwindStyleFrontend } from './frontend'
export type * from './types'
