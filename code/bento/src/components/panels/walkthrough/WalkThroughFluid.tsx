import { AccordionDemo, GroupDemo } from '@tamagui/demos'
import { useEffect, useMemo, useRef, useState } from 'react'
import { View } from 'react-native'
import {
  AnimatePresence,
  Button,
  Paragraph,
  Popover,
  PortalHost,
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
    itemsDim: {
      x: number
      y: number
      width: number
      height: number
    }[]
    upsertItemDim: (param: {
      index: number
      data: {
        x: number
        y: number
        width: number
        height: number
      }
    }) => void
  }>()

const PORTAL_WALKTHROUGH_HOST_NAME = 'walkthrough'
const PORTAL_WALKTHROUGH_DIALOG_HOST_NAME = 'walkthrough-dialog'

function WalkThroughComp({
  numberOfSteps,
  children,
}: {
  numberOfSteps: number
  children: React.ReactNode
}) {
  const [activeStep, setActiveStep] = useState(0)
  const nextStep = useEvent(() => {
    setActiveStep(activeStep + 1)
  })
  const prevStep = useEvent(() => {
    if (activeStep >= 0) {
      setActiveStep(activeStep - 1)
    }
  })

  const [itemsDim, setItemsDim] = useState<
    {
      x: number
      y: number
      width: number
      height: number
    }[]
  >([])

  const upsertItemDim = useEvent(
    (param: {
      index: number
      data: {
        x: number
        y: number
        width: number
        height: number
      }
    }) => {
      const { index, data } = param
      setItemsDim((itemsDim) => {
        const newItemsDim = [...itemsDim]
        newItemsDim[index] = data
        return newItemsDim
      })
    }
  )

  const lastActiveStep = useRef(activeStep)
  useEffect(() => {
    lastActiveStep.current = activeStep
  }, [activeStep])

  const value = {
    activeStep,
    nextStep,
    prevStep,
    numberOfSteps,
    upsertItemDim,
    itemsDim,
  }

  const popoverRef = useRef<Popover | null>(null)

  useEffect(() => {
    if (itemsDim.length !== numberOfSteps) return
    popoverRef.current?.anchorTo(itemsDim[activeStep] || itemsDim[numberOfSteps - 1])
  }, [activeStep, itemsDim])

  return (
    <PortalProvider rootHostName={PORTAL_WALKTHROUGH_HOST_NAME}>
      <PortalItem hostName={PORTAL_WALKTHROUGH_HOST_NAME}>
        <AnimatePresence>
          {activeStep <= numberOfSteps - 1 && (
            <XStack
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
              animation="quick"
              width="100%"
              mih="100%"
              fullscreen
              borderColor="#000"
              zIndex={1000}
              opacity={0.5}
            />
          )}
        </AnimatePresence>
        {itemsDim.length === numberOfSteps && (
          <Popover
            stayInFrame
            allowFlip
            placement="bottom"
            size="$0.5"
            ref={popoverRef}
            open={activeStep <= numberOfSteps - 1 && itemsDim.length === numberOfSteps}
          >
            <Popover.Trigger />
            <Popover.Content
              enterStyle={{ opacity: 0, scale: 0.9 }}
              exitStyle={{ scale: 0.9 }}
              scale={1}
              x={0}
              y={0}
              opacity={1}
              fullscreen
              animation="quick"
              enableAnimationForPositionChange
            >
              <Popover.Arrow size="$4" borderColor="$borderColor" />
              <PortalHost name={PORTAL_WALKTHROUGH_DIALOG_HOST_NAME} />
            </Popover.Content>
          </Popover>
        )}
      </PortalItem>
      <WalkThroughStateProvider {...value}>{children}</WalkThroughStateProvider>
    </PortalProvider>
  )
}
WalkThroughComp.displayName = 'WalkThrough'

