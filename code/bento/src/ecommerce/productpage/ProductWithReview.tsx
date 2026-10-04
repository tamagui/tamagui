import { useState } from 'react'
import { Button, Image, Separator, Text, View } from 'tamagui'
import { Check, Minus, Plus, ShoppingBag, Star } from '../../icons'
import { tone } from '../../tone'

const product = {
  title: 'Field Hoodie',
  price: 189,
  was: 220,
  rating: 4.6,
  reviewCount: 128,
  description:
    'Heavyweight brushed fleece with a relaxed fit, dropped shoulders and a hand painted finish, so no two are quite the same.',
  details: ['480 gsm cotton fleece', 'Hand painted by artisans', 'Made in Portugal'],
  colors: [
    { name: 'Olive', swatch: '#5b5f3a', picture: '/bento/images/jacket1.webp' },
    { name: 'Sage', swatch: '#8a9070', picture: '/bento/images/jacket2.webp' },
    { name: 'Stone', swatch: '#c9c4b5', picture: '/bento/images/jacket3.webp' },
    { name: 'Moss', swatch: '#3f4a2c', picture: '/bento/images/jacket4.webp' },
  ],
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
}

const reviews = [
  {
    name: 'Maya R.',
    avatar: '/bento/images/avatar_1.png',
    rating: 5,
    text: 'Thick, soft and the paint holds up in the wash. Sized up one for a looser fit.',
  },
  {
    name: 'Jonas K.',
    avatar: '/bento/images/avatar_2.png',
    rating: 4,
    text: 'Great weight for autumn. The olive is a little darker in person than in photos.',
  },
  {
    name: 'Priya S.',
    avatar: '/bento/images/avatar_3.png',
    rating: 5,
    text: 'Second one I have bought. Gets better every wear and still looks brand new.',
  },
]

