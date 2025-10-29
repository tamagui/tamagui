module.exports = proxyWorm()

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
