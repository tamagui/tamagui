// Setup for native tests - alias react-native to fake-react-native at runtime

const Module = require('module')
const originalRequire = Module.prototype.require

Module.prototype.require = function(id) {
  // Redirect all react-native requires to fake-react-native
  if (id === 'react-native' || id.startsWith('react-native/')) {
    return originalRequire.call(this, '@tamagui/fake-react-native')
  }
  return originalRequire.apply(this, arguments)
}
