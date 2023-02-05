import { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  SizeTokens,
  Spinner,
  Text,
  TextArea,
  XStack,
  YStack,
} from 'tamagui'

export function FormsDemo() {
  return (
    <YStack mih={250} overflow="hidden" space="$2" m="$3" p="$2">
      <FormDemo size="$2" />
    </YStack>
  )
}

function FormDemo(props: { size: SizeTokens }) {
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 2000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [submitted])

  return (
    <Form space="$2" ai="center" onSubmit={() => setSubmitted(true)}>
      <Text>Form {submitted ? 'submitted' : 'unsubmitted'}</Text>
      <XStack space>
        <Button
          backgroundColor="transparent"
          borderWidth="$0.5"
          borderColor="$borderColor"
        >
          <Text>Other</Text>
        </Button>
        <Form.Trigger asChild disabled={submitted}>
          <Button icon={submitted ? () => <Spinner /> : undefined}>
            <Text>Submit</Text>
          </Button>
        </Form.Trigger>
      </XStack>
    </Form>
  )
}
