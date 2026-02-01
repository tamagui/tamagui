import { Paragraph, Spacer, styled, YStack } from 'tamagui'
import { Link } from '../../../components/Link'
import { P } from './BigP'

const Question = styled(P, {
  size: '$5',
  fontWeight: 'bold',
  $gtXs: {
    size: '$6',
  },
})

const Answer = styled(Paragraph, {
  fontFamily: '$mono',
  color: '$color10',
  size: '$3',
  lineHeight: '$4',
  $gtXs: {
    px: '$8',
    size: '$4',
    lineHeight: '$5',
  },
})

export const FaqTabContent = () => {
  return (
    <YStack gap="$5">
      <Question>What's included with Pro?</Question>
      <Answer>
        Two starter kits (v1 with Next.js + Expo, v2 with One framework), Bento copy-paste
        components, Theme AI generator, private Discord support, and all future updates
        during your license period. See our{' '}
        <Link href="/pro-license">full license terms</Link> for details.
      </Answer>

      <Question>What's the difference between Takeout v1 and v2?</Question>
      <Answer>
        v1 uses Next.js + Expo with Supabase - a more conservative, proven stack. v2 is
        our next-gen stack using One framework, Zero for real-time sync, Better Auth,
        Postgres + Drizzle, and SST/Uncloud for deployment. v2 includes CLI tools and IaC.
        Both are included with Pro.
      </Answer>

      <Question>Do I own the code?</Question>
      <Answer>
        For Bento - yes, you have full rights and can use it in public projects. For
        Takeout - the code is private, all team members must be added to your project on
        tamagui.dev. See our <Link href="/pro-license">license</Link> for full details.
      </Answer>

      <Question>What support do I get?</Question>
      <Answer>
        Base plan includes private #takeout Discord channel. We respond within a few days
        but no SLA. For guaranteed response times, see Direct ($500/mo, 2-day response, 5
        bug fixes/year) and Sponsor ($2,000/mo, 1-day response, unlimited fixes, monthly
        call) tiers.
      </Answer>

      <Question>Can I use this for multiple projects?</Question>
      <Answer>
        Each license covers one project (web domain + iOS + Android apps). Purchase
        additional licenses for more projects. Updates are $100/year per project after
        year one.
      </Answer>

      <Question>What about teams?</Question>
      <Answer>
        Unlimited team members at no extra cost. Add them through your project dashboard
        on tamagui.dev to grant access to private repos.
      </Answer>

      <Question>Is there a free version?</Question>
      <Answer>
        Yes! Takeout v2-free is open source on GitHub with the same core stack, just
        without deployment configs, CLI tools, and private repo access.
      </Answer>

      <Question>What about refunds?</Question>
      <Answer>
        All sales are final. Please review the{' '}
        <Link href="/pro-license">license agreement</Link> and{' '}
        <Link href="/pro-policy">policies</Link> before purchasing.
      </Answer>

      <Question>Enterprise pricing?</Question>
      <Answer>
        Companies with over $1M annual revenue should contact{' '}
        <Link href="mailto:support@tamagui.dev">support@tamagui.dev</Link>.
      </Answer>

      <Question>Why the price?</Question>
      <Answer>
        Two years of effort went into this stack, with a ton of offert into CI/CD, robust
        production, AI integration, docs and scripting, and overall refinement. We think
        it's a lot more than the current price, if anything.
      </Answer>

      <Question>How do I use a coupon?</Question>
      <Answer>
        Enter it at checkout and click apply. Valid coupons update the price
        automatically.
      </Answer>

      <Question>How do I get my invoice?</Question>
      <Answer>
        Access invoices through{' '}
        <Link href="https://zenvoice.io/p/66c8a1357aed16c9b4a6dafb" target="_blank">
          Zenvoice
        </Link>
        .
      </Answer>

      <Spacer height="$6" />
    </YStack>
  )
}
