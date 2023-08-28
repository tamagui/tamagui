import {
  Avatar,
  Card,
  CardProps,
  H4,
  H6,
  Image,
  Paragraph,
  TooltipSimple,
  XStack,
  YStack,
} from 'tamagui'
import { LinearGradient } from '@tamagui/linear-gradient'

// mostly for showing something on home so it's not empty
export const FeedCard = ({
  title,
  description,
  tag,
  authors,
  withImages,
  ...props
}: {
  title: string
  description?: string
  tag?: string
  authors?: { avatar: string; name: string; id: number }[]
  withImages?: boolean
} & CardProps) => {
  return (
    <Card borderRadius="$4" bordered overflow="hidden" {...props}>
      <Card.Header>
        {withImages && (
          <Image
            source={{
              uri: `https://picsum.photos/seed/${title}/1000/500`,
            }}
            height={150}
            $sm={{
              height: 100,
            }}
          />
        )}
        <YStack px="$4" pt="$4" gap="$2">
          {!!tag && (
            <H6 size="$2" theme="alt2" mb="$1">
              {tag}
            </H6>
          )}

          <H4 size="$5" textTransform="capitalize">
            {title}
          </H4>
          {!!description && (
            <Paragraph size="$3" theme="alt1">
              {description}
            </Paragraph>
          )}
        </YStack>
      </Card.Header>
      <Card.Footer jc="space-between" ai="center" padded gap="$2">
        {authors && authors.length > 0 && (
          <XStack>
            {authors.map((author) => (
              <TooltipSimple key={author.id} label={author.name}>
                <Avatar circular size={32} mr="$-2">
                  <Avatar.Image
                    source={{
                      uri: author.avatar,
                      width: 32,
                      height: 32,
                    }}
                  />
                </Avatar>
              </TooltipSimple>
            ))}
          </XStack>
        )}
      </Card.Footer>

      <Card.Background>
        <LinearGradient
          // borderRadius="$4"
          width="100%"
          height="100%"
          colors={['$color2', '$color1']}
          start={[1, 1]}
          end={[0.85, 0]}
        />
      </Card.Background>
    </Card>
  )
}
