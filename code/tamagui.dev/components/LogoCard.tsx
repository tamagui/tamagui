import { ThemeTintAlt } from '@tamagui/logo'
import { ChevronRight } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Avatar, Card, H5, Paragraph, View, XStack, YStack } from 'tamagui'

export function LogoCard({ title, subtitle, img, icon, link, colorOffset, ...props }) {
  const [isHovered, setHovered] = useState(false)

  return (
    <ThemeTintAlt offset={colorOffset}>
      <Card
        tag="a"
        transition="quickest"
        flex={1}
        flexBasis="auto"
        width="$19"
        height="$11"
        y={0}
        hoverStyle={{ y: -2, bg: '$backgroundHover' }}
        pressStyle={{ y: 2, bg: '$color2' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        // @ts-ignore
        href={link}
        {...props}
      >
        <Card.Header>
          <XStack justify="space-between">
            <YStack gap="$2.5">
              <H5 size="$6" color="$color9" fontFamily="$silkscreen">
                {title}
              </H5>
              <Paragraph width="$19" lineHeight="$1" color="$color8">
                {subtitle}
              </Paragraph>
            </YStack>

            {icon ? (
              <View
                items="center"
                justify="center"
                height="$3"
                width="$3"
                theme="alt1"
                bg="$color6"
                rounded="$true"
              >
                {icon}
              </View>
            ) : (
              <Avatar rounded="$true" size="$3" p="$3" bg="$color6">
                <Avatar.Image scale={0.6} src={img} />
                <Avatar.Fallback bg="$color6" borderColor="$color8" />
              </Avatar>
            )}
          </XStack>
        </Card.Header>

        <Card.Footer transition="quicker" x={isHovered ? 5 : 0}>
          <ChevronRight size="$1" position="absolute" b="$4" r="$4" color="$color11" />
        </Card.Footer>
      </Card>
    </ThemeTintAlt>
  )
}
