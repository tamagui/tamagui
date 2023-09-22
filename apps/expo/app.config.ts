import { ExpoConfig, ConfigContext } from 'expo/config'

const test = (config: Partial<ExpoConfig>): ExpoConfig => {
  return {
    ...config,
    icon: './assets/Test-180.png',
    name: '(test) belaytionship',
    slug: 'expo-belaytionship',
    ios: {
      bundleIdentifier: 'com.belay-test.app'
    }
  }
}

const development = (config: Partial<ExpoConfig>): ExpoConfig => {
  return {
    ...config,
    icon: './assets/Dev-180.png',
    name: '(dev) belaytionship',
    slug: 'expo-belaytionship',
    ios: {
      bundleIdentifier: 'com.belay-dev.app'
    }
  }
}
// Constants.
// https://github.com/stephenlaughton/lite-invoice/blob/steve/lit-74-invoice-terms-section-and-general-invoice-edit-strategy/packages/app-state/src/App.store.ts#L18
export default (props: ConfigContext): ExpoConfig => {
  const TEST = test(props.config)
  const DEVELOPMENT = development(props.config)



  if (process.env.NODE_ENV === 'test') {
    return TEST
  } else if (process.env.NODE_ENV === 'development') {
    return DEVELOPMENT
  } else {
    return {
      ...props.config,
      name: 'belaytionship',
      slug: 'expo-belaytionship',
    }
  }
}
