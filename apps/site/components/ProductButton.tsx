import { ThemeTintAlt } from '@tamagui/logo'
import { ChevronRight } from '@tamagui/lucide-icons'
import React from 'react'
import { Card, H4, Paragraph, Stack, View, XStack, YStack } from 'tamagui'

import { BentoIcon } from './BentoIcon'
import { BentoLogo } from './BentoLogo'
import { NextLink } from './NextLink'
import { TakeoutIcon } from './TakeoutIcon'
import { TakeoutLogo } from './TakeoutLogo'

const productSettings = (
  product: string
): {
  ProductLogo: React.ReactNode
  ProductIcon: React.ReactNode
  colorOffset: number
} => {
  switch (product) {
    case 'bento':
      return {
        ProductLogo: (
          <View t={-2.5} mr="$-10">
            <BentoLogo noShadow scale={0.22} />
          </View>
        ),
        ProductIcon: <BentoIcon scale={1.25} />,
        colorOffset: 0,
      }
    case 'takeout':
      return {
        ProductLogo: (
          <View mx={-150}>
            <TakeoutLogo scale={0.09} />
          </View>
        ),
        ProductIcon: <TakeoutIcon scale={1.25} />,
        colorOffset: 2,
      }
    default:
      return { ProductLogo: null, ProductIcon: null, colorOffset: 0 }
  }
}

export function ProductButton({ product, children, ...props }) {
  const childText = typeof children === 'string' ? children : children.props.children

  const title = product.charAt(0).toUpperCase() + product.slice(1)
  const link = '/' + product

  const { ProductLogo, ProductIcon, colorOffset } = productSettings(product)

  return (
    <NextLink href={link}>
      <Stack
        group="card"
        theme="surface4"
        animation="quicker"
        bg="$background"
        f={1}
        h="$7"
        p={0}
        br="$4"
        ov="hidden"
        cursor="pointer"
        hoverStyle={{ y: -2, bg: '$color7', h: '$15' }}
        pressStyle={{ y: 2, bg: '$color5' }}
      >
        <ThemeTintAlt offset={colorOffset}>
          <YStack
            fullscreen
            zi={0}
            br="$4"
            style={{
              background: `linear-gradient(-90deg, transparent, var(--color05))`,
              mixBlendMode: 'color',
            }}
          />
        </ThemeTintAlt>

        <Card tag="a" bg="transparent" {...props}>
          <Card.Header fd="column" ai="center" gap="$3">
            <XStack ai="center" jc="space-between" gap="$3" w="100%">
              <View
                x={-20}
                animation="quicker"
                rotateZ="-5deg"
                scale={1}
                $group-card-hover={{ rotateZ: '0deg', scale: 1.05 }}
              >
                {ProductLogo}
              </View>

              <View animation="quicker" x={0} $group-card-hover={{ x: 10 }}>
                <ChevronRight size="$2" color="$color12" />
              </View>
              {/* <H4>{title}</H4> */}
            </XStack>

            <Paragraph size="$5" theme="alt1">
              {childText}
            </Paragraph>
          </Card.Header>

          <Card.Footer als="flex-end">
            <View
              animation="quickest"
              o={0}
              y={20}
              $group-card-hover={{
                o: 1,
                x: '$-3',
                y: '$-2',
                rotateZ: '-15deg',
                scale: 2.2,
              }}
            >
              {ProductIcon}
            </View>
          </Card.Footer>
        </Card>
      </Stack>
    </NextLink>
  )
}
