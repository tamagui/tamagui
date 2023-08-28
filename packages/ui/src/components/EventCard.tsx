import { ArrowUpRight } from '@tamagui/lucide-icons'
import { useLink } from 'solito/link'
import { Button, Card, CardProps, H6, Paragraph, Theme, ThemeName, XStack } from 'tamagui'

export type EventCardTypes = {
  title?: string
  description?: string
  action?: {
    props: ReturnType<typeof useLink>
    text: string
  }
  tags?: { text: string; theme: ThemeName }[]
} & CardProps

export const EventCard = ({ title, description, action, tags = [], ...props }: EventCardTypes) => {
  return (
    <Card gap="$2" padded borderRadius="$0" chromeless {...props}>
      <XStack gap="$2">
        <H6 size="$5" textTransform="capitalize">
          {title}
        </H6>
        {tags.map((tag) => (
          <Theme key={tag.text} name={tag.theme}>
            <Button size="$1" px="$2" br="$10" disabled>
              {tag.text}
            </Button>
          </Theme>
        ))}
      </XStack>
      <XStack gap="$1" ai="center">
        <Paragraph>{description}</Paragraph>
      </XStack>

      {action && (
        <Button iconAfter={ArrowUpRight} size="$2" als="flex-end" {...action.props}>
          {action?.text}
        </Button>
      )}
    </Card>
  )
}
