export function getBaseViews() {
  const native = require('react-native')

  let View
  let TextAncestor

  if (process.env.NODE_ENV !== 'test') {
    View = require('react-native/Libraries/Components/View/ViewNativeComponent').default
    TextAncestor = require('react-native/Libraries/Text/TextAncestor')
  }

  if (!View) {
    View = native.View || native.default.View
  }

  return {
    View,
    Text: native.Text || native.default.Text,
    StyleSheet: native.StyleSheet || native.default.StyleSheet,
    TextAncestor,
    Pressable: native.Pressable || native.default.Pressable,
  }
}
