import { randAvatar, randFloat, randFullName, randUuid, randWord } from '@ngneat/falso'
import { LinearGradient } from '@tamagui/linear-gradient'
import { Dot, Minus, Plus, Star } from '../../icons'
import { RovingFocusGroup } from '@tamagui/roving-focus'
import { Fragment, useEffect, useState } from 'react'
import type { ColorTokens } from 'tamagui'
import {
  createStyledHOC,
  Button,
  Circle,
  H1,
  H2,
  Image,
  ScrollView,
  Separator,
  Spacer,
  Text,
  View,
  XStack,
  debounce,
  styled,
  useMedia,
  Avatar,
  XGroup,
  SizableText,
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
      picture: '/images/jacket1.webp',
      meta: {
        colorName: 'Cyron',
      },
    },
    {
      picture: '/images/jacket2.webp',
      meta: {
        colorName: 'Light Green',
      },
    },
    {
      picture: '/images/jacket3.webp',
      meta: {
        colorName: 'White',
      },
    },
    {
      picture: '/images/jacket4.webp',
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


/** ------ EXAMPLE ------ */
export function ProductWithReview() {
  const [selectedPicture, setSelectedPicture] = useState(product.pictures[0].picture)
  const [tempPicture, setTempPicture] = useState<string | null>(null)
  const setDebounceTempPicture = debounce(setTempPicture, 100)
  const { 'max-sm': narrow } = useGroupMedia('window')
  const media = useMedia()
  return (
    <ScrollView width="100%">
      <View width="100%" bg="background" p="8 max-sm:4" gap="8 max-sm:4">
        <View
          flexDirection="row"
          bg="background"
          width="100%"
          flexWrap="wrap"
          gap="10 @max-sm/window:6"
          items="stretch"
        >
          <View width="100%" flexBasis="@max-md/window:100%">
            <View flexDirection="column" width="100%">
              <View flexDirection="row" flex={1} flexBasis="auto" overflow="hidden">
                <View
                  flexDirection="row"
                  cursor="pointer"
                  scale="hover:1.1"
                  width="100%"
                  style={{ transition: 'transform 200ms ease' }}
                >
                  <Image
                    flex={1}
                    width="100%"
                    rounded="2"
                    aspectRatio={1 / 1}
                    objectFit="cover"
                    bg="color-2"
                    height="@max-md/window:300px"
                    src={tempPicture || selectedPicture}
                  />
                </View>
              </View>
              <View flexDirection="row" width="100%" px="@max-sm/window:3">
                <RovingFocusGroup
                  width="100%"
                  flexDirection="row"
                  loop
                  orientation="horizontal"
                >
                  <ScrollView
                    horizontal
                    width="100%"
                    self="center"
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      gap: '3',
                      py: '4',
                      px: '2',
                    }}
                  >
                    {product.pictures.map(({ picture, meta: { colorName } }) => (
                      <RovingFocusGroup.Item
                        key={picture}
                        asChild="except-style"
                        tabIndex={0}
                        active={picture === selectedPicture}
                      >
                        <View
                          grow={1}
                          position="relative"
                          rounded="2"
                          cursor="pointer"
                          outlineStyle="solid"
                          outlineOffset="3px press:4px"
                          outlineWidth={2}
                          outlineColor={`${picture === selectedPicture ? 'color-9' : 'transparent'} hover:color-8`}
                          overflow="hidden"
                          height="173px @max-md/window:160px @max-sm/window:140px @max-xs/window:100px"
                          onFocus={() => setDebounceTempPicture(picture)}
                          onMouseEnter={() => setDebounceTempPicture(picture)}
                          onMouseLeave={() => setDebounceTempPicture(null)}
                          onBlur={() => setDebounceTempPicture(null)}
                          onPress={() => setSelectedPicture(picture)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setSelectedPicture(picture)
                            }
                          }}
                        >
                          <View width="100%" height="100%">
                            <Image
                              key={picture}
                              src={picture}
                              width="100%"
                              height={'100%'}
                              aspectRatio={1}
                              objectFit="cover"
                              bg="color-2"
                              rounded="2"
                            />
                          </View>
                          {!narrow && (
                            <View
                              width="100%"
                              position="absolute"
                              justify="center"
                              items="center"
                              pt="2-5"
                              pb="4"
                              bg="rgba(0,0,0,0.7)"
                              b={0}
                              y={15}
                              opacity={0.7}
                              {...((selectedPicture === picture ||
                                tempPicture === picture) && {
                                y: 10,
                                opacity: 1,
                              })}
                              style={{
                                transition: 'transform 150ms ease, opacity 150ms ease',
                              }}
                            >
                              <Text fontSize="3" lineHeight="1" color="#fff">
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
            maxW="100%"
            gap="5"
            items="flex-start"
            px="@max-sm/window:3"
          >
            <View flexDirection="column" width="100%" items="flex-start">
              <View
                flexDirection="row"
                flexWrap="wrap"
                items="center"
                width="100%"
                justify="space-between"
                gap="@max-sm/window:3"
              >
                <View gap="3" items="flex-start" flexDirection="column">
                  <H1 size={media['max-sm'] ? '8' : '9'}>{product.title}</H1>
                  <XStack flexDirection="row" gap="2" justify="center" items="center">
                    <View flexDirection="row" gap="1">
                      {Array.from({ length: 5 })
                        .fill(0)
                        .map((_, index) => (
                          <Star
                            key={index}
                            size={16}
                            color={`${index < Math.floor(product.stars.rate) ? 'orange-9' : 'color-8'}`}
                          />
                        ))}
                    </View>
                    <SizableText size="2" color="color-8">
                      {product.stars.numberOfReviews} reviews
                    </SizableText>
                  </XStack>
                </View>

                <View gap="1" items="flex-end">
                  <Text fontSize="9 max-sm:6" fontWeight="600" x={2}>
                    ${599}
                  </Text>
                  <Text
                    fontSize="6 max-sm:4"
                    textDecorationLine="line-through"
                    color="color-9"
                  >
                    ${650}
                  </Text>
                </View>
              </View>
            </View>

            <Separator width="100%" />

            <View gap="4" width="100%">
              <XStack gap="6">
                <View flexDirection="column" gap="2">
                  <SizableText size="5">Colors</SizableText>
                  <ColorSelector />
                </View>

                <View flexDirection="column" gap="2">
                  <SizableText size="5">Sizes</SizableText>
                  <SizeSelector />
                </View>
              </XStack>

              <XStack items="center" gap="4">
                <ItemCounter />
                <Spacer />

                <Button theme="accent" flex="max-sm:1">
                  <Button.Text>Add to Cart</Button.Text>
                </Button>
              </XStack>
            </View>
            <Separator width="100%" />
            <View flexDirection="column" maxW="100%" shrink={1} gap="3">
              <SizableText size="6">Description</SizableText>
              <SizableText theme="level2" shrink={1} size="4">
                {product.description}
              </SizableText>
            </View>
            <Separator width="100%" />
            <View flexDirection="column" gap="3">
              <SizableText size="6">Details</SizableText>
              <View flexDirection="column" items="flex-start" pl="2">
                {product.features.map((feature) => (
                  <View
                    key={feature}
                    flexDirection="row"
                    gap="1"
                    justify="center"
                    items="center"
                  >
                    <Dot />
                    <SizableText theme="level2" shrink={1} size="4">
                      {feature}
                    </SizableText>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
        <Separator />
        <View flexDirection="column" gap="3">
          <H2 ml="-1" mx="@max-md/window:px" px="@max-sm/window:4">
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
    code: 'red-9',
  },
  { name: 'blue', code: 'blue-9' },
  { name: 'green', code: 'green-9' },
]
function ColorSelector() {
  const [selectedColor, setSelectedColor] = useState(colors[0])

  return (
    <View flexDirection="row" gap="3">
      {colors.map((color) => (
        <Circle
          onPress={() => setSelectedColor(color)}
          cursor="pointer"
          width={30}
          height={30}
          bg={color.code as ColorTokens}
          rounded="2"
          outlineWidth={2}
          outlineOffset={2}
          outlineStyle="solid"
          outlineColor={`${selectedColor === color ? 'border-color-press' : 'transparent'}`}
          key={color.code}
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
    <View flexDirection="row" gap="2">
      {sizes.map((size) => (
        <View
          onPress={() => setSelectedSize(size)}
          cursor="pointer"
          width={30}
          height={30}
          bg="color-2"
          rounded="2"
          borderWidth={2}
          borderColor={`${selectedSize === size ? 'border-color-press' : 'border-color'}`}
          justify="center"
          items="center"
          key={size}
        >
          <SizableText size="3" color={`${selectedSize === size ? 'text' : 'color-8'}`}>
            {size}
          </SizableText>
        </View>
      ))}
    </View>
  )
}

const ItemCounter = createStyledHOC(XGroup, (props, ref) => {
  const [count, setCount] = useState(1)

  return (
    <XGroup ref={ref} {...props}>
      <XGroup.Item>
        <Button
          theme="level3"
          size="sm"
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
          justify="center"
          items="center"
          borderColor="border-color"
          borderWidth={1}
          rounded={100}
        >
          <SizableText>{count}</SizableText>
        </View>
      </XGroup.Item>
      <XGroup.Item>
        <Button
          theme="level3"
          size="sm"
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
  const { 'max-md': compact } = useGroupMedia('window')

  useEffect(() => {
    setReviews(getReview())
  }, [])

  return (
    <View flexDirection="row">
      <ScrollView
        width="100%"
        horizontal={!compact}
        contentContainerStyle={{
          gap: 8,
        }}
        showsHorizontalScrollIndicator={false}
      >
        {reviews.map((review, index) => (
          <Fragment key={index}>
            <Review
              width={compact ? '100%' : undefined}
              maxW={compact ? '100%' : 400}
              bg="background-focus"
              key={review.id}
              review={review}
            />
          </Fragment>
        ))}
      </ScrollView>
      {!compact && (
        <LinearGradient
          start={[1, 0]}
          end={[1, 0]}
          position="absolute"
          inset={0}
          width="15%"
          colors={['background', '#00000000']}
          pointerEvents="none"
          z={100}
          opacity={0.3}
        />
      )}
    </View>
  )
}

type ReviewProps = {
  review: ReviewsArray[0]
}

const Review = createStyledHOC(View, ({ review, ...rest }: ReviewProps, forwardRef) => {
  return (
    <View
      flexDirection="column"
      gap="4"
      rounded="4"
      p="4"
      bg="color-1"
      {...rest}
      ref={forwardRef}
    >
      <View flexDirection="row" items="center" gap="3">
        <Avatar circular size="3">
          <Avatar.Image objectFit="contain" src={review.avatar} />
          <Avatar.Fallback />
        </Avatar>
        <View flexDirection="column" gap="1">
          <SizableText size="5">{review.fullname}</SizableText>
          <View flexDirection="row" gap="1">
            {Array.from({ length: 5 })
              .fill(0)
              .map((_, index) => (
                <Star
                  key={index}
                  size={12}
                  color={`${index < Math.floor(review.rate) ? 'orange-9' : 'color-8'}`}
                />
              ))}
          </View>
        </View>
      </View>
      <SizableText size="4" theme="level2" opacity={0.7}>
        {review.review}
      </SizableText>
    </View>
  )
})
