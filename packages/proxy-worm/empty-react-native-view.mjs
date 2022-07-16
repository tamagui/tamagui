export default new Proxy(
  {
    get default() {
      return require('react-native').View
    },
  },
  {
    get(_, key) {
      if (key === 'createAnimatedComponent') {
        return (x) => x
      }
      return require('react-native').View
    },
  }
)
