import { AccordionDemo, GroupDemo } from '@tamagui/demos'
import { useEffect, useMemo, useRef, useState } from 'react'
import { View, useWindowDimensions } from 'react-native'
import {
  AnimatePresence,
  Button,
  Paragraph,
  Popover,
  PortalItem,
  PortalProvider,
  Stack,
  ThemeableStack,
  XStack,
  YStack,
  createStyledContext,
  useEvent,
  withStaticProperties,
} from 'tamagui'
const { Provider: WalkThroughStateProvider, useStyledContext: useWalkThrough } =
  createStyledContext<{
    activeStep: number
    numberOfSteps: number
    nextStep: () => void
    prevStep: () => void
  }>()

function Tour({
  children,
  stepNumber,
  renderDialog,
}: {
  children: React.ReactNode
  stepNumber: number
  renderDialog: (props: {
    nextStep: () => void
    prevStep: () => void
    numberOfSteps: number
    activeStep: number
  }) => React.ReactNode
}) {
  const { activeStep, numberOfSteps, nextStep, prevStep } = useWalkThrough()
  const showTour = activeStep === stepNumber
  const itemRef = useRef<View | null>(null)
  const [dim, setDim] = useState<{
    width: number
    height: number
    pageX: number
    pageY: number
  }>()
  const { pageX, pageY } = dim || {}

  useEffect(() => {
    itemRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
      setDim({ width, height, pageX, pageY })
    })
  }, [children])

  return (
    <>
      <View
        aria-hidden
        style={useMemo(() => ({ opacity: 0, pointerEvents: 'none' }), [showTour])}
        key={stepNumber}
        ref={itemRef}
      >
        {children}
      </View>
      {dim && (
        <PortalItem hostName="walkthrough">
          <Popover stayInFrame allowFlip placement="bottom" size="$0.5" open={showTour}>
            <Popover.Trigger asChild>
              <Stack
                key={stepNumber}
                zIndex={showTour ? 2000 : 1}
                position="absolute"
                left={pageX}
                top={pageY}
                ref={itemRef}
              >
                {children}
              </Stack>
            </Popover.Trigger>
            <Popover.Content
              enterStyle={{ opacity: 0, scale: 0.9 }}
              exitStyle={{ opacity: 0, scale: 0.9 }}
              scale={1}
              x={0}
              y={0}
              opacity={1}
              fullscreen
              animation={[
                'quick',
                {
                  opacity: {
                    overshootClamping: true,
                  },
                },
              ]}
            >
              <Popover.Arrow size="$4" borderColor="$borderColor" />
              {renderDialog({ nextStep, prevStep, numberOfSteps, activeStep })}
            </Popover.Content>
          </Popover>
        </PortalItem>
      )}
    </>
  )
}
function WalkThroughImpl({
  numberOfSteps,
  children,
}: {
  numberOfSteps: number
  children: React.ReactNode
}) {
  const [activeStep, setActiveStep] = useState(1)
  const nextStep = useEvent(() => {
    if (activeStep <= numberOfSteps) {
      setActiveStep(activeStep + 1)
    }
  })
  const prevStep = useEvent(() => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
    }
  })
  const value = {
    activeStep,
    nextStep,
    prevStep,
    numberOfSteps,
  }

  const { height: screenHeight, width: screenWidth } = useWindowDimensions()
  return (
    <PortalProvider rootHostName="walkthrough">
      <PortalItem hostName="walkthrough">
        <AnimatePresence>
          {activeStep <= numberOfSteps && (
            <XStack
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
              animation="bouncy"
              width="100%"
              mih="100%"
              fullscreen
              borderColor="#000"
              opacity={0.5}
              zIndex={1000}
            />
          )}
        </AnimatePresence>
      </PortalItem>
      <WalkThroughStateProvider {...value}>{children}</WalkThroughStateProvider>
    </PortalProvider>
  )
}

const WalkThrough = withStaticProperties(WalkThroughImpl, {
  Tour,
})

function Dialog({
  nextStep,
  prevStep,
  numberOfSteps,
  title,
  currentStep,
}: {
  nextStep: () => void
  prevStep: () => void
  numberOfSteps: number
  title: string
  currentStep: number
}) {
  const isLastStep = currentStep === numberOfSteps
  const isFirstStep = currentStep === 0
  return (
    <ThemeableStack
      borderWidth={2}
      backgroundColor="#fff"
      gap="$4"
      flexDirection="column"
      elevate
      backgrounded
      radiused
      borderColor="black"
    >
      <Paragraph>{title}</Paragraph>
      <XStack gap="$2">
        {!isFirstStep && (
          <Button onPress={prevStep}>
            <Button.Text>Previous</Button.Text>
          </Button>
        )}
        <Button onPress={nextStep}>
          {isLastStep ? (
            <Button.Text>Finish</Button.Text>
          ) : (
            <Button.Text>Next</Button.Text>
          )}
        </Button>
      </XStack>
    </ThemeableStack>
  )
}

export function WalkThroughDemo() {
  return (
    <WalkThrough numberOfSteps={2}>
      <YStack gap="$4">
        <WalkThrough.Tour
          stepNumber={1}
          renderDialog={({ nextStep, prevStep, numberOfSteps }) => (
            <Dialog
              nextStep={nextStep}
              prevStep={prevStep}
              numberOfSteps={numberOfSteps}
              title="This is our Group component"
              currentStep={1}
            />
          )}
        >
          <GroupDemo />
        </WalkThrough.Tour>
        <WalkThrough.Tour
          stepNumber={2}
          renderDialog={({ nextStep, prevStep, numberOfSteps }) => (
            <Dialog
              nextStep={nextStep}
              prevStep={prevStep}
              numberOfSteps={numberOfSteps}
              title="This is our accordion component"
              currentStep={2}
            />
          )}
        >
          <AccordionDemo />
        </WalkThrough.Tour>
      </YStack>
    </WalkThrough>
  )
}

WalkThroughDemo.fileName = 'WalkThrough'
