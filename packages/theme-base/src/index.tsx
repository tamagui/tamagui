export * from './themes'
export * from './tokens'
export * from '@tamagui/colors'

if (process.env.NODE_ENV === 'development') {
  // rome-ignore lint/nursery/noConsoleLog: <explanation>
  console.log(
    `Note: We've moved @tamagui/theme-base over to @tamagui/themes. They are much improved and easier to use. If you really want to keep this package, copy and paste the contents into your app as it will be removed eventually.`
  )
}
