const emtpyComponent = () => null

function proxyWorm() {
  return new Proxy(
    {
      StyleSheet: {
        create() {},
      },
      Platform: {
        OS: 'web',
      },
      Image: emtpyComponent,
      View: emtpyComponent,
      Text: emtpyComponent,
      TextInput: emtpyComponent,
      ScrollView: emtpyComponent,
      Dimensions: {
        addEventListener(cb) {},
      },
      Appearance: {
        getColorScheme: () => 'light',
        addChangeListener: () => {},
        removeChangeListener: () => {},
      },
      addPoolingTo() {},
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

// Named exports that can be tree-shaken
export const Platform = proxy.Platform
export const StyleSheet = proxy.StyleSheet
export const Image = proxy.Image
export const View = proxy.View
export const Text = proxy.Text
export const TextInput = proxy.TextInput
export const ScrollView = proxy.ScrollView
export const Dimensions = proxy.Dimensions
export const Pressable = proxy.Pressable
export const Animated = proxy.Animated
export const Easing = proxy.Easing
export const Appearance = proxy.Appearance
export const findNodeHandle = proxy.findNodeHandle
export const unstable_batchedUpdates = proxy.unstable_batchedUpdates

// Default export
export default proxy
