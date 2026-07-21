import { useState } from 'react'
import { Button, Paragraph, Portal, Text, XStack, YStack } from 'tamagui'

import {
  Result,
  SectionHeading,
  Specimen,
  SpecimenGrid,
  SpecimenHeader,
} from './PlaygroundParts'

export function PortalPlayground() {
  const [lastAction, setLastAction] = useState('No surface opened yet')

  return (
    <YStack gap="$8">
      <YStack gap="$6">
        <SectionHeading
          index="01A"
          title="Floating surfaces"
          description="These surfaces must escape the scroll container without losing theme, placement, pointer events, or their trigger relationship."
        />
        <SpecimenGrid>
          <DirectPortalSpecimen onAction={setLastAction} />
          <TooltipSpecimen onAction={setLastAction} />
          <PopoverSpecimen onAction={setLastAction} />
          <SelectSpecimen onAction={setLastAction} />
          <MenuSpecimen onAction={setLastAction} />
          <ContextMenuSpecimen onAction={setLastAction} />
        </SpecimenGrid>
      </YStack>

      <YStack gap="$6">
        <SectionHeading
          index="01B"
          title="Modal and transient layers"
          description="Keep every broken modal and transient path visible as a precise, non-crashing desktop diagnostic."
        />
        <SpecimenGrid>
          <DialogSpecimen onAction={setLastAction} />
          <AlertSpecimen onAction={setLastAction} />
          <SheetSpecimen onAction={setLastAction} />
          <ToastSpecimen onAction={setLastAction} />
        </SpecimenGrid>
      </YStack>

      <YStack gap="$6">
        <SectionHeading
          index="01C"
          title="Stacking stress test"
          description="Mount three direct Portals in sequence. Each layer should stay interactive, visually distinct, and above the previous root surface."
        />
        <NestedPortalSpecimen onAction={setLastAction} />
      </YStack>

      <YStack
        self="flex-start"
        px="$4"
        py="$3"
        rounded="$10"
        bg="$color12"
        shadowColor="$shadowColor"
        shadowOpacity={0.24}
        shadowRadius={16}
        shadowOffset={{ width: 0, height: 8 }}
      >
        <Text color="$color1" fontWeight="800" fontSize="$3" testID="portal-last-action">
          {lastAction}
        </Text>
      </YStack>
    </YStack>
  )
}

type ActionProps = { onAction: (message: string) => void }

function DirectPortalSpecimen({ onAction }: ActionProps) {
  const [open, setOpen] = useState(false)

  return (
    <Specimen>
      <SpecimenHeader
        title="Portal"
        kind="Direct"
        description="Mounts a custom beacon at the window root. It must not be clipped by this card or the ScrollView."
      />
      <Button
        theme="accent"
        onPress={() => {
          setOpen(true)
          onAction('Direct Portal mounted at the window root')
        }}
        testID="portal-direct-trigger"
      >
        Mount root beacon
      </Button>
      {open && (
        <Portal zIndex={100_000}>
          <XStack
            position="absolute"
            t={22}
            r={22}
            bg="$yellow9"
            borderWidth={1}
            borderColor="$yellow11"
            rounded="$6"
            p="$3"
            gap="$3"
            items="center"
            shadowColor="$shadowColor"
            shadowOpacity={0.28}
            shadowRadius={18}
            shadowOffset={{ width: 0, height: 9 }}
            testID="portal-direct-content"
          >
            <YStack>
              <Text color="$yellow12" fontWeight="900">
                Root beacon
              </Text>
              <Text color="$yellow12" fontSize="$2">
                Rendered outside the ScrollView
              </Text>
            </YStack>
            <Button
              size="$2"
              circular
              onPress={() => setOpen(false)}
              aria-label="Close root beacon"
            >
              ×
            </Button>
          </XStack>
        </Portal>
      )}
      <Result>{open ? 'Beacon is mounted' : 'Ready to mount'}</Result>
    </Specimen>
  )
}

function TooltipSpecimen({ onAction }: ActionProps) {
  return (
    <Specimen>
      <SpecimenHeader
        title="Tooltip"
        kind="Hover + focus"
        description="Tooltip is currently a native no-op: its Content renders null on macOS. This card keeps that gap visible."
      />
      <Button
        disabled
        onPress={() => onAction('Tooltip is not mounted on native desktop')}
        testID="portal-tooltip-unsupported"
      >
        Native Tooltip unavailable
      </Button>
      <Result>Expected gap · Tooltip.native renders null</Result>
    </Specimen>
  )
}

