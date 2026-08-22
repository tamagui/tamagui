import { ThemeTintAlt } from '@tamagui/logo'
import { ChevronRight } from '@tamagui/lucide-icons-2'
import { useState } from 'react'
import { Avatar, Card, H5, Paragraph, View, XStack, YStack } from 'tamagui'

export function LogoCard({ title, subtitle, img, icon, link, colorOffset, ...props }) {
  const [isHovered, setHovered] = useState(false)

  return (
    <ThemeTintAlt offset={colorOffset}>
      <Card
        render="a"
        transition="quickest"
        flex={1}
        flexBasis="auto"
        width="19"
        height="11"
        y="0 hover:-2px press:2px"
        bg="hover:background-hover press:color2"
        {...(props as any)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        href={link}
      >
        <Card.Header>
          <XStack justify="space-between">
            <YStack gap="2-5">
              <H5 size="6" color="color9" fontFamily="silkscreen">
                {title}
              </H5>
              <Paragraph width="19" lineHeight="1" color="color8">
                {subtitle}
              </Paragraph>
            </YStack>

            {icon ? (
              <View
                items="center"
                justify="center"
                height="3"
                width="3"
                bg="color6"
                rounded="4"
              >
                {icon}
              </View>
            ) : (
              <Avatar rounded="4" p="3" bg="color6" size="3">
                <Avatar.Image scale={0.6} src={img} />
                <Avatar.Fallback bg="color6" borderColor="color8" />
              </Avatar>
            )}
          </XStack>
        </Card.Header>

        <Card.Footer transition="quicker" x={isHovered ? 5 : 0}>
          <ChevronRight size="1" position="absolute" b="4" r="4" color="color11" />
        </Card.Footer>
      </Card>
    </ThemeTintAlt>
  )
}
