import React from 'react'
import type { SizeTokens } from 'tamagui'
import { Button, Form, H4, Spinner } from 'tamagui'

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
      alignItems="center"
      minWidth={300}
      gap="$2"
      onSubmit={() => setStatus('submitting')}
      borderWidth={1}
      borderRadius="$4"
      backgroundColor="$background"
      borderColor="$borderColor"
      padding="$8"
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
