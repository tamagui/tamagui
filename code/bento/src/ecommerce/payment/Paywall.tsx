import type { IconProps } from '@tamagui/helpers-icon'
import {
  Calendar,
  ChartArea,
  ChartLine,
  Handshake,
  HelpCircle,
  Mail,
  Plug,
  Rocket,
  Star,
  User,
  X,
} from '../../icons'
import { Fragment, useEffect, useState, type FunctionComponent } from 'react'
import { Dimensions } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  CurvedTransition,
  Easing,
  Extrapolation,
  interpolate,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated'
import {
  createStyledHOC,
  Button,
  isWeb,
  styled,
  Text,
  useTheme,
  View,
  XStack,
} from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'
import { Switch } from '../../forms/switches/common/switchParts'
import { Chip } from '../../elements/chips/components/chipsParts'

const { width } = Dimensions.get('window')

type WebSafeAnimationProps = {
  forwardedRef?: any
  layout?: any
  nativeID?: string
}

const AnimatedViewFrame = createStyledHOC(
  View,
  ({ forwardedRef, layout, nativeID, ...props }: WebSafeAnimationProps, ref) => (
    <View
      ref={forwardedRef || ref}
      {...props}
      {...(!isWeb && nativeID ? { nativeID } : {})}
      {...(!isWeb && layout ? { layout } : {})}
    />
  )
)
const AnimatedView = Animated.createAnimatedComponent(AnimatedViewFrame)

const HStackFrame = styled(XStack, {
  items: 'center',
  gap: '4',
})
const AnimatedHStackFrame = createStyledHOC(
  HStackFrame,
  ({ forwardedRef, layout, nativeID, ...props }: WebSafeAnimationProps, ref) => (
    <HStackFrame
      ref={forwardedRef || ref}
      {...props}
      {...(!isWeb && nativeID ? { nativeID } : {})}
      {...(!isWeb && layout ? { layout } : {})}
    />
  )
)
const AnimatedHStack = Animated.createAnimatedComponent(AnimatedHStackFrame)

export function Paywall() {
  const goToTermsOfService = () => {
    //
  }

  const oRestore = () => {
    //
  }

  return (
    <View flex={1} flexBasis="auto" gap="4" bg="color-2" position="relative">
      <LinearGradient colors={['color/0', 'color-2']} position="absolute" inset={0} />

      <ReviewListCarousel />

      <LinearGradient
        colors={['background/0', 'background', 'background']}
        height={'100%'}
        position="absolute"
        l={0}
        r={0}
        b={0}
      />

      {isWeb ? (
        <XStack
          overflow="scroll"
          justify="flex-start"
          items="flex-end"
          gap={SPACING}
          px={SPACING}
        >
          {plans.map((plan, index) => (
            <PlanView
              key={plan.id}
              scrollX={0 as unknown as SharedValue<number>}
              plan={plan}
              index={index}
            />
          ))}
        </XStack>
      ) : (
        <PlanList />
      )}

      <XStack gap="4" justify="center" items="center" pb={SPACING * 2}>
        <Text onPress={goToTermsOfService} fontSize="4" color="color-7">
          Terms of Service
        </Text>
        <Text onPress={oRestore} fontSize="4" color="color-7">
          Restore
        </Text>
      </XStack>
    </View>
  )
}

