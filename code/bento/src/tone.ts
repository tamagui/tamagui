// the one set of surface rules every bento component follows, after heroui.
// the page is the base layer; cards and fields sit one step toward the
// viewer (white in light, a lighter gray in dark), so nothing a user types
// into is ever darker than what it sits on. soft fills mark chips and empty
// slots, and borders stay hairline quiet until hover or focus.
export const tone = {
  /** cards, panels, popovers, sheets */
  surface: 'color-1 dark:color-4',
  /** inputs, selects, text areas, code cells: same as a surface, with a border */
  field: 'color-1 dark:color-4',
  /** chips, tags, secondary buttons, empty slots */
  fill: 'color-3 dark:color-5',
  /** the fill under a pointer */
  fillHover: 'color-4 dark:color-6',
  /** append to a transparent row or menu item so it fills under a pointer */
  rowHover: 'hover:color-3 dark:hover:color-5',
  /** hairlines around surfaces and fields */
  border: 'color-4 dark:color-5',
  /** a field's border under a pointer or while focused */
  borderStrong: 'color-6 dark:color-7',
  /** the ring of an empty checkbox, radio or switch, strong enough to read as a control */
  control: 'color-8',
  /** a chosen item that has to stand out, like a selected day: inverted, as in shadcn */
  selected: 'color-12',
  /** text and icons on a selected item */
  onSelected: 'color-1',
  /** secondary text: descriptions, captions, placeholders */
  muted: 'color-8 dark:color-10',
} as const
