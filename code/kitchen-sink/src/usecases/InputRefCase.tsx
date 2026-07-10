import { Input, TextArea } from '@tamagui/input'
import React from 'react'
import { Button, Dialog, Paragraph, Popover, YStack, styled } from 'tamagui'

const StyledInput = styled(Input, {
  name: 'InputRefCaseStyledInput',
})

const StyledTextArea = styled(TextArea, {
  name: 'InputRefCaseStyledTextArea',
})

const DoubleStyledInput = styled(
  styled(Input, {
    name: 'InputRefCaseDoubleStyledInputBase',
  }),
  {
    name: 'InputRefCaseDoubleStyledInput',
  }
)

const DoubleStyledTextArea = styled(
  styled(TextArea, {
    name: 'InputRefCaseDoubleStyledTextAreaBase',
  }),
  {
    name: 'InputRefCaseDoubleStyledTextArea',
  }
)

function ImperativeStyledInput(props: React.ComponentProps<typeof StyledInput>) {
  const { ref, ...rest } = props
  const innerRef = React.useRef<any>(null)

  React.useImperativeHandle(ref, () => innerRef.current, [])

  return <StyledInput {...rest} ref={innerRef} />
}

type RefProbeProps = {
  Component: React.ElementType
  callback?: boolean
  children?: React.ReactNode
  componentProps?: Record<string, unknown>
  focusOnLayout?: boolean
  id: string
}

function RefProbe({
  Component,
  callback,
  children,
  componentProps,
  focusOnLayout,
  id,
}: RefProbeProps) {
  const objectRef = React.useRef<any>(null)
  const [callbackNode, setCallbackNode] = React.useState<any>(null)
  const callbackRef = React.useCallback((node: any) => setCallbackNode(node), [])
  const [tagName, setTagName] = React.useState('NULL')

  React.useLayoutEffect(() => {
    const current = callback ? callbackNode : objectRef.current
    if (!current) return

    if (focusOnLayout) {
      current.focus()
    }
    setTagName(current.tagName ?? 'NULL')
  }, [callback, callbackNode, focusOnLayout])

  return (
    <YStack gap="$2">
      <Component {...componentProps} id={id} ref={callback ? callbackRef : objectRef}>
        {children}
      </Component>
      <Paragraph testID={`${id}-tag`}>{tagName}</Paragraph>
      <Button
        testID={`${id}-focus`}
        onPress={() => (callback ? callbackNode : objectRef.current)?.focus()}
      >
        Focus {id}
      </Button>
    </YStack>
  )
}

export function InputRefCase() {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [popoverOpen, setPopoverOpen] = React.useState(false)

  return (
    <YStack gap="$3" padding="$4">
      <RefProbe Component={Input} id="input-ref-plain" />
      <RefProbe Component={StyledInput} id="input-ref-styled" />
      <RefProbe
        Component={TextArea}
        componentProps={{ multiline: true, rows: 5 }}
        id="textarea-ref-plain"
      />
      <RefProbe
        Component={StyledTextArea}
        componentProps={{ multiline: true, rows: 5 }}
        id="textarea-ref-styled"
      />

      <RefProbe callback Component={StyledInput} id="input-ref-callback" />
      <RefProbe callback Component={StyledTextArea} id="textarea-ref-callback" />
      <RefProbe Component={DoubleStyledInput} id="input-ref-double-styled" />
      <RefProbe Component={DoubleStyledTextArea} id="textarea-ref-double-styled" />
      <RefProbe
        Component={ImperativeStyledInput}
        focusOnLayout
        id="input-ref-imperative"
      />
      <RefProbe
        Component={Input}
        componentProps={{ asChild: true }}
        id="input-ref-as-child"
      >
        <input />
      </RefProbe>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal={false}>
        <Dialog.Trigger asChild>
          <Button testID="input-ref-dialog-open">Open ref dialog</Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content>
            <Dialog.Title>Input ref dialog</Dialog.Title>
            <Dialog.Description>Portal ref coverage</Dialog.Description>
            <RefProbe Component={StyledInput} id="input-ref-dialog" />
            <Dialog.Close asChild>
              <Button testID="input-ref-dialog-close">Close ref dialog</Button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>

      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Popover.Trigger asChild>
          <Button testID="textarea-ref-popover-open">Open ref popover</Button>
        </Popover.Trigger>
        <Popover.Content>
          <RefProbe Component={StyledTextArea} id="textarea-ref-popover" />
        </Popover.Content>
      </Popover>
    </YStack>
  )
}
