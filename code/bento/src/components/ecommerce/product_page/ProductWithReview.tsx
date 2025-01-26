import { randAvatar, randFloat, randFullName, randUuid, randWord } from '@ngneat/falso'
import { getFontSized } from '@tamagui/get-font-sized'
import { LinearGradient } from '@tamagui/linear-gradient'
import { Dot, Minus, Plus, Star } from '@tamagui/lucide-icons'
import { RovingFocusGroup } from '@tamagui/roving-focus'
import { Fragment, useEffect, useState } from 'react'
import type { ColorTokens } from 'tamagui'
import {
  Avatar,
  Button,
  Circle,
  H1,
  H2,
  Image,
  ScrollView,
  Separator,
  Text,
  View,
  XGroup,
  debounce,
  styled,
} from 'tamagui'
import { useGroupMedia } from '../../hooks/useGroupMedia'

const product = {
  title: 'Winter Jacket',
  price: 30000,
  discount: 4000,
  description:
    'Making fresh tracks this cold-weather jacket will keep you comfortable with warm Thermarator insulation, a thermal-reflective lining that holds in heat, and a durable water-resistant shell.',
  pictures: [
    {
      picture: '/bento/images/jacket/jacket1.jpg',
      meta: {
        colorName: 'Cyron',
      },
    },
    {
      picture: '/bento/images/jacket/jacket2.webp',
      meta: {
        colorName: 'Light Green',
      },
    },
    {
      picture: '/bento/images/jacket/jacket3.jpg',
      meta: {
        colorName: 'White',
      },
    },
    {
      picture: '/bento/images/jacket/jacket4.jpg',
      meta: {
        colorName: 'Dark Green',
      },
    },
  ],
  stars: {
    rate: 4.5,
    numberOfReviews: 100,
  },
  features: [
    'Omni-Heat thermal reflective',
    'Draw cord adjustable hem',
    'Thermarator insulation',
    'Water resistant fabric',
    'Zippered hand pockets',
    'Elastic cuffs',
  ],
}

export const SizableText = styled(Text, {
  name: 'SizableText',
  fontFamily: '$body',

  variants: {
    size: {
      '...fontSize': getFontSized,
    },
  } as const,

  defaultVariants: {
    size: '$true',
  },
})

