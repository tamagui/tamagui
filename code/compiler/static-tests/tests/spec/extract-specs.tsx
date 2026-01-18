import { config } from '@tamagui/config'
import {
  Spacer,
  TamaguiProvider,
  Test14Component,
  Text,
  XStack,
  YStack,
  createTamagui,
  useMedia,
} from '@tamagui/sandbox-ui'

import { testColor } from './constants'
import { baseStyle, nestedStyle } from './extract-spec-constants'

// biome-ignore lint/security/noGlobalEval: intentionally non-static for compiler testing
const nonStaticInt = eval(`10`)

type TestProps = {
  conditional?: boolean
  altConditional?: boolean
}

const tamaguiConfig = createTamagui(config)

export const Provider = (props) => (
  <TamaguiProvider defaultTheme="dark" config={tamaguiConfig}>
    {props.children}
  </TamaguiProvider>
)

const child = <Text>hello world</Text>

export function Test1() {
  return (
    <YStack
      className="test1"
      flex={1}
      rounded={100}
      bg="red"
      shadowRadius={10}
      shadowColor="#000"
      hoverStyle={{
        scale: 2,
      }}
    >
      {child}
    </YStack>
  )
}

export const Card = (props: any) => (
  <XStack
    className="transition all ease-in ms100"
    borderRadius="$2"
    backgroundColor="$background"
    hoverStyle={{
      backgroundColor: '$backgroundHover',
      shadowColor: '$shadowColor',
      shadowRadius: 20,
      shadowOffset: { height: 3, width: 0 },
      y: -4,
    }}
    {...props}
  />
)

export function TestVariantDefaultFalseOn(props: TestProps) {
  return <Test14Component fullbleed />
}

export function TestVariantDefaultFalseOff(props: TestProps) {
  return <Test14Component />
}

export function TestMediaQuery() {
  const media = useMedia() // should extract
  const { sm } = useMedia() // should extract
  const media2 = useMedia() // should remain
  const media3 = useMedia() // should remain
  return (
    <>
      <YStack
        backgroundColor={!sm ? 'green' : 'red'}
        paddingRight={media.sm ? 10 : 0}
        {...(media.xs && { borderTopWidth: 1 })}
        {...(media.sm && {
          paddingRight: 4,
          // nested conditional
          backgroundColor: nonStaticInt ? 'red' : 'blue',
        })}
        hoverStyle={{
          bg: 'yellow',
        }}
      >
        {child}
      </YStack>
      <YStack
        borderRightWidth={media2.xs && nonStaticInt ? 1 : 0}
        borderLeftWidth={media3.sm ? 1 : 0}
      >
        {media3.lg && <div />}
      </YStack>
      <YStack p="$2" $lg={{ bg: '$background', p: '$2' }} />
    </>
  )
}

export function TestMediaQueryInline() {
  return (
    <>
      <YStack
        $sm={{
          bg: '$background',
          hoverStyle: {
            bg: 'red',
          },
        }}
      >
        {child}
      </YStack>
    </>
  )
}

// leaves valid props, combines classname
export function Test2(props: TestProps) {
  return (
    <>
      <XStack className="who" onPress={() => {}} overflow="hidden" />
      <XStack
        className="ease-in-out-top"
        backgroundColor="#000"
        py={2}
        top={0}
        {...(props.conditional && {
          top: -14,
          backgroundColor: '#fff',
        })}
      >
        {child}
      </XStack>
    </>
  )
}

// single spread at end
export function Test3(props: any) {
  return (
    <YStack overflow="hidden" {...props}>
      {child}
    </YStack>
  )
}

// static + dynamic prop, hoverStyle
export function Test4() {
  return (
    <YStack
      height={200}
      width={`calc(100% + ${nonStaticInt * 2}px)`}
      hoverStyle={{
        overflow: 'visible',
      }}
    />
  )
}

// spread
export function Test5(props: TestProps) {
  return (
    <YStack
      overflow="hidden"
      {...(props.conditional && {
        backgroundColor: 'blue',
      })}
    >
      {/* with classname already */}
      <YStack
        className="hello-world"
        overflow="hidden"
        {...(props.conditional && {
          backgroundColor: 'blue',
        })}
      />
    </YStack>
  )
}

// ternary
export function Test6(props: TestProps) {
  return (
    <YStack
      overflow="hidden"
      {...(props.conditional
        ? {
            backgroundColor: 'blue',
          }
        : {
            backgroundColor: 'red',
          })}
    >
      {child}
    </YStack>
  )
}

// evaluates away
export function Test7() {
  const isSmall = false
  const verticalPad = 10
  const pad = 5
  return (
    <YStack
      px={pad + 6}
      pb={verticalPad}
      width={isSmall ? '50vw' : '66%'}
      minW={isSmall ? '50%' : 500}
      maxW={isSmall ? '80vw' : '30%'}
    >
      <YStack width={nonStaticInt ? 10 : 0} height={nonStaticInt ? 10 : 0} />
    </YStack>
  )
}

