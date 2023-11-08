// native only, taken from react-native

import { createElement, useContext } from 'react'

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

export function createOptimizedView(
  children: any,
  viewProps: Record<string, any>,
  baseViews: any
) {
  const TextAncestor = baseViews.TextAncestor
  const ViewNativeComponent = baseViews.View

  // return createElement(ViewNativeComponent, viewProps, children)

  const {
    accessibilityElementsHidden,
    accessibilityLabel,
    accessibilityLabelledBy,
    accessibilityLiveRegion,
    accessibilityRole,
    accessibilityState,
    accessibilityValue,
    'aria-busy': ariaBusy,
    'aria-checked': ariaChecked,
    'aria-disabled': ariaDisabled,
    'aria-expanded': ariaExpanded,
    'aria-hidden': ariaHidden,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-live': ariaLive,
    'aria-selected': ariaSelected,
    'aria-valuemax': ariaValueMax,
    'aria-valuemin': ariaValueMin,
    'aria-valuenow': ariaValueNow,
    'aria-valuetext': ariaValueText,
    focusable,
    id,
    importantForAccessibility,
    nativeID,
    pointerEvents,
    role,
    tabIndex,
    // ...otherProps
  } = viewProps

  const _accessibilityLabelledBy =
    ariaLabelledBy?.split(/\s*,\s*/g) ?? accessibilityLabelledBy

  let _accessibilityState
  if (
    accessibilityState != null ||
    ariaBusy != null ||
    ariaChecked != null ||
    ariaDisabled != null ||
    ariaExpanded != null ||
    ariaSelected != null
  ) {
    _accessibilityState = {
      busy: ariaBusy ?? accessibilityState?.busy,
      checked: ariaChecked ?? accessibilityState?.checked,
      disabled: ariaDisabled ?? accessibilityState?.disabled,
      expanded: ariaExpanded ?? accessibilityState?.expanded,
      selected: ariaSelected ?? accessibilityState?.selected,
    }
  }
  let _accessibilityValue
  if (
    accessibilityValue != null ||
    ariaValueMax != null ||
    ariaValueMin != null ||
    ariaValueNow != null ||
    ariaValueText != null
  ) {
    _accessibilityValue = {
      max: ariaValueMax ?? accessibilityValue?.max,
      min: ariaValueMin ?? accessibilityValue?.min,
      now: ariaValueNow ?? accessibilityValue?.now,
      text: ariaValueText ?? accessibilityValue?.text,
    }
  }

  let style = Array.isArray(viewProps.style)
    ? baseViews.StyleSheet.flatten(viewProps.style)
    : viewProps.style
  const newPointerEvents = style?.pointerEvents || pointerEvents

  const finalProps = viewProps

  const extras = {
    accessibilityLiveRegion:
      ariaLive === 'off' ? 'none' : ariaLive ?? accessibilityLiveRegion,
    accessibilityLabel: ariaLabel ?? accessibilityLabel,
    focusable: tabIndex !== undefined ? !tabIndex : focusable,
    accessibilityState: _accessibilityState,
    accessibilityRole: role ? getAccessibilityRoleFromRole(role) : accessibilityRole,
    accessibilityElementsHidden: ariaHidden ?? accessibilityElementsHidden,
    accessibilityLabelledBy: _accessibilityLabelledBy,
    accessibilityValue: _accessibilityValue,
    importantForAccessibility:
      ariaHidden === true ? 'no-hide-descendants' : importantForAccessibility,
    nativeID: id ?? nativeID,
    style,
    pointerEvents: newPointerEvents,
  }
  // avoid adding undefined props
  for (const key in extras) {
    if (extras[key] != null) {
      finalProps[key] = extras[key]
    }
  }

  // isInText is significantly faster than just providing it each time
  const isInText = useContext(TextAncestor)
  const finalElement = createElement(ViewNativeComponent, finalProps, children)

  if (!isInText) {
    return finalElement
  }

  return createElement(TextAncestor.Provider, { value: false }, finalElement)
}

export function getAccessibilityRoleFromRole(role) {
  switch (role) {
    case 'alert':
      return 'alert'
    case 'alertdialog':
      return undefined
    case 'application':
      return undefined
    case 'article':
      return undefined
    case 'banner':
      return undefined
    case 'button':
      return 'button'
    case 'cell':
      return undefined
    case 'checkbox':
      return 'checkbox'
    case 'columnheader':
      return undefined
    case 'combobox':
      return 'combobox'
    case 'complementary':
      return undefined
    case 'contentinfo':
      return undefined
    case 'definition':
      return undefined
    case 'dialog':
      return undefined
    case 'directory':
      return undefined
    case 'document':
      return undefined
    case 'feed':
      return undefined
    case 'figure':
      return undefined
    case 'form':
      return undefined
    case 'grid':
      return 'grid'
    case 'group':
      return undefined
    case 'heading':
      return 'header'
    case 'img':
      return 'image'
    case 'link':
      return 'link'
    case 'list':
      return 'list'
    case 'listitem':
      return undefined
    case 'log':
      return undefined
    case 'main':
      return undefined
    case 'marquee':
      return undefined
    case 'math':
      return undefined
    case 'menu':
      return 'menu'
    case 'menubar':
      return 'menubar'
    case 'menuitem':
      return 'menuitem'
    case 'meter':
      return undefined
    case 'navigation':
      return undefined
    case 'none':
      return 'none'
    case 'note':
      return undefined
    case 'option':
      return undefined
    case 'presentation':
      return 'none'
    case 'progressbar':
      return 'progressbar'
    case 'radio':
      return 'radio'
    case 'radiogroup':
      return 'radiogroup'
    case 'region':
      return undefined
    case 'row':
      return undefined
    case 'rowgroup':
      return undefined
    case 'rowheader':
      return undefined
    case 'scrollbar':
      return 'scrollbar'
    case 'searchbox':
      return 'search'
    case 'separator':
      return undefined
    case 'slider':
      return 'adjustable'
    case 'spinbutton':
      return 'spinbutton'
    case 'status':
      return undefined
    case 'summary':
      return 'summary'
    case 'switch':
      return 'switch'
    case 'tab':
      return 'tab'
    case 'table':
      return undefined
    case 'tablist':
      return 'tablist'
    case 'tabpanel':
      return undefined
    case 'term':
      return undefined
    case 'timer':
      return 'timer'
    case 'toolbar':
      return 'toolbar'
    case 'tooltip':
      return undefined
    case 'tree':
      return undefined
    case 'treegrid':
      return undefined
    case 'treeitem':
      return undefined
  }

  return undefined
}
