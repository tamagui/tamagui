import { useState } from 'react'
import { ChevronRight } from '@tamagui/lucide-icons'
import { Avatar, Card, H5, Paragraph, XStack, YStack } from 'tamagui'
import { NextLink } from 'components/NextLink'
import { ThemeTintAlt } from '@tamagui/logo'

export function AvatarCard({ title, subtitle, img, link, colorOffset, ...props }) {
  const [isHovered, setHovered] = useState(false)

  return (
    <ThemeTintAlt offset={colorOffset}>
      <NextLink passHref href={link}>
        <Card
          tag="a"
          animation="quickest"
          f={1}
          fg={0}
          y={0}
          h="$12"
          hoverStyle={{ y: -2, bg: '$backgroundHover' }}
          pressStyle={{ y: 2, bg: '$color2' }}
          onHoverIn={() => setHovered(true)}
          onHoverOut={() => setHovered(false)}
          {...props}
        >
          <Card.Header gap="$2">
            <XStack gap="$4">
              <Avatar
                circular
                size="$3.5"
                ai="center"
                jc="center"
                mt="$2"
                p="$3"
                bg="$color6"
              >
                <Avatar.Image scale={0.65} src={img} />
                <Avatar.Fallback bg="$color6" bc="$color8" />
              </Avatar>

              <YStack>
                <H5 color="$color9" fontFamily="$silkscreen" size="$7">
                  {title}
                </H5>
                <Paragraph w="$19" color="$color8">
                  {subtitle}
                </Paragraph>
              </YStack>
            </XStack>
          </Card.Header>

          <Card.Footer animation="quicker" x={isHovered ? 5 : 0}>
            <ChevronRight pos="absolute" b="$4" r="$4" color="$color11" />
          </Card.Footer>
        </Card>
      </NextLink>
    </ThemeTintAlt>
  )
}
