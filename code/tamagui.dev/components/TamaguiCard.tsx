import { H3, Paragraph, XStack } from 'tamagui'

import { Card } from './Card'

export function TamaguiCard({ children, title, subTitle, ...props }) {
  return (
    <Card
      p="4"
      mx="0-5"
      marginTop="1-5"
      mb="1-5"
      width="md:50% max-md:auto"
      maxW="md:calc(50% - var(--space-8)) max-md:auto"
      flex="max-md:1"
      {...props}
    >
      <H3
        render="span"
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

      <Paragraph render="span" size="4" cursor="inherit" color="color-9" opacity={0.7}>
        {children}
      </Paragraph>
    </Card>
  )
}
