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
  alert: 'alert',
  button: 'button',
  checkbox: 'checkbox',
  combobox: 'combobox',
  grid: 'grid',
  group: 'none',
  heading: 'header',
  imagebutton: 'imagebutton',
  img: 'image',
  keyboardkey: 'keyboardkey',
  link: 'link',
  menu: 'menu',
  menubar: 'menubar',
  menuitem: 'menuitem',
  none: 'none',
  presentation: 'none',
  progressbar: 'progressbar',
  radio: 'radio',
  radiogroup: 'radiogroup',
  region: 'summary',
  scrollbar: 'scrollbar',
  searchbox: 'search',
  slider: 'adjustable',
  spinbutton: 'spinbutton',
  summary: 'summary',
  switch: 'switch',
  tab: 'tab',
  tablist: 'tablist',
  text: 'text',
  timer: 'timer',
  togglebutton: 'togglebutton',
  toolbar: 'toolbar',
}
