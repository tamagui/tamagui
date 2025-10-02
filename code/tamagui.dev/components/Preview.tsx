import type { YStackProps } from '@tamagui/ui'
import { YStack } from '@tamagui/ui'

export const Preview = (props: YStackProps) => (
  <YStack
    data-preview
    margin={0}
    overflow="visible"
    borderWidth={1}
    borderColor="$borderColor"
    borderTopLeftRadius="$3"
    borderTopRightRadius="$3"
    mb="$-6"
    padding="$3"
    pb="$6"
    position="relative"
    ai="flex-start"
    {...props}
  />
)
