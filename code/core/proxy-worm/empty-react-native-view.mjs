import { View } from 'react-native'

const EmptyReactNativeView = new Proxy(
  {
    get default() {
      return View
    },
  },
  {
    get(_, key) {
      if (key === 'createAnimatedComponent') {
        return (component) => component
      }
      return View
    },
  }
)

export default EmptyReactNativeView
