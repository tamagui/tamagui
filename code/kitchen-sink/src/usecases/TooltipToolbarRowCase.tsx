import { useState } from 'react'
import { Paragraph, Tooltip, XStack, YStack } from 'tamagui'

/**
 * Mirrors the soot/contrast "global tooltip over an icon toolbar" pattern:
 * a single controlled Tooltip whose label + anchor swap as the pointer
 * crosses a row of small adjacent triggers.
 *
 * Reproduces:
 * - label text swapping while the bubble is still positioned at the old
 *   trigger (off-center, then re-centers late)
 * - the bubble falling behind the pointer during a fast sweep
 */
const LABELS = [
  'Back',
  'Reload page',
  'Forward',
  'Toggle appearance',
  'Clear console output',
  'Fullscreen',
  'Device',
  'Pane controls',
]

export function TooltipToolbarRowCase() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <YStack flex={1} bg="$background" p="$8" minWidth={700} minHeight={400}>
      <Tooltip
        scope="toolbar-tip"
        offset={16}
        placement="bottom"
        restMs={0}
        open={!!active}
        allowFlip
        stayInFrame={{ padding: 14 }}
      >
        <XStack gap="$1" mt="$10" self="center">
          {LABELS.map((label, i) => (
            <Tooltip.Trigger key={label} scope="toolbar-tip" asChild="except-style">
              <YStack
                data-testid={`icon-${i}`}
                role="button"
                aria-label={label}
                width={26}
                height={26}
                items="center"
                justify="center"
                rounded="$2"
                bg="$color4"
                hoverStyle={{ bg: '$color6' }}
                onMouseEnter={() => setActive(label)}
                onMouseLeave={() => setActive((prev) => (prev === label ? null : prev))}
              >
                <Paragraph size="$1">{i}</Paragraph>
              </YStack>
            </Tooltip.Trigger>
          ))}
        </XStack>

        <Tooltip.Content
          data-testid="toolbar-tip-content"
          animatePosition
          animateOnly={['transform', 'opacity', 'width', 'height']}
          transition={{
            default: 'quickest',
            enter: 'quickest',
            exit: '0ms',
          }}
          enterStyle={{ x: 0, y: -3, opacity: 0 }}
          exitStyle={{ x: 0, y: -3, opacity: 0 }}
          x={0}
          y={0}
          scale={1}
          opacity={1}
          pointerEvents="none"
          py="$1.5"
          px="$2"
          rounded="$2"
          bg="$color2"
          borderWidth={0}
        >
          <Tooltip.Arrow size="$3" bg="$color2" />
          <Paragraph pointerEvents="none" fontWeight="600" size="$2">
            {active}
          </Paragraph>
        </Tooltip.Content>
      </Tooltip>
    </YStack>
  )
}
