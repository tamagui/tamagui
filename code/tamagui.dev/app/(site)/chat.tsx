import { H1, Paragraph, Separator, Spacer } from 'tamagui'
import { Container } from '../../components/Containers'
import { Link } from '../../components/Link'
import { Notice } from '../../components/Notice'

export const ChatPage = () => {
  return (
    <>
      <Container py="$12" gap="$4">
        <Paragraph fontFamily="$mono" color="$color9" mb="$-4">
          Introducing
        </Paragraph>

        <H1 fontFamily="$mono" size="$12">
          Tamagui Chat
        </H1>

        <Paragraph fontFamily="$mono" size="$10">
          A chatbot and AI code generator, built from scratch to be an expert in all
          things Tamagui.
        </Paragraph>

        <Notice>
          Chat is in early alpha, it may go down for extended periods of time. We are
          dog-fooding it as the base of the next version of Takeout, so our focus is on
          testing architectures and refactoring primitives over stability at the moment.
        </Notice>

        <Paragraph fontFamily="$mono" size="$7" lineHeight="$8" color="$color10">
          Available today to all Pro members, our chat experience is actually a whole new
          app built with Tamagui, <Link href="https://onestack.dev">One</Link>, and{' '}
          <Link href="https://zero.rocicorp.dev">Zero</Link>.
        </Paragraph>

        <Paragraph fontFamily="$mono" size="$7" lineHeight="$8" color="$color10">
          Our bot isn't just a GPT wrapper, it features a large library of resources
          including all the code for Bento and Takeout and a custom library designed to
          improve it's answers with Config v4.
        </Paragraph>

        <Paragraph fontFamily="$mono" size="$7" lineHeight="$8" color="$color10">
          It also has access to our entire Discord chatroom, distilled using a multi-stage
          LLM pipeline.
        </Paragraph>

        <Paragraph fontFamily="$mono" size="$7" lineHeight="$8" color="$color10">
          Tamagui Chat has access to a wide variety of tools, including vector and fuzzy
          search, and three specific sub-tools that work together for code generation.
        </Paragraph>

        <Separator my="$5" />

        <Paragraph fontFamily="$mono" size="$7" lineHeight="$8" color="$color10">
          Tamagui Chat is in early beta, so we don't yet guarantee uptime and results, but
          we appreciate your patience and feedback as we iterate on the model.
        </Paragraph>

        <Spacer my="$6" />
      </Container>
    </>
  )
}
