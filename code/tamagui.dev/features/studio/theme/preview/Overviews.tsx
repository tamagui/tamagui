import type { CardProps } from 'tamagui'
import { Button, Card, H4, Paragraph, XStack, YStack } from 'tamagui'
import { useDemoProps } from '../hooks/useDemoProps'

export const Overview1 = () => {
  const demoProps = useDemoProps()
  return (
    <YStack
      {...demoProps.panelProps}
      {...demoProps.stackOutlineProps}
      {...demoProps.borderRadiusOuterProps}
      {...demoProps.elevationProps}
      {...demoProps.panelPaddingProps}
      p="$0"
    >
      <YStack flex={1}>
        <OverviewCard
          title="ARR"
          value="$204,010"
          badgeText="+40.5%"
          badgeState="success"
        />
      </YStack>
    </YStack>
  )
}
export const Overview2 = () => {
  const demoProps = useDemoProps()
  return (
    <YStack
      {...demoProps.panelProps}
      {...demoProps.stackOutlineProps}
      {...demoProps.borderRadiusOuterProps}
      {...demoProps.elevationProps}
      {...demoProps.panelPaddingProps}
      p="$0"
    >
      <YStack flex={1}>
        <OverviewCard
          title="New Users"
          value="113"
          badgeText="+142.2%"
          badgeState="success"
        />
      </YStack>
    </YStack>
  )
}
export const Overview3 = () => {
  const demoProps = useDemoProps()
  return (
    <YStack
      {...demoProps.panelProps}
      {...demoProps.stackOutlineProps}
      {...demoProps.borderRadiusOuterProps}
      {...demoProps.elevationProps}
      {...demoProps.panelPaddingProps}
      p="$0"
    >
      <YStack flex={1}>
        <OverviewCard
          title="ARR"
          value="$204,010"
          badgeText="+40.5%"
          badgeState="success"
        />
      </YStack>
    </YStack>
  )
}

export type OverviewCardTypes = {
  title: string
  value: string
  badgeText?: string
  badgeAfter?: string
  badgeState?: 'success' | 'failure' | 'indifferent'
} & CardProps

export const OverviewCard = ({
  title,
  value,
  badgeText,
  badgeState,
  badgeAfter,
  ...props
}: OverviewCardTypes) => {
  const demoProps = useDemoProps()

  return (
    <Card backgroundColor="transparent" {...props}>
      <Card.Header f={1} jc="space-between" {...demoProps.gapPropsLg}>
        <Paragraph fontWeight="400" size="$4" lh="$1" mb="$-2">
          {title}
        </Paragraph>
        <H4 size="$9">{value}</H4>
        <XStack>
          {!!badgeText && (
            <>
              <Button
                size="$2"
                {...demoProps.borderRadiusProps}
                {...demoProps.buttonOutlineProps}
              >
                {badgeText}
              </Button>
            </>
          )}
          {badgeAfter && <Paragraph>{badgeAfter}</Paragraph>}
        </XStack>
      </Card.Header>
    </Card>
  )
}