const PlanList = () => {
  const scrollX = useSharedValue(0)
  const initialX = useSharedValue(0)

  const gesture = Gesture.Pan()
    .onBegin(() => {
      'worklet'
      initialX.value = scrollX.value
    })
    .onUpdate(({ translationX, velocityX }) => {
      'worklet'
      const maxScroll = -(PLAN_ITEM_WIDTH + SPACING) * (plans.length - 1)
      scrollX.value = Math.max(Math.min(initialX.value + translationX, 0), maxScroll)

      const snapToIndex = (index: number) => {
        scrollX.value = withSpring(-SIZE_RANGE * index, {
          velocity: velocityX,
          damping: 20,
          stiffness: 200,
        })
      }

      // Snap immediately on fast swipes
      if (Math.abs(velocityX) > PLAN_ITEM_WIDTH) {
        const currentIndex = Math.round(-scrollX.value / SIZE_RANGE)
        const direction = velocityX > 0 ? -1 : 1
        const targetIndex = Math.max(
          0,
          Math.min(currentIndex + direction, plans.length - 1)
        )
        snapToIndex(targetIndex)
      }
    })
    .onEnd(({ velocityX }) => {
      'worklet'
      // Snap to nearest on slow swipes
      if (Math.abs(velocityX) <= 500) {
        const index = Math.round(-scrollX.value / SIZE_RANGE)
        const boundedIndex = Math.max(0, Math.min(index, plans.length - 1))
        scrollX.value = withSpring(-SIZE_RANGE * boundedIndex, {
          velocity: velocityX,
          damping: 20,
          stiffness: 200,
        })
      }
    })

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: scrollX.value }],
    }),
    [scrollX]
  )

  return (
    <GestureDetector gesture={gesture} touchAction="pan-x">
      <AnimatedHStack
        style={animatedStyle}
        justify="flex-start"
        items="flex-end"
        gap={SPACING}
        px={SPACING}
      >
        {plans.map((plan, index) => (
          <PlanView key={plan.id} scrollX={scrollX} plan={plan} index={index} />
        ))}
      </AnimatedHStack>
    </GestureDetector>
  )
}

