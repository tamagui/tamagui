import { copyTamaguiPackages } from './copy-tamagui-packages'

if (!process.env.TARGET) {
  throw new Error(`Supply a TARGET starter dir to copy into`)
}

copyTamaguiPackages(process.env.TARGET).catch((err) => {
  // eslint-disable-next-line no-console
  console.error(`Error copying: ${err}`)
  process.exit(0)
})
