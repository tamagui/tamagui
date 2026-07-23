// Surface — a copied panel / well / toolbar fixture, not a framework component.
// It is a YStack + the composable chrome/interaction facets + a `level` prop that
// shifts the subtree to the surface1-3 sub-theme. Nothing is on by default: a bare
// <Surface /> renders no chrome and no interaction styling; every facet is opt-in
// at the use site:
//
//   <Surface level={2} filled outlined rounded interactive />
//
// `level` sets `theme="surfaceN"` (a theme boundary can only be created by the
// prop, not by a variant), and because the facets read generics and the surface
// theme re-binds those generics, facets are level-aware with zero cooperation.
// Component skins do NOT extend Surface — they get their similarity by styling
// against the same generics. Fork the copy for CardSurface vs ListSurface and
// nothing in the framework cares.
//
// Generics-only: never references the color scale ($colorN) directly, so it
// restyles under any re-bound level. Single definition; the registry item is
// generated from this file.
import { type GetProps, styled, Theme, YStack } from '@tamagui/ui'
import { forwardRef } from 'react'

import { elevated, filled, interactive, outlined, rounded } from './facets'

export const SurfaceFrame = styled(YStack, {
  name: 'Surface',

  variants: {
    filled,
    outlined,
    elevated,
    rounded,
    interactive,
  } as const,
})

export type SurfaceProps = GetProps<typeof SurfaceFrame> & {
  /** shift the subtree to a surface sub-theme (surface1-3). */
  level?: 1 | 2 | 3
}

export const Surface = forwardRef<any, SurfaceProps>(function Surface(
  { level, ...props },
  ref
) {
  const frame = <SurfaceFrame ref={ref} {...props} />
  if (!level) return frame
  return <Theme name={`surface${level}` as any}>{frame}</Theme>
})
