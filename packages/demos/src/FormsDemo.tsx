import { stat } from 'fs'

import { useEffect, useState } from 'react'
import { Button, Form, H4, SizeTokens, Spinner, XStack, YStack } from 'tamagui'

export function FormsDemo(props: { size: SizeTokens }) {
  const [status, setStatus] = useState<'off' | 'submitting' | 'submitted'>('off')

  useEffect(() => {
    if (status === 'submitting') {
      const timer = setTimeout(() => setStatus('off'), 2000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [status])

  return (
    <Form
      ai="center"
      miw={300}
      space
      onSubmit={() => setStatus('submitting')}
      bw={1}
      br="$4"
      bc="$background"
      boc="$borderColor"
      p="$8"
    >
      <H4>{status[0].toUpperCase() + status.slice(1)}</H4>

      <Form.Trigger asChild disabled={status !== 'off'}>
        <Button icon={status === 'submitting' ? () => <Spinner /> : undefined}>
          Submit
        </Button>
      </Form.Trigger>
    </Form>
  )
}
