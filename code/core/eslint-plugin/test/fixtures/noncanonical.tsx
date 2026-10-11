import { styled, View } from 'tamagui'

const Frame = styled(View, {
  backgroundColor: '  red   hover:blue  ',
})

export function NoncanonicalFlatValues() {
  return <Frame bg=" red   dark:blue " p={`  4   sm:6  `} />
}
