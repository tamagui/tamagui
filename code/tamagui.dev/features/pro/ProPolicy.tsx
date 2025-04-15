import { H1, H3, Paragraph, Separator, YStack } from 'tamagui'

export const ProPolicy = () => {
  return (
    <YStack gap="$4">
      <H1 $maxMd={{ size: '$8' }}>Fulfillment Policies</H1>

      <H3>Delivery</H3>

      <Paragraph>
        Tamagui LLC will deliver to you access to the Takeout Github repo, Bento copy and
        paste the code for all the examples on the /bento main page, and the Theme AI
        builder.
      </Paragraph>

      <H3>Returns and Refunds</H3>

      <Paragraph>
        Bento is not able to be returned as it is digital software, but for exceptional
        cases where things are breaking on Mac we do accept refunds within 48 hours. Get
        in touch with support support@tamagui.dev.
      </Paragraph>

      <Separator />

      <Paragraph>
        For any further questions{' '}
        <a href="mailto:support@tamagui.dev">send us an email</a>.
      </Paragraph>
    </YStack>
  )
}
