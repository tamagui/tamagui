import { H3, Paragraph, XStack } from 'tamagui'

import { Card } from './Card'

export function TamaguiCard({ children, title, subTitle, ...props }) {
  return (
    <Card
      p="4"
      mx="1"
      marginTop="2"
      mb="2"
      width="gtSm:50% sm:auto"
      maxW="gtSm:calc(50% - var(--space-8)) sm:auto"
      flex="sm:1"
      {...props}
    >
      <H3
        render="span"
        fontFamily="silkscreen"
        lineHeight="6"
        color="color"
        cursor="inherit"
        letterSpacing={0}
        size="7"
        className="font-smooth-none"
      >
        {title}
      </H3>

      {!!subTitle && <XStack opacity={0.5}>{subTitle}</XStack>}

      <Paragraph render="span" size="4" cursor="inherit" color="color9" opacity={0.7}>
        {children}
      </Paragraph>
    </Card>
  )
}
