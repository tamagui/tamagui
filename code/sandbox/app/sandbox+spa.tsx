import { XStack, YStack } from 'tamagui'

export default () => {
  const boom = true
  return (
    <YStack f={1} jc="center" ai="center" gap="$8" p="$4" bg="$background">
      <XStack
        h={200}
        w={200}
        bg="red"
        jc="center"
        ai="center"
        group={boom ? undefined : 'card'}
      >
        <XStack h={150} w={150} bc="yellow" jc="center" ai="center" group="other">
          <XStack
            h={100}
            w={100}
            bg="green"
            jc="center"
            ai="center"
            debug="verbose"
            $group-hover={{
              bg: 'yellow',
            }}
            $group-sm-hover={{
              bg: 'yellow',
            }}
            $group-card-lg={{
              bg: 'orange',
            }}
          >
            <XStack
              h={50}
              w={50}
              bg="green"
              jc="center"
              ai="center"
              $group-other-lg={{
                bg: 'red',
              }}
            />
          </XStack>
        </XStack>
      </XStack>
    </YStack>
  )
}
