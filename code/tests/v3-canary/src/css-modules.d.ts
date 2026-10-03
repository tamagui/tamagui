// TypeScript 6 reports TS2882 for a side-effect import of a non-TS module, and
// this fixture imports '@tamagui/core/reset.css' the way a real consumer app
// does. Bundlers resolve it; tsc needs to be told the module shape exists.
declare module '*.css'