/** ------ EXAMPLE ------ */
export function ProductWithReview() {
  const [color, setColor] = useState(product.colors[0])
  const [size, setSize] = useState('M')
  const [count, setCount] = useState(1)

  return (
    <View width="100%" maxW={960} p="6 max-sm:4" gap="10">
      <View flexDirection="row" flexWrap="wrap" gap="8">
        <View flexBasis={340} grow={1} gap="3">
          <Image
            src={color.picture}
            alt={`${product.title} in ${color.name}`}
            width="100%"
            aspectRatio={1}
            objectFit="cover"
            rounded="6"
            bg={tone.fill}
          />
          <View flexDirection="row" gap="3">
            {product.colors.map((option) => (
              <View
                key={option.name}
                flex={1}
                tabIndex={0}
                role="button"
                aria-label={`Show ${option.name}`}
                aria-pressed={option === color}
                onPress={() => setColor(option)}
                cursor="pointer"
                rounded="4"
                overflow="hidden"
                outlineStyle="solid"
                outlineWidth={2}
                outlineOffset={2}
                outlineColor={option === color ? 'color-12' : 'transparent hover:color-6'}
              >
                <Image
                  src={option.picture}
                  alt=""
                  width="100%"
                  aspectRatio={1}
                  objectFit="cover"
                  bg={tone.fill}
                />
              </View>
            ))}
          </View>
        </View>

        <View flexBasis={320} grow={1} gap="6">
          <View gap="2">
            <Text fontFamily="body" fontSize="3xl" fontWeight="700" color="color-12">
              {product.title}
            </Text>
            <View flexDirection="row" items="center" gap="2">
              <Stars rating={product.rating} />
              <Text fontFamily="body" fontSize="sm" color={tone.muted}>
                {product.rating} · {product.reviewCount} reviews
              </Text>
            </View>
            <View flexDirection="row" items="baseline" gap="2" pt="2">
              <Text fontFamily="body" fontSize="2xl" fontWeight="600" color="color-12">
                ${product.price}
              </Text>
              <Text
                fontFamily="body"
                fontSize="base"
                color={tone.muted}
                textDecorationLine="line-through"
              >
                ${product.was}
              </Text>
            </View>
          </View>

          <OptionGroup label="Color" value={color.name}>
            {product.colors.map((option) => (
              <View
                key={option.name}
                tabIndex={0}
                role="radio"
                aria-label={option.name}
                aria-checked={option === color}
                onPress={() => setColor(option)}
                cursor="pointer"
                width={32}
                height={32}
                rounded="full"
                style={{ backgroundColor: option.swatch }}
                outlineStyle="solid"
                outlineWidth={2}
                outlineOffset={2}
                outlineColor={option === color ? 'color-12' : 'transparent'}
              />
            ))}
          </OptionGroup>

          <OptionGroup label="Size" value={size}>
            {product.sizes.map((option) => {
              const active = option === size
              return (
                <View
                  key={option}
                  tabIndex={0}
                  role="radio"
                  aria-checked={active}
                  onPress={() => setSize(option)}
                  cursor="pointer"
                  minW={48}
                  height={36}
                  px="3"
                  rounded="3"
                  items="center"
                  justify="center"
                  borderWidth={1}
                  borderColor={active ? tone.selected : `${tone.border} hover:color-6`}
                  bg={active ? tone.selected : tone.surface}
                >
                  <Text
                    fontFamily="body"
                    fontSize="sm"
                    fontWeight="500"
                    color={active ? tone.onSelected : 'color-12'}
                  >
                    {option}
                  </Text>
                </View>
              )
            })}
          </OptionGroup>

          <View flexDirection="row" gap="3">
            <View
              flexDirection="row"
              items="center"
              rounded="4"
              borderWidth={1}
              borderColor={tone.border}
              bg={tone.surface}
            >
              <Button
                size="sm"
                variant="quiet"
                aria-label="Fewer"
                icon={Minus}
                disabled={count === 1}
                onPress={() => setCount(count - 1)}
              />
              <Text
                fontFamily="body"
                fontSize="sm"
                fontWeight="500"
                color="color-12"
                width={28}
                text="center"
              >
                {count}
              </Text>
              <Button
                size="sm"
                variant="quiet"
                aria-label="More"
                icon={Plus}
                onPress={() => setCount(count + 1)}
              />
            </View>
            <Button theme="accent" flex={1} icon={ShoppingBag}>
              Add to bag
            </Button>
          </View>

          <Separator borderColor={tone.border} />

          <View gap="3">
            <Text fontFamily="body" fontSize="sm" color="color-11" lineHeight="sm">
              {product.description}
            </Text>
            {product.details.map((detail) => (
              <View key={detail} flexDirection="row" items="center" gap="2">
                <Check size={16} color="green-10" />
                <Text fontFamily="body" fontSize="sm" color="color-11">
                  {detail}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View gap="4">
        <Text fontFamily="body" fontSize="xl" fontWeight="600" color="color-12">
          Reviews
        </Text>
        <View flexDirection="row" flexWrap="wrap" gap="4">
          {reviews.map((review) => (
            <View
              key={review.name}
              flexBasis={240}
              grow={1}
              gap="3"
              p="4"
              rounded="6"
              bg={tone.surface}
              borderWidth={1}
              borderColor={tone.border}
            >
              <View flexDirection="row" items="center" gap="3">
                <Image
                  src={review.avatar}
                  alt=""
                  width={32}
                  height={32}
                  rounded="full"
                  bg={tone.fill}
                />
                <View gap="1">
                  <Text fontFamily="body" fontSize="sm" fontWeight="600" color="color-12">
                    {review.name}
                  </Text>
                  <Stars rating={review.rating} size={12} />
                </View>
              </View>
              <Text fontFamily="body" fontSize="sm" color="color-11" lineHeight="sm">
                {review.text}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

function OptionGroup({
  label,
  value,
  children,
}: {
  label: string
  value: string
  children: React.ReactNode
}) {
  return (
    <View gap="3">
      <Text fontFamily="body" fontSize="sm" color={tone.muted}>
        {label}:{' '}
        <Text fontFamily="body" fontSize="sm" fontWeight="500" color="color-12">
          {value}
        </Text>
      </Text>
      <View role="radiogroup" aria-label={label} flexDirection="row" flexWrap="wrap" gap="2">
        {children}
      </View>
    </View>
  )
}

function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <View flexDirection="row" gap="0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          size={size}
          color={index <= Math.round(rating) ? 'orange-9' : 'color-6'}
          fill={index <= Math.round(rating) ? 'currentColor' : 'none'}
        />
      ))}
    </View>
  )
}
