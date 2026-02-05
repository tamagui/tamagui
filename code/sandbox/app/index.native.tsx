import { Link } from 'one'
import { H1, Paragraph, ScrollView, YStack } from 'tamagui'

export function HomePage() {
  return (
    <ScrollView horizontal minH="100%">
      <YStack maxW={250}>
        <H1>One Sandbox222</H1>

        <Link href="/sandbox">
          <Paragraph>Sandbox</Paragraph>
        </Link>

        <Link href="/sub/portal-missing-styles">
          <Paragraph>Missing styles on nav</Paragraph>
        </Link>
      </YStack>
    </ScrollView>
  )
}
