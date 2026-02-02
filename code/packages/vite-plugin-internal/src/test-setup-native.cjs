// Setup for native tests - alias react-native to fake-react-native at runtime

const Module = require('module')
const originalRequire = Module.prototype.require

// Mock for usePressability - returns empty event handlers object
const usePressabilityMock = { default: () => ({}) }

Module.prototype.require = function (id) {
  // Handle specific react-native subpaths that need special mocking
  if (id === 'react-native/Libraries/Pressability/usePressability') {
    return usePressabilityMock
  }
  // Redirect all other react-native requires to fake-react-native
  if (id === 'react-native' || id.startsWith('react-native/')) {
    return originalRequire.call(this, '@tamagui/fake-react-native')
  }
  return originalRequire.apply(this, arguments)
}

// Configure @testing-library/react-native host component names
// This is required for v12+ since it can't auto-detect in non-RN environments
try {
  const { configure } = require('@testing-library/react-native')
  configure({
    // Map to the host component names used by fake-react-native / react-test-renderer
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