/** ------ EXAMPLE ------ */
export function ProductWithReview() {
  const [selectedPicture, setSelectedPicture] = useState(product.pictures[0].picture)
  const [tempPicture, setTempPicture] = useState<string | null>(null)
  const setDebounceTempPicture = debounce(setTempPicture, 100)
  const { xs } = useGroupMedia('window')
  return (
    <ScrollView width="100%">
      <View
        width="100%"
        backgroundColor="$background"
        padding="$8"
        gap="$8"
        $group-window-sm={{
          padding: '$6',
        }}
        $group-window-xs={{
          padding: 0,
          gap: '$4',
        }}
      >
        <View
          flexDirection="row"
          backgroundColor="$background"
          width="100%"
          flexWrap="wrap"
          gap="$10"
          alignItems="stretch"
          $group-window-xs={{
            gap: '$6',
          }}
        >
          <View
            flex={7}
            flexBasis={550}
            $group-window-sm={{
              flexBasis: '100%',
            }}
          >
            <View flexDirection="column" gap="$4" width="100%">
              <View flexDirection="row" flex={1} overflow="hidden">
                <View
                  flexDirection="row"
                  cursor="pointer"
                  animation="lazy"
                  hoverStyle={{
                    scale: 1.1,
                  }}
                  width="100%"
                >
                  <Image
                    flex={1}
                    width="100%"
                    borderRadius="$2"
                    aspectRatio={1 / 1}
                    resizeMode="cover"
                    backgroundColor="$color2"
                    source={{ uri: tempPicture || selectedPicture }}
                    $group-window-sm={{
                      height: 300,
                    }}
                  />
                </View>
              </View>
              <View
                flexDirection="row"
                width="100%"
                $group-window-xs={{
                  paddingHorizontal: '$3',
                }}
              >
                <RovingFocusGroup
                  width="100%"
                  flexDirection="row"
                  loop
                  orientation="horizontal"
                >
                  <ScrollView
                    horizontal
                    width="100%"
                    alignSelf="center"
                    contentContainerStyle={{
                      gap: '$3',
                      paddingVertical: '$4',
                      paddingHorizontal: '$2',
                    }}
                  >
                    {product.pictures.map(({ picture, meta: { colorName } }, index) => (
                      <RovingFocusGroup.Item
                        key={picture}
                        asChild="except-style"
                        focusable
                        active={picture === selectedPicture}
                      >
                        <View
                          flexGrow={1}
                          borderRadius="$2"
                          onFocus={() => setDebounceTempPicture(picture)}
                          onHoverIn={() => setDebounceTempPicture(picture)}
                          onHoverOut={() => setDebounceTempPicture(null)}
                          onBlur={() => setDebounceTempPicture(null)}
                          onPress={() => setSelectedPicture(picture)}
                          //@ts-ignore
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setSelectedPicture(picture)
                            }
                          }}
                          cursor="pointer"
                          outlineStyle="solid"
                          outlineOffset={3}
                          outlineWidth={2}
                          hoverStyle={{
                            outlineColor: '$gray9',
                          }}
                          pressStyle={{
                            outlineOffset: 4,
                          }}
                          outlineColor={
                            picture === selectedPicture
                              ? '$gray10'
                              : ('transparent' as any)
                          }
                          overflow="hidden"
                          height={173}
                          $group-window-sm={{
                            height: 160,
                          }}
                          $group-window-xs={{
                            height: 140,
                          }}
                          $group-window-xxs={{
                            height: 100,
                          }}
                        >
                          <View width="100%" height="100%">
                            <Image
                              key={picture}
                              src={picture}
                              source={{ uri: `https://random.imagecdn.app/250/${150}` }}
                              width="100%"
                              height={'100%'}
                              aspectRatio={1}
                              resizeMode="center"
                              backgroundColor="$color2"
                              borderRadius="$2"
                            />
                          </View>
                          {!xs && (
                            <View
                              width="100%"
                              animation="bouncy"
                              position="absolute"
                              justifyContent="center"
                              alignItems="center"
                              paddingTop="$2.5"
                              paddingBottom="$4"
                              backgroundColor="rgba(0,0,0,0.7)"
                              bottom={0}
                              y={15}
                              opacity={0.7}
                              {...((selectedPicture === picture ||
                                tempPicture === picture) && {
                                y: 10,
                                opacity: 1,
                              })}
                            >
                              <Text fontSize="$3" lineHeight="$1" color="#fff">
                                {colorName}
                              </Text>
                            </View>
                          )}
                        </View>
                      </RovingFocusGroup.Item>
                    ))}
                  </ScrollView>
                </RovingFocusGroup>
              </View>
            </View>
          </View>
          <View
            flexDirection="column"
            flex={7}
            flexBasis={550}
            maxWidth="100%"
            gap="$5"
            alignItems="flex-start"
            $group-window-xs={{
              paddingHorizontal: '$3',
            }}
          >
            <View flexDirection="column" width="100%" alignItems="flex-start">
              <View
                flexDirection="row"
                flexWrap="wrap"
                alignItems="center"
                width="100%"
                justifyContent="space-between"
                $group-window-xs={{
                  gap: '$3',
                }}
              >
                <View gap="$3" alignItems="flex-start" flexDirection="column">
                  <H1
                    size="$9"
                    $group-window-xs={{
                      size: '$8',
                    }}
                  >
                    {product.title}
                  </H1>
                  <View
                    flexDirection="row"
                    gap="$2"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <View flexDirection="row" gap="$1">
                      {Array.from({ length: 5 })
                        .fill(0)
                        .map((_, index) => (
                          <Star
                            key={index}
                            size={16}
                            color={
                              index < Math.floor(product.stars.rate)
                                ? '$yellow9'
                                : '$gray9'
                            }
                          />
                        ))}
                    </View>
                    <SizableText y={2} size="$1" color="$color9">
                      {product.stars.numberOfReviews} reviews
                    </SizableText>
                  </View>
                </View>
                <View gap="$1" alignItems="flex-end">
                  <Text
                    fontSize="$9"
                    lineHeight="$9"
                    fontWeight="600"
                    x={2}
                    $group-window-xs={{
                      fontSize: '$8',
                      lineHeight: '$8',
                    }}
                  >
                    ${599}
                  </Text>
                  <Text
                    textDecorationLine="line-through"
                    color="$color10"
                    fontSize="$5"
                    lineHeight="$5"
                  >
                    ${650}
                  </Text>
                </View>
              </View>
            </View>
            <Separator width="100%" />
            <View width="100%" flexDirection="row" justifyContent="space-between">
              <View gap="$5" flexDirection="column" justifyContent="space-between">
                <View flexDirection="column" gap="$2">
                  <SizableText size="$5">Colors</SizableText>
                  <ColorSelector />
                </View>
                <View flexDirection="column" gap="$2">
                  <SizableText size="$5">Sizes</SizableText>
                  <SizeSelector />
                </View>
              </View>
              <View
                flexDirection="column"
                flexWrap="wrap"
                alignItems="center"
                justifyContent="center"
                gap="$3"
              >
                <ItemCounter />
                <Button themeInverse>
                  <Button.Text>Add to Cart</Button.Text>
                </Button>
              </View>
            </View>
            <Separator width="100%" />
            <View flexDirection="column" maxWidth="100%" flexShrink={1} gap="$3">
              <SizableText size="$6">Description</SizableText>
              <SizableText theme="alt1" flexShrink={1} size="$4">
                {product.description}
              </SizableText>
            </View>
            <Separator width="100%" />
            <View flexDirection="column" gap="$3">
              <SizableText size="$6">Details</SizableText>
              <View flexDirection="column" alignItems="flex-start" paddingLeft="$2">
                {product.features.map((feature) => (
                  <View
                    key={feature}
                    flexDirection="row"
                    gap="$1"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Dot />
                    <SizableText theme="alt1" flexShrink={1} size="$4">
                      {feature}
                    </SizableText>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
        <Separator />
        <View flexDirection="column" gap="$3">
          <H2
            marginLeft="$-1.5"
            $group-window-sm={{
              marginHorizontal: '$0.5',
            }}
            $group-window-xs={{
              paddingHorizontal: '$3.5',
            }}
          >
            Reviews
          </H2>
          <Reviews />
        </View>
      </View>
    </ScrollView>
  )
}

ProductWithReview.fileName = 'ProductWithReview'

const colors = [
  {
    name: 'red',
    code: '$red9',
  },
  { name: 'blue', code: '$blue9' },
  { name: 'green', code: '$green9' },
]
function ColorSelector() {
  const [selectedColor, setSelectedColor] = useState(colors[0])

  return (
    <View flexDirection="row" gap="$3">
      {colors.map((color) => (
        <Circle
          onPress={() => setSelectedColor(color)}
          cursor="pointer"
          width={30}
          height={30}
          backgroundColor={color.code as ColorTokens}
          borderRadius="$2"
          key={color.code}
          outlineWidth={2}
          outlineOffset={2}
          outlineStyle="solid"
          outlineColor={
            (selectedColor === color ? '$borderPress' : 'transparent') as ColorTokens
          }
          circular
        />
      ))}
    </View>
  )
}
const sizes = ['S', 'M', 'L']

function SizeSelector() {
  const [selectedSize, setSelectedSize] = useState(sizes[0])

  return (
    <View flexDirection="row" gap="$2">
      {sizes.map((size) => (
        <View
          onPress={() => setSelectedSize(size)}
          cursor="pointer"
          width={30}
          height={30}
          backgroundColor="$color2"
          borderRadius="$2"
          key={size}
          borderWidth={2}
          borderColor={(selectedSize === size ? '$borderPress' : '$borderColor') as any}
          justifyContent="center"
          alignItems="center"
        >
          <SizableText
            size="$3"
            color={(selectedSize === size ? '$text' : '$color9') as any}
          >
            {size}
          </SizableText>
        </View>
      ))}
    </View>
  )
}

const ItemCounter = XGroup.styleable((props, ref) => {
  const [count, setCount] = useState(1)

  return (
    <XGroup width={122} ref={ref} {...props}>
      <XGroup.Item>
        <Button
          theme="alt2"
          size="$3"
          onPress={() => setCount(count > 1 ? count - 1 : 1)}
        >
          <Button.Icon>
            <Minus />
          </Button.Icon>
        </Button>
      </XGroup.Item>
      <XGroup.Item>
        <View
          flexBasis={40}
          justifyContent="center"
          alignItems="center"
          borderColor="$borderColor"
          borderWidth={1}
          borderRadius={100}
        >
          <SizableText>{count}</SizableText>
        </View>
      </XGroup.Item>
      <XGroup.Item>
        <Button
          theme="alt2"
          size="$3"
          onPress={() => setCount(count < 10 ? count + 1 : 10)}
        >
          <Button.Icon>
            <Plus />
          </Button.Icon>
        </Button>
      </XGroup.Item>
    </XGroup>
  )
})

const getReview = () =>
  Array.from({ length: 10 })
    .fill(0)
    .map(() => ({
      id: randUuid(),
      fullname: randFullName(),
      avatar: randAvatar(),
      rate: randFloat({ min: 1, max: 5, precision: 0.5 }),
      review: Array.from({ length: 15 }, () => randWord()).join(' '),
    }))

type ReviewsArray = ReturnType<typeof getReview>

function Reviews() {
  const [reviews, setReviews] = useState<ReviewsArray>([])
  const { sm, xs } = useGroupMedia('window')
  useEffect(() => {
    setReviews(getReview())
  }, [])
  return (
    <View
      flexDirection="row"
      marginHorizontal="$-8"
      $group-window-sm={{
        marginHorizontal: '$-6',
      }}
      $group-window-xs={{
        marginHorizontal: 0,
      }}
    >
      <ScrollView
        width="100%"
        horizontal={!sm}
        contentContainerStyle={{
          maxWidth: '100%',
          gap: 8,
          paddingHorizontal: 24,
          ...(sm && { paddingHorizontal: 16 }),
          ...(xs && { paddingHorizontal: 0 }),
        }}
      >
        {reviews.map((review, index) => (
          <Fragment key={index}>
            <Review
              width={sm ? '100%' : undefined}
              maxWidth={sm ? '100%' : 400}
              backgroundColor={!sm ? '$color1' : undefined}
              key={review.id}
              review={review}
            />
            {sm && index !== reviews.length - 1 && <Separator />}
          </Fragment>
        ))}
      </ScrollView>
      {!sm && (
        <LinearGradient
          start={[1, 0]}
          end={[1, 0]}
          fullscreen
          width="15%"
          colors={['$background', '#00000000']}
          pointerEvents="none"
          zIndex={100}
          opacity={0.3}
        />
      )}
    </View>
  )
}

type ReviewProps = {
  review: ReviewsArray[0]
}

const Review = View.styleable<ReviewProps>(({ review, ...rest }, forwardRef) => {
  return (
    <View
      flexDirection="column"
      gap="$4"
      borderRadius="$4"
      padding="$4"
      backgroundColor="$color1"
      {...rest}
      ref={forwardRef}
    >
      <View flexDirection="row" alignItems="center" gap="$3">
        <Avatar circular size="$3">
          <Avatar.Image resizeMode="contain" source={{ uri: review.avatar }} />
          <Avatar.Fallback />
        </Avatar>
        <View flexDirection="column" gap="$1">
          <SizableText size="$5">{review.fullname}</SizableText>
          <View flexDirection="row" gap="$1">
            {Array.from({ length: 5 })
              .fill(0)
              .map((_, index) => (
                <Star
                  key={index}
                  size={12}
                  color={index < Math.floor(review.rate) ? '$yellow9' : '$gray9'}
                />
              ))}
          </View>
        </View>
      </View>
      <SizableText size="$4" theme="alt1" opacity={0.7}>
        {review.review}
      </SizableText>
    </View>
  )
})
