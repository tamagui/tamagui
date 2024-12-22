import { ColorTokens, Paragraph, Text, Tooltip } from 'tamagui'
import type { KeyboardEvent } from 'react'

export const Hint = ({
  children,
  hintContents,
  tint = 'blue',
}: {
  children: React.ReactNode
  hintContents: React.ReactNode
  tint?: 'green' | 'pink' | 'blue' | 'red' | 'purple'
}) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      // Trigger the tooltip (this depends on how Tamagui's Tooltip handles this)
      // You might need to use a ref or other method to programmatically show the tooltip
    }
  }

  const color = `$${tint}Fg` as ColorTokens
  const bg = `$${tint}` as ColorTokens

  return (
    <Tooltip placement="top" allowFlip disableRTL offset={15} restMs={40} delay={40}>
      <Tooltip.Trigger
        tag="span"
        display="inline"
        cursor="default"
        data-tint-link={tint}
        hoverStyle={{
          // @ts-ignore
          color,
          bg,
        }}
        br="$4"
        px={2}
        py={1}
        m={-2}
        aria-describedby="tooltip-content"
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <Text color="inherit">{children}</Text>
      </Tooltip.Trigger>
      <Tooltip.Content
        zIndex={1_000_000_000}
        enterStyle={{ x: 0, y: -4, opacity: 0, scale: 0.96 }}
        exitStyle={{ x: 0, y: -4, opacity: 0, scale: 0.96 }}
        x={0}
        scale={1}
        transformOrigin="center bottom"
        y={0}
        br="$8"
        elevation="$8"
        p="$5"
        maw={250}
        animateOnly={['transform', 'opacity']}
        bg={bg}
        style={{
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
        }}
        animation={[
          'quicker',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        id="tooltip-content"
        role="tooltip"
        aria-hidden={false}
      >
        <Tooltip.Arrow
          style={{
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
          }}
          bg={bg}
          size="$4"
        />
        <Paragraph color={color} size="$6">
          {hintContents}
        </Paragraph>
      </Tooltip.Content>
    </Tooltip>
  )
}
