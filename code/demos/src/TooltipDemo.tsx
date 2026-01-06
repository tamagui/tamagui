import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
} from '@tamagui/lucide-icons'
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { TooltipProps } from 'tamagui'
import {
  Button,
  Label,
  Paragraph,
  Switch,
  Tooltip,
  TooltipGroup,
  XStack,
  YStack,
} from 'tamagui'

// Non-animated: individual tooltips with enter/exit animations
function IndividualTooltip({
  placement,
  Icon,
  groupId,
}: {
  placement: TooltipProps['placement']
  Icon: any
  groupId: string
}) {
  return (
    <Tooltip groupId={groupId} placement={placement}>
      <Tooltip.Trigger>
        <Button icon={Icon} circular />
      </Tooltip.Trigger>
      <Tooltip.Content
        enterStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
        exitStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
        scale={1}
        x={0}
        y={0}
        opacity={1}
        py="$2"
        animation={['tooltip', { opacity: '200ms', backgroundColor: '200ms' }]}
      >
        <Tooltip.Arrow />
        <Paragraph size="$2" lineHeight="$1">
          {placement}
        </Paragraph>
      </Tooltip.Content>
    </Tooltip>
  )
}

// Animated position: global tooltip that glides between triggers
const TooltipContext = createContext<
  (label: string, placement?: TooltipProps['placement']) => void
>(() => {})

function GlobalTrigger({
  label,
  placement,
  Icon,
}: {
  label: string
  placement: TooltipProps['placement']
  Icon: any
}) {
  const setTooltip = useContext(TooltipContext)
  return (
    <Tooltip.Trigger
      scope="global"
      asChild="except-style"
      onMouseEnter={() => setTooltip(label, placement)}
    >
      <Button icon={Icon} circular />
    </Tooltip.Trigger>
  )
}

function GlobalProvider({ children }: { children: ReactNode }) {
  const [label, setLabel] = useState('')
  const [placement, setPlacement] = useState<TooltipProps['placement']>('top')
  const [open, setOpen] = useState(false)

  const setTooltip = (l: string, p?: TooltipProps['placement']) => {
    setLabel(l)
    if (p) setPlacement(p)
  }

  return (
    <TooltipContext.Provider value={setTooltip}>
      <Tooltip
        scope="global"
        offset={15}
        restMs={200}
        delay={{ open: 200, close: 200 }}
        open={open}
        onOpenChange={setOpen}
        placement={placement}
      >
        {children}
        <Tooltip.Content
          scope="global"
          enterStyle={{ y: -4, opacity: 0, scale: 0.96 }}
          exitStyle={{ y: -4, opacity: 0, scale: 0.96 }}
          x={0}
          y={0}
          scale={1}
          elevation="$0.5"
          opacity={1}
          pointerEvents="none"
          py="$1.5"
          px="$2"
          animateOnly={['transform', 'opacity', 'width', 'height']}
          enableAnimationForPositionChange
          animation={['tooltip', { opacity: '200ms', backgroundColor: '200ms' }]}
        >
          <Tooltip.Arrow />
          <Paragraph size="$3">{label}</Paragraph>
        </Tooltip.Content>
      </Tooltip>
    </TooltipContext.Provider>
  )
}

export function TooltipDemo() {
  const [animatePosition, setAnimatePosition] = useState(true)

  const Trigger = animatePosition ? GlobalTrigger : IndividualTooltip
  const Wrapper = animatePosition
    ? GlobalProvider
    : ({ children }: { children: ReactNode }) => (
        <TooltipGroup delay={{ open: 3000, close: 100 }}>{children}</TooltipGroup>
      )

  return (
    <YStack gap="$4">
      <Wrapper>
        <YStack gap="$2" self="center">
          <XStack gap="$2">
            <Trigger label="top-end" placement="top-end" Icon={Circle} groupId="0" />
            <Trigger label="top" placement="top" Icon={ChevronUp} groupId="1" />
            <Trigger label="top-start" placement="top-start" Icon={Circle} groupId="2" />
          </XStack>
          <XStack gap="$2">
            <Trigger label="left" placement="left" Icon={ChevronLeft} groupId="3" />
            <YStack flex={1} />
            <Trigger label="right" placement="right" Icon={ChevronRight} groupId="4" />
          </XStack>
          <XStack gap="$2">
            <Trigger
              label="bottom-end"
              placement="bottom-end"
              Icon={Circle}
              groupId="5"
            />
            <Trigger label="bottom" placement="bottom" Icon={ChevronDown} groupId="6" />
            <Trigger
              label="bottom-start"
              placement="bottom-start"
              Icon={Circle}
              groupId="7"
            />
          </XStack>
        </YStack>
      </Wrapper>

      <XStack gap="$2" style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
        <Switch
          id="animate-position"
          size="$2"
          checked={animatePosition}
          onCheckedChange={setAnimatePosition}
        >
          <Switch.Thumb animation="quick" />
        </Switch>
        <Label htmlFor="animate-position" size="$2">
          Animate position
        </Label>
      </XStack>
    </YStack>
  )
}
