import { ThemeTintAlt } from '@tamagui/logo'
import { ChevronRight } from '@tamagui/lucide-icons'
import { Card, H3, Paragraph, Stack, View, YStack } from 'tamagui'
import type { Href } from 'one'
import { BentoIcon } from '~/features/icons/BentoIcon'
import { TakeoutIcon } from '~/features/icons/TakeoutIcon'
import { Link } from './Link'

const productSettings = (
  product: string
): { colorOffset: number; Icon: React.ReactNode } => {
  switch (product) {
    case 'bento':
      return { colorOffset: 6, Icon: <BentoIcon scale={2.5} /> }
    case 'takeout':
      return { colorOffset: 3, Icon: <TakeoutIcon scale={2.5} /> }
    default:
      return { colorOffset: 0, Icon: null }
  }
}

export function ProductCard({ product, children, ...props }) {
  const childText = typeof children === 'string' ? children : children.props.children
  const title = product.charAt(0).toUpperCase() + product.slice(1)
  const link = '/' + product

  const { colorOffset, Icon } = productSettings(product)

  return (
    <Link asChild href={link as Href}>
      <Stack
        group="card"
        tag="a"
        theme="surface3"
        animation="quickest"
        bg="$background"
        f={1}
        ai="center"
        jc="center"
        w="55%"
        miw="$20"
        h="$17"
        mx="auto"
        padding={0}
        br="$4"
        ov="hidden"
        cursor="pointer"
        hoverStyle={{ y: -2, bg: '$color7' }}
        pressStyle={{ y: 2, bg: '$color5' }}
      >
        <ThemeTintAlt offset={colorOffset}>
          <YStack
            fullscreen
            zi={0}
            br="$4"
            style={{
              background: `linear-gradient(transparent, var(--color04))`,
              mixBlendMode: 'color',
            }}
          />
        </ThemeTintAlt>

        <Card tag="a" bg="transparent" {...props}>
          <View
            pos="absolute"
            als="flex-end"
            animation="quicker"
            y="$-10"
            $lg={{ y: '$-6' }}
            x="$-0.25"
            rotateZ="-5deg"
            scale={1}
            $group-card-hover={{ y: '$-4.5', x: '$-3.5', rotateZ: '0deg', scale: 1.15 }}
          >
            {Icon}
          </View>
          <Card.Header>
            <YStack ai="center" gap="$5" px="$5">
              <H3>{title}</H3>
              <Paragraph size="$5" theme="alt1">
                {childText}
              </Paragraph>
            </YStack>
          </Card.Header>

          <Card.Footer animation="quicker" x={0} $group-card-hover={{ x: 5 }}>
            <ChevronRight
              size="$1"
              pos="absolute"
              mb="$-5"
              b="$4"
              r="$4"
              color="$color11"
            />
          </Card.Footer>
        </Card>
      </Stack>
    </Link>
  )
}
