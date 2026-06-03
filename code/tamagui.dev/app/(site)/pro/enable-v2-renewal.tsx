import { Button, H1, Paragraph, YStack } from 'tamagui'
import { Container } from '../../../components/Containers'
import { HeadInfo } from '~/components/HeadInfo'
import { Link } from '~/components/Link'

export default function EnableV2RenewalPage() {
  const couponCode = 'RENEWAL30'

  return (
    <>
      <HeadInfo title="Renewal Discount" />

      <Container py="$8">
        <YStack
          gap="$4"
          maxWidth={600}
          alignItems="center"
          justifyContent="center"
          mx="auto"
        >
          <H1 fontFamily="$mono" textAlign="center">
            Your Renewal Discount Is Set
          </H1>

          <Paragraph size="$5" textAlign="center">
            We've applied <strong>30% off</strong> to your renewal.
          </Paragraph>

          <Paragraph size="$4" textAlign="center" color="$color10">
            If you want to buy another project or share the discount with a friend, use{' '}
            <strong>{couponCode}</strong> at checkout.
          </Paragraph>

          <Paragraph size="$4" textAlign="center" color="$color10">
            Your renewal keeps the current Pro package, including Takeout 2, Takeout
            Static, and unlimited team members.
          </Paragraph>

          <Link href="/account">
            <Button size="$4" theme="accent" mt="$4">
              Go to Account
            </Button>
          </Link>
        </YStack>
      </Container>
    </>
  )
}
