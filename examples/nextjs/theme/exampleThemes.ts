type MyTheme = typeof dark

declare module 'snackui' {
  interface ThemeObject extends MyTheme {}
}

const dark = {
  color: '#fff',
  altColor: 'red',
  backgroundColor: '#000',
}

const light: MyTheme = {
  backgroundColor: '#fff',
  altColor: 'blue',
  color: '#000',
}

export default {
  dark,
  light,
}
