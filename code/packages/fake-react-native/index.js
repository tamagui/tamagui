const React = require('react')

// Create mock RN components that render as simple divs/spans for testing
// react-test-renderer will serialize these properly
const createMockComponent = (name) => {
  const Component = React.forwardRef((props, ref) => {
    const { children, style, ...rest } = props
    // Return a "View" element that react-test-renderer understands
    return React.createElement(name, { ...rest, style, ref }, children)
  })
  Component.displayName = name
  return Component
}

// For components that don't need to render (like Image)
const emtpyComponent = () => null

// Mock usePressability for testing - returns empty event handlers
const usePressabilityMock = () => ({})

// real context: consumers (tamagui's useChildren) call React.useContext on it,
// the proxyWorm fallback object would break that
const TextAncestorContext = React.createContext(false)
const Animated = {
  createAnimatedComponent: (Component) => Component,
}
const PanResponder = {
  create: (handlers) => ({ panHandlers: handlers }),
}
const TurboModuleRegistry = {
  get: () => null,
}
const codegenNativeCommands = () => ({})
const codegenNativeComponent = (name) => createMockComponent(name)

function proxyWorm() {
  return new Proxy(
    {
      StyleSheet: {
        create() {},
      },
      unstable_TextAncestorContext: TextAncestorContext,
      Platform: {
        OS: 'web',
        select: (options) => options.web ?? options.default,
      },
      Image: emtpyComponent,
      View: createMockComponent('View'),
      Text: createMockComponent('Text'),
      TextInput: createMockComponent('TextInput'),
      ScrollView: createMockComponent('ScrollView'),
      FlatList: createMockComponent('FlatList'),
      Pressable: createMockComponent('Pressable'),
      Animated,
      NativeModules: {},
      PanResponder,
      TurboModuleRegistry,
      processColor: (color) => color,
      Dimensions: {
        get: () => ({ width: 1024, height: 768 }),
        addEventListener: () => ({ remove: () => {} }),
      },
      Appearance: {
        getColorScheme: () => 'light',
        addChangeListener: () => {},
        removeChangeListener: () => {},
      },
      addPoolingTo() {},
      // Libraries/Pressability/usePressability mock
      Libraries: {
        Pressability: {
          usePressability: {
            default: usePressabilityMock,
          },
        },
      },
    },
    {
      get(target, key) {
        return Reflect.get(target, key) || proxyWorm()
      },
      apply() {
        return proxyWorm()
      },
    }
  )
}

const proxy = proxyWorm()

module.exports = proxy
module.exports.default = proxy
module.exports.Platform = proxy.Platform
module.exports.StyleSheet = proxy.StyleSheet
module.exports.Image = proxy.Image
module.exports.View = proxy.View
module.exports.Text = proxy.Text
module.exports.TextInput = proxy.TextInput
module.exports.ScrollView = proxy.ScrollView
module.exports.FlatList = proxy.FlatList
module.exports.Pressable = proxy.Pressable
module.exports.Animated = proxy.Animated
module.exports.NativeModules = proxy.NativeModules
module.exports.PanResponder = proxy.PanResponder
module.exports.TurboModuleRegistry = proxy.TurboModuleRegistry
module.exports.processColor = proxy.processColor
module.exports.Dimensions = proxy.Dimensions
module.exports.Appearance = proxy.Appearance
module.exports.codegenNativeCommands = codegenNativeCommands
module.exports.codegenNativeComponent = codegenNativeComponent
