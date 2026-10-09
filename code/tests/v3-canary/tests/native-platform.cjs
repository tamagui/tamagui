const native = require('@tamagui/fake-react-native')
const web = require('react-native-web')

// value nodes allow the headless closed Sheet to mount; this is no motion proof.
const bindings = {
  ...native,
  Animated: {
    ...web.Animated,
    createAnimatedComponent: native.Animated.createAnimatedComponent,
  },
  Easing: web.Easing,
}
bindings.default = bindings
module.exports = bindings
