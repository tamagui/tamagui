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

      <Question>What support do I get in the base plan?</Question>
      <P>
        For subscribers, you get access to the private #takeout channel. We prioritize
        responses there over the public Discord, but we don't provide any SLA.
      </P>

      <Question>What support do I get with Support tiers?</Question>
      <P>
        Each tier adds 4 hours of development per month, faster response times, and 4
        additional private chat invites.
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
