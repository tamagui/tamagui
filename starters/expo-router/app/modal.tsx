import { Anchor, Paragraph, View } from 'tamagui'

export default function ModalScreen() {
  return (
    <View flex={1} alignItems="center" justifyContent="center">
      <Paragraph ta="center" color="$color12" themeInverse>
        Made by{' '}
        <Anchor color="$blue10" href="https://twitter.com/natebirdman" target="_blank">
          @natebirdman
        </Anchor>
        ,{' '}
        <Anchor
          color="$purple10"
          href="https://github.com/tamagui/tamagui"
          target="_blank"
          rel="noreferrer"
        >
          give it a ⭐️
        </Anchor>
      </Paragraph>
    </View>
  )
}
