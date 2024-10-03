import { Github, Twitter } from '@tamagui/lucide-icons'
import { Spacer, styled, View, XStack, YStack } from 'tamagui'
import { PrettyText, PrettyTextBigger } from './typography'
import { Image } from '@tamagui/image-next'
import { Link } from '~/features/site/Link'

export const Team = () => {
  return (
    <YStack group containerType="normal" gap="$8" my="$4">
      <PrettyText
        ff="$perfectlyNineties"
        fontSize="$8"
        lineHeight="$8"
        color="$color"
        ta="center"
      >
        Team
      </PrettyText>

      <PrettyText maw={500} als="center">
        Hello. We're the creators of <Link href="https://tamagui.dev">Tamagui</Link>. We
        built One out of our experience at{' '}
        <Link href="https://app.uniswap.org">Uniswap</Link> and creating{' '}
        <Link href="https://tamagui.dev/takeout">Takeout</Link>.
      </PrettyText>

      <View
        my="$4"
        fd="row"
        fw="wrap"
        gap="$4"
        ai="center"
        jc="space-between"
        als="center"
        $gtSm={{
          gap: '$8',
          jc: 'center',
        }}
      >
        {[
          {
            image: 'nate',
            name: `Nate`,
            xHandle: 'natebirdman',
            githubHandle: 'natebirdman',
          },
          {
            image: 'pokai',
            name: `Pokai`,
            githubHandle: 'zetavg',
            xHandle: 'zetavg',
          },
          {
            image: 'jon',
            name: `Jon`,
            xHandle: 'jshez',
            githubHandle: 'jonsherrard',
          },
          // { image: 'dominic', name: `Dominic` },
        ].map(({ name, image, xHandle, githubHandle }) => {
          return (
            <YStack
              p="$8"
              px="$10"
              f={1}
              br="$8"
              key={name}
              gap="$0"
              ai="flex-start"
              jc="flex-start"
              als={'stretch'}
              // bg="$color1"
              theme="yellow"
              bw={1}
              borderColor="$color3"
              group="card"
              animation="medium"
              containerType="normal"
              filter="grayscale(100%)"
              hoverStyle={{
                y: -3,
                elevation: '$4',
                scale: 1.01,
                filter: 'grayscale(0%)',
              }}
              $sm={{
                filter: 'grayscale(0%)',
              }}
              $group-hover={{
                filter: 'grayscale(0%)',
              }}
            >
              <Image
                width={95}
                height={95}
                animation="medium"
                borderRadius={100}
                alignSelf="center"
                src={`/${image}.webp`}
                alt={name}
              />

              <YStack als="center" miw={100} mt={20} gap="$4">
                <PrettyText
                  userSelect="none"
                  als="center"
                  fontSize="$6"
                  color="$color11"
                  mt="$2"
                >
                  {name}
                </PrettyText>

                <YStack ml={-30} mr={-30} gap="$2">
                  {xHandle ? (
                    <Link href={`https://x.com/${xHandle}`} target="_blank">
                      <XStack ai="center" gap="$3">
                        <Twitter
                          width={14}
                          height={14}
                          color="$color11"
                          strokeWidth={1}
                          fill={'$color11'}
                        />
                        <StyledLink fontSize="$4" color="$color11">
                          @{xHandle}
                        </StyledLink>
                      </XStack>
                    </Link>
                  ) : (
                    <Spacer size="$3" />
                  )}

                  {githubHandle ? (
                    <Link href={`https://github.com/${githubHandle}`} target="_blank">
                      <XStack ai="center" gap="$3">
                        <Github
                          width={14}
                          height={14}
                          color="$color11"
                          strokeWidth={1}
                          fill="$color11"
                        />
                        <StyledLink fontSize="$4" color="$color11">
                          {githubHandle}
                        </StyledLink>
                      </XStack>
                    </Link>
                  ) : (
                    <Spacer size="$3" />
                  )}
                </YStack>
              </YStack>
            </YStack>
          )
        })}
      </View>
    </YStack>
  )
}

const StyledLink = styled(PrettyText, {
  display: 'flex',
  flex: 1,

  hoverStyle: {
    color: '$color12',
  },
})