function Tour({
  children,
  stepNumber,
  renderDialog,
}: {
  children: React.ReactElement<any>
  stepNumber: number
  renderDialog: (props: {
    nextStep: () => void
    prevStep: () => void
    numberOfSteps: number
    activeStep: number
  }) => React.ReactNode
}) {
  const { activeStep, numberOfSteps, nextStep, prevStep, upsertItemDim } =
    useWalkThrough()
  const showTour = activeStep === stepNumber
  const itemRef = useRef<View | null>(null)
  const absoluteItemRef = useRef<View | null>(null)
  const [dim, setDim] = useState<{
    width: number
    height: number
    pageX: number
    pageY: number
  }>()
  const { pageX, pageY } = dim || {}

  const measureDim = useEvent(() => {
    itemRef.current?.measure((_, __, width, height, pageX, pageY) => {
      setDim({
        width,
        height,
        pageX,
        pageY,
      })
      upsertItemDim({
        index: stepNumber,
        data: {
          x: pageX,
          y: pageY,
          width,
          height,
        },
      })
    })
  })

  const measureAbsoluteDim = useEvent(() => {
    absoluteItemRef.current?.measure((_, __, width, height, pageX, pageY) => {
      upsertItemDim({
        index: stepNumber,
        data: {
          x: pageX,
          y: pageY,
          width,
          height,
        },
      })
    })
  })

  useEffect(() => {
    measureDim()
  }, [stepNumber])

  return (
    <>
      <View
        aria-hidden
        style={useMemo(
          () => ({
            opacity: dim && showTour ? 0 : 1,
            pointerEvents: showTour ? 'none' : undefined,
            alignSelf: 'flex-start',
          }),
          [showTour, dim]
        )}
        ref={itemRef}
      >
        {children}
      </View>
      <PortalItem hostName={PORTAL_WALKTHROUGH_HOST_NAME}>
        {dim && activeStep <= numberOfSteps && (
          <Stack
            zIndex={showTour ? 2000 : -1000}
            position="absolute"
            animation="quick"
            left={pageX}
            top={pageY}
            overflow="hidden"
            ref={absoluteItemRef}
            onLayout={measureAbsoluteDim}
          >
            {children}
          </Stack>
        )}
      </PortalItem>
      <PortalItem hostName={PORTAL_WALKTHROUGH_DIALOG_HOST_NAME}>
        {stepNumber === activeStep &&
          renderDialog({ nextStep, prevStep, numberOfSteps, activeStep })}
      </PortalItem>
    </>
  )
}
Tour.displayName = 'WalkThrough.Tour'

const WalkThrough = withStaticProperties(WalkThroughComp, {
  Tour,
})

function DialogContent({
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
  const isLastStep = currentStep === numberOfSteps - 1
  const isFirstStep = currentStep === 0
  return (
    <ThemeableStack
      borderWidth={2}
      backgroundColor="#fff"
      gap="$4"
      flexDirection="column"
      padding="$4"
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

export function WalkThroughFluidDemo() {
  return (
    <WalkThrough numberOfSteps={2}>
      <YStack gap="$4" padding={100} flex={1}>
        <WalkThrough.Tour
          stepNumber={0}
          renderDialog={({ nextStep, prevStep, numberOfSteps }) => (
            <DialogContent
              nextStep={nextStep}
              prevStep={prevStep}
              numberOfSteps={numberOfSteps}
              title="This is our Group component"
              currentStep={0}
            />
          )}
        >
          <GroupDemo />
        </WalkThrough.Tour>
        <WalkThrough.Tour
          stepNumber={1}
          renderDialog={({ nextStep, prevStep, numberOfSteps }) => (
            <DialogContent
              nextStep={nextStep}
              prevStep={prevStep}
              numberOfSteps={numberOfSteps}
              title="This is our accordion component"
              currentStep={1}
            />
          )}
        >
          <AccordionDemo />
        </WalkThrough.Tour>
      </YStack>
    </WalkThrough>
  )
}

WalkThroughFluidDemo.fileName = 'WalkThroughFluid'
