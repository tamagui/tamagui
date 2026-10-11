// a namespace import rather than `require('react-native')`: the ESM native artifact
// (`dist/esm/*.native.js`) is real ESM, where a bare `require` is not defined, and
// `runtime.tsx` calls this at module scope. The `.default?.` reads keep the same
// interop the require form relied on, and the CJS builds compile it back to a
// require, so nothing changes for metro.
import * as native from 'react-native'

export function getBaseViews() {
  const rn = native as any

  return {
    View: rn.View || rn.default?.View,
    Text: rn.Text || rn.default?.Text,
    TextAncestor: rn.unstable_TextAncestorContext,
    StyleSheet: rn.StyleSheet || rn.default?.StyleSheet,
    Pressable: rn.Pressable || rn.default?.Pressable,
  }
}
