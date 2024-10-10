/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */

import AccessibilityUtil from '../AccessibilityUtil/index'
import { getStylesAtomic, wrapStyleTags } from '@tamagui/web'

const emptyObject = {}
const hasOwnProperty = Object.prototype.hasOwnProperty
const isArray = Array.isArray

const uppercasePattern = /[A-Z]/g
function toHyphenLower(match) {
  return '-' + match.toLowerCase()
}
function hyphenateString(str: string): string {
  return str.replace(uppercasePattern, toHyphenLower)
}
function processIDRefList(idRefList: string | Array<string>): string {
  return isArray(idRefList) ? idRefList.join(' ') : idRefList
}

let pointerEventsStyles

export const stylesFromProps = new WeakMap()

const createDOMProps = (elementType, props, options?) => {
  if (!props) {
    props = emptyObject
  }

  const {
    accessibilityActiveDescendant,
    accessibilityAtomic,
    accessibilityAutoComplete,
    accessibilityBusy,
    accessibilityChecked,
    accessibilityColumnCount,
    accessibilityColumnIndex,
    accessibilityColumnSpan,
    accessibilityControls,
    accessibilityCurrent,
    accessibilityDescribedBy,
    accessibilityDetails,
    accessibilityDisabled,
    accessibilityErrorMessage,
    accessibilityExpanded,
    accessibilityFlowTo,
    accessibilityHasPopup,
    accessibilityHidden,
    accessibilityInvalid,
    accessibilityKeyShortcuts,
    accessibilityLabel,
    accessibilityLabelledBy,
    accessibilityLevel,
    accessibilityLiveRegion,
    accessibilityModal,
    accessibilityMultiline,
    accessibilityMultiSelectable,
    accessibilityOrientation,
    accessibilityOwns,
    accessibilityPlaceholder,
    accessibilityPosInSet,
    accessibilityPressed,
    accessibilityReadOnly,
    accessibilityRequired,
    /* eslint-disable */
    accessibilityRole,
    /* eslint-enable */
    accessibilityRoleDescription,
    accessibilityRowCount,
    accessibilityRowIndex,
    accessibilityRowSpan,
    accessibilitySelected,
    accessibilitySetSize,
    accessibilitySort,
    accessibilityValueMax,
    accessibilityValueMin,
    accessibilityValueNow,
    accessibilityValueText,
    dataSet,
    focusable,
    nativeID,
    pointerEvents,
    style,
    testID,
    id,
    // Rest
    ...domProps
  } = props

  const disabled = accessibilityDisabled

  const role = AccessibilityUtil.propsToAriaRole(props)

  // ACCESSIBILITY
  if (accessibilityActiveDescendant != null) {
    domProps['aria-activedescendant'] = accessibilityActiveDescendant
  }
  if (accessibilityAtomic != null) {
    domProps['aria-atomic'] = accessibilityAtomic
  }
  if (accessibilityAutoComplete != null) {
    domProps['aria-autocomplete'] = accessibilityAutoComplete
  }
  if (accessibilityBusy != null) {
    domProps['aria-busy'] = accessibilityBusy
  }
  if (accessibilityChecked != null) {
    domProps['aria-checked'] = accessibilityChecked
  }
  if (accessibilityColumnCount != null) {
    domProps['aria-colcount'] = accessibilityColumnCount
  }
  if (accessibilityColumnIndex != null) {
    domProps['aria-colindex'] = accessibilityColumnIndex
  }
  if (accessibilityColumnSpan != null) {
    domProps['aria-colspan'] = accessibilityColumnSpan
  }
  if (accessibilityControls != null) {
    domProps['aria-controls'] = processIDRefList(accessibilityControls)
  }
  if (accessibilityCurrent != null) {
    domProps['aria-current'] = accessibilityCurrent
  }
  if (accessibilityDescribedBy != null) {
    domProps['aria-describedby'] = processIDRefList(accessibilityDescribedBy)
  }
  if (accessibilityDetails != null) {
    domProps['aria-details'] = accessibilityDetails
  }
  if (disabled === true) {
    domProps['aria-disabled'] = true
    // Enhance with native semantics
    if (
      elementType === 'button' ||
      elementType === 'form' ||
      elementType === 'input' ||
      elementType === 'select' ||
      elementType === 'textarea'
    ) {
      domProps.disabled = true
    }
  }
  if (accessibilityErrorMessage != null) {
    domProps['aria-errormessage'] = accessibilityErrorMessage
  }
  if (accessibilityExpanded != null) {
    domProps['aria-expanded'] = accessibilityExpanded
  }
  if (accessibilityFlowTo != null) {
    domProps['aria-flowto'] = processIDRefList(accessibilityFlowTo)
  }
  if (accessibilityHasPopup != null) {
    domProps['aria-haspopup'] = accessibilityHasPopup
  }
  if (accessibilityHidden === true) {
    domProps['aria-hidden'] = accessibilityHidden
  }
  if (accessibilityInvalid != null) {
    domProps['aria-invalid'] = accessibilityInvalid
  }
  if (accessibilityKeyShortcuts != null && Array.isArray(accessibilityKeyShortcuts)) {
    domProps['aria-keyshortcuts'] = accessibilityKeyShortcuts.join(' ')
  }
  if (accessibilityLabel != null) {
    domProps['aria-label'] = accessibilityLabel
  }
  if (accessibilityLabelledBy != null) {
    domProps['aria-labelledby'] = processIDRefList(accessibilityLabelledBy)
  }
  if (accessibilityLevel != null) {
    domProps['aria-level'] = accessibilityLevel
  }
  if (accessibilityLiveRegion != null) {
    domProps['aria-live'] =
      accessibilityLiveRegion === 'none' ? 'off' : accessibilityLiveRegion
  }
  if (accessibilityModal != null) {
    domProps['aria-modal'] = accessibilityModal
  }
  if (accessibilityMultiline != null) {
    domProps['aria-multiline'] = accessibilityMultiline
  }
  if (accessibilityMultiSelectable != null) {
    domProps['aria-multiselectable'] = accessibilityMultiSelectable
  }
  if (accessibilityOrientation != null) {
    domProps['aria-orientation'] = accessibilityOrientation
  }
  if (accessibilityOwns != null) {
    domProps['aria-owns'] = processIDRefList(accessibilityOwns)
  }
  if (accessibilityPlaceholder != null) {
    domProps['aria-placeholder'] = accessibilityPlaceholder
  }
  if (accessibilityPosInSet != null) {
    domProps['aria-posinset'] = accessibilityPosInSet
  }
  if (accessibilityPressed != null) {
    domProps['aria-pressed'] = accessibilityPressed
  }
  if (accessibilityReadOnly != null) {
    domProps['aria-readonly'] = accessibilityReadOnly
    // Enhance with native semantics
    if (
      elementType === 'input' ||
      elementType === 'select' ||
      elementType === 'textarea'
    ) {
      domProps.readOnly = true
    }
  }
  if (accessibilityRequired != null) {
    domProps['aria-required'] = accessibilityRequired
    // Enhance with native semantics
    if (
      elementType === 'input' ||
      elementType === 'select' ||
      elementType === 'textarea'
    ) {
      domProps.required = true
    }
  }
  if (role != null) {
    // 'presentation' synonym has wider browser support
    domProps['role'] = role === 'none' ? 'presentation' : role
  }
  if (accessibilityRoleDescription != null) {
    domProps['aria-roledescription'] = accessibilityRoleDescription
  }
  if (accessibilityRowCount != null) {
    domProps['aria-rowcount'] = accessibilityRowCount
  }
  if (accessibilityRowIndex != null) {
    domProps['aria-rowindex'] = accessibilityRowIndex
  }
  if (accessibilityRowSpan != null) {
    domProps['aria-rowspan'] = accessibilityRowSpan
  }
  if (accessibilitySelected != null) {
    domProps['aria-selected'] = accessibilitySelected
  }
  if (accessibilitySetSize != null) {
    domProps['aria-setsize'] = accessibilitySetSize
  }
  if (accessibilitySort != null) {
    domProps['aria-sort'] = accessibilitySort
  }
  if (accessibilityValueMax != null) {
    domProps['aria-valuemax'] = accessibilityValueMax
  }
  if (accessibilityValueMin != null) {
    domProps['aria-valuemin'] = accessibilityValueMin
  }
  if (accessibilityValueNow != null) {
    domProps['aria-valuenow'] = accessibilityValueNow
  }
  if (accessibilityValueText != null) {
    domProps['aria-valuetext'] = accessibilityValueText
  }

  // "dataSet" replaced with "data-*"
  const tmgCN = dataSet ? dataSet.className : undefined
  const tmgID = dataSet ? dataSet.id : undefined

  if (dataSet != null) {
    for (const dataProp in dataSet) {
      if (dataProp === 'className' || dataProp === 'id') continue
      if (hasOwnProperty.call(dataSet, dataProp)) {
        const dataName = hyphenateString(dataProp)
        const dataValue = dataSet[dataProp]
        if (dataValue != null) {
          domProps[`data-${dataName}`] = dataValue
        }
      }
    }
  }

  // FOCUS
  // "focusable" indicates that an element may be a keyboard tab-stop.
  if (focusable === false) {
    domProps.tabIndex = '-1'
  }
  if (
    // These native elements are keyboard focusable by default
    elementType === 'a' ||
    elementType === 'button' ||
    elementType === 'input' ||
    elementType === 'select' ||
    elementType === 'textarea'
  ) {
    if (focusable === false || accessibilityDisabled === true) {
      domProps.tabIndex = '-1'
    }
  } else if (
    // These roles are made keyboard focusable by default
    role === 'button' ||
    role === 'checkbox' ||
    role === 'link' ||
    role === 'radio' ||
    role === 'textbox' ||
    role === 'switch'
  ) {
    if (focusable !== false) {
      domProps.tabIndex = '0'
    }
  } else {
    // Everything else must explicitly set the prop
    if (focusable === true) {
      domProps.tabIndex = '0'
    }
  }

  // Resolve styles
  const flat = []
    .concat(style)
    .flat()
    .flat()
    .flat()
    .flat()
    .reduce((acc, cur) => {
      if (cur) {
        Object.assign(acc, cur)
      }
      return acc
    }, {})

  let className = tmgCN || ''

  if (props.className) {
    className += ` ${props.className}`
  }

  const stylesAtomic = getStylesAtomic(flat)

  stylesFromProps.set(domProps, stylesAtomic)

  domProps.style = stylesAtomic.reduce((acc, [key, value]) => {
    if (key[0] === '_' || key.startsWith('is_') || key.startsWith('font_')) {
      className += ` ${key}`
      return acc
    }
    if (key === '$$css' || key === '') {
      return acc
    }
    acc[key] = value
    return acc
  }, {})

  if (className) {
    domProps.className = className
  }

  // OTHER
  // Native element ID
  const _id = tmgID || id || nativeID
  if (_id) {
    domProps.id = _id
  }
  // Automated test IDs
  if (testID != null) {
    domProps['data-testid'] = testID
  }

  return domProps
}

export default createDOMProps