// style expasion + imported constants
export function Test8() {
  return (
    <YStack fullscreen position="relative">
      <YStack {...baseStyle}>
        <YStack fullscreen position="relative" {...nestedStyle} />
      </YStack>
    </YStack>
  )
}

// combines with classname
export function Test9() {
  return <YStack py={15} className="home-top-dish" />
}

// Text
export function Test10({ textStyle }) {
  return (
    <Text fontSize={10}>
      <Text select="auto">
        <Text
          color={nonStaticInt ? '#000' : '#fff'}
          fontSize={15}
          fontWeight="600"
          {...textStyle}
        >
          hello
        </Text>
      </Text>
    </Text>
  )
}

// alllll in one
export function Test11({ conditional, altConditional, ...rest }: TestProps) {
  const lineHeight = 10
  return (
    <YStack
      height={(conditional ? 1 : 0) * 31}
      rounded={8 * (conditional ? 1 : 0)}
      borderWidth={1}
      borderColor={altConditional ? 'red' : 'rgba(0,0,0,0.15)'}
      overflow="hidden"
      items="center"
      position="relative"
      minH={lineHeight}
      {...rest}
      bg="blue"
    >
      {child}
    </YStack>
  )
}

// ternary multiple on same key
export function Test12(props: TestProps) {
  return (
    <YStack
      opacity={props.conditional ? 1 : 0}
      transform={props.conditional ? [] : [{ translateY: 5 }]}
    />
  )
}

// text with complex conditional
export function Test13(props: TestProps) {
  const scale = 1
  return (
    <Text
      color={props.conditional ? '#fff' : '#454545'}
      fontSize={(props.conditional ? 40 : 24) * scale}
      lineHeight={40 * scale}
      width={36 * scale}
      height={36 * scale}
      fontWeight="400"
      text="center"
      mt={(props.conditional ? -4 : 0) * scale}
    />
  )
}

// pressStyle + external constants
export function Test14() {
  return (
    <YStack
      hoverStyle={{
        bg: 'red',
      }}
      pressStyle={{
        bg: testColor,
      }}
    />
  )
}

// spacer
export function Test15() {
  return (
    <>
      <Spacer />
      <Spacer flex={1} size={10} />
    </>
  )
}

// override props when spread is used
export function Test16(props: TestProps) {
  return (
    <YStack
      flex={props.conditional ? 1 : 0}
      backgroundColor="blue"
      {...(props.conditional && {
        backgroundColor: 'red',
      })}
      {...props}
    />
  )
}

// flexWrap and other flex properties
export function TestFlexWrap() {
  return (
    <XStack flexWrap="wrap" flexDirection="row" gap="$2">
      {child}
    </XStack>
  )
}

// flexWrap with conditional
export function TestFlexWrapConditional(props: TestProps) {
  return (
    <XStack
      flexWrap={props.conditional ? 'wrap' : 'nowrap'}
      flexDirection="row"
      items="center"
      justify="space-between"
    >
      {child}
    </XStack>
  )
}

// multiple flex properties together
export function TestFlexProperties() {
  return (
    <YStack
      flexDirection="column"
      flexWrap="wrap"
      flex={1}
      shrink={0}
      flexBasis="auto"
      items="stretch"
      justify="flex-start"
      content="flex-start"
    >
      {child}
    </YStack>
  )
}

// complex real-world case with many conditionals and media queries
export function TestComplexFlexWithConditionals(props: TestProps) {
  const { sm } = useMedia()
  return (
    <YStack
      rounded={sm ? '$0' : '$8'}
      flexDirection={sm ? 'row' : 'column'}
      flexBasis={props.conditional ? '100%' : 'auto'}
      maxW="100%"
      overflow="hidden"
      p={4}
      $sm={{ px: '$0' }}
      width={sm ? '100%' : 260}
      bg={props.altConditional ? '$backgroundHover' : '$background'}
      hoverStyle={{
        cursor: 'pointer',
        bg: '$backgroundHover',
      }}
    >
      <XStack
        flexDirection={sm ? 'column' : 'row'}
        flexWrap="wrap"
        gap={sm ? 0 : 4}
        justify={props.conditional ? 'flex-start' : 'center'}
      >
        {child}
      </XStack>
    </YStack>
  )
}

// flexWrap with multiple media query conditionals
export function TestFlexWrapWithMediaQuery() {
  const media = useMedia()
  return (
    <XStack
      flexWrap="wrap"
      flexDirection={media.sm ? 'row' : 'column'}
      gap="$2"
      $sm={{
        flexWrap: 'nowrap',
        p: '$4',
      }}
    >
      {child}
    </XStack>
  )
}

// Test aria props - should NOT produce duplicate keys
export function TestAriaProps() {
  return (
    <YStack
      render="nav"
      aria-labelledby="test-heading"
      aria-label="Navigation menu"
      p="$4"
    >
      <Text id="test-heading">Navigation</Text>
      {child}
    </YStack>
  )
}

// Test aria props with conditional
export function TestAriaPropsConditional(props: TestProps) {
  return (
    <YStack
      aria-hidden={props.conditional}
      aria-expanded={props.conditional ? true : false}
    >
      {child}
    </YStack>
  )
}
