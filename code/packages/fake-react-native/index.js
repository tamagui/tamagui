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

module.exports = proxy
module.exports.default = proxy
module.exports.Platform = proxy.Platform
module.exports.StyleSheet = proxy.StyleSheet
module.exports.Image = proxy.Image
module.exports.View = proxy.View
module.exports.Text = proxy.Text
module.exports.TextInput = proxy.TextInput
module.exports.ScrollView = proxy.ScrollView
module.exports.Dimensions = proxy.Dimensions
module.exports.Appearance = proxy.Appearance
