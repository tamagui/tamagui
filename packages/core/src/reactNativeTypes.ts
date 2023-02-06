import type { GestureResponderHandlers, LayoutChangeEvent } from 'react-native'

// The following list is sourced from:
// - https://github.com/necolas/react-native-web/blob/0.17.5/packages/react-native-web/src/types/styles.js#L76
type RNWCursorValue =
  | 'alias'
  | 'all-scroll'
  | 'auto'
  | 'cell'
  | 'context-menu'
  | 'copy'
  | 'crosshair'
  | 'default'
  | 'grab'
  | 'grabbing'
  | 'help'
  | 'pointer'
  | 'progress'
  | 'wait'
  | 'text'
  | 'vertical-text'
  | 'move'
  | 'none'
  | 'no-drop'
  | 'not-allowed'
  | 'zoom-in'
  | 'zoom-out'
  | 'col-resize'
  | 'e-resize'
  | 'ew-resize'
  | 'n-resize'
  | 'ne-resize'
  | 'ns-resize'
  | 'nw-resize'
  | 'row-resize'
  | 's-resize'
  | 'se-resize'
  | 'sw-resize'
  | 'w-resize'
  | 'nesw-resize'
  | 'nwse-resize'

// This list is the combination of the following two lists:
// - https://github.com/necolas/react-native-web/blob/0.17.5/packages/react-native-web/src/modules/AccessibilityUtil/propsToAriaRole.js#L10
// - https://github.com/necolas/react-native-web/blob/0.17.5/packages/react-native-web/src/modules/AccessibilityUtil/propsToAccessibilityComponent.js#L12
// Plus the single hard-coded value "label" from here:
// - https://github.com/necolas/react-native-web/blob/0.17.5/packages/react-native-web/src/modules/AccessibilityUtil/propsToAccessibilityComponent.js#L36
type RNWWebAccessibilityRole =
  | 'adjustable'
  | 'article'
  | 'banner'
  | 'blockquote'
  | 'button'
  | 'code'
  | 'complementary'
  | 'contentinfo'
  | 'deletion'
  | 'emphasis'
  | 'figure'
  | 'form'
  | 'header'
  | 'image'
  | 'imagebutton'
  | 'insertion'
  | 'keyboardkey'
  | 'label'
  | 'link'
  | 'list'
  | 'listitem'
  | 'main'
  | 'navigation'
  | 'none'
  | 'region'
  | 'search'
  | 'strong'
  | 'summary'
  | 'text'

type OnLayout = ((event: LayoutChangeEvent) => void) | undefined

type RNExtraProps = {
  dataSet?: Record<string, string | number | undefined | null>
  onScrollShouldSetResponder?: unknown
  onScrollShouldSetResponderCapture?: unknown
  onSelectionChangeShouldSetResponder?: unknown
  onSelectionChangeShouldSetResponderCapture?: unknown
  onLayout?: OnLayout
  href?: string
  hrefAttrs?: {
    target?: '_blank' | '_self' | '_top' | 'blank' | 'self' | 'top'
    rel?: string
    download?: boolean
  }
}

export interface RNViewProps extends GestureResponderHandlers, RNExtraProps {
  rel?: any
  download?: any
}

export interface RNTextProps extends RNExtraProps {
  dir?: 'ltr' | 'rtl' | 'auto'
  focusable?: boolean
}
