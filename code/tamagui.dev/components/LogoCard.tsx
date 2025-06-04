import { ThemeTintAlt } from '@tamagui/logo'
import { ChevronRight } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Avatar, Card, H5, Paragraph, View, XStack, YStack } from 'tamagui'
import { Link } from './Link'

export function LogoCard({ title, subtitle, img, icon, link, colorOffset, ...props }) {
  const [isHovered, setHovered] = useState(false)

  return (
    <ThemeTintAlt offset={colorOffset}>
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
        href={link}
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

            {icon ? (
              <View
                ai="center"
                jc="center"
                h="$3"
                w="$3"
                theme="alt1"
                bg="$color6"
                br="$true"
              >
                {icon}
              </View>
            ) : (
              <Avatar br="$true" size="$3" p="$3" bg="$color6">
                <Avatar.Image scale={0.6} src={img} />
                <Avatar.Fallback bg="$color6" bc="$color8" />
              </Avatar>
            )}
          </XStack>
        </Card.Header>

        <Card.Footer animation="quicker" x={isHovered ? 5 : 0}>
          <ChevronRight size="$1" pos="absolute" b="$4" r="$4" color="$color11" />
        </Card.Footer>
      </Card>
    </ThemeTintAlt>
  )
}
