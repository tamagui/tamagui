export const accessibilityDirectMap = {}

export const webToNativeAccessibilityDirectMap = {
  'aria-label': 'accessibilityLabel',
  'aria-labelledby': 'accessibilityLabelledBy',
  'aria-live': 'accessibilityLiveRegion',
  'aria-modal': 'accessibilityViewIsModal',
  'aria-hidden': 'accessibilityElementsHidden',
}

export const nativeAccessibilityValue = {
  'aria-valuemin': 'min',
  'aria-valuemax': 'max',
  'aria-valuenow': 'now',
  'aria-valuetext': 'text',
}

export const nativeAccessibilityState = {
  'aria-disabled': 'disabled',
  'aria-selected': 'selected',
  'aria-checked': 'checked',
  'aria-busy': 'busy',
  'aria-expanded': 'expanded',
}

// Note: left side is not always web role, for example togglebutton
export const accessibilityWebRoleToNativeRole = {
  slider: 'adjustable',
  heading: 'header',
  img: 'image',
  link: 'link',
  presentation: 'none',
  region: 'summary',
  group: 'none',
  alert: 'alert',
  button: 'button',
  checkbox: 'checkbox',
  combobox: 'combobox',
  imagebutton: 'imagebutton',
  keyboardkey: 'keyboardkey',
  menu: 'menu',
  menubar: 'menubar',
  menuitem: 'menuitem',
  none: 'none',
  progressbar: 'progressbar',
  radio: 'radio',
  radiogroup: 'radiogroup',
  scrollbar: 'scrollbar',
  searchbox: 'search',
  spinbutton: 'spinbutton',
  grid: 'grid',
  summary: 'summary',
  switch: 'switch',
  tab: 'tab',
  tablist: 'tablist',
  text: 'text',
  timer: 'timer',
  toolbar: 'toolbar',
  togglebutton: 'togglebutton',
}
