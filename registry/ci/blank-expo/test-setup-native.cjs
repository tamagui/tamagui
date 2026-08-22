const Module = require('module')

const originalRequire = Module.prototype.require
const safeAreaContextMock = require('./tests/native-safe-area.cjs')

Module.prototype.require = function (id) {
  if (
    id === 'react-native-safe-area-context' ||
    id.startsWith('react-native-safe-area-context/')
  ) {
    return safeAreaContextMock
  }
  if (id === 'react-native/Libraries/Utilities/codegenNativeComponent') {
    return () => 'NativeComponent'
  }
  if (id === 'react-native/Libraries/Pressability/usePressability') {
    return { default: () => ({}) }
  }
  if (id === 'react-native' || id.startsWith('react-native/')) {
    return originalRequire.call(this, '@tamagui/fake-react-native')
  }
  return originalRequire.apply(this, arguments)
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true
