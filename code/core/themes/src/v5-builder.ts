// v5 theme builder entry - everything needed to build custom v5 themes at
// runtime. this pulls in @tamagui/theme-builder and @tamagui/colors, so it is
// kept behind its own subpath: the default @tamagui/themes/v5 entry stays
// static (generated themes + tokens + types) and free of the builder.
export { createThemes } from '@tamagui/theme-builder'
export { v5Templates } from './v5-templates'
export * from './v5-themes'
