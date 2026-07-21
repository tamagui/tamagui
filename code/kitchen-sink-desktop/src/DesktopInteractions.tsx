import { useState } from 'react'
import { Button, Text, XStack, YStack } from 'tamagui'

import { RawHoverProbe } from './RawHoverProbe'
import {
  Result,
  SectionHeading,
  Specimen,
  SpecimenGrid,
  SpecimenHeader,
} from './PlaygroundParts'

export function DesktopInteractions() {
  const [tamaguiEnters, setTamaguiEnters] = useState(0)
  const [tamaguiLeaves, setTamaguiLeaves] = useState(0)

  return (
    <YStack gap="$6">
      <SectionHeading
        index="03"
        title="Desktop event probes"
        description="The original low-level checks remain available for separating platform event problems from Tamagui styling problems."
      />
      <SpecimenGrid>
        <Specimen>
          <SpecimenHeader
            title="Direct hover"
            kind="Tamagui"
            description="Confirms hoverStyle and raw mouse enter/leave events fire together."
          />
          <YStack
            group
            testID="tamagui-hover-target"
            minH={150}
            justify="center"
            items="center"
            gap="$3"
            p="$5"
            rounded="$6"
            borderWidth={2}
            borderColor="$blue7"
            bg="$blue3"
            onMouseEnter={() => setTamaguiEnters((count) => count + 1)}
            onMouseLeave={() => setTamaguiLeaves((count) => count + 1)}
            hoverStyle={{ bg: '$blue9', borderColor: '$blue10', scale: 1.025 }}
            pressStyle={{ scale: 0.985 }}
          >
            <Text
              color="$blue11"
              fontSize="$6"
              fontWeight="900"
              $group-hover={{ color: 'white' }}
            >
              Hover this target
            </Text>
            <Text color="$blue10" $group-hover={{ color: '$blue2' }}>
              Blue at rest · cobalt while hovered
            </Text>
          </YStack>
          <Result>
            enter {tamaguiEnters} · leave {tamaguiLeaves}
          </Result>
        </Specimen>

        <Specimen>
          <SpecimenHeader
            title="Named groups"
            kind="Tamagui"
            description="The outer card moves its child; the inner group changes its color."
          />
          <YStack
            group="card"
            testID="group-hover-outer"
            minH={150}
            gap="$3"
            p="$5"
            rounded="$6"
            borderWidth={2}
            borderColor="$purple7"
            bg="$purple3"
            hoverStyle={{ borderColor: '$purple9', bg: '$purple4' }}
          >
            <Text color="$purple11" fontWeight="900">
              Outer group: card
            </Text>
            <YStack
              group="inner"
              testID="group-hover-inner"
              bg="$background"
              p="$4"
              rounded="$5"
              hoverStyle={{ bg: '$purple9', scale: 1.02 }}
            >
              <Text
                color="$purple10"
                fontWeight="800"
                $group-card-hover={{ x: 8 }}
                $group-inner-hover={{ color: 'white' }}
              >
                Outer hover moves me; inner hover recolors me
              </Text>
            </YStack>
          </YStack>
          <Result>Named group propagation</Result>
        </Specimen>

        <Specimen>
          <SpecimenHeader
            title="Button states"
            kind="Keyboard"
            description="Tab to focus, press Space, then compare against the disabled target."
          />
          <YStack gap="$4" justify="center" flex={1}>
            <Button
              testID="interactive-button"
              size="$5"
              borderWidth={2}
              borderColor="$blue9"
              bg="$blue9"
              color="white"
              fontWeight="900"
              hoverStyle={{ bg: '$blue10', y: -2 }}
              pressStyle={{ bg: '$blue11', scale: 0.97, y: 0 }}
              focusStyle={{ borderColor: '$yellow9', borderWidth: 4 }}
            >
              Interactive desktop button
            </Button>
            <Button testID="disabled-button" disabled disabledStyle={{ opacity: 0.48 }}>
              Disabled stays muted
            </Button>
          </YStack>
          <Result>Hover · press · focus · disabled</Result>
        </Specimen>

        <Specimen>
          <SpecimenHeader
            title="Raw native View"
            kind="React Native"
            description="Bypasses Tamagui to verify macOS emits the underlying mouse events."
          />
          <RawHoverProbe />
          <Result>Platform event baseline</Result>
        </Specimen>
      </SpecimenGrid>
    </YStack>
  )
}
