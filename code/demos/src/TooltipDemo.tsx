import * as React from 'react'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
} from '@tamagui/local-icons'
import type { TooltipProps } from 'tamagui'
import {
  Button,
  Label,
  Paragraph,
  Switch,
  Theme,
  Tooltip,
  TooltipGroup,
  XStack,
  YStack,
} from 'tamagui'

export function TooltipDemo() {
  const [animatePosition, setAnimatePosition] = React.useState(true)
  const [placement, setPlacement] = React.useState<TooltipProps['placement']>('top')
  const [label, setLabel] = React.useState('Top')

  return (
    <Theme name="level3">
      <YStack gap="4" alignItems="center">
        <XStack gap="2" alignItems="center">
          <Label size="2" htmlFor="tooltip-animate-pos" userSelect="none">
            Animate position
          </Label>
          <Switch
            id="tooltip-animate-pos"
            size="sm"
            checked={animatePosition}
            onCheckedChange={setAnimatePosition}
          >
            <Switch.Thumb transition="quickest" />
          </Switch>
        </XStack>

        <TooltipGroup delay={{ open: 300, close: 100 }}>
          <Tooltip scope="tooltip-demo" placement={placement} offset={12}>
            <YStack gap="2" alignSelf="center">
              <XStack gap="2">
                <DemoTrigger
                  placement="top-end"
                  label="Top end"
                  Icon={Circle}
                  onActivate={() => {
                    setPlacement('top-end')
                    setLabel('Top end')
                  }}
                />
                <DemoTrigger
                  placement="top"
                  label="Top"
                  Icon={ChevronUp}
                  onActivate={() => {
                    setPlacement('top')
                    setLabel('Top')
                  }}
                />
                <DemoTrigger
                  placement="top-start"
                  label="Top start"
                  Icon={Circle}
                  onActivate={() => {
                    setPlacement('top-start')
                    setLabel('Top start')
                  }}
                />
              </XStack>
              <XStack gap="2">
                <DemoTrigger
                  placement="left"
                  label="Left"
                  Icon={ChevronLeft}
                  onActivate={() => {
                    setPlacement('left')
                    setLabel('Left')
                  }}
                />
                <YStack flex={1} />
                <DemoTrigger
                  placement="right"
                  label="Right"
                  Icon={ChevronRight}
                  onActivate={() => {
                    setPlacement('right')
                    setLabel('Right')
                  }}
                />
              </XStack>
              <XStack gap="2">
                <DemoTrigger
                  placement="bottom-end"
                  label="Bottom end"
                  Icon={Circle}
                  onActivate={() => {
                    setPlacement('bottom-end')
                    setLabel('Bottom end')
                  }}
                />
                <DemoTrigger
                  placement="bottom"
                  label="Bottom"
                  Icon={ChevronDown}
                  onActivate={() => {
                    setPlacement('bottom')
                    setLabel('Bottom')
                  }}
                />
                <DemoTrigger
                  placement="bottom-start"
                  label="Bottom start"
                  Icon={Circle}
                  onActivate={() => {
                    setPlacement('bottom-start')
                    setLabel('Bottom start')
                  }}
                />
              </XStack>
            </YStack>

            <Tooltip.Content
              scope="tooltip-demo"
              theme="brand"
              animatePosition={animatePosition}
              scale="1 enter:0.9 exit:0.9"
              x="0 enter:0 exit:0"
              y="0 enter:-5px exit:-5px"
              opacity="1 enter:0 exit:0"
              paddingVertical="1.5"
              paddingHorizontal="3"
              borderRadius="2"
              boxShadow="0 2px 4px shadow-color"
              transition={{
                preset: 'quick',
                opacity: { preset: 'quick', spring: { overshootClamping: true } },
              }}
            >
              <Tooltip.Arrow
                scope="tooltip-demo"
                animatePosition={animatePosition}
                backgroundColor="background"
                borderColor="border-color"
              />
              <Paragraph size="2" lineHeight="1">
                {label}
              </Paragraph>
            </Tooltip.Content>
          </Tooltip>
        </TooltipGroup>
      </YStack>
    </Theme>
  )
}

function DemoTrigger({
  Icon,
  onActivate,
}: {
  placement: string
  label: string
  Icon: any
  onActivate: () => void
}) {
  return (
    <Tooltip.Trigger
      scope="tooltip-demo"
      asChild
      onMouseEnter={onActivate}
      onFocus={onActivate}
    >
      <Button icon={Icon} circular />
    </Tooltip.Trigger>
  )
}
