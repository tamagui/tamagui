import { extractForNative } from './tests/lib/extract'

async function run() {
  const output = await extractForNative(`
import { View, styled } from 'tamagui'

export default (props) => (
  <>
    <View top={10} backgroundColor="$background" margin={10} paddingBottom="$5" />
    <View backgroundColor={props.x ? "$background" : 'red'} top={props.x ? 0 : 10} />
  </>
)
    `)

  console.log(output?.code)
}

run()