function PopoverSpecimen({ onAction }: ActionProps) {
  return (
    <Specimen>
      <SpecimenHeader
        title="Popover"
        kind="Context gap"
        description="The macOS Portal fallback currently loses Popper context. Opening this surface would fail while registering its floating reference."
      />
      <Button
        disabled
        onPress={() => onAction('Popover needs desktop Portal context re-propagation')}
        testID="portal-popover-unsupported"
      >
        Popover context unavailable
      </Button>
      <Result>Known gap · Popper context lost across Portal</Result>
    </Specimen>
  )
}

function SelectSpecimen({ onAction }: ActionProps) {
  return (
    <Specimen>
      <SpecimenHeader
        title="Select"
        kind="Context gap"
        description="Select's portaled Viewport relies on the same scoped context handoff. It stays disabled until desktop re-propagation is available."
      />
      <Button
        disabled
        onPress={() => onAction('Select needs desktop Portal context re-propagation')}
        testID="portal-select-unsupported"
      >
        Select context unavailable
      </Button>
      <Result>Known gap · Select context lost across Portal</Result>
    </Specimen>
  )
}

function MenuSpecimen({ onAction }: ActionProps) {
  return (
    <Specimen>
      <SpecimenHeader
        title="Menu"
        kind="Nested Portal"
        description="Menu currently always selects its Zeego native path on macOS, even with native={false}. The missing fallback is surfaced here."
      />
      <Button
        disabled
        onPress={() => onAction('Menu requires a macOS-capable native adapter')}
        testID="portal-menu-unsupported"
      >
        Zeego adapter unavailable
      </Button>
      <Result>Expected gap · no macOS Menu adapter</Result>
    </Specimen>
  )
}

function ContextMenuSpecimen({ onAction }: ActionProps) {
  return (
    <Specimen>
      <SpecimenHeader
        title="ContextMenu"
        kind="Right click"
        description="ContextMenu shares Menu's always-native wrapper, so macOS cannot reach the custom Portal implementation yet."
      />
      <Button
        disabled
        onPress={() => onAction('ContextMenu requires a macOS-capable native adapter')}
        testID="portal-context-unsupported"
      >
        Native context menu unavailable
      </Button>
      <Result>Expected gap · no macOS ContextMenu adapter</Result>
    </Specimen>
  )
}

function DialogSpecimen({ onAction }: ActionProps) {
  return (
    <Specimen>
      <SpecimenHeader
        title="Dialog"
        kind="Hit-test gap"
        description="Dialog renders through the macOS Portal host, but its visible Content does not receive presses. It stays unmounted so the lab cannot trap the user."
      />
      <Button
        disabled
        onPress={() => onAction('Dialog content does not receive presses on macOS')}
        testID="portal-dialog-unsupported"
      >
        Dialog hit testing unavailable
      </Button>
      <Result>Known gap · portaled Content cannot be pressed</Result>
    </Specimen>
  )
}

function AlertSpecimen({ onAction }: ActionProps) {
  return (
    <Specimen>
      <SpecimenHeader
        title="AlertDialog"
        kind="Hit-test gap"
        description="AlertDialog uses the same Dialog Portal path, so its decision buttons inherit the macOS hit-testing failure."
      />
      <Button
        disabled
        onPress={() => onAction('AlertDialog content does not receive presses on macOS')}
        testID="portal-alert-unsupported"
      >
        AlertDialog hit testing unavailable
      </Button>
      <Result>Known gap · shares Dialog Portal hit testing</Result>
    </Specimen>
  )
}

function SheetSpecimen({ onAction }: ActionProps) {
  return (
    <Specimen>
      <SpecimenHeader
        title="Sheet"
        kind="Closed-state gap"
        description="Sheet initializes its macOS modal layer even while closed, leaving an empty surface over the app. It stays unmounted so the rest of the lab remains usable."
      />
      <Button
        disabled
        onPress={() => onAction('Sheet mounts its modal layer while closed on macOS')}
        testID="portal-sheet-unsupported"
      >
        Sheet closed state unavailable
      </Button>
      <Result>Known gap · closed Sheet still mounts a modal layer</Result>
    </Specimen>
  )
}

function ToastSpecimen({ onAction }: ActionProps) {
  return (
    <Specimen>
      <SpecimenHeader
        title="Toast"
        kind="Paint gap"
        description="Toast state reaches the macOS accessibility tree, but the named root viewport paints no visible content."
      />
      <Button
        disabled
        onPress={() =>
          onAction('Toast state is present but its viewport does not paint on macOS')
        }
        testID="portal-toast-unsupported"
      >
        Toast viewport unavailable
      </Button>
      <Result>Known gap · accessible state, no painted pixels</Result>
    </Specimen>
  )
}

