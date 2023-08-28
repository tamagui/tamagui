import { IconProps } from '@tamagui/helpers-icon'
import { LinearGradient } from '@tamagui/linear-gradient'
import { ChevronRight } from '@tamagui/lucide-icons'
import React from 'react'
import { useLink } from 'solito/link'
import { Button, Card, CardProps, H4, Progress, SizableText, YStack } from 'tamagui'

export type AchievementCardProps = {
  icon: React.FC<IconProps>
  title?: string
  progress: {
    current: number
    full: number
    label?: string
  }
  action?: {
    props: ReturnType<typeof useLink>
    text: string
  }
} & CardProps

export const AchievementCard = ({
  title,
  icon: Icon,
  progress,
  action,
  ...props
}: AchievementCardProps) => {
  return (
    <Card borderRadius="$0" chromeless {...props}>
      <Card.Header my="auto" padded gap="$3">
        <Icon size="$2" opacity={0.6} />
        <YStack gap="$2">
          {/* <H6 theme="alt2">{subtitle}</H6> */}
          <H4 size="$5" textTransform="capitalize" mt="$2">
            {title}
          </H4>
          <SizableText mt="$2">
            <SizableText size="$4" theme="alt1" fontWeight="900">
              {progress.current}
            </SizableText>
            <SizableText size="$2" theme="alt1">
              {' '}
              / {progress.full} {progress.label}
            </SizableText>
          </SizableText>

          <Progress
            mt="$2"
            theme="alt2"
            value={(progress.current / progress.full) * 100}
            backgroundColor="$color2"
            borderColor="$color5"
            borderWidth={1}
          >
            <Progress.Indicator backgroundColor="$color7" animation="bouncy" />
          </Progress>

          {!!action && (
            <Button mt="$3" als="flex-end" size="$2" iconAfter={<ChevronRight />}>
              {action.text}
            </Button>
          )}
        </YStack>
      </Card.Header>
      <Card.Background>
        <LinearGradient
          borderRadius="$6"
          width="100%"
          height="100%"
          colors={['$color1', '$color2', '$color1']}
          start={[1, 1]}
          end={[0.85, 0]}
        />
      </Card.Background>
    </Card>
  )
}
