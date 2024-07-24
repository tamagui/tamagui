import { H1, H3, Paragraph, Separator, YStack, styled } from 'tamagui'

export const BentoPolicy = () => {
  return (
    <YStack gap="$4" p="$4">
      <H1 $sm={{ size: '$8' }}>Fulfillment Policies</H1>

      <H3>Delivery</H3>

      <Paragraph>
        Tamagui LLC will deliver to you access to copy and paste the code for all the
        examples on the /bento main page.
      </Paragraph>

      <H3>Returns and Refunds</H3>

      <Paragraph>
        Bento is not able to be returned as it is digital software. For this reason we
        have a limited return policy in order to protect ourselves from abuse, if you have
        a bad experience in your first week get in touch with support support@tamagui.dev.
      </Paragraph>

      <Separator />

      <Paragraph>
        For any further questions{' '}
        <a href="mailto:support@tamagui.dev">send us an email</a>.
      </Paragraph>
    </YStack>
  )
}

const Ul = styled(YStack, {
  name: 'ul',
  tag: 'ul',
  paddingLeft: 20,
})

const Li = styled(YStack, {
  name: 'li',
  tag: 'li',
  // @ts-ignore˝
  display: 'list-item',
})
