import Text from './Text'
import View from './View'

function createAnimatedComponent<A>(Component: A): A {
  return Component
}

const AnimatedView = createAnimatedComponent(View)
const AnimatedText = createAnimatedComponent(Text)

export default {
  View: AnimatedView,
  FlatList: AnimatedView,
  VirtualizedList: AnimatedView,
  Text: AnimatedText,
}
