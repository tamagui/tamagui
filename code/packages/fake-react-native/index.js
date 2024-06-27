module.exports = proxyWorm()

function proxyWorm() {
  return new Proxy(
    {
      StyleSheet: {
        create() {},
      },
      Platform: {
        OS: 'web',
      },
      Image: 'Image',
      View: 'View',
      Text: 'Text',
      TextInput: 'TextInput',
      ScrollView: 'ScrollView',
      Dimensions: {
        addEventListener(cb) {}
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
