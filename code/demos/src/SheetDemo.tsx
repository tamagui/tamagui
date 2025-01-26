import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import type { SheetProps } from '@tamagui/sheet'
import { Sheet } from '@tamagui/sheet'
import React, { memo } from 'react'
import { Button, H2, Input, Paragraph, XStack, YStack } from 'tamagui'

const spModes = ['percent', 'constant', 'fit', 'mixed'] as const

export const SheetDemo = () => {
  const [position, setPosition] = React.useState(0)
  const [open, setOpen] = React.useState(false)
  const [modal, setModal] = React.useState(true)
  const [innerOpen, setInnerOpen] = React.useState(false)
  const [snapPointsMode, setSnapPointsMode] =
    React.useState<(typeof spModes)[number]>('percent')
  const [mixedFitDemo, setMixedFitDemo] = React.useState(false)

  const isPercent = snapPointsMode === 'percent'
  const isConstant = snapPointsMode === 'constant'
  const isFit = snapPointsMode === 'fit'
  const isMixed = snapPointsMode === 'mixed'
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
      <YStack gap="$4">
        <XStack gap="$4" $sm={{ flexDirection: 'column', alignItems: 'center' }}>
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
            <Paragraph>
              {`Snap Points: ${isFit ? '(none)' : JSON.stringify(snapPoints)}`}
            </Paragraph>
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
        animation="medium"
      >
        <Sheet.Overlay
          bg="$shadow4"
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Sheet.Handle />
        <Sheet.Frame padding="$4" justifyContent="center" alignItems="center" gap="$5">
          <SheetContents {...{ modal, isPercent, innerOpen, setInnerOpen, setOpen }} />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

// in general good to memoize the contents to avoid expensive renders during animations
const SheetContents = memo(
  ({ modal, isPercent, innerOpen, setInnerOpen, setOpen }: any) => {
    return (
      <>
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
      </>
    )
  }
)

function InnerSheet(props: SheetProps) {
  return (
    <Sheet animation="medium" modal snapPoints={[90]} dismissOnSnapToBottom {...props}>
      <Sheet.Overlay
        animation="medium"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />

      <Sheet.Handle />
      <Sheet.Frame flex={1} justifyContent="center" alignItems="center" gap="$5">
        <Sheet.ScrollView>
          <YStack p="$5" gap="$8">
            <Button
              size="$6"
              circular
              alignSelf="center"
              icon={ChevronDown}
              onPress={() => props.onOpenChange?.(false)}
            />

            <H2>Hello world</H2>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Paragraph key={i} size="$8">
                Eu officia sunt ipsum nisi dolore labore est laborum laborum in esse ad
                pariatur. Dolor excepteur esse deserunt voluptate labore ea. Exercitation
                ipsum deserunt occaecat cupidatat consequat est adipisicing velit
                cupidatat ullamco veniam aliquip reprehenderit officia. Officia labore
                culpa ullamco velit. In sit occaecat velit ipsum fugiat esse aliqua dolor
                sint.
              </Paragraph>
            ))}
          </YStack>
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  )
}
