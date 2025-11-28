import { webOnlyStylePropsText, webOnlyStylePropsView } from '@tamagui/helpers'

// pointerEvents is in webOnlyStylePropsView for web CSS, but it's a valid
// React Native View prop, so we exclude it from the skip list on native.
// It's handled specially in getSplitStyles.tsx
const { pointerEvents: _, ...webOnlyStylePropsViewWithoutPointerEvents } = webOnlyStylePropsView

/**
 * Web-only props and event handlers that should be skipped on native
 */
export const webPropsToSkip = {
  // Reuse web-only style props from webOnlyStyleProps (excluding pointerEvents)
  ...webOnlyStylePropsViewWithoutPointerEvents,
  ...webOnlyStylePropsText,

  // Web-only event handlers
  onClick: 1,
  onDoubleClick: 1,
  onContextMenu: 1,
  onMouseEnter: 1,
  onMouseLeave: 1,
  onMouseMove: 1,
  onMouseOver: 1,
  onMouseOut: 1,
  onMouseDown: 1,
  onMouseUp: 1,
  onWheel: 1,
  onKeyDown: 1,
  onKeyUp: 1,
  onKeyPress: 1,
  onPointerDown: 1,
  onPointerMove: 1,
  onPointerUp: 1,
  onPointerCancel: 1,
  onPointerEnter: 1,
  onPointerLeave: 1,
  onDrag: 1,
  onDragStart: 1,
  onDragEnd: 1,
  onDragEnter: 1,
  onDragLeave: 1,
  onDragOver: 1,
  onDrop: 1,
  onChange: 1,
  onInput: 1,
  onBeforeInput: 1,
  onScroll: 1,
  onCopy: 1,
  onCut: 1,
  onPaste: 1,

  // Other web-only props
  htmlFor: 1,
  dangerouslySetInnerHTML: 1,
}
