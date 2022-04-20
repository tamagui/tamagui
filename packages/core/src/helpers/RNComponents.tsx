import * as ReactNative from 'react-native'

// bye bye tree shaking... but only way to properly detect react-native components...
// also neither rnw nor react support tree shaking atm
export const RNComponents = new WeakMap()

// I was looping over all of them, but casuses deprecation warnings and there's only a few
// we realistically support - lets whitelist rather than blacklist
for (const key of ['Image', 'TextInput', 'Text', 'View']) {
  const val = ReactNative[key]
  if (val && typeof val === 'object') {
    RNComponents.set(val, true)
  }
}
