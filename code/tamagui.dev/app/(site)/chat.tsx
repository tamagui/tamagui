import { H1, Paragraph, Separator, Spacer } from '@tamagui/ui'
import { Container } from '../../components/Containers'
import { Link } from '../../components/Link'

export const ChatPage = () => {
  return (
    <>
      <Container py="$12" gap="$4">
        <Paragraph ff="$mono" theme="alt2" mb="$-4">
          Introducing
        </Paragraph>

        <H1 ff="$mono" size="$12">
          Tamagui Chat
        </H1>

        <Paragraph ff="$mono" size="$10">
          A chatbot and AI code generator, built from scratch to be an expert in all
          things Tamagui.
        </Paragraph>

        <Paragraph ff="$mono" size="$7" lh="$8" theme="alt1">
          Available today to all Pro members, our chat experience is actually a whole new
          app built with Tamagui,{' '}
          <Link ff={'inherit' as any} href="https://onestack.dev">
            One
          </Link>
          , and{' '}
          <Link ff={'inherit' as any} href="https://zero.rocicorp.dev">
            Zero
          </Link>
          .
        </Paragraph>

        <Paragraph ff="$mono" size="$7" lh="$8" theme="alt1">
          Our bot isn't just a GPT wrapper, it features a large library of resources
          including all the code for Bento and Takeout and a custom library designed to
          improve it's answers with Config v4.
        </Paragraph>

        <Paragraph ff="$mono" size="$7" lh="$8" theme="alt1">
          It also has access to our entire Discord chatroom, distilled using a multi-stage
          LLM pipeline.
        </Paragraph>

        <Paragraph ff="$mono" size="$7" lh="$8" theme="alt1">
          Tamagui Chat has access to a wide variety of tools, including vector and fuzzy
          search, and three specific sub-tools that work together for code generation.
        </Paragraph>

        <Separator my="$5" />

        <Paragraph ff="$mono" size="$7" lh="$8" theme="alt1">
          Tamagui Chat is in early beta, so we don't yet guarantee uptime and results, but
          we appreciate your patience and feedback as we iterate on the model.
        </Paragraph>

        <Spacer my="$6" />
      </Container>
    </>
  )
}
