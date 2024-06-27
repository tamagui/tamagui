/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {
  AnimationStyles,
  BorderStyles,
  InteractionStyles,
  LayoutStyles,
  ShadowStyles,
  TransformStyles,
} from '../styleTypes'
import type { ColorValue, GenericStyleProp, LayoutEvent } from '../types'

type NumberOrString = number | string
type OverscrollBehaviorValue = 'auto' | 'contain' | 'none'
type idRef = string
type idRefList = idRef | Array<idRef>

export type AccessibilityProps = {
  accessibilityActiveDescendant?: idRef | null
  accessibilityAtomic?: boolean | null
  accessibilityAutoComplete?: 'none' | 'list' | 'inline' | 'both' | null
  accessibilityBusy?: boolean | null
  accessibilityChecked?: boolean | 'mixed' | null
  accessibilityColumnCount?: number | null
  accessibilityColumnIndex?: number | null
  accessibilityColumnSpan?: number | null
  accessibilityControls?: idRefList | null
  accessibilityCurrent?: boolean | 'page' | 'step' | 'location' | 'date' | 'time' | null
  accessibilityDescribedBy?: idRefList | null
  accessibilityDetails?: idRef | null
  accessibilityDisabled?: boolean | null
  accessibilityErrorMessage?: idRef | null
  accessibilityExpanded?: boolean | null
  accessibilityFlowTo?: idRefList | null
  accessibilityHasPopup?: 'dialog' | 'grid' | 'listbox' | 'menu' | 'tree' | false | null
  accessibilityHidden?: boolean | null
  accessibilityInvalid?: boolean | null
  accessibilityKeyShortcuts?: Array<string> | null
  accessibilityLabel?: string | null
  accessibilityLabelledBy?: idRefList | null
  accessibilityLevel?: number | null
  accessibilityLiveRegion?: 'assertive' | 'none' | 'polite' | null
  accessibilityModal?: boolean | null
  accessibilityMultiline?: boolean | null
  accessibilityMultiSelectable?: boolean | null
  accessibilityOrientation?: 'horizontal' | 'vertical' | null
  accessibilityOwns?: idRefList | null
  accessibilityPlaceholder?: string | null
  accessibilityPosInSet?: number | null
  accessibilityPressed?: boolean | 'mixed' | null
  accessibilityReadOnly?: boolean | null
  accessibilityRequired?: boolean | null
  accessibilityRole?: string | null
  accessibilityRoleDescription?: string | null
  accessibilityRowCount?: number | null
  accessibilityRowIndex?: number | null
  accessibilityRowSpan?: number | null
  accessibilitySelected?: boolean | null
  accessibilitySetSize?: number | null
  accessibilitySort?: 'ascending' | 'descending' | 'none' | 'other' | null
  accessibilityValueMax?: number | null
  accessibilityValueMin?: number | null
  accessibilityValueNow?: number | null
  accessibilityValueText?: string | null
  dataSet?: {}
  focusable?: boolean | null
  nativeID?: string | null
}

export type ViewStyle = {
  backdropFilter?: string | null
  backgroundAttachment?: string | null
  backgroundBlendMode?: string | null
  backgroundClip?: string | null
  backgroundColor?: ColorValue | null
  backgroundImage?: string | null
  backgroundOrigin?: 'border-box' | 'content-box' | 'padding-box'
  backgroundPosition?: string | null
  backgroundRepeat?: string | null
  backgroundSize?: string | null
  boxShadow?: string | null
  clip?: string | null
  filter?: string | null
  opacity?: number | null
  outlineColor?: ColorValue | null
  outlineOffset?: NumberOrString | null
  outlineStyle?: string | null
  outlineWidth?: NumberOrString | null
  overscrollBehavior?: OverscrollBehaviorValue | null
  overscrollBehaviorX?: OverscrollBehaviorValue | null
  overscrollBehaviorY?: OverscrollBehaviorValue | null
  scrollbarWidth?: 'auto' | 'none' | 'thin'
  scrollSnapAlign?: string | null
  scrollSnapType?: string | null
  WebkitMaskImage?: string | null
  WebkitOverflowScrolling?: 'auto' | 'touch'
} & AnimationStyles &
  BorderStyles &
  InteractionStyles &
  LayoutStyles &
  ShadowStyles &
  TransformStyles

export type ViewProps = {
  children?: any | null
  dir?: 'ltr' | 'rtl'
  focusable?: boolean | null
  lang?: string
  nativeID?: string | null
  onBlur?: (e: any) => void
  onClick?: (e: any) => void
  onClickCapture?: (e: any) => void
  onContextMenu?: (e: any) => void
  onFocus?: (e: any) => void
  onKeyDown?: (e: any) => void
  onKeyUp?: (e: any) => void
  onLayout?: (e: LayoutEvent) => void
  onMoveShouldSetResponder?: (e: any) => boolean
  onMoveShouldSetResponderCapture?: (e: any) => boolean
  onResponderEnd?: (e: any) => void
  onResponderGrant?: (e: any) => void | boolean
  onResponderMove?: (e: any) => void
  onResponderReject?: (e: any) => void
  onResponderRelease?: (e: any) => void
  onResponderStart?: (e: any) => void
  onResponderTerminate?: (e: any) => void
  onResponderTerminationRequest?: (e: any) => boolean
  onScrollShouldSetResponder?: (e: any) => boolean
  onScrollShouldSetResponderCapture?: (e: any) => boolean
  onSelectionChangeShouldSetResponder?: (e: any) => boolean
  onSelectionChangeShouldSetResponderCapture?: (e: any) => boolean
  onStartShouldSetResponder?: (e: any) => boolean
  onStartShouldSetResponderCapture?: (e: any) => boolean
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto'
  style?: GenericStyleProp<ViewStyle>
  testID?: string | null
  // unstable
  dataSet?: Object | null
  onMouseDown?: (e: any) => void
  onMouseEnter?: (e: any) => void
  onMouseLeave?: (e: any) => void
  onMouseMove?: (e: any) => void
  onMouseOver?: (e: any) => void
  onMouseOut?: (e: any) => void
  onMouseUp?: (e: any) => void
  onScroll?: (e: any) => void
  onTouchCancel?: (e: any) => void
  onTouchCancelCapture?: (e: any) => void
  onTouchEnd?: (e: any) => void
  onTouchEndCapture?: (e: any) => void
  onTouchMove?: (e: any) => void
  onTouchMoveCapture?: (e: any) => void
  onTouchStart?: (e: any) => void
  onTouchStartCapture?: (e: any) => void
  onWheel?: (e: any) => void
  href?: string | null
  hrefAttrs?: {
    download?: boolean | null
    rel?: string | null
    target?: string | null
  } | null
} & AccessibilityProps
