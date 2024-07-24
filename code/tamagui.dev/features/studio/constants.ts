export const IS_TAURI = globalThis['__TAURI__']
export const STUDIO_TITLEBAR_HEIGHT = 30

export const MODAL_WIDTH = 600
export const MODAL_MIN_HEIGHT = 530
export const MODAL_MAX_HEIGHT = 1100
export const SIDEBAR_WIDTH = 500

// duplicated from site for now...

export const topBarHeight = 46
export const sidebarWidth = 290
export const isLocal = process.env.NODE_ENV === 'development'
export const studioRootDir =
  process.env.NODE_ENV === 'development' ? '' : 'https://studio.tamagui.dev'
export const siteRootDir =
  process.env.NODE_ENV === 'development' ? '' : 'https://tamagui.dev'
