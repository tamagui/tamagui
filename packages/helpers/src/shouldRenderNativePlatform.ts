import { currentPlatform } from '@tamagui/constants'

// these types and helpers are to be used on the components that support the `native` prop
// some usage examples are:
// `<Component native` means render natively on any platform if possible
// `<Component native={false}` means opt out of native
// `<Component native="web"` means render natively on web if possible
// `<Component native={["web", "android"]}` means render natively on web and android if possible
// `<Component native={["mobile"]}` means render natively on mobile (android or ios) if possible

export type NativePlatform =
  | 'web'
  | 'mobile' // called 'mobile' instead of 'native' because things could be 'native' to web as well
  | 'android'
  | 'ios'

export type ExplicitNativePlatform = Exclude<NativePlatform, 'mobile'>

export type NativeValue<Platform extends NativePlatform = NativePlatform> =
  | boolean
  | Platform
  | Platform[]

const ALL_PLATFORMS: ExplicitNativePlatform[] = ['web', 'android', 'ios']
/**
 *
 * takes in what user has inputted the native-supporting component and returns the name of the native platform we should render
 *
 * @example ['android'] => 'android' (when current platform is android)
 * @example ['android'] => null      (when current platform is not android)
 * @example ['mobile']  => 'ios'     (when current platform is ios)
 *
 * @param supportedSpecificNativeValues the platforms your component/system supports
 * @param nativeProp the platforms your user is requesting you to use
 * @returns
 */
export function shouldRenderNativePlatform(nativeProp?: NativeValue) {
  if (!nativeProp) {
    return null
  }
  const userRequestedPlatforms = resolvePlatformNames(nativeProp)

  for (const platform of ALL_PLATFORMS) {
    if (platform === currentPlatform && userRequestedPlatforms.has(platform)) {
      return platform
    }
  }

  return null
}

function resolvePlatformNames(nativeProp: NativeValue) {
  const platforms: NativePlatform[] =
    nativeProp === true // all native platforms
      ? ALL_PLATFORMS
      : nativeProp === false // no native platform
        ? []
        : Array.isArray(nativeProp)
          ? nativeProp
          : [nativeProp]
  const set = new Set(platforms)

  if (set.has('mobile')) {
    // mobile means android and ios so we'll just use the explicit platforms here
    set.add('android')
    set.add('ios')
    set.delete('mobile')
  }
  return set as Set<ExplicitNativePlatform>
}
