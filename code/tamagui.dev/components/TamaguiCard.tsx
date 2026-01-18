import { H3, Paragraph, XStack } from 'tamagui'

import { Card } from './Card'

export function TamaguiCard({ children, title, subTitle, ...props }) {
  return (
    <Card
      p="$4"
      mx="$1"
      my="$2"
      mb="$2"
      $gtSm={{
        width: '50%',
        maxW: 'calc(50% - var(--space-8))',
      }}
      $sm={{ width: 'auto', maxW: 'auto', flex: 1 }}
      {...props}
    >
      <H3
        render="span"
        fontFamily="$silkscreen"
        size="$7"
        lineHeight="$6"
        color="$color"
        cursor="inherit"
        className="font-smooth-none"
        letterSpacing={0}
      >
        {title}
      </H3>

      {!!subTitle && <XStack opacity={0.5}>{subTitle}</XStack>}

      <Paragraph render="span" size="$4" cursor="inherit" color="$color9" opacity={0.7}>
        {children}
      </Paragraph>
    </Card>
  )
}
