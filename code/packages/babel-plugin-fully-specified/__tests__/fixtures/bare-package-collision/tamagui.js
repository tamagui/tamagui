// a local file whose basename collides with a real package name ("tamagui").
// its existence must not cause bare `import ... from 'tamagui'` in sibling
// files to be rewritten to `tamagui.mjs`.
export const config = 'local'
