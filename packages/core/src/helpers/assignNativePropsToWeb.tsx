import { accessibilityRoleToWebRole, processIDRefList } from '../createComponent'

// adapted from react-native-web

export function assignNativePropsToWeb(elementType: string, viewProps: any, nativeProps: any) {
  if (!viewProps.role && nativeProps.accessibilityRole) {
    if (nativeProps.accessibilityRole === 'none') {
      viewProps.role = 'presentation'
    } else {
      const webRole = accessibilityRoleToWebRole[nativeProps.accessibilityRole]
      if (webRole != null) {
        viewProps.role = webRole || nativeProps.accessibilityRole
      }
    }
  }

  if (nativeProps.accessibilityActiveDescendant != null) {
    viewProps['aria-activedescendant'] = nativeProps.accessibilityActiveDescendant
  }
  if (nativeProps.accessibilityAtomic != null) {
    viewProps['aria-atomic'] = nativeProps.accessibilityAtomic
  }
  if (nativeProps.accessibilityAutoComplete != null) {
    viewProps['aria-autocomplete'] = nativeProps.accessibilityAutoComplete
  }
  if (nativeProps.accessibilityBusy != null) {
    viewProps['aria-busy'] = nativeProps.accessibilityBusy
  }
  if (nativeProps.accessibilityChecked != null) {
    viewProps['aria-checked'] = nativeProps.accessibilityChecked
  }
  if (nativeProps.accessibilityColumnCount != null) {
    viewProps['aria-colcount'] = nativeProps.accessibilityColumnCount
  }
  if (nativeProps.accessibilityColumnIndex != null) {
    viewProps['aria-colindex'] = nativeProps.accessibilityColumnIndex
  }
  if (nativeProps.accessibilityColumnSpan != null) {
    viewProps['aria-colspan'] = nativeProps.accessibilityColumnSpan
  }
  if (nativeProps.accessibilityControls != null) {
    console.log('wtf', nativeProps.accessibilityControls)
    viewProps['aria-controls'] = processIDRefList(nativeProps.accessibilityControls)
  }
  if (nativeProps.accessibilityCurrent != null) {
    viewProps['aria-current'] = nativeProps.accessibilityCurrent
  }
  if (nativeProps.accessibilityDescribedBy != null) {
    viewProps['aria-describedby'] = processIDRefList(nativeProps.accessibilityDescribedBy)
  }
  if (nativeProps.accessibilityDetails != null) {
    viewProps['aria-details'] = nativeProps.accessibilityDetails
  }
  if (nativeProps.disabled === true) {
    viewProps['aria-disabled'] = true
    // Enhance with native semantics
    if (
      elementType === 'button' ||
      elementType === 'form' ||
      elementType === 'input' ||
      elementType === 'select' ||
      elementType === 'textarea'
    ) {
      viewProps.disabled = true
    }
  }
  if (nativeProps.accessibilityErrorMessage != null) {
    viewProps['aria-errormessage'] = nativeProps.accessibilityErrorMessage
  }
  if (nativeProps.accessibilityExpanded != null) {
    viewProps['aria-expanded'] = nativeProps.accessibilityExpanded
  }
  if (nativeProps.accessibilityFlowTo != null) {
    viewProps['aria-flowto'] = processIDRefList(nativeProps.accessibilityFlowTo)
  }
  if (nativeProps.accessibilityHasPopup != null) {
    viewProps['aria-haspopup'] = nativeProps.accessibilityHasPopup
  }
  if (nativeProps.accessibilityHidden === true) {
    viewProps['aria-hidden'] = nativeProps.accessibilityHidden
  }
  if (nativeProps.accessibilityInvalid != null) {
    viewProps['aria-invalid'] = nativeProps.accessibilityInvalid
  }
  if (
    nativeProps.accessibilityKeyShortcuts != null &&
    Array.isArray(nativeProps.accessibilityKeyShortcuts)
  ) {
    viewProps['aria-keyshortcuts'] = nativeProps.accessibilityKeyShortcuts.join(' ')
  }
  if (nativeProps.accessibilityLabel != null) {
    viewProps['aria-label'] = nativeProps.accessibilityLabel
  }
  if (nativeProps.accessibilityLabelledBy != null) {
    viewProps['aria-labelledby'] = processIDRefList(nativeProps.accessibilityLabelledBy)
  }
  if (nativeProps.accessibilityLevel != null) {
    viewProps['aria-level'] = nativeProps.accessibilityLevel
  }
  if (nativeProps.accessibilityLiveRegion != null) {
    viewProps['aria-live'] =
      nativeProps.accessibilityLiveRegion === 'none' ? 'off' : nativeProps.accessibilityLiveRegion
  }
  if (nativeProps.accessibilityModal != null) {
    viewProps['aria-modal'] = nativeProps.accessibilityModal
  }
  if (nativeProps.accessibilityMultiline != null) {
    viewProps['aria-multiline'] = nativeProps.accessibilityMultiline
  }
  if (nativeProps.accessibilityMultiSelectable != null) {
    viewProps['aria-multiselectable'] = nativeProps.accessibilityMultiSelectable
  }
  if (nativeProps.accessibilityOrientation != null) {
    viewProps['aria-orientation'] = nativeProps.accessibilityOrientation
  }
  if (nativeProps.accessibilityOwns != null) {
    viewProps['aria-owns'] = processIDRefList(nativeProps.accessibilityOwns)
  }
  if (nativeProps.accessibilityPlaceholder != null) {
    viewProps['aria-placeholder'] = nativeProps.accessibilityPlaceholder
  }
  if (nativeProps.accessibilityPosInSet != null) {
    viewProps['aria-posinset'] = nativeProps.accessibilityPosInSet
  }
  if (nativeProps.accessibilityPressed != null) {
    viewProps['aria-pressed'] = nativeProps.accessibilityPressed
  }
  if (nativeProps.accessibilityReadOnly != null) {
    viewProps['aria-readonly'] = nativeProps.accessibilityReadOnly
    // Enhance with native semantics
    if (elementType === 'input' || elementType === 'select' || elementType === 'textarea') {
      viewProps.readOnly = true
    }
  }
  if (nativeProps.accessibilityRequired != null) {
    viewProps['aria-required'] = nativeProps.accessibilityRequired
    // Enhance with native semantics
    if (elementType === 'input' || elementType === 'select' || elementType === 'textarea') {
      viewProps.required = true
    }
  }
  if (nativeProps.accessibilityRoleDescription != null) {
    viewProps['aria-roledescription'] = nativeProps.accessibilityRoleDescription
  }
  if (nativeProps.accessibilityRowCount != null) {
    viewProps['aria-rowcount'] = nativeProps.accessibilityRowCount
  }
  if (nativeProps.accessibilityRowIndex != null) {
    viewProps['aria-rowindex'] = nativeProps.accessibilityRowIndex
  }
  if (nativeProps.accessibilityRowSpan != null) {
    viewProps['aria-rowspan'] = nativeProps.accessibilityRowSpan
  }
  if (nativeProps.accessibilitySelected != null) {
    viewProps['aria-selected'] = nativeProps.accessibilitySelected
  }
  if (nativeProps.accessibilitySetSize != null) {
    viewProps['aria-setsize'] = nativeProps.accessibilitySetSize
  }
  if (nativeProps.accessibilitySort != null) {
    viewProps['aria-sort'] = nativeProps.accessibilitySort
  }
  if (nativeProps.accessibilityValueMax != null) {
    viewProps['aria-valuemax'] = nativeProps.accessibilityValueMax
  }
  if (nativeProps.accessibilityValueMin != null) {
    viewProps['aria-valuemin'] = nativeProps.accessibilityValueMin
  }
  if (nativeProps.accessibilityValueNow != null) {
    viewProps['aria-valuenow'] = nativeProps.accessibilityValueNow
  }
  if (nativeProps.accessibilityValueText != null) {
    viewProps['aria-valuetext'] = nativeProps.accessibilityValueText
  }

  if (nativeProps.nativeID) {
    viewProps.id = nativeProps.nativeID
  }
}