function NestedPortalSpecimen({ onAction }: ActionProps) {
  const [layerOneOpen, setLayerOneOpen] = useState(false)
  const [layerTwoOpen, setLayerTwoOpen] = useState(false)
  const [layerThreeOpen, setLayerThreeOpen] = useState(false)

  return (
    <Specimen width="100%" maxW={760}>
      <SpecimenHeader
        title="Portal → Portal → Portal"
        kind="Three layers"
        description="Mount three direct root Portals in sequence, dismiss them in reverse order, and verify every surface remains interactive."
      />
      <Button
        theme="accent"
        self="flex-start"
        onPress={() => {
          setLayerOneOpen(true)
          onAction('Stack test reached layer 1')
        }}
        testID="portal-stack-trigger"
      >
        Start the stacking circuit
      </Button>
      {layerOneOpen && (
        <Portal zIndex={300_000}>
          <YStack
            position="absolute"
            inset={0}
            bg="rgba(20, 12, 36, 0.5)"
            pointerEvents="none"
          />
          <YStack
            position="absolute"
            t={150}
            l="28%"
            width={520}
            maxW="68%"
            gap="$4"
            p="$6"
            rounded="$7"
            borderWidth={1}
            borderColor="$purple7"
            bg="$background"
            shadowColor="$shadowColor"
            shadowOpacity={0.34}
            shadowRadius={28}
            shadowOffset={{ width: 0, height: 14 }}
            testID="portal-stack-layer-one"
          >
            <Text fontFamily="$heading" fontWeight="900" fontSize="$8">
              Layer 1 · Direct Portal
            </Text>
            <Paragraph color="$color9">
              This root-mounted surface remains interactive without a Dialog wrapper.
            </Paragraph>
            <Button
              onPress={() => {
                setLayerTwoOpen(true)
                onAction('Stack test reached layer 2')
              }}
              testID="portal-stack-portal-trigger"
            >
              Mount layer 2 · Portal
            </Button>
            {layerTwoOpen && (
              <Portal zIndex={310_000}>
                <YStack
                  position="absolute"
                  t={78}
                  r={28}
                  width={320}
                  maxW="88%"
                  gap="$3"
                  p="$4"
                  rounded="$6"
                  borderWidth={1}
                  borderColor="$orange8"
                  bg="$orange3"
                  shadowColor="$shadowColor"
                  shadowOpacity={0.3}
                  shadowRadius={22}
                  shadowOffset={{ width: 0, height: 11 }}
                  testID="portal-stack-portal"
                >
                  <Text color="$orange12" fontWeight="900">
                    Layer 2 · Direct Portal
                  </Text>
                  <Paragraph color="$orange11" size="$3">
                    This content was mounted from inside another Portal and remains
                    clickable.
                  </Paragraph>
                  <Button
                    size="$3"
                    theme="accent"
                    onPress={() => {
                      setLayerThreeOpen(true)
                      onAction('Stack test reached layer 3')
                    }}
                    testID="portal-stack-third-trigger"
                  >
                    Mount layer 3 · Portal
                  </Button>
                  <Button
                    size="$3"
                    onPress={() => {
                      setLayerThreeOpen(false)
                      setLayerTwoOpen(false)
                    }}
                  >
                    Close root Portal
                  </Button>
                  {layerThreeOpen && (
                    <Portal zIndex={320_000}>
                      <YStack
                        position="absolute"
                        b={70}
                        l="36%"
                        width={300}
                        maxW="82%"
                        gap="$3"
                        p="$4"
                        rounded="$6"
                        borderWidth={1}
                        borderColor="$green8"
                        bg="$green3"
                        shadowColor="$shadowColor"
                        shadowOpacity={0.3}
                        shadowRadius={22}
                        shadowOffset={{ width: 0, height: 11 }}
                        testID="portal-stack-third"
                      >
                        <Text color="$green12" fontWeight="900">
                          Layer 3 · Direct Portal
                        </Text>
                        <Paragraph color="$green11" size="$3">
                          Three root-mounted layers are visible and this top surface still
                          receives presses.
                        </Paragraph>
                        <Button
                          size="$3"
                          onPress={() => {
                            setLayerThreeOpen(false)
                            onAction('Stack test returned to layer 2')
                          }}
                        >
                          Close top Portal
                        </Button>
                      </YStack>
                    </Portal>
                  )}
                </YStack>
              </Portal>
            )}
            <Button
              onPress={() => {
                setLayerThreeOpen(false)
                setLayerTwoOpen(false)
                setLayerOneOpen(false)
                onAction('Stacking circuit closed')
              }}
            >
              Finish circuit
            </Button>
          </YStack>
        </Portal>
      )}
      <Result>Expected order: Portal 300k · Portal 310k · Portal 320k</Result>
    </Specimen>
  )
}
