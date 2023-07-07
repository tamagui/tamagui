export const constants = {}
export const topBarHeight = 46
export const sidebarWidth = 290
export const isLocal = process.env.NEXT_PUBLIC_STUDIO_IS_LOCAL === 'true'
export const studioRootDir =
  process.env.NODE_ENV === 'development' ? '/studio-app' : 'https://studio.tamagui.dev'
export const siteRootDir =
  process.env.NODE_ENV === 'development' ? '' : 'https://tamagui.dev'
