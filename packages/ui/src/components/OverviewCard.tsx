import { CardProps, Card, H6, H2, Paragraph, Button, XStack, Theme } from 'tamagui'

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
  return (
    <Card borderRadius="$0" backgroundColor="transparent" {...props}>
      <Card.Header f={1} jc="space-between">
        <H6 fontWeight="400" size="$4" theme="alt2">
          {title}
        </H6>
        <H2 mt="$2">{value}</H2>
        <XStack mt="$4">
          {!!badgeText && (
            <Theme
              name={
                badgeState === 'success'
                  ? 'green_alt1'
                  : badgeState === 'failure'
                  ? 'red_alt1'
                  : undefined
              }
            >
              <Button size="$2" disabled>
                {badgeText}
              </Button>
            </Theme>
          )}
          {badgeAfter && <Paragraph>{badgeAfter}</Paragraph>}
        </XStack>
      </Card.Header>
    </Card>
  )
}