const PlanView = ({
  plan,
  scrollX,
  index,
}: {
  plan: Plan
  scrollX: SharedValue<number>
  index: number
}) => {
  const [annual, setAnnual] = useState(false)
  const [nextStep, setNextStep] = useState(false)

  const length = plans.length

  const inputRange = Array.from({ length: length }, (_, i) => index + i)
  const outputRange = Array.from({ length: length }, (_, i) => SIZE_RANGE * i)

  const range = Array.from({ length: length }, (_, i) => index + i - 1)

  const style = useAnimatedStyle(() => {
    if (isWeb) {
      return {
        transform: [
          { translateX: 0 },
          { scale: 1 },
          { translateY: 0 },
          { rotate: '0deg' },
        ],
        opacity: 1,
      }
    }

    const position = (scrollX.value / SIZE_RANGE) * -1

    // keep position in the center
    const active = index <= Math.abs(Math.round(position))
    const translateX = active
      ? interpolate(Math.abs(position), inputRange, outputRange, Extrapolation.CLAMP)
      : 0

    const scale = interpolate(
      position,
      [index - 2, index - 1, index, index + 1, index + 2],
      [0.85, 0.9, 1, 0.9, 0.85],
      Extrapolation.CLAMP
    )

    const opacity = interpolate(position, range, [0.8, 1, 0.8], Extrapolation.CLAMP)

    const rotate = interpolate(
      position,
      [index - 2, index - 1, index, index + 1, index + 2],
      [10, -5, 0, 5, -10],
      Extrapolation.CLAMP
    )

    const translateY = interpolate(
      position,
      [index - 2, index - 1, index, index + 1, index + 2],
      [-SPACING * 2, -SPACING * 1.5, 0, -SPACING * 1.5, -SPACING * 2],
      Extrapolation.CLAMP
    )

    return {
      transform: [{ translateX }, { scale }, { translateY }, { rotate: `${rotate}deg` }],
      opacity,
    }
  }, [scrollX, index])

  const { title, description, price, yearPrice, features } = plan

  const PriceGradient = () => {
    return (
      <LinearGradient
        colors={['background', 'background/0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        position="absolute"
        height={12}
        r={0}
        l={0}
        t={0}
      />
    )
  }

  return (
    <AnimatedView
      style={style}
      width={isWeb ? '100% lg:500px' : PLAN_ITEM_WIDTH}
      layout={CurvedTransition.duration(325).reduceMotion(ReduceMotion.System).build()}
      bg="background"
      borderWidth={1}
      borderColor="border-color"
      rounded="8"
      boxShadow="0 0 32px shadow-color"
      height={nextStep ? 'auto' : '100%'}
      grow={1}
    >
      <View key="plan-content" overflow="hidden">
        <View
          key="paywall-plan"
          style={{ transition: 'transform 150ms ease, opacity 150ms ease' }}
          opacity={nextStep ? 0 : 1}
          transform={[{ translateY: nextStep ? 100 : 0 }]}
          gap="6"
          p="6"
        >
          <View gap="2">
            <XStack gap="2">
              <Text flex={1} fontWeight="bold" fontSize="8">
                {title}
              </Text>
              <Text fontWeight="500" fontSize="6">
                {formatCurrency(price)}/
                <Text fontWeight="500" fontSize="4" color="color-11">
                  month
                </Text>
              </Text>
            </XStack>
            <Text color="color-7" fontSize="6">
              {description}
            </Text>
          </View>
          <View gap="4" borderWidth={1} borderColor="border-color" rounded="6" py="4">
            {features.map(({ name, Icon }, index) => (
              <Fragment key={name}>
                <XStack px="4" items="center" gap="3">
                  <Icon color="color" />
                  <Text>{name}</Text>
                </XStack>
                {index !== features.length - 1 && (
                  <View borderTopWidth={1} borderColor="border-color" />
                )}
              </Fragment>
            ))}
          </View>

          <Button
            theme="accent"
            flexDirection="column"
            gap={0}
            height="auto"
            rounded="10"
            onPress={() => setNextStep(true)}
          >
            <Button.Text py="4" fontSize="5" fontWeight="bold">
              Subscribe
            </Button.Text>
          </Button>
        </View>

        {nextStep && (
          <View key="checkout" position="absolute" justify="center" inset={0}>
            <View
              key="paywall-checkout"
              style={{ transition: 'transform 150ms ease, opacity 150ms ease' }}
              opacity="1 enter:0 exit:0"
              transform={`translateY(0px) enter:translateY(-100px) exit:translateY(-100px)`}
              gap="6"
              p="6"
              flex={1}
              theme={annual ? 'green' : undefined}
            >
              <View flex={1} justify="center" gap="4" py="4">
                <XStack
                  gap="4"
                  items="center"
                  self="center"
                  justify="space-between"
                  rotate={annual ? '-3deg' : '0deg'}
                  key="switch"
                  style={{ transition: 'transform 150ms ease' }}
                >
                  <Text
                    fontSize="5"
                    {...(!annual
                      ? { color: 'color', fontWeight: '600' }
                      : { color: 'black' })}
                  >
                    Monthly
                  </Text>
                  <Switch
                    checked={annual}
                    onCheckedChange={(checked) => {
                      setAnnual(checked)
                    }}
                    size={'3'}
                    bg={`${annual ? 'color' : 'color-7'}`}
                    justify="center"
                    items="center"
                    cursor="pointer"
                    borderWidth={2}
                    borderColor="transparent"
                  >
                    {/* switch background */}
                    <Switch.Thumb
                      style={{ transition: 'transform 200ms ease' }}
                      bg="transparent"
                    >
                      <View
                        boxShadow="18px 0 18px shadow-color"
                        m="1"
                        flex={1}
                        overflow="hidden"
                        rounded="10"
                        items="center"
                        justify="center"
                        bg="color"
                        style={{ transition: 'background-color 200ms ease' }}
                      />
                    </Switch.Thumb>
                  </Switch>

                  <Text
                    fontSize="5"
                    {...(annual
                      ? { color: 'color', fontWeight: '600' }
                      : { color: 'black' })}
                  >
                    Annual
                  </Text>
                </XStack>

                <View py="2">
                  <View items="center" self="center" position="relative">
                    <View height={64} justify="center" items="center" overflow="hidden">
                      <Text
                        key="monthly-price"
                        style={{
                          transition: 'transform 150ms ease, opacity 150ms ease',
                        }}
                        text="center"
                        fontSize="10"
                        fontWeight="bold"
                        px="2"
                        opacity={annual ? 0 : 1}
                        transform={[{ translateY: annual ? -56 : 0 }]}
                      >
                        {formatCurrency(price)}
                      </Text>

                      <Text
                        key="annual-price"
                        style={{
                          transition: 'transform 150ms ease, opacity 150ms ease',
                        }}
                        text="center"
                        fontSize="10"
                        fontWeight="bold"
                        transform={[{ translateY: !annual ? 56 : 0 }]}
                        opacity={annual ? 1 : 0}
                        position="absolute"
                      >
                        {formatCurrency(yearPrice)}
                      </Text>

                      <PriceGradient key="top-gradient" />
                      <View
                        position="absolute"
                        r={0}
                        b={0}
                        rotate={'-180deg'}
                        height={12}
                        l={0}
                      >
                        <PriceGradient key="bottom-gradient" />
                      </View>
                    </View>

                    <Text color="color-7" text="center" fontSize="4">
                      Monthly
                    </Text>

                    {annual && (
                      <Chip
                        size="sm"
                        circular
                        position="absolute"
                        r="-6"
                        t="-2"
                        rotate="25deg"
                        opacity="1 enter:0 exit:0"
                        transform={`translateY(0px) translateX(0px) enter:translateY(-10px) translateX(10px) exit:translateY(-10px) translateX(10px)`}
                        px="3"
                        style={{
                          transition: 'transform 150ms ease, opacity 150ms ease',
                        }}
                      >
                        <Chip.Text fontWeight="600">
                          -{Math.round(((price - yearPrice) / price) * 100)}%
                        </Chip.Text>
                      </Chip>
                    )}
                  </View>
                </View>

                <Text text="center" fontSize="6">
                  {description}
                </Text>
              </View>

              <Button flexDirection="column" gap={0} height="auto" rounded="10">
                <Button.Text py="4" fontSize="5" fontWeight="bold">
                  Checkout
                </Button.Text>
              </Button>
            </View>
            <Button
              self="flex-end"
              bg="transparent"
              position="absolute"
              t="4"
              r="4"
              circular
              onPress={() => setNextStep(false)}
            >
              <Button.Icon>
                <X size={24} />
              </Button.Icon>
            </Button>
          </View>
        )}
      </View>
    </AnimatedView>
  )
}

const DURATION = 90000

const ReviewListCarousel = () => {
  const slideLeft = useSharedValue(0)
  const slideRight = useSharedValue(0)

  const animatedSlideLeft = useAnimatedStyle(
    () => ({
      transform: [{ translateX: slideLeft.value }],
    }),
    [slideLeft]
  )

  const animatedSlideRight = useAnimatedStyle(
    () => ({
      transform: [{ translateX: slideRight.value }],
    }),
    [slideRight]
  )

  useEffect(() => {
    slideLeft.value = withRepeat(
      withTiming(-REVIEW_RANGE, { duration: DURATION, easing: Easing.linear }),
      -1,
      true
    )

    slideRight.value = withRepeat(
      withTiming(REVIEW_RANGE, { duration: DURATION, easing: Easing.linear }),
      -1,
      true
    )
  }, [])

  return (
    <View
      style={{ transition: 'transform 250ms ease, opacity 150ms ease' }}
      opacity="1 enter:0 exit:0"
      transform={`translateY(0px) enter:translateY(50px) exit:translateY(50px)`}
      flex={1}
      flexBasis="auto"
      rotate="-10deg"
      gap="4"
      key="review-list"
    >
      <AnimatedHStack style={animatedSlideLeft}>
        {reviewers.map((reviewer) => (
          <RatingView key={reviewer.id} reviewer={reviewer} />
        ))}
      </AnimatedHStack>

      <AnimatedHStack r={REVIEW_RANGE} style={animatedSlideRight}>
        {reviewers.map((reviewer) => (
          <RatingView key={reviewer.id} reviewer={reviewer} />
        ))}
      </AnimatedHStack>

      <AnimatedHStack l="-10%" style={animatedSlideLeft}>
        {reviewers.map((reviewer) => (
          <RatingView key={reviewer.id} reviewer={reviewer} />
        ))}
      </AnimatedHStack>
    </View>
  )
}

const RatingView = ({ reviewer }: { reviewer: Reviewer }) => {
  const theme = useTheme()
  return (
    <View
      rounded="4"
      gap="2"
      overflow="hidden"
      width="70%"
      maxW={REVIEW_WIDTH}
      height="100%"
      p="4"
      bg="color-1"
    >
      <XStack items="center" gap="2">
        <Text fontSize="5" fontWeight="bold" flex={1} numberOfLines={1}>
          {reviewer.name}
        </Text>
        <XStack items="center" gap="1">
          {Array.from({ length: 5 }).map((_, index) => {
            const active = index < reviewer.rating
            return (
              <Star
                size="1"
                key={index}
                color="transparent"
                fill={active ? '#FFCF50' : theme['color-4']?.val}
              />
            )
          })}
        </XStack>
      </XStack>
      <Text>{reviewer.review}</Text>
      <Text>{reviewer.date}</Text>
    </View>
  )
}

type Feature = {
  Icon: FunctionComponent<IconProps>
  name: string
}

type Plan = {
  id: string
  title: string
  price: number
  yearPrice: number
  description: string
  features: Feature[]
}

const plans: Plan[] = [
  {
    id: 'pro',
    title: 'Pro Plan',
    price: 3.99,
    yearPrice: 2.99,
    description: 'Flexibility for less frequent flyers or occasional trips',
    features: [
      {
        Icon: (props) => <Mail {...props} />,
        name: 'Email integration',
      },
      {
        Icon: (props) => <Calendar {...props} />,
        name: 'Event planning',
      },
      {
        Icon: (props) => <HelpCircle {...props} />,
        name: 'Priority support',
      },
    ],
  },
  {
    id: 'premium',
    title: 'Premium Plan',
    price: 7.99,
    yearPrice: 6.29,
    description: 'Best for professionals and small teams who need advanced features',
    features: [
      {
        Icon: (props) => <Rocket {...props} />,
        name: 'Everything in Pro',
      },
      {
        Icon: (props) => <User {...props} />,
        name: 'Team collaboration',
      },
      {
        Icon: (props) => <ChartLine {...props} />,
        name: 'Advanced analytics',
      },
    ],
  },
  {
    id: 'business',
    title: 'Business Plan',
    price: 14.99,
    yearPrice: 10.99,
    description: 'For larger teams and enterprises with advanced needs',
    features: [
      {
        Icon: (props) => <Handshake {...props} />,
        name: 'Dedicated support',
      },
      {
        Icon: (props) => <Plug {...props} />,
        name: 'API access',
      },
      {
        Icon: (props) => <ChartArea {...props} />,
        name: 'Usage reports',
      },
    ],
  },
]

type Reviewer = {
  id: number
  name: string
  rating: number
  review: string
  date: string
}

const reviewers: Reviewer[] = [
  {
    id: 1,
    name: 'John Smith',
    rating: 4,
    review: 'Amazing product that has transformed how I work. Highly recommend!',
    date: '2024-03-15',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    rating: 4,
    review:
      'Very intuitive interface and great features. Would love to see more customization options.',
    date: '2024-03-10',
  },
  {
    id: 3,
    name: 'Michael Williams',
    rating: 5,
    review:
      "Best productivity tool I've used. The premium features are worth every penny.",
    date: '2024-03-05',
  },
  {
    id: 4,
    name: 'Emily Brown',
    rating: 4,
    review: 'Clean design and smooth performance. Really helps keep me organized.',
    date: '2024-02-28',
  },
  {
    id: 5,
    name: 'David Miller',
    rating: 5,
    review:
      'Excellent app that delivers on all its promises. The support team is fantastic too!',
    date: '2024-02-20',
  },
  {
    id: 6,
    name: 'Jessica Davis',
    rating: 4,
    review:
      'Great tool for both personal and professional use. Very satisfied with my subscription.',
    date: '2024-02-15',
  },
  {
    id: 7,
    name: 'James Wilson',
    rating: 5,
    review: 'Game-changing features that have improved my workflow significantly.',
    date: '2024-02-10',
  },
  {
    id: 8,
    name: 'Lisa Anderson',
    rating: 4,
    review: 'Solid performance and regular updates. Really enjoy using this product.',
    date: '2024-02-05',
  },
  {
    id: 9,
    name: 'Robert Taylor',
    rating: 5,
    review:
      'Phenomenal tool that keeps getting better. The premium features are exceptional.',
    date: '2024-01-30',
  },
  {
    id: 10,
    name: 'Jennifer Martinez',
    rating: 4,
    review: 'User-friendly and powerful. Definitely worth upgrading to the pro version.',
    date: '2024-01-25',
  },
]

const formatCurrency = (price: number) => {
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
}

const SPACING = 24
const PLAN_ITEM_WIDTH = width - SPACING * 2
const SIZE_RANGE = PLAN_ITEM_WIDTH + SPACING

const REVIEW_WIDTH = isWeb ? 400 : width * 0.7
const REVIEW_RANGE = REVIEW_WIDTH * (reviewers.length - 2)

Paywall.fileName = 'Paywall'
Paywall.title = 'Paywall #1'
