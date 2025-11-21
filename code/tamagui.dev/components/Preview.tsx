import type { YStackProps } from 'tamagui'
import { YStack } from 'tamagui'

export const Preview = (props: YStackProps) => (
  <YStack
    data-preview
    m={0}
    overflow="visible"
    borderWidth={1}
    borderColor="$borderColor"
    borderTopLeftRadius="$3"
    borderTopRightRadius="$3"
    mb="$-6"
    p="$3"
    pb="$6"
    position="relative"
    items="flex-start"
    {...props}
  />
)
