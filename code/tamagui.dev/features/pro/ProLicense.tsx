import { Link } from 'one'
import { YStack, H1, Paragraph, H3, styled } from 'tamagui'

export const ProLicense = () => {
  return (
    <YStack gap="$4" p="$4">
      <H1 $maxMd={{ size: '$8' }}>License Agreement</H1>
      <Link href="/pro-policy">Policy Agreement</Link>.
      <Paragraph>
        Tamagui Pro License grants you a non-exclusive license and permission to use the
        Tamagui LLC Pro features and services based on your subscription plan.
      </Paragraph>
      <Paragraph>
        Tamagui Pro License grants permission to one individual to access the Takeout
        Github repository and the Bento components via tamagui.dev. You are free to use
        Takeout to build as many apps as you please, and to use Bento components in as
        many projects as you please.
      </Paragraph>
      <Paragraph>
        For Bento - you are free to use and the source code in unlimited projects and
        publish it publicly, but we ask you do not re-publish the majority of the
        components in one place. Other developers may collaborate on the source code
        without a license.
      </Paragraph>
      <Paragraph>
        For Takeout - you cannot re-publish any of the source code publicly. If you are
        collaborating on the source code with other developers, then all developers who
        commit to the repository within the last 3 months must also have a license.
      </Paragraph>
      <H3>License Terms</H3>
      <Paragraph>You can:</Paragraph>
      <Paragraph tag="span">
        <Ul>
          <Li>
            Use all Pro features including Theme Builder, Bento, and Takeout, in your
            projects.
          </Li>
          <Li>Use Pro features in both commercial and non-commercial projects.</Li>
          <Li>
            Access Discord community and support channels based on your subscription tier.
          </Li>
        </Ul>
      </Paragraph>
      <Paragraph>You cannot:</Paragraph>
      <Paragraph tag="span">
        <Ul>
          <Li>Share your Pro account credentials with any other individual.</Li>
          <Li>
            Redistribute or resell Pro features or components as standalone products.
          </Li>
          <Li>
            Create and distribute derivative products based on Pro features without
            permission.
          </Li>
        </Ul>
      </Paragraph>
      <H3>License Definitions</H3>
      <Paragraph tag="span">
        <Ul>
          <Li>
            Licensee is a person or a business entity who has purchased a Pro
            subscription.
          </Li>
          <Li>
            Pro features are the components, tools, and services made available to the
            Licensee after purchasing a Tamagui Pro subscription.
          </Li>
          <Li>Employee is a full-time or part-time employee of the Licensee.</Li>
          <Li>
            Contractor is an individual or business entity contracted to perform services
            for the Licensee.
          </Li>
        </Ul>
      </Paragraph>
      <H3>Liability</H3>
      <Paragraph>
        Tamagui LLC's liability to you for costs, damages, or other losses arising from
        your use of the Pro features — including third-party claims against you — is
        limited to a refund of your subscription fee. Tamagui LLC may not be held liable
        for any consequential damages related to your use of the Pro features. The
        ownership of the Pro features remains with the Tamagui LLC development team. You
        are required to abide by the licensing terms to avoid termination in case of
        non-compliance with the agreed terms.
      </Paragraph>
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

const Li = styled(Paragraph, {
  name: 'li',
  tag: 'li',
  // @ts-ignore
  display: 'list-item',
})
