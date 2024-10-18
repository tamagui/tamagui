import { Heart, Repeat, Reply } from '@tamagui/lucide-icons'
import { Link } from 'one'
import { isWeb, Paragraph, SizableText, XStack, YStack } from 'tamagui'
import { Card } from '../ui/Card'
import { Image } from '../ui/Image'

type FeedItem = {
  id: number
  content: string
  createdAt: Date | null
  user: {
    name: string
    avatar: string | null
  } | null
  likesCount?: number
  repliesCount?: number
  repostsCount?: number
  disableLink?: boolean
  isReply?: boolean
}

const StatItem = ({ Icon, count }: { Icon: any; count: number }) => {
  return (
    <XStack ai="center" jc="center" gap="$2">
      <Icon color="$color10" size={14} />
      <SizableText fow="700" color="$color10" userSelect="none">
        {count}
      </SizableText>
    </XStack>
  )
}

export const FeedCard = (props: FeedItem) => {
  if (!props.user) {
    return null
  }

  const content = (
    <Card tag="a">
      <Image width={32} height={32} br={100} mt="$2" src={props.user.avatar || ''} />
      <YStack f={1} gap="$2">
        <Paragraph size="$5" fow="bold">
          {props.user.name}
        </Paragraph>

        <Paragraph
          size="$4"
          whiteSpace="pre-wrap"
          $gtSm={{
            size: '$5',
          }}
        >
          {props.content}
        </Paragraph>
        {!props.isReply ? (
          <XStack mt="$0" jc="flex-end" px="$5" gap="$5">
            <StatItem Icon={Reply} count={props.repliesCount || 0} />
            <StatItem Icon={Repeat} count={props.repostsCount || 0} />
            <StatItem Icon={Heart} count={props.likesCount || 0} />
          </XStack>
        ) : null}
      </YStack>
    </Card>
  )

  return props.disableLink ? (
    content
  ) : (
    <Link
      asChild
      href={{
        pathname: `/post/[id]`,
        params: {
          id: props.id.toString(),
          ...(!isWeb ? ({ preloadTitle: props.content } as any) : {}),
        },
      }}
    >
      {content}
    </Link>
  )
}
