import { Spacer, styled, YStack } from 'tamagui'
import { Link } from '../../../components/Link'
import { P } from './BigP'

const Question = styled(P, {
  size: '$6',
  fontWeight: 'bold',
  $gtXs: {
    size: '$8',
  },
})

export const FaqTabContent = () => {
  return (
    <YStack gap="$6">
      <Question>Why the high price?</Question>
      <P>
        The new Takeout stack took immense, loving effort. We considered not selling it
        all and keeping it a trade secret, especially as its AI integration + docs +
        scripting + setup makes it incredible at moving fast. Still, we do like the idea
        that Tamagui supports itself, and we hope the stack leads to{' '}
        <Link target="_blank" href="https://addeven.com">
          higher quality consulting gigs
        </Link>
        .
      </P>

      <Question>Do I own the code? Can I publish it publicly?</Question>
      <P>
        For Bento - yes. For Takeout - no. Takeout is closed source, but the Bento license
        is liberal, you have all rights to the code. The only limit we have is that you
        don't directly list or sell the majority of Bento code in one place, but you can
        absolutely use it in public projects.
      </P>

      <Question>What is Theme AI?</Question>
      <P>
        If you go to the Theme page from the header, we have an input box to prompt. We've
        spent a lot of effort putting together a prompt and examples for LLMs to generate
        great looking themes based on your input. It's quite fun and generates some great
        themes.
      </P>

      <Question>Can I buy licenses for multiple projects?</Question>
      <P>
        Yes! Each license covers one project (web domain + iOS + Android apps). You can
        purchase additional project licenses anytime. Update subscriptions are always
        $300/year per project regardless of when you buy.
      </P>

      <Question>What support do I get in the base plan?</Question>
      <P>
        The base plan includes access to the private #takeout Discord channel. We
        prioritize responses there over the public Discord, but there is no guaranteed
        SLA. We typically respond within a few days. For guaranteed response times and bug
        fix commitments, see our Direct and Sponsor support tiers.
      </P>

      <Question>What's the difference between support levels?</Question>
      <P>
        <strong>Chat (Included):</strong> Access to the private #takeout Discord channel.
        No SLA guarantee, but we typically respond within a few days.
        {'\n\n'}
        <strong>Direct ($500/mo):</strong> 5 bug fixes per year, guaranteed response
        within 2 business days, your issues get prioritized in our queue.
        {'\n\n'}
        <strong>Sponsor ($2,000/mo):</strong> Unlimited higher priority bug fixes, 1 day
        response time, plus a monthly video call with the team.
      </P>

      <Question>What about companies with significant revenue?</Question>
      <P>
        Companies with over $1M in annual revenue should contact us at{' '}
        <Link href="mailto:support@tamagui.dev">support@tamagui.dev</Link> for enterprise
        pricing. The standard license is intended for bootstrapped companies, solo
        developers, and early-stage startups.
      </P>

      <Question>How do I use a coupon?</Question>
      <P>
        When you checkout, you'll see an input box to enter a coupon. If you have a
        coupon, enter it and click apply. If it's valid, the price will update.
      </P>

      <Question>How do I get my invoice?</Question>
      <P>
        You can access all your invoices through our billing partner Zenvoice.{' '}
        <Link href="https://zenvoice.io/p/66c8a1357aed16c9b4a6dafb" target="_blank">
          Click here to view your invoices
        </Link>
        .
      </P>

      <Spacer height="$10" />
    </YStack>
  )
}
