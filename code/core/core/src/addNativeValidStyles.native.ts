import { validStyles, stylePropsAll } from '@tamagui/helpers'

// this does exist :/
import ReactNativeVersion from 'react-native/Libraries/Core/ReactNativeVersion'

// mutate valid style props based on react native version

export function addNativeValidStyles() {
  if (!ReactNativeVersion) return
  const {
    version: { major, minor },
  } = ReactNativeVersion as { version: { major: number; minor: number; patch: number } }

  if (major === 0 && minor >= 77) {
    const additional = {
      boxSizing: true,
      mixBlendMode: true,
      outlineWidth: true,
      outlineStyle: true,
      outlineSpread: true,
      outlineColor: true,
    }

    Object.assign(validStyles, additional)
    Object.assign(stylePropsAll, additional)
  }
}
