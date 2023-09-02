import { copyTamaguiPackages } from './copy-tamagui-packages'

if (!process.env.TARGET) {
  throw new Error(`Supply a TARGET starter dir to copy into`)
}

copyTamaguiPackages(process.env.TARGET).catch((err) => {
  // rome-ignore lint/suspicious/noConsoleLog: ok
  console.error(`Error copying: ${err}`)
  process.exit(0)
})
