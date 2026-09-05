import { ThemeTintAlt } from '@tamagui/logo'
import { ChevronRight } from '@tamagui/lucide-icons-2'
import { Card, H3, Paragraph, View, YStack } from 'tamagui'
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
      <View
        position="relative"
        group="card"
        transition="quickest"
        bg="background hover:color7 press:color5"
        flex={1}
        items="center"
        justify="center"
        width="55%"
        minW="20"
        height="17"
        mx="auto"
        p={0}
        rounded="4"
        overflow="hidden"
        cursor="pointer"
        y="hover:-2px press:2px"
        render="a"
      >
        <ThemeTintAlt offset={colorOffset}>
          <YStack
            position="absolute"
            inset={0}
            z={0}
            rounded="4"
            style={{
              background: `linear-gradient(transparent, var(--color04))`,
              mixBlendMode: 'color',
            }}
          />
        </ThemeTintAlt>

        <Card position="relative" render="a" bg="transparent" {...props}>
          <View
            position="absolute"
            self="flex-end"
            transition="quicker"
            y="-10 lg:-6 group-hover/card:-4-5"
            x="-0-25 group-hover/card:-3-5"
            rotate="-5deg group-hover/card:0deg"
            scale="1 group-hover/card:1.15"
          >
            {Icon}
          </View>
          <Card.Header>
            <YStack items="center" gap="5" p="5">
              <H3>{title}</H3>
              <Paragraph size="5" color="color10">
                {childText}
              </Paragraph>
            </YStack>
          </Card.Header>

          <Card.Footer transition="quicker" x="0 group-hover/card:5px">
            <ChevronRight
              size="1"
              position="absolute"
              mb="-5"
              b="4"
              r="4"
              color="color11"
            />
          </Card.Footer>
        </Card>
      </View>
    </Link>
  )
}
