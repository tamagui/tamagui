function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
import AccessibilityUtil from '../AccessibilityUtil';
import StyleSheet from '../../exports/StyleSheet';
var emptyObject = {};
var hasOwnProperty = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;
var uppercasePattern = /[A-Z]/g;

function toHyphenLower(match) {
  return '-' + match.toLowerCase();
}

function hyphenateString(str) {
  return str.replace(uppercasePattern, toHyphenLower);
}

function processIDRefList(idRefList) {
  return isArray(idRefList) ? idRefList.join(' ') : idRefList;
}

var pointerEventsStyles = StyleSheet.create({
  auto: {
    pointerEvents: 'auto'
  },
  'box-none': {
    pointerEvents: 'box-none'
  },
  'box-only': {
    pointerEvents: 'box-only'
  },
  none: {
    pointerEvents: 'none'
  }
});

var createDOMProps = function createDOMProps(elementType, props, options) {
  if (!props) {
    props = emptyObject;
  }

  var _props = props,
      accessibilityActiveDescendant = _props.accessibilityActiveDescendant,
      accessibilityAtomic = _props.accessibilityAtomic,
      accessibilityAutoComplete = _props.accessibilityAutoComplete,
      accessibilityBusy = _props.accessibilityBusy,
      accessibilityChecked = _props.accessibilityChecked,
      accessibilityColumnCount = _props.accessibilityColumnCount,
      accessibilityColumnIndex = _props.accessibilityColumnIndex,
      accessibilityColumnSpan = _props.accessibilityColumnSpan,
      accessibilityControls = _props.accessibilityControls,
      accessibilityCurrent = _props.accessibilityCurrent,
      accessibilityDescribedBy = _props.accessibilityDescribedBy,
      accessibilityDetails = _props.accessibilityDetails,
      accessibilityDisabled = _props.accessibilityDisabled,
      accessibilityErrorMessage = _props.accessibilityErrorMessage,
      accessibilityExpanded = _props.accessibilityExpanded,
      accessibilityFlowTo = _props.accessibilityFlowTo,
      accessibilityHasPopup = _props.accessibilityHasPopup,
      accessibilityHidden = _props.accessibilityHidden,
      accessibilityInvalid = _props.accessibilityInvalid,
      accessibilityKeyShortcuts = _props.accessibilityKeyShortcuts,
      accessibilityLabel = _props.accessibilityLabel,
      accessibilityLabelledBy = _props.accessibilityLabelledBy,
      accessibilityLevel = _props.accessibilityLevel,
      accessibilityLiveRegion = _props.accessibilityLiveRegion,
      accessibilityModal = _props.accessibilityModal,
      accessibilityMultiline = _props.accessibilityMultiline,
      accessibilityMultiSelectable = _props.accessibilityMultiSelectable,
      accessibilityOrientation = _props.accessibilityOrientation,
      accessibilityOwns = _props.accessibilityOwns,
      accessibilityPlaceholder = _props.accessibilityPlaceholder,
      accessibilityPosInSet = _props.accessibilityPosInSet,
      accessibilityPressed = _props.accessibilityPressed,
      accessibilityReadOnly = _props.accessibilityReadOnly,
      accessibilityRequired = _props.accessibilityRequired,
      accessibilityRole = _props.accessibilityRole,
      accessibilityRoleDescription = _props.accessibilityRoleDescription,
      accessibilityRowCount = _props.accessibilityRowCount,
      accessibilityRowIndex = _props.accessibilityRowIndex,
      accessibilityRowSpan = _props.accessibilityRowSpan,
      accessibilitySelected = _props.accessibilitySelected,
      accessibilitySetSize = _props.accessibilitySetSize,
      accessibilitySort = _props.accessibilitySort,
      accessibilityValueMax = _props.accessibilityValueMax,
      accessibilityValueMin = _props.accessibilityValueMin,
      accessibilityValueNow = _props.accessibilityValueNow,
      accessibilityValueText = _props.accessibilityValueText,
      dataSet = _props.dataSet,
      focusable = _props.focusable,
      nativeID = _props.nativeID,
      pointerEvents = _props.pointerEvents,
      style = _props.style,
      testID = _props.testID,
      domProps = _objectWithoutPropertiesLoose(_props, ["accessibilityActiveDescendant", "accessibilityAtomic", "accessibilityAutoComplete", "accessibilityBusy", "accessibilityChecked", "accessibilityColumnCount", "accessibilityColumnIndex", "accessibilityColumnSpan", "accessibilityControls", "accessibilityCurrent", "accessibilityDescribedBy", "accessibilityDetails", "accessibilityDisabled", "accessibilityErrorMessage", "accessibilityExpanded", "accessibilityFlowTo", "accessibilityHasPopup", "accessibilityHidden", "accessibilityInvalid", "accessibilityKeyShortcuts", "accessibilityLabel", "accessibilityLabelledBy", "accessibilityLevel", "accessibilityLiveRegion", "accessibilityModal", "accessibilityMultiline", "accessibilityMultiSelectable", "accessibilityOrientation", "accessibilityOwns", "accessibilityPlaceholder", "accessibilityPosInSet", "accessibilityPressed", "accessibilityReadOnly", "accessibilityRequired", "accessibilityRole", "accessibilityRoleDescription", "accessibilityRowCount", "accessibilityRowIndex", "accessibilityRowSpan", "accessibilitySelected", "accessibilitySetSize", "accessibilitySort", "accessibilityValueMax", "accessibilityValueMin", "accessibilityValueNow", "accessibilityValueText", "dataSet", "focusable", "nativeID", "pointerEvents", "style", "testID"]);

  var disabled = accessibilityDisabled;
  var role = AccessibilityUtil.propsToAriaRole(props); // ACCESSIBILITY

  if (accessibilityActiveDescendant != null) {
    domProps['aria-activedescendant'] = accessibilityActiveDescendant;
  }

  if (accessibilityAtomic != null) {
    domProps['aria-atomic'] = accessibilityAtomic;
  }

  if (accessibilityAutoComplete != null) {
    domProps['aria-autocomplete'] = accessibilityAutoComplete;
  }

  if (accessibilityBusy != null) {
    domProps['aria-busy'] = accessibilityBusy;
  }

  if (accessibilityChecked != null) {
    domProps['aria-checked'] = accessibilityChecked;
  }

  if (accessibilityColumnCount != null) {
    domProps['aria-colcount'] = accessibilityColumnCount;
  }

  if (accessibilityColumnIndex != null) {
    domProps['aria-colindex'] = accessibilityColumnIndex;
  }

  if (accessibilityColumnSpan != null) {
    domProps['aria-colspan'] = accessibilityColumnSpan;
  }

  if (accessibilityControls != null) {
    domProps['aria-controls'] = processIDRefList(accessibilityControls);
  }

  if (accessibilityCurrent != null) {
    domProps['aria-current'] = accessibilityCurrent;
  }

  if (accessibilityDescribedBy != null) {
    domProps['aria-describedby'] = processIDRefList(accessibilityDescribedBy);
  }

  if (accessibilityDetails != null) {
    domProps['aria-details'] = accessibilityDetails;
  }

  if (disabled === true) {
    domProps['aria-disabled'] = true; // Enhance with native semantics

    if (elementType === 'button' || elementType === 'form' || elementType === 'input' || elementType === 'select' || elementType === 'textarea') {
      domProps.disabled = true;
    }
  }

  if (accessibilityErrorMessage != null) {
    domProps['aria-errormessage'] = accessibilityErrorMessage;
  }

  if (accessibilityExpanded != null) {
    domProps['aria-expanded'] = accessibilityExpanded;
  }

  if (accessibilityFlowTo != null) {
    domProps['aria-flowto'] = processIDRefList(accessibilityFlowTo);
  }

  if (accessibilityHasPopup != null) {
    domProps['aria-haspopup'] = accessibilityHasPopup;
  }

  if (accessibilityHidden === true) {
    domProps['aria-hidden'] = accessibilityHidden;
  }

  if (accessibilityInvalid != null) {
    domProps['aria-invalid'] = accessibilityInvalid;
  }

  if (accessibilityKeyShortcuts != null && Array.isArray(accessibilityKeyShortcuts)) {
    domProps['aria-keyshortcuts'] = accessibilityKeyShortcuts.join(' ');
  }

  if (accessibilityLabel != null) {
    domProps['aria-label'] = accessibilityLabel;
  }

  if (accessibilityLabelledBy != null) {
    domProps['aria-labelledby'] = processIDRefList(accessibilityLabelledBy);
  }

  if (accessibilityLevel != null) {
    domProps['aria-level'] = accessibilityLevel;
  }

  if (accessibilityLiveRegion != null) {
    domProps['aria-live'] = accessibilityLiveRegion === 'none' ? 'off' : accessibilityLiveRegion;
  }

  if (accessibilityModal != null) {
    domProps['aria-modal'] = accessibilityModal;
  }

  if (accessibilityMultiline != null) {
    domProps['aria-multiline'] = accessibilityMultiline;
  }

  if (accessibilityMultiSelectable != null) {
    domProps['aria-multiselectable'] = accessibilityMultiSelectable;
  }

  if (accessibilityOrientation != null) {
    domProps['aria-orientation'] = accessibilityOrientation;
  }

  if (accessibilityOwns != null) {
    domProps['aria-owns'] = processIDRefList(accessibilityOwns);
  }

  if (accessibilityPlaceholder != null) {
    domProps['aria-placeholder'] = accessibilityPlaceholder;
  }

  if (accessibilityPosInSet != null) {
    domProps['aria-posinset'] = accessibilityPosInSet;
  }

  if (accessibilityPressed != null) {
    domProps['aria-pressed'] = accessibilityPressed;
  }

  if (accessibilityReadOnly != null) {
    domProps['aria-readonly'] = accessibilityReadOnly; // Enhance with native semantics

    if (elementType === 'input' || elementType === 'select' || elementType === 'textarea') {
      domProps.readOnly = true;
    }
  }

  if (accessibilityRequired != null) {
    domProps['aria-required'] = accessibilityRequired; // Enhance with native semantics

    if (elementType === 'input' || elementType === 'select' || elementType === 'textarea') {
      domProps.required = true;
    }
  }

  if (role != null) {
    // 'presentation' synonym has wider browser support
    domProps['role'] = role === 'none' ? 'presentation' : role;
  }

  if (accessibilityRoleDescription != null) {
    domProps['aria-roledescription'] = accessibilityRoleDescription;
  }

  if (accessibilityRowCount != null) {
    domProps['aria-rowcount'] = accessibilityRowCount;
  }

  if (accessibilityRowIndex != null) {
    domProps['aria-rowindex'] = accessibilityRowIndex;
  }

  if (accessibilityRowSpan != null) {
    domProps['aria-rowspan'] = accessibilityRowSpan;
  }

  if (accessibilitySelected != null) {
    domProps['aria-selected'] = accessibilitySelected;
  }

  if (accessibilitySetSize != null) {
    domProps['aria-setsize'] = accessibilitySetSize;
  }

  if (accessibilitySort != null) {
    domProps['aria-sort'] = accessibilitySort;
  }

  if (accessibilityValueMax != null) {
    domProps['aria-valuemax'] = accessibilityValueMax;
  }

  if (accessibilityValueMin != null) {
    domProps['aria-valuemin'] = accessibilityValueMin;
  }

  if (accessibilityValueNow != null) {
    domProps['aria-valuenow'] = accessibilityValueNow;
  }

  if (accessibilityValueText != null) {
    domProps['aria-valuetext'] = accessibilityValueText;
  } // "dataSet" replaced with "data-*"


  const tmgCN = dataSet ? dataSet.className : undefined
  const tmgID = dataSet ? dataSet.id : undefined

  if (dataSet != null) {
    for (var dataProp in dataSet) {
      if (dataProp === 'className' || dataProp === 'id') continue
      if (hasOwnProperty.call(dataSet, dataProp)) {
        var dataName = hyphenateString(dataProp);
        var dataValue = dataSet[dataProp];

        if (dataValue != null) {
          domProps["data-" + dataName] = dataValue;
        }
      }
    }
  } // FOCUS
  // "focusable" indicates that an element may be a keyboard tab-stop.


  if (focusable === false) {
    domProps.tabIndex = '-1';
  }

  if ( // These native elements are keyboard focusable by default
  elementType === 'a' || elementType === 'button' || elementType === 'input' || elementType === 'select' || elementType === 'textarea') {
    if (focusable === false || accessibilityDisabled === true) {
      domProps.tabIndex = '-1';
    }
  } else if ( // These roles are made keyboard focusable by default
  role === 'button' || role === 'checkbox' || role === 'link' || role === 'radio' || role === 'textbox' || role === 'switch') {
    if (focusable !== false) {
      domProps.tabIndex = '0';
    }
  } else {
    // Everything else must explicitly set the prop
    if (focusable === true) {
      domProps.tabIndex = '0';
    }
  } // Resolve styles
  
  var _StyleSheet = StyleSheet([style, pointerEvents && pointerEventsStyles[pointerEvents]], {
    writingDirection: options ? options.writingDirection : 'ltr'
  }),
      className = _StyleSheet[0],
      inlineStyle = _StyleSheet[1];

  // elementType = null on setNativeProps and overrides our classname
  if (elementType != null && className) {
    domProps.className = className;
  }

  if (inlineStyle) {
    domProps.style = inlineStyle;
  }
  
  if (tmgCN) {
    domProps.className = tmgCN
  }

  if (tmgID) {
    domProps.id = tmgID
  } else if (nativeID != null) {
    domProps.id = nativeID;
  } // Automated test IDs


  if (testID != null) {
    domProps['data-testid'] = testID;
  }

  return domProps;
};

export default createDOMProps;