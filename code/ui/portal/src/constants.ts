import { isAndroid } from '@tamagui/constants'

export const IS_FABRIC =
  typeof global !== 'undefined' &&
  Boolean(global._IS_FABRIC ?? global.nativeFabricUIManager)

export const USE_NATIVE_PORTAL =
  !isAndroid && process.env.TAMAGUI_USE_NATIVE_PORTAL !== 'false' && !IS_FABRIC

export const allPortalHosts = new Map<string, HTMLElement>()
export const portalListeners: Record<string, Set<Function>> = {}
