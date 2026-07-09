// Setup for native tests - alias react-native to fake-react-native at runtime

const Module = require('module')
const originalRequire = Module.prototype.require
const React = require('react')

// mock for usePressability - returns empty event handlers object
const usePressabilityMock = { default: () => ({}) }
const SafeAreaInsetsContext = React.createContext(null)
const defaultInsets = { top: 0, right: 0, bottom: 0, left: 0 }
const defaultFrame = { x: 0, y: 0, width: 0, height: 0 }
const safeAreaContextMock = {
  SafeAreaInsetsContext,
  SafeAreaFrameContext: React.createContext(null),
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => defaultInsets,
  useSafeAreaFrame: () => defaultFrame,
  initialWindowMetrics: {
    insets: defaultInsets,
    frame: defaultFrame,
  },
}

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
  // handle specific react-native subpaths that need special mocking
  if (id === 'react-native/Libraries/Pressability/usePressability') {
    return usePressabilityMock
  }
  // redirect all other react-native requires to fake-react-native
  if (id === 'react-native' || id.startsWith('react-native/')) {
    return originalRequire.call(this, '@tamagui/fake-react-native')
  }
  return originalRequire.apply(this, arguments)
}

// configure @testing-library/react-native host component names
// this is required for v12+ since it can't auto-detect in non-RN environments
try {
  const { configure } = require('@testing-library/react-native')
  configure({
    // map to the host component names used by fake-react-native / react-test-renderer
    hostComponentNames: {
      text: 'Text',
      textInput: 'TextInput',
      image: 'Image',
      switch: 'Switch',
      scrollView: 'ScrollView',
      modal: 'Modal',
    },
  })
} catch (e) {
  // @testing-library/react-native may not be installed in all test packages
}
