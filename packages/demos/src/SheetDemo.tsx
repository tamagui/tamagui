import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { Sheet, SheetProps, useSheet } from '@tamagui/sheet'
import { useState } from 'react'
import { Button, H1, H2, Input, Paragraph, XStack, YStack } from 'tamagui'

const spModes = ['percent', 'constant', 'fit', 'mixed'] as const

export const SheetDemo = () => {
  const [position, setPosition] = useState(0)
  const [open, setOpen] = useState(false)
  const [modal, setModal] = useState(true)
  const [innerOpen, setInnerOpen] = useState(false)
  const [snapPointsMode, setSnapPointsMode] =
    useState<(typeof spModes)[number]>('percent')
  const [mixedFitDemo, setMixedFitDemo] = useState(false)

  const isPercent = snapPointsMode === 'percent'
  const isConstant = snapPointsMode === 'constant'
  const isFit = snapPointsMode === 'fit'
  const isMixed = snapPointsMode === 'mixed'
  const hasFit = isFit || (isMixed && mixedFitDemo)
  const snapPoints = isPercent
    ? [85, 50, 25]
    : isConstant
    ? [256, 190]
    : isFit
    ? undefined
    : mixedFitDemo
    ? ['fit', 110]
    : ['80%', 256, 190]

  return (
    <>
      <YStack space>
        <XStack space $sm={{ flexDirection: 'column', alignItems: 'center' }}>
          <Button onPress={() => setOpen(true)}>Open</Button>
          <Button onPress={() => setModal((x) => !x)}>
            {modal ? 'Type: Modal' : 'Type: Inline'}
          </Button>
          <Button
            onPress={() =>
              setSnapPointsMode(
                (prev) => spModes[(spModes.indexOf(prev) + 1) % spModes.length]
              )
            }
          >
            {`Mode: ${
              { percent: 'Percentage', constant: 'Constant', fit: 'Fit', mixed: 'Mixed' }[
                snapPointsMode
              ]
            }`}
          </Button>
        </XStack>
        {isMixed ? (
          <Button onPress={() => setMixedFitDemo((x) => !x)}>
            {`Snap Points: ${JSON.stringify(snapPoints)}`}
          </Button>
        ) : (
          <XStack paddingVertical="$2.5" justifyContent="center">
            <Paragraph>{`Snap Points: ${
              isFit ? '(none)' : JSON.stringify(snapPoints)
            }`}</Paragraph>
          </XStack>
        )}
      </YStack>

      <Sheet
        forceRemoveScrollEnabled={open}
        modal={modal}
        open={open}
        onOpenChange={setOpen}
        snapPoints={snapPoints}
        snapPointsMode={snapPointsMode}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
        animation="bouncy"
      >
        <Sheet.Overlay
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle />
        <Sheet.Frame padding="$4" justifyContent="center" alignItems="center" space="$5">
          <Button size="$6" circular icon={ChevronDown} onPress={() => setOpen(false)} />
          <Input width={200} />
          {modal && isPercent && (
            <>
              <InnerSheet open={innerOpen} onOpenChange={setInnerOpen} />
              <Button
                size="$6"
                circular
                icon={ChevronUp}
                onPress={() => setInnerOpen(true)}
              />
            </>
          )}
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

function InnerSheet(props: SheetProps) {
  return (
    <Sheet modal snapPoints={[90]} dismissOnSnapToBottom {...props}>
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame flex={1} justifyContent="center" alignItems="center" space="$5">
        <Sheet.ScrollView padding="$4" space>
          <Button
            size="$8"
            circular
            alignSelf="center"
            icon={ChevronDown}
            onPress={() => props.onOpenChange?.(false)}
          />
          <H1>Hello world</H1>
          <H2>You can scroll me</H2>
          {[1, 2, 3].map((i) => (
            <Paragraph key={i} size="$10">
              Eu officia sunt ipsum nisi dolore labore est laborum laborum in esse ad
              pariatur. Dolor excepteur esse deserunt voluptate labore ea. Exercitation
              ipsum deserunt occaecat cupidatat consequat est adipisicing velit cupidatat
              ullamco veniam aliquip reprehenderit officia. Officia labore culpa ullamco
              velit. In sit occaecat velit ipsum fugiat esse aliqua dolor sint.
            </Paragraph>
          ))}
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  )
}
