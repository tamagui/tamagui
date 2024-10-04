import { H1, H3, Paragraph, Separator, YStack, styled } from 'tamagui'

export const TakeoutPolicy = () => {
  return (
    <YStack gap="$4" p="$4">
      <H1 $sm={{ size: '$8' }}>Fulfillment Policies</H1>

      <H3>Delivery</H3>

      <Paragraph>
        Tamagui LLC will deliver to you access to a GitHub repository that contains the
        Takeout stack code. This code includes all the functionality to build and ship
        apps using Tamagui on React Native, supporting the most recent two versions of iOS
        and Android, as well as building and shipping websites that support Chrome,
        Safari, and Firefox versions released within the last two years. You also get
        access to a CLI which can install fonts from Google Fonts, and icons from
        icones.js.org.
      </Paragraph>

      <H3>Returns and Refunds</H3>

      <Paragraph>
        Takeout is not able to be returned as it is digital software. For this reason we
        have a limited return policy in order to protect ourselves from abuse.
      </Paragraph>

      <Paragraph>
        Within the first 48 hours of your purchase, email us at support@tamagui.dev with
        any issues you have with Takeout not working as advertised. We support all Takeout
        features listed on https://tamagui.dev/takeout, and if any are not working well we
        are happy to refund you.
      </Paragraph>

      <Paragraph>
        We highly recommend trying out the free starter before committing to Tamagui, we
        think it provides a good idea of the base structure of Takeout.
      </Paragraph>

      <H3>Cancellation</H3>

      <Paragraph>
        The Takeout subscription is yearly at the rate of the purchase price. It will keep
        your access to the Takeout GitHub repository, as well as to updates via the
        TakeoutBot GitHub Bot. You may cancel this at any time from{' '}
        <a href="https://tamagui.dev/account">your account</a> by going to Subscriptions
        and then hitting "Cancel," or you can email us at support@tamagui.dev.
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
