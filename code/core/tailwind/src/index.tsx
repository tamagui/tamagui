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
import type { TailwindText, TailwindView } from './types'

const frontendViews = createFrontendViews(tailwindStyleFrontend)

export const View = frontendViews.View as unknown as TailwindView
export const Text = frontendViews.Text as unknown as TailwindText

export { styled } from './styled'
export { parseStaticStyle, tailwindStyleFrontend } from './frontend'
export type * from './types'
