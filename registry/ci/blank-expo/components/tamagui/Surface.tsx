// Surface — a copied panel / well / toolbar fixture, not a framework component.
// It is a YStack + the composable chrome/interaction facets + a `level` prop that
// shifts the subtree through the relative level themes. Nothing is on by default: a bare
// <Surface /> renders no chrome and no interaction styling; every facet is opt-in
// at the use site:
//
//   <Surface level={2} filled outlined rounded interactive />
//
// `level` sets a relative level theme (a theme boundary can only be created by the
// prop, not by a variant), and because the facets read generics and the surface
// theme re-binds those generics, facets are level-aware with zero cooperation.
// Component skins do NOT extend Surface — they get their similarity by styling
// against the same generics. Fork the copy for CardSurface vs ListSurface and
// nothing in the framework cares.
//
// Generics-only: never references the color scale (colorN) directly, so it
// restyles under any re-bound level. Single definition; the registry item is
// generated from this file.
import { type GetProps, styled, Theme, YStack } from '@tamagui/ui'
import { forwardRef } from 'react'

import { elevated, filled, interactive, outlined, rounded } from './facets'

export const SurfaceFrame = styled(YStack, {
  displayName: 'Surface',

  variants: {
    filled,
    outlined,
    elevated,
    roundedFacet: rounded,
    interactive,
  } as const,
})

export type SurfaceProps = Omit<
  GetProps<typeof SurfaceFrame>,
  'roundedFacet' | 'rounded'
> & {
  /** shift the subtree to a relative theme level. */
  level?: 1 | 2 | 3 | 4
  /** add the default component radius without depending on config shorthands. */
  rounded?: boolean
}

export const Surface = forwardRef<any, SurfaceProps>(function Surface(
  { level, rounded, ...props },
  ref
) {
  const frame = <SurfaceFrame ref={ref} roundedFacet={rounded} {...props} />
  if (!level || level === 1) return frame
  return <Theme name={`level${level}` as 'level2' | 'level3' | 'level4'}>{frame}</Theme>
})
