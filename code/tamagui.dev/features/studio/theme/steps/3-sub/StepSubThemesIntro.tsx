import { H4, Paragraph, YStack } from 'tamagui'

import { NoticeParagraph, StudioSuccess } from '../../../StudioNotice'

export function StepSubThemesIntro() {
  return (
    <YStack
      my="$4"
      gap="$3"
    >
      <H4>Beyond light and dark</H4>

      <Paragraph
        size="$5"
        theme="alt1"
      >
        So now we've got our base theme set up, but you may want to go further. Tamagui lets you
        define two types of sub-themes.
      </Paragraph>

      <Paragraph
        size="$5"
        theme="alt1"
      >
        The main type of theme, like your base and accent themes, is one built out of a palette. It
        can be useful as a sub-theme for things like success, or error:
      </Paragraph>

      <StudioSuccess
        my="$3"
        title="Hello"
      >
        <NoticeParagraph>
          This green section is using a sub-theme called <b>success</b> based on a green palette.
          It's great for notices, toasts, modals, badges, and more. Other useful sub-themes for
          states can be <b>error</b> or <b>alert</b>.
        </NoticeParagraph>
      </StudioSuccess>

      <Paragraph
        size="$5"
        theme="alt1"
      >
        You can also create a different type of sub-theme, which is a bit more advanced. This is
        called a <b>mask</b> sub-theme. What it does it take a parent theme and "shift" the values
        it looks for in some way. These are useful for things like having an <b>active</b>,{' '}
        <b>disabled</b> or <b>dim</b> sub-theme.
      </Paragraph>

      <Paragraph
        size="$5"
        theme="alt1"
      >
        In the next step you can customize your sub-themes. We show a few recommended ones in the
        menu to help you get started.
      </Paragraph>

      <Paragraph
        size="$4"
        theme="alt1"
      >
        For a really detailed breakdown of how themes work, we highly recommend you check out{' '}
        <a
          href="https://tamagui.dev/docs/guides/theme-builder"
          // biome-ignore lint/a11y/noBlankTarget: <explanation>
          target="_blank"
          style={{ textDecoration: 'underline' }}
        >
          the Theme Builder guide
        </a>
        .
      </Paragraph>

      <br />
    </YStack>
  )
}
