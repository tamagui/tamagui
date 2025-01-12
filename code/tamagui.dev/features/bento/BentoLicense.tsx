import { H1, H3, Paragraph, YStack, styled } from 'tamagui'

export const BentoLicense = () => {
  return (
    <YStack gap="$4" p="$4">
      <H1 $sm={{ size: '$8' }}>License Agreement</H1>

      <Paragraph>
        Tamagui Bento License grants you a non-exclusive license and permission to use the
        Tamagui LLC Bento products based on the number of purchased licenses.
      </Paragraph>

      <Paragraph>
        Tamagui Bento License grants the same permissions to all Employees and Contractors
        of the Licensee to access and use the Bento stack up to the number of seats
        purchased.
      </Paragraph>

      <H3>License Terms</H3>

      <Paragraph>You can:</Paragraph>

      <Paragraph>
        <Ul>
          <Li>
            Use all Bento deliverables as you please for code both open and closed source,
            across as many projects as you need within the limits listed in this document.
          </Li>
        </Ul>
      </Paragraph>

      <Paragraph>You cannot:</Paragraph>

      <Paragraph>
        <Ul>
          <Li>
            Use Bento on a team project without every developer purchasing Bento. This
            doesn't apply for open-source, non-commercial projects.
          </Li>
          <Li>
            Re-sell or re-publish Bento copy-paste components for others to consume as
            widgets - they must be used within a project where they are not the majority
            of the project code, and not exported for direct use outside of the project.
          </Li>
          <Li>
            Use Bento components as part of a commercial project that sells access to
            their code without an exemption.
          </Li>
          <Li>Publicly publish the majority of the components into a single project.</Li>
        </Ul>
      </Paragraph>

      <H3>License Definitions</H3>

      <Paragraph>
        <Ul>
          <Li>Licensee is a person or a business entity who has purchased a License.</Li>
          <Li>
            Bento stack is the code and assets made available to the Licensee after
            purchasing a Tamagui Bento license.
          </Li>
          <Li>Product is any artifact produced that incorporates the Bento stack.</Li>
          <Li>User is any person not licensed to use the Bento stack.</Li>
          <Li>Employee is a full-time or part-time employee of the Licensee.</Li>
          <Li>
            Contractor is an individual or business entity contracted to perform services
            for the Licensee.
          </Li>
          <Li>
            Client is an individual or entity receiving custom professional services
            directly from the Licensee, produced specifically for that individual or
            entity.
          </Li>
        </Ul>
      </Paragraph>

      <H3>Liability</H3>

      <Paragraph>
        Tamagui LLC's liability to you for costs, damages, or other losses arising from
        your use of the Bento stack — including third-party claims against you — is
        limited to a refund of your license fee. See https://tamagui.dev/bento-policy for
        our fulfillment policies. Tamagui LLC may not be held liable for any consequential
        damages related to your use of the Bento stack. The ownership of the Bento stack
        remains with the Tamagui LLC development team. You are required to abide by the
        licensing terms to avoid termination in case of non-compliance with the agreed
        terms.
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
  // @ts-ignore˝
  display: 'list-item',
})
