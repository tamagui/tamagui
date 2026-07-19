// Facets — the composable Surface chrome + interaction variants, shipped in the
// copied layer beside the skins (registry item `facets`). Imported by Surface and
// any skin that wants them; forkable like every copy. Core contributes only the
// existing variant machinery.
//
// Each facet is a canonical boolean variant that is a pure function of generics +
// conventional variables. Two composition rules keep this from becoming a second
// variant system:
//
//   1. Family ownership. Chrome facets (filled/outlined/elevated/rounded) set
//      static styles only and never touch pseudos. The interaction facet only
//      touches pseudos and never sets static styles. An interaction facet may
//      state-shift ANY family's generic (borderColorPress) because the value is
//      inert when that chrome is absent (no borderWidth -> borderColor does
//      nothing). So `interactive + outlined` composes with zero coordination.
//   2. Generics-only. Facets read theme GENERICS ($background, $borderColor,
//      $backgroundHover, …) and conventional custom variables ($radius,
//      $pressScale), never the color scale ($colorN). That makes them
//      level-aware for free: <Surface level={2} filled interactive> needs no
//      facet cooperation — the level re-bound the generics the facets read.
//
// Nothing is on by default: every facet is opt-in at the use site.

// chrome facets — one property family each, static styles only.

export const filled = {
  true: {
    backgroundColor: '$background',
  },
} as const

export const outlined = {
  true: {
    borderWidth: 1,
    borderColor: '$borderColor',
  },
} as const

export const elevated = {
  true: {
    shadowColor: '$shadowColor',
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
} as const

export const rounded = {
  true: {
    borderRadius: '$radius',
  },
} as const

// interaction facet — pseudos only. state-shifts every family's generic; each is
// inert until the matching chrome facet turns its property family on.

export const interactive = {
  true: {
    hoverStyle: {
      backgroundColor: '$backgroundHover',
      borderColor: '$borderColorHover',
    },
    pressStyle: {
      backgroundColor: '$backgroundPress',
      borderColor: '$borderColorPress',
      scale: '$pressScale',
    },
    focusVisibleStyle: {
      outlineColor: '$outlineColor',
      outlineWidth: 2,
      outlineStyle: 'solid',
    },
  },
} as const

// the full facet set, spreadable into a styled() `variants` block.
export const facets = {
  filled,
  outlined,
  elevated,
  rounded,
  interactive,
} as const
