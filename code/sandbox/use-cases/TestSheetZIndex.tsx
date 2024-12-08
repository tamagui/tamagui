import { Anchor, Button, Paragraph, Sheet, XStack } from 'tamagui'
import { ChevronDown } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { useToastController } from '@tamagui/toast'

export default function test() {
  return <SheetDemo />
}

function SheetDemo() {
  const toast = useToastController()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        size="$6"
        onPress={() => {
          setOpen(true)
          toast.show('This toast is covered by the ', {
            message: 'Just showing how toast works...',
            duration: 100_000,
          })
        }}
      >
        Open Sheet & Toast
      </Button>

      <CustomSheet open={open} setOpen={setOpen} />
    </>
  )
}

const CustomSheet = ({ open, setOpen }) => {
  const [position, setPosition] = useState(0)
  const [childOpen, setChildOpen] = useState(false)

  return (
    <>
      {childOpen && <CustomSheet open={childOpen} setOpen={setChildOpen} />}

      <Sheet
        modal
        animation="medium"
        open={open}
        onOpenChange={setOpen}
        snapPoints={[95]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
        zIndex={100_000_000}
      >
        <Sheet.Overlay
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle bg="$gray8" />
        <Sheet.Frame ai="center" jc="center" gap="$10" bg="rgba(255,0,0,0.5)">
          <Button
            size="$6"
            onPress={() => {
              setChildOpen(true)
            }}
          >
            Open Child Sheet
          </Button>

          <Button
            size="$6"
            circular
            icon={ChevronDown}
            onPress={() => {
              setOpen(false)
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
