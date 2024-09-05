import React from 'react' // native only, taken from react-native

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
  const isInText = React.useContext(TextAncestor)
  const finalElement = React.createElement(ViewNativeComponent, finalProps, children)

  if (!isInText) {
    return finalElement
  }

  return React.createElement(TextAncestor.Provider, { value: false }, finalElement)
}

export function getAccessibilityRoleFromRole(role) {
  switch (role) {
    case 'alert':
      return 'alert'
    case 'alertdialog':
      return
    case 'application':
      return
    case 'article':
      return
    case 'banner':
      return
    case 'button':
      return 'button'
    case 'cell':
      return
    case 'checkbox':
      return 'checkbox'
    case 'columnheader':
      return
    case 'combobox':
      return 'combobox'
    case 'complementary':
      return
    case 'contentinfo':
      return
    case 'definition':
      return
    case 'dialog':
      return
    case 'directory':
      return
    case 'document':
      return
    case 'feed':
      return
    case 'figure':
      return
    case 'form':
      return
    case 'grid':
      return 'grid'
    case 'group':
      return
    case 'heading':
      return 'header'
    case 'img':
      return 'image'
    case 'link':
      return 'link'
    case 'list':
      return 'list'
    case 'listitem':
      return
    case 'log':
      return
    case 'main':
      return
    case 'marquee':
      return
    case 'math':
      return
    case 'menu':
      return 'menu'
    case 'menubar':
      return 'menubar'
    case 'menuitem':
      return 'menuitem'
    case 'meter':
      return
    case 'navigation':
      return
    case 'none':
      return 'none'
    case 'note':
      return
    case 'option':
      return
    case 'presentation':
      return 'none'
    case 'progressbar':
      return 'progressbar'
    case 'radio':
      return 'radio'
    case 'radiogroup':
      return 'radiogroup'
    case 'region':
      return
    case 'row':
      return
    case 'rowgroup':
      return
    case 'rowheader':
      return
    case 'scrollbar':
      return 'scrollbar'
    case 'searchbox':
      return 'search'
    case 'separator':
      return
    case 'slider':
      return 'adjustable'
    case 'spinbutton':
      return 'spinbutton'
    case 'status':
      return
    case 'summary':
      return 'summary'
    case 'switch':
      return 'switch'
    case 'tab':
      return 'tab'
    case 'table':
      return
    case 'tablist':
      return 'tablist'
    case 'tabpanel':
      return
    case 'term':
      return
    case 'timer':
      return 'timer'
    case 'toolbar':
      return 'toolbar'
    case 'tooltip':
      return
    case 'tree':
      return
    case 'treegrid':
      return
    case 'treeitem':
      return
  }

  return
}
