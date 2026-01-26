import React from 'react'
import type { SizeTokens } from 'tamagui'
import {
  Button,
  Form,
  H4,
  Spinner,
  AnimatePresence,
  Square,
  XStack,
  XGroup,
  Label,
  YStack,
} from 'tamagui'

export function FormsDemo(props: { size: SizeTokens }) {
  const [status, setStatus] = React.useState<'off' | 'submitting' | 'submitted'>('off')

  React.useEffect(() => {
    if (status === 'submitting') {
      const timer = setTimeout(() => setStatus('off'), 2000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [status])

  return (
    <Form
      items="center"
      gap="$2"
      onSubmit={() => setStatus('submitting')}
      borderWidth={1}
      rounded="$4"
      bg="$color2"
      borderColor="$borderColor"
      minW={350}
      p="$6"
    >
      <Form.Trigger asChild disabled={status !== 'off'}>
        <YStack gap="$4">
          <Button theme="surface3">Submit</Button>
          <YStack width="100%" height={40} justifyContent="center" alignItems="center">
            <AnimatePresence>
              {status === 'submitting' ? (
                <Spinner
                  transition="kindaBouncy"
                  enterStyle={{ opacity: 0 }}
                  alignSelf="center"
                  key="spinner"
                  width={8}
                />
              ) : null}
            </AnimatePresence>
          </YStack>
        </YStack>
      </Form.Trigger>
    </Form>
  )
}
