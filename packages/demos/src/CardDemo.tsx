import React from 'react'
import { Button, Card, CardProps, H2, H3, Image, Paragraph, XStack } from 'tamagui'

// @ts-ignore
import camera from '../../public/camera.jpg'

export default function CardDemo() {
  return (
    <XStack $sm={{ flexDirection: 'column' }} px="$4" space>
      <DemoCard
        animation="bouncy"
        size="$4"
        w={250}
        h={300}
        scale={0.9}
        hoverStyle={{ scale: 0.95 }}
        pressStyle={{ scale: 0.85 }}
      />
      <DemoCard size="$5" w={250} h={300} />
    </XStack>
  )
}

function DemoCard(props: CardProps) {
  return (
    <Card theme="dark" elevate size="$4" {...props}>
      <Card.Header padded>
        <H2>Sony A7IV</H2>
        <Paragraph theme="alt2">Now available</Paragraph>
      </Card.Header>
      <Card.Footer padded>
        <XStack f={1} />
        <Button br="$10">Purchase</Button>
      </Card.Footer>
      <Card.Background>
        <Image pos="absolute" width={300} height={500} resizeMode="cover" src={camera.src} />
      </Card.Background>
    </Card>
  )
}
