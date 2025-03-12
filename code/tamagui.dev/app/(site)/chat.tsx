import { H1, Paragraph, Separator, Spacer } from 'tamagui'
import { Container } from '../../components/Containers'
import { Link } from '../../components/Link'

export const ChatPage = () => {
  return (
    <>
      <Container py="$12" gap="$4">
        <Paragraph ff="$mono" theme="alt2" mb="$-4">
          Introducing
        </Paragraph>

        <H1 ff="$mono" size="$11">
          Tamagui Chat
        </H1>

        <Paragraph ff="$mono" size="$10">
          We've built a chatbot from scratch, an expert in all things Tamagui.
        </Paragraph>

        <Paragraph ff="$mono" size="$7" lh="$8" theme="alt1">
          Available today to all Pro members, it's actually a whole new app built with
          Tamagui,{' '}
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
          Tamagui Chat isn't just a plain old GPT wrapper.
        </Paragraph>

        <Paragraph ff="$mono" size="$7" lh="$8" theme="alt1">
          It features a large library of resources including all the code for Bento and
          Takeout and a custom library designed to improve it's answers with Config v4.
        </Paragraph>

        <Paragraph ff="$mono" size="$7" lh="$8" theme="alt1">
          It also has access to our entire Discord chatroom, distilled using a multi-stage
          LLM pipeline with a variety of tools, including multi-stage vector and fuzzy
          search.
        </Paragraph>

        <Paragraph ff="$mono" size="$7" lh="$8" theme="alt1">
          Tamagui Chat also has a few different code generation tools that are in early
          beta.
        </Paragraph>

        <Separator my="$5" />

        <Paragraph ff="$mono" size="$7" lh="$8" theme="alt1">
          Tamagui Chat is in early beta, we appreciate your patience and feedback.
        </Paragraph>

        <Spacer my="$6" />
      </Container>
    </>
  )
}
