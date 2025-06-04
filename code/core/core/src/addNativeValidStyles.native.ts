import { validStyles, stylePropsAll } from '@tamagui/helpers'

function getReactNativeVersion() {
  let version = process.env.REACT_NATIVE_VERSION || ''

  if (!process.env.REACT_NATIVE_VERSION) {
    try {
      const ReactNativeOfficalVersion =
        require('react-native/Libraries/Core/ReactNativeVersion') as
          | { version: { major: number; minor: number; patch: number } }
          | undefined

      if (ReactNativeOfficalVersion) {
        const {
          version: { major, minor, patch },
        } = ReactNativeOfficalVersion
        version = `${major}.${minor}.${patch}`
      }
    } catch {
      // can't win them all
    } finally {
      if (!version) {
        version = '0.77'
      }
    }
  }

  const [major, minor, patch] = version.split('.')
  return [+major, +minor, +patch] as const
}

// mutate valid style props based on react native version

export function addNativeValidStyles() {
  const [major, minor] = getReactNativeVersion()

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
