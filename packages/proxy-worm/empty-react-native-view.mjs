import { View } from 'react-native'

export default new Proxy(
  {
    get default() {
      return View
    },
  },
  {
    get(_, key) {
      if (key === 'createAnimatedComponent') {
        return (x) => x
      }
      return View
    },
  }
)
