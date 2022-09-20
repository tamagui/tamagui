import { TamaguiProvider, XStack, YStack, Image, Text } from '@my/ui'
import { Icon } from './ListIcon'
import config from '../../tamagui.config'

export function Provider(props: any) {
  return <TamaguiProvider config={config} disableInjectCSS defaultTheme="light" {...props} />
}

export const ListItem = (item: any) => {
  const { name, thumbnail, label1, label2, label3 } = item.item.values

  return (
    <XStack
      bw={1}
      bc="$background"
      p="$3"
      h={88}
      boc="$borderColor"
      borderRadius="$4"
      my="$1"
      onPress={() => console.log('click')}
    >
      <YStack h={64} w={64} mr={3}>
        <YStack
          position="absolute"
          h={64}
          w={64}
          justifyContent="center"
          alignItems="center"
          zIndex={1}
        >
          <Icon />
        </YStack>
        <Image h={64} w={64} src={thumbnail} alt={name} resizeMode="cover" borderRadius={2} />
      </YStack>
      <YStack flex={1} justifyContent="space-between" overflow="hidden">
        <Text fontSize="sm" fontWeight="medium" lineHeight="16px" ellipse numberOfLines={2}>
          {name}
        </Text>
        <XStack flexDirection="row" flex={1} alignItems="flex-end">
          <Label key="label1" text={label1} />
          <Label key="label2" text={label2} />
          <Label key="label3" text={label3} />
        </XStack>
      </YStack>
      <YStack ai="center" jc="center">
        <Icon />
      </YStack>
    </XStack>
  )
}

function Label({ text }: { text: string }) {
  return (
    <XStack h={6} px={2} py={1} bg="brand.black" mr={2} borderRadius="4" alignItems="center">
      <YStack mr={1}>
        <Icon />
      </YStack>
      <Text fontSize="xs" fontWeight="bold" lineHeight="14px" ellipse>
        {text}
      </Text>
    </XStack>
  )
}
