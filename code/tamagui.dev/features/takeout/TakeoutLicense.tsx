import { H1, H3, Paragraph, YStack, styled } from 'tamagui'

export const TakeoutLicense = () => {
  return (
    <YStack gap="$4" p="$4">
      <H1 $sm={{ size: '$8' }}>License Agreement</H1>

      <Paragraph>
        Tamagui Takeout License grants you a non-exclusive license and permission to use
        the Tamagui LLC Takeout products based on the number of purchased licenses.
      </Paragraph>

      <Paragraph>
        Tamagui Takeout License grants the same permissions to all Employees and
        Contractors of the Licensee to access and use the Takeout stack up to the number
        of seats purchased.
      </Paragraph>

      <Paragraph>
        Seats only apply to the subscription - if the number of Employees and Contractors
        who modify the Takeout stack for the the duration of the license purchase exceeds
        your seat limit, you must upgrade or cancel your subscription.
      </Paragraph>

      <H3>License Terms</H3>

      <Paragraph>You can:</Paragraph>

      <Paragraph>
        <Ul>
          <Li>
            Use all Takeout stack deliverables within a single code repository for a
            single public product.
          </Li>
          <Li>
            Use the Takeout stack deliverables for unlimited private projects available to
            only licensees.
          </Li>
          <Li>
            Deploy all Takeout stack deliverables to two public domains, and two public
            apps within each of the iOS and Android app stores.
          </Li>
          <Li>Deliver a product that is commercial in nature with the Takeout stack.</Li>
          <Li>
            Re-use all Takeout stack deliverables for a new project after a previous
            project has been shut down to users.
          </Li>
        </Ul>
      </Paragraph>

      <Paragraph>You cannot:</Paragraph>

      <Paragraph>
        <Ul>
          <Li>
            Re-sell or distribute the Takeout stack available for users to read for any
            purpose, even with modification.
          </Li>
          <Li>
            Create a service which allows for users to use the Takeout stack to build
            their own publicly available products.
          </Li>
          <Li>
            Create a code template, UI kit, or starter kit based on the Takeout stack
            available to users.
          </Li>
          <Li>
            Use the Takeout stack for more than two public domains per license purchase.
          </Li>
        </Ul>
      </Paragraph>

      <H3>License Definitions</H3>

      <Paragraph>
        <Ul>
          <Li>Licensee is a person or a business entity who has purchased a License.</Li>
          <Li>
            Takeout stack is the code and assets made available to the Licensee after
            purchasing a Tamagui Takeout license.
          </Li>
          <Li>Product is any artifact produced that incorporates the Takeout stack.</Li>
          <Li>User is any person not licensed to use the Takeout stack.</Li>
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
        your use of the Takeout stack — including third-party claims against you — is
        limited to a refund of your license fee. See https://tamagui.dev/takeout-policy
        for our fulfillment policies. Tamagui LLC may not be held liable for any
        consequential damages related to your use of the Takeout stack. The ownership of
        the Takeout stack remains with the Tamagui LLC development team. You are required
        to abide by the licensing terms to avoid termination in case of non-compliance
        with the agreed terms.
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
