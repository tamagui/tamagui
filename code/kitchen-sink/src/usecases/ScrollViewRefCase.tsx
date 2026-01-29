import { useRef, useState } from 'react'
import { ScrollView, type ScrollView as ScrollViewType } from '@tamagui/scroll-view'
import { Button, Text, YStack } from 'tamagui'

export function ScrollViewRefCase() {
  const scrollRef = useRef<ScrollViewType>(null)
  const [status, setStatus] = useState('ready')

  const handleScrollTo = () => {
    if (scrollRef.current?.scrollTo) {
      scrollRef.current.scrollTo({ x: 0, y: 200, animated: false })
      setStatus('scrolled-to-200')
    } else {
      setStatus('no-scrollTo-method')
    }
  }

  const handleScrollToEnd = () => {
    if (scrollRef.current?.scrollToEnd) {
      scrollRef.current.scrollToEnd({ animated: false })
      setStatus('scrolled-to-end')
    } else {
      setStatus('no-scrollToEnd-method')
    }
  }

  const handleGetScrollableNode = () => {
    if (scrollRef.current?.getScrollableNode) {
      const node = scrollRef.current.getScrollableNode()
      if (node && node instanceof HTMLElement) {
        setStatus('got-scrollable-node')
      } else {
        setStatus('invalid-node')
      }
    } else {
      setStatus('no-getScrollableNode-method')
    }
  }

  return (
    <YStack gap="$2" padding="$2" height={400}>
      <Text id="status" testID="status">
        {status}
      </Text>

      <YStack flexDirection="row" gap="$2">
        <Button id="scroll-to-btn" testID="scroll-to-btn" size="$2" onPress={handleScrollTo}>
          scrollTo(200)
        </Button>
        <Button
          id="scroll-to-end-btn"
          testID="scroll-to-end-btn"
          size="$2"
          onPress={handleScrollToEnd}
        >
          scrollToEnd
        </Button>
        <Button
          id="get-node-btn"
          testID="get-node-btn"
          size="$2"
          onPress={handleGetScrollableNode}
        >
          getScrollableNode
        </Button>
      </YStack>

      <ScrollView
        ref={scrollRef}
        id="test-scrollview"
        testID="test-scrollview"
        flex={1}
        backgroundColor="$background"
      >
        {Array.from({ length: 50 }, (_, i) => (
          <Text key={i} id={`item-${i}`} padding="$2">
            Item {i}
          </Text>
        ))}
      </ScrollView>
    </YStack>
  )
}
