import { Button } from '@tamagui/button'
import { Spacer, View, XStack } from 'tamagui'
import { Link } from 'one'
import { PrettyTextBigger, PrettyTextBiggest } from '~/components/typography'
import { OneLogo } from '~/features/brand/Logo'
import { ContainerSm } from '~/features/site/Containers'
import { HeadInfo } from '~/features/site/HeadInfo'

export default function RubberDuckPage() {
  return (
    <>
      <HeadInfo title="The One Ball" description="Get your rubber duck on." />

      <Spacer size="$4" $gtSm={{ size: '$8' }} />

      <ContainerSm>
        <Spacer size="$4" $gtSm={{ size: '$0' }} />

        <XStack jc="space-between" mb="$2">
          <View
            group
            containerType="normal"
            pos="relative"
            scale={0.9}
            ml={-10}
            mt={-5}
            $sm={{ scale: 0.65, mx: -35, my: -20 }}
          >
            <OneLogo animate />
          </View>

          <XStack
            ai="center"
            jc="center"
            gap="$2"
            $gtSm={{
              gap: '$4',
            }}
          >
            <Link href="/docs/introduction" asChild>
              <Button size="$5" bg="$colorTransparent" bw={0.5} bc="$color6" br="$10">
                The One Framework
              </Button>
            </Link>
          </XStack>
        </XStack>

        <View gap="$3">
          <PrettyTextBiggest className="clip-text hero-text" mt={10} mb={-2}>
            Get unstuck by talking out loud to the One ball.
          </PrettyTextBiggest>

          <PrettyTextBigger intro>
            Every developer knows that you can solve half your code questions simply by
            talking your problems out loud to yourself... so we though, what if there was
            a real-world AI assistant that simply asked you questions as you think through
            your problems out loud?
          </PrettyTextBigger>

          <PrettyTextBigger intro>
            The One Ball is a purpose-built AI assistant. We haven't made it yet, but if
            we make over $100,000 in pre-orders, we will start productionizing it.
          </PrettyTextBigger>

          <ul>
            <li>
              <PrettyTextBigger intro>
                Is heavy, feels amazing in your hand.
              </PrettyTextBigger>
            </li>
          </ul>
        </View>
      </ContainerSm>
    </>
  )
}
