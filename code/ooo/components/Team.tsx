import { Github, Twitter } from '@tamagui/lucide-icons'
import { Spacer, View, XStack, YStack } from 'tamagui'
import { Link } from 'vxs'
import { PrettyText } from './typography'

export const Team = () => {
  return (
    <>
      <PrettyText fontSize="$6" lineHeight="$6" color="$color" fow="bold" ta="center">
        Team
      </PrettyText>
      <View
        my="$4"
        fd="row"
        fw="wrap"
        gap="$4"
        ai="center"
        jc="space-between"
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
            xHandle: 'zetavag',
          },
          {
            image: 'jon',
            name: `Jon`,
            xHandle: 'jshez',
            githubHandle: 'jonsherrard',
          },
          { image: 'dominic', name: `Dominic` },
        ].map(({ name, image, xHandle, githubHandle }) => {
          return (
            <YStack
              p="$2.5"
              pt="$3"
              miw="$12"
              br="$4"
              key={name}
              gap="$0"
              ai="flex-start"
              jc="flex-start"
              als={'stretch'}
              bw={0.5}
              borderColor="$yellow5Light"
            >
              <img
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 100,
                  alignSelf: 'center',
                }}
                src={`/${image}.jpg`}
              />
              <PrettyText als="flex-start" fow="bold" fontSize="$4" theme="alt1" mt="$2">
                {name}
              </PrettyText>
              {xHandle ? (
                <Link href={`https://x.com/${xHandle}`} target="_blank">
                  <XStack ai="center" gap="$2">
                    <Twitter
                      width={12}
                      height={12}
                      color="$color12"
                      strokeWidth={1}
                      fill={'$color12'}
                    />
                    <PrettyText fontSize="$1" theme="alt1">
                      @{xHandle}
                    </PrettyText>
                  </XStack>
                </Link>
              ) : (
                <Spacer size="$3" />
              )}
              {githubHandle ? (
                <Link href={`https://github.com/${githubHandle}`} target="_blank">
                  <XStack ai="center" gap="$2">
                    <Github
                      width={12}
                      height={12}
                      color="$color12"
                      strokeWidth={1}
                      fill="$color12"
                    />
                    <PrettyText fontSize="$1" theme="alt1">
                      {githubHandle}
                    </PrettyText>
                  </XStack>
                </Link>
              ) : (
                <Spacer size="$3" />
              )}
            </YStack>
          )
        })}
      </View>
    </>
  )
}
