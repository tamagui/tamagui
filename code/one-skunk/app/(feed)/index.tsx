import { Stack } from 'one'
import { Adapt, H1, Paragraph, Sheet } from 'tamagui'
import { ModalSheetViewTest01 } from '~/code/TestSheet'

export function FeedPage() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Feed',
        }}
      />

      <Sheet
        // modal
        dismissOnSnapToBottom
        animationConfig={{
          type: 'spring',
          damping: 20,
          mass: 1.2,
          stiffness: 250,
        }}
      >
        <Sheet.Frame>
          <Sheet.ScrollView>
            <H1>Test this sheet</H1>
            <Paragraph>Lorem ipsum dolor sit amet.</Paragraph>
          </Sheet.ScrollView>
        </Sheet.Frame>
        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />

        <Adapt platform="ios">
          {(props) => {
            console.info('adapting our sheet', props)
            return <ModalSheetViewTest01 index={0} />
          }}
        </Adapt>
      </Sheet>
    </>
  )
}
