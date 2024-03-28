import { Accordion, Paragraph, Square, YStack } from 'tamagui'
import * as React from 'react'
import Svg, { Path, Pattern, Defs, Rect, Ellipse } from 'react-native-svg'
import { IconProps, themed } from '@tamagui/helpers-icon'

export function AccordionDemo() {
  return (
    <Accordion overflow="hidden" width="$20" type="multiple">
      <Accordion.Item value="a1">
        <Accordion.Trigger flexDirection="row" justifyContent="space-between">
          {({ open }) => (
            <>
              <Paragraph
                zIndex={2}
                size="$5"
                fontWeight="bold"
                backgroundColor="transparent"
              >
                1. Take a cold shower
              </Paragraph>
              <Square zIndex={2} width={20} height={20} backgroundColor="transparent">
                <Square backgroundColor="$color12" width="100%" height={2} />
                <Square
                  animation="100ms"
                  scaleY={open ? 0 : 1}
                  transformOrigin="center"
                  position="absolute"
                  bg="$color12"
                  width={2}
                  height="100%"
                />
              </Square>
              <YStack
                zIndex={1}
                fullscreen
                opacity={0.2}
                hoverStyle={{
                  opacity: 0.3,
                }}
              >
                <PatternOne width="100%" height="100%" color="$gray10" />
              </YStack>
            </>
          )}
        </Accordion.Trigger>
        <Accordion.Content>
          <Paragraph>
            Cold showers can help reduce inflammation, relieve pain, improve circulation,
            lower stress levels, and reduce muscle soreness and fatigue.
          </Paragraph>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="a2">
        <Accordion.Trigger flexDirection="row" justifyContent="space-between">
          {({ open }) => (
            <>
              <Paragraph size="$5" fontWeight="bold" backgroundColor="transparent">
                2. Eat 4 eggs
              </Paragraph>
              <Square width={20} height={20} backgroundColor="transparent">
                <Square backgroundColor="$color12" width="100%" height={2} />
                <Square
                  animation="100ms"
                  scaleY={open ? 0 : 1}
                  transformOrigin="center"
                  position="absolute"
                  bg="$color12"
                  width={2}
                  height="100%"
                />
              </Square>
              <YStack
                fullscreen
                opacity={0.2}
                hoverStyle={{
                  opacity: 0.3,
                }}
              >
                <PatternTwo width="100%" height="100%" color="$gray10" />
              </YStack>
            </>
          )}
        </Accordion.Trigger>
        <Accordion.Content>
          <Paragraph>
            Eggs have been a dietary staple since time immemorial and there’s good reason
            for their continued presence in our menus and meals.
          </Paragraph>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  )
}

function PatternOneComp(props) {
  const { color = 'black', width, height, ...otherProps } = props
  return (
    <Svg width={width} height={height} viewBox="0 0 2000 400">
      <Defs>
        <Pattern
          id="TrianglePattern"
          patternUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="100"
          height="100"
          viewBox="0 0 10 10"
        >
          <Path
            fill={color}
            fillRule="evenodd"
            d="M12 0h18v6h6v6h6v18h-6v6h-6v6H12v-6H6v-6H0V12h6V6h6V0zm12 6h-6v6h-6v6H6v6h6v6h6v6h6v-6h6v-6h6v-6h-6v-6h-6V6zm-6 12h6v6h-6v-6zm24 24h6v6h-6v-6z"
            {...otherProps}
          />
        </Pattern>
      </Defs>
      <Rect
        fill="url(#TrianglePattern)"
        stroke="gray"
        x="1"
        y="1"
        width="100%"
        height="100%"
      />
    </Svg>
  )
}

const PatternTwoComp = (props) => {
  const { color = 'black', width, height, ...otherProps } = props
  return (
    <Svg width={width} height={height} viewBox="0 0 2000 400">
      <Defs>
        <Pattern
          id="TrianglePattern"
          patternUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="100"
          height="100"
          viewBox="0 0 10 10"
        >
          <Path
            d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"
            fill={color}
            fillRule="evenodd"
            {...otherProps}
          />
        </Pattern>
      </Defs>
      <Rect
        fill="url(#TrianglePattern)"
        stroke="gray"
        x="1"
        y="1"
        width="100%"
        height="100%"
      />
    </Svg>
  )
}

const PatternOne = React.memo(themed(PatternOneComp))
const PatternTwo = React.memo(themed(PatternTwoComp))
