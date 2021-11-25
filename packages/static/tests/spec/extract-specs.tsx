import * as React from 'react'
import { Box, Spacer, Text, YStack, useMedia } from 'tamagui'

import Tamagui from '../lib/tamagui.config'
import { testColor } from './constants'
import { baseStyle, nestedStyle } from './extract-spec-constants'

const nonStaticInt = eval(`10`)

type TestProps = {
  conditional?: boolean
  altConditional?: boolean
}

export const Provider = (props) => <Tamagui.Provider>{props.children}</Tamagui.Provider>

const child = <Text>hello world</Text>

export const Card = (props: any) => (
  <Box
    className="transition all ease-in ms100"
    borderRadius="$2"
    hoverStyle={{
      backgroundColor: '$bg',
      shadowColor: '$shadowColor',
      shadowRadius: 20,
      shadowOffset: { height: 3, width: 0 },
      y: -4,
    }}
    {...props}
  />
)

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
          backgroundColor: 'yellow',
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
      <YStack p="$2" $lg={{ backgroundColor: '$bg', p: '$2' }} />
    </>
  )
}

export function TestMediaQueryInline() {
  return (
    <>
      <YStack
        $sm={{
          backgroundColor: '$bg',
          hoverStyle: {
            backgroundColor: 'red',
          },
        }}
      >
        {child}
      </YStack>
    </>
  )
}

export function Test1() {
  return (
    <YStack
      className="test1"
      flex={1}
      borderRadius={100}
      backgroundColor="red"
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

// leaves valid props, combines classname
export function Test2(props: TestProps) {
  return (
    <>
      <Box className="who" onPress={() => {}} overflow="hidden" />
      <Box
        className="ease-in-out-top"
        backgroundColor="#000"
        paddingVertical={2}
        top={0}
        {...(props.conditional && {
          top: -14,
          backgroundColor: '#fff',
        })}
      >
        {child}
      </Box>
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
      paddingHorizontal={pad + 6}
      paddingBottom={verticalPad}
      width={isSmall ? '50vw' : '66%'}
      minWidth={isSmall ? '50%' : 500}
      maxWidth={isSmall ? '80vw' : '30%'}
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
  return <YStack paddingVertical={15} className="home-top-dish" />
}

// Text
export function Test10({ textStyle }) {
  return (
    <Text fontSize={10}>
      <Text selectable>
        <Text color={nonStaticInt ? '#000' : '#fff'} fontSize={15} fontWeight="600" {...textStyle}>
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
      borderRadius={8 * (conditional ? 1 : 0)}
      borderWidth={1}
      borderColor={altConditional ? 'red' : 'rgba(0,0,0,0.15)'}
      overflow="hidden"
      alignItems="center"
      position="relative"
      minHeight={lineHeight}
      {...rest}
      backgroundColor="blue"
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
      textAlign="center"
      marginTop={(props.conditional ? -4 : 0) * scale}
    />
  )
}

// pressStyle + external constants
export function Test14() {
  return (
    <YStack
      hoverStyle={{
        backgroundColor: 'red',
      }}
      pressStyle={{
        backgroundColor: testColor,
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

// // TODO can't do this because it renders null on native
// // need to patch expo-linear-gradient for now
// export function TestLinearGradient() {
//   return (
//     <>
//       <YStack backgroundColor="red" width={10} height={10} />
//       <LinearGradient
//         style={[StyleSheet.absoluteFill]}
//         colors={['red', 'blue']}
//       />
//     </>
//   )
// }
