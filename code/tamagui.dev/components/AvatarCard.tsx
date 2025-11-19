import { useState } from 'react'
import { ChevronRight } from '@tamagui/lucide-icons'
import { Avatar, Card, H5, Paragraph, XStack, YStack } from 'tamagui'
import { Link } from '~/components/Link'
import { ThemeTintAlt } from '@tamagui/logo'

export function AvatarCard({ title, subtitle, img, link, colorOffset, ...props }) {
  const [isHovered, setHovered] = useState(false)

  return (
    <ThemeTintAlt offset={colorOffset}>
      <Link asChild href={link}>
        <Card
          tag="a"
          animation="quickest"
          f={1}
          w="$19"
          h="$11"
          y={0}
          hoverStyle={{ y: -2, bg: '$backgroundHover' }}
          pressStyle={{ y: 2, bg: '$color2' }}
          onHoverIn={() => setHovered(true)}
          onHoverOut={() => setHovered(false)}
          {...props}
        >
          <Card.Header>
            <XStack jc="space-between">
              <YStack gap="$2.5">
                <H5 size="$6" color="$color9" fontFamily="$silkscreen">
                  {title}
                </H5>
                <Paragraph w="$19" lh="$1" color="$color8">
                  {subtitle}
                </Paragraph>
              </YStack>

              <Avatar br="$true" size="$3" p="$3" bg="$color6">
                <Avatar.Image scale={0.6} src={img} />
                <Avatar.Fallback bg="$color6" bc="$color8" />
              </Avatar>
            </XStack>
          </Card.Header>

          <Card.Footer animation="quicker" x={isHovered ? 5 : 0}>
            <ChevronRight size="$1" pos="absolute" b="$4" r="$4" color="$color11" />
          </Card.Footer>
        </Card>
      </Link>
    </ThemeTintAlt>
  )
}
