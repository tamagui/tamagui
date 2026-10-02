delete process.env.IS_STATIC

const Module = require('module')

const originalRequire = Module.prototype.require
const safeAreaContextMock = require('./tests/native-safe-area.cjs')
const nativePressability = require('./tests/native-pressability.cjs')

const nativeBindings = require('./tests/native-platform.cjs')

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
    return { __esModule: true, default: nativePressability }
  }
  if (id === 'react-native' || id.startsWith('react-native/')) {
    return nativeBindings
  }
  return originalRequire.apply(this, arguments)
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true
