// v5 theme builder entry - everything needed to build custom v5 themes at
// runtime. this pulls in the internal legacy builder and @tamagui/colors, while
// the default @tamagui/themes/v5 entry stays static and builder-free.
export { createThemes } from '../theme-builder'
export { v5Templates } from './v5-templates'
export * from './v5-themes'
