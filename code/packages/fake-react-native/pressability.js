const { dirname, join } = require('node:path')
const createNativeModuleLoader = require('./loadNativeModule')

// run react native's actual press state machine in native tests. only the
// platform bindings are mocked; geometry, timers and cancellation stay real.
// published so any native test setup, in or out of this repo, aliases
// react-native/Libraries/Pressability/usePressability to this one file.
const root = dirname(require.resolve('react-native/package.json'))
const platform = require('./index.js').Platform
const bindings = new Map([
  [join(root, 'Libraries/Utilities/Platform.js'), platform],
  [
    join(root, 'Libraries/ReactNative/UIManager.js'),
    {
      measure() {
        throw new Error('native press tests must provide a measurable responder')
      },
    },
  ],
  [join(root, 'Libraries/Components/Sound/SoundManager.js'), { playTouchSound() {} }],
  [
    join(root, 'src/private/featureflags/ReactNativeFeatureFlags.js'),
    {
      shouldPressibilityUseW3CPointerEventsForHover: () => false,
    },
  ],
])
const load = createNativeModuleLoader(bindings)

module.exports = load(join(root, 'Libraries/Pressability/usePressability.js')).default
