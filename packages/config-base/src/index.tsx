export * from './tamagui.config'
export * from './media'
export * from './createGenericFont'

if (process.env.NODE_ENV === 'development') {
  // rome-ignore lint/nursery/noConsoleLog: <explanation>
  console.log(
    `Note: We've moved @tamagui/config-base over to @tamagui/config. If you really want to keep this file, just copy and paste the contents into your app as it will be removed eventually.`
  )
}
