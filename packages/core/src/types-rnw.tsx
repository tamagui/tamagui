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

interface PressableStateCallbackType {
  hovered?: boolean
  focused?: boolean
}

export interface RNWViewProps {
  // our internal hack to pass className down (until styleq transition)
  dataSet?: any

  // TODO get proper types:
  target?: any
  rel?: any
  download?: any

  accessibilityRole?: RNWWebAccessibilityRole
  href?: string
  hrefAttrs?: {
    target?: '_blank' | '_self' | '_top' | 'blank' | 'self' | 'top'
    rel?: string
    download?: boolean
  }
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onMouseUp?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void
  onScroll?: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void
  // For compatibility with RNW internals
  onScrollShouldSetResponder?: unknown
  onScrollShouldSetResponderCapture?: unknown
  onSelectionChangeShouldSetResponder?: unknown
  onSelectionChangeShouldSetResponderCapture?: unknown
}

export interface RNWTextProps {
  dir?: 'ltr' | 'rtl' | 'auto'
  focusable?: boolean
  accessibilityRole?: RNWWebAccessibilityRole
  accessibilityState?: {
    busy?: boolean
    checked?: boolean | 'mixed'
    disabled?: boolean
    expanded?: boolean
    grabbed?: boolean
    hidden?: boolean
    invalid?: boolean
    pressed?: boolean
    readonly?: boolean
    required?: boolean
    selected?: boolean
  }
  href?: string
  hrefAttrs?: {
    target?: '_blank' | '_self' | '_top' | 'blank' | 'self' | 'top'
    rel?: string
    download?: boolean
  }
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void
  // For compatibility with RNW internals
  onMoveShouldSetResponder?: unknown
  onMoveShouldSetResponderCapture?: unknown
  onResponderEnd?: unknown
  onResponderGrant?: unknown
  onResponderMove?: unknown
  onResponderReject?: unknown
  onResponderRelease?: unknown
  onResponderStart?: unknown
  onResponderTerminate?: unknown
  onResponderTerminationRequest?: unknown
  onScrollShouldSetResponder?: unknown
  onScrollShouldSetResponderCapture?: unknown
  onSelectionChangeShouldSetResponder?: unknown
  onSelectionChangeShouldSetResponderCapture?: unknown
  onStartShouldSetResponder?: unknown
  onStartShouldSetResponderCapture?: unknown
}

interface TouchableOpacityProps {
  accessibilityRole?: RNWWebAccessibilityRole
  href?: string
  hrefAttrs?: {
    target?: '_blank' | '_self' | '_top' | 'blank' | 'self' | 'top'
    rel?: string
    download?: boolean
  }
  nativeID?: string
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

interface CheckBoxProps {
  color?: string | null
}

export interface RNWViewStyle {
  cursor?: RNWCursorValue
  transitionProperty?: string
  display?: 'flex' | 'inline-flex' | 'none'
}

export interface RNWTextStyle {
  // The following list is sourced from:
  // - https://github.com/necolas/react-native-web/blob/0.17.5/packages/react-native-web/src/types/styles.js#L128
  userSelect?: 'all' | 'auto' | 'contain' | 'none' | 'text'
}
