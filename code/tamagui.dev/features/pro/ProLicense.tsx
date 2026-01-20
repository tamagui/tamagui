import { Link } from 'one'
import { YStack, H1, Paragraph, H3, styled } from 'tamagui'

export const ProLicense = () => {
  return (
    <YStack gap="$4" p="$4">
      <H1 $sm={{ size: '$8' }}>Tamagui Pro V2 License Agreement</H1>
      <Link href="/pro-policy">Policy Agreement</Link>

      <H3>Overview</H3>
      <Paragraph>
        Tamagui Pro V2 License grants you a non-exclusive, perpetual license to use
        Tamagui Pro features for one project. Your license includes lifetime rights to all
        code and assets you download during your license period.
      </Paragraph>

      <H3>Project License Scope</H3>
      <Paragraph>Each Tamagui Pro V2 License covers one project, defined as:</Paragraph>
      <Paragraph render="span">
        <Ul>
          <Li>One public web domain (e.g., myapp.com)</Li>
          <Li>One iOS App Store application</Li>
          <Li>One Android Play Store application</Li>
        </Ul>
      </Paragraph>
      <Paragraph>
        You must specify your project name and domain at the time of purchase. If you need
        to use Tamagui Pro for additional projects, you must purchase additional licenses.
      </Paragraph>

      <H3>What's Included</H3>
      <Paragraph render="span">
        <Ul>
          <Li>
            Access to all Takeout templates (v1 Takeout, v2 Takeout, Takeout Static)
          </Li>
          <Li>Bento premium components</Li>
          <Li>One year of updates included with purchase</Li>
          <Li>Unlimited team members for your project (no additional seat cost)</Li>
          <Li>Basic chat support in Discord #takeout channel</Li>
          <Li>Lifetime rights to all code downloaded during license period</Li>
        </Ul>
      </Paragraph>

      <H3>Updates and Upgrades</H3>
      <Paragraph>
        Your initial purchase includes one year of updates. After the first year, you will
        be automatically enrolled in an upgrade subscription at $300/year to continue
        receiving updates. You may cancel the upgrade subscription at any time, but you
        will not receive new updates after cancellation. You retain lifetime rights to all
        code downloaded prior to cancellation.
      </Paragraph>

      <H3>Code Usage Rights</H3>
      <Paragraph>
        For Bento components - you are free to use the source code in your licensed
        project and publish derivative works publicly. You may not re-publish the majority
        of Bento components as a standalone component library.
      </Paragraph>
      <Paragraph>
        For Takeout templates - you cannot re-publish any of the source code publicly. All
        team members working on the source code must be added to your project team on
        tamagui.dev (no additional cost).
      </Paragraph>

      <H3>Team Members</H3>
      <Paragraph>
        Your license includes unlimited team members at no additional cost. All team
        members must be added through your project dashboard on tamagui.dev to gain access
        to the private repositories. Team members may only use the code for the licensed
        project.
      </Paragraph>

      <H3>Sales Policy</H3>
      <Paragraph>
        <strong>All sales are final. No refunds will be issued.</strong> Please review
        this license agreement and evaluate the product before purchasing.
      </Paragraph>

      <H3>License Terms</H3>
      <Paragraph>You can:</Paragraph>
      <Paragraph render="span">
        <Ul>
          <Li>
            Use all Pro features including Theme Builder, Bento, and Takeout for your
            licensed project.
          </Li>
          <Li>Use Pro features in both commercial and non-commercial projects.</Li>
          <Li>Add unlimited team members to your project.</Li>
          <Li>
            Keep and use all downloaded code forever, even after your license expires.
          </Li>
        </Ul>
      </Paragraph>
      <Paragraph>You cannot:</Paragraph>
      <Paragraph render="span">
        <Ul>
          <Li>Use the license for projects other than the one specified at purchase.</Li>
          <Li>
            Share your Pro account credentials with individuals outside your project team.
          </Li>
          <Li>
            Redistribute or resell Pro features or components as standalone products.
          </Li>
          <Li>Redistribute Takeout source code publicly.</Li>
        </Ul>
      </Paragraph>

      <H3>Definitions</H3>
      <Paragraph render="span">
        <Ul>
          <Li>
            Licensee is a person or business entity who has purchased a Tamagui Pro V2
            license.
          </Li>
          <Li>
            Project is the web domain and mobile applications specified at the time of
            purchase.
          </Li>
          <Li>Team Member is any individual added to the project team on tamagui.dev.</Li>
          <Li>
            License Period is the time during which you have access to updates (initial
            year plus any upgrade subscription periods).
          </Li>
        </Ul>
      </Paragraph>

      <H3>Liability</H3>
      <Paragraph>
        Tamagui LLC's liability to you for costs, damages, or other losses arising from
        your use of the Pro features — including third-party claims against you — is
        limited to the amount paid for your license. Tamagui LLC may not be held liable
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
  render: 'ul',
  pl: 20,
})

const Li = styled(Paragraph, {
  name: 'li',
  render: 'li',
  // @ts-ignore
  display: 'list-item',
})
