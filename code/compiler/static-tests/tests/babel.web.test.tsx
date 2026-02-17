import * as React from 'react'
import { expect, test } from 'vitest'

import { extractForWeb } from './lib/extract'

window['React'] = React

test('theme props get extracted properly', async () => {
  const output = await extractForWeb(
    `
import { View } from '@tamagui/core'
    export function Test(props) {
      return (
        <View theme="green" width={10} bg={props.green ? 'red' : 'blue'} />
      )
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.js).toContain(`<_TamaguiTheme name="green"><div className={`)
})

test('theme + media queries + conditionals extract', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test(props) {
      return (
        <View
          theme="surface1"
          $sm={{ flexDirection: 'column' }}
          {...(onlyDemo && {
            flexDirection: 'column',
          })}
        />
      )
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.js).toMatchSnapshot()
  expect(output?.styles).toMatchSnapshot()
})

// floating && floating2 && p2 pb18 mr2 btrr10 br5 btlr7
// floating && !floating2 && p2 pb18 mr1 btrr10 br5
// !floating && floating2 && p2 pb15 mr2 btrr10 br2 btlr7
// !floating && !floating2 && p2 pb15 mr1 btrr10 br2

test('conditional specific after generic style overrides', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test(props) {
      return (
        <View
          p="$2"                              // base padding
          pb={floating ? 18 : 15}             // should override bottom
          mr={floating2 ? 2 : 1}              // unrelated ternary
          borderTopRightRadius={10}           // base tr radius
          borderRadius={floating ? 5 : 2}     // should override the tr radius always
          {...floating2 && {
            borderTopLeftRadius: 7
          }}
        />
      )
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.js).toMatchSnapshot()
  expect(output?.styles).toMatchSnapshot()
})

test('conditional styles get full base styles merged onto + shorthand', async () => {
  const output = await extractForWeb(
    `
import { View } from '@tamagui/core'
    export function Test(props) {
      return (
        <View width={10} bg={props.green ? 'red' : 'blue'} />
      )
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.js).toMatchSnapshot()
  expect(output?.styles).toMatchSnapshot()
})

test('className + conditional styles get full base styles merged onto + shorthand', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test(props) {
      return (
        <View width={10} bg={props.green ? 'red' : 'blue'} className={props.className} />
      )
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )
  expect(output?.js).toMatchSnapshot()
  expect(output?.styles).toMatchSnapshot()
})

test('font classNames are extracted properly', async () => {
  // one sanity check debug output test
  const output = await extractForWeb(
    `
    import { Text } from '@tamagui/core'
    export function Test(props) {
      return (
        <Text fontFamily="$body" />
      )
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(
    output?.js.includes(
      `_cn = "font_body _dsp-inline _bxs-border-box _ww-break-word _whiteSpace-pre-wrap _mt-0px _mr-0px _mb-0px _ml-0px _ff-f-family"`
    )
  )
})

test('ternaries + font families works', async () => {
  // one sanity check debug output test
  const output = await extractForWeb(
    `
    import { Text } from '@tamagui/core'
    export function Test(props) {
      return (
        <Text fontFamily={window ? "$body" : "$heading"} />
      )
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.js).toMatchSnapshot()
  expect(output?.styles).toMatchSnapshot()
})

test('bails from non-deterministic values', async () => {
  // one sanity check debug output test
  const output = await extractForWeb(
    `
    import { Text } from '@tamagui/core'
    export function Test(props) {
      return (
        <Text
          color={Math.random()}
        />
      )
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.js).toMatchSnapshot()
})

test('non-flattened works', async () => {
  const output = await extractForWeb(
    `
    import { Text } from '@tamagui/core'
    export function Test(props) {
      return (
        <Text
          textAlign={inMenu ? props.hello : 'right'}
          width="100%"
          hoverStyle={{
            o: 0.85,
          }}
          {...(active && {
            fow: '700',
            opacity: 1,
          })}
        />
      )
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.js).toMatchSnapshot()
})

test('fontFamily shorthand + styled + flatten works', async () => {
  const output = await extractForWeb(
    `
    import { MySizableText } from '@tamagui/test-design-system'
    export function Test(props) {
      return (
        <MySizableText
          ff="$mono"
        />
      )
    }
  `
  )

  expect(output?.js).toMatchSnapshot()
})

test('fontFamily shorthand + styled + flatten + ternaries', async () => {
  const output = await extractForWeb(
    `
    import { MySizableText } from '@tamagui/test-design-system'
    export function Test(props) {
      return (
        <MySizableText
          ff="$mono"
          opacity={active ? 1 : 0.65}
        />
      )
    }
  `
  )

  expect(output?.js).toMatchSnapshot()
})

test('specific className + ternary', async () => {
  const output = await extractForWeb(
    `
    import { MySizableText } from '@tamagui/test-design-system'
    export function Test(props) {
      return (
        <MySizableText
          className="test-class-name"
          ff="$mono"
          opacity={active ? 1 : 0.65}
        />
      )
    }
  `
  )

  expect(output?.js).toMatchSnapshot()
})

test('spread + className', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test(props) {
      return (
        <View
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
        </View>
      )
    }
  `
  )

  expect(output?.js).toMatchSnapshot()
})

test('double ternary + spread', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test({ isSettings, isVertical, children }) {
      return (
        <View
          flex={isSettings || isVertical ? 'unset' : 5}
          alignItems="center"
          {...(isVertical && {
            flexDirection: 'column',
            alignItems: 'flex-start',
          })}
        >
          {children}
        </View>
      )
    }
  `
  )

  expect(output?.js).toMatchSnapshot()
})

test(`conditional classname keeps base and concats properly`, async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test(props) {
      return (
        <View
          flex={1}
          className={isEnabled ? '' : 'disable-all-pointer-events'}
        >
          {props.child}
        </View>
      )
    }
  `
  )

  expect(output?.js).toMatchSnapshot()
})

// https://github.com/tamagui/tamagui/issues/3608
test('flexBasis: 0 with responsive style extracts correctly', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test() {
      return (
        <View
          fb={1}
          $gtXs={{ fb: 0 }}
        />
      )
    }
  `
  )

  // fb: 0 should extract as 0px, not auto
  expect(output?.styles).toContain('_fb-_gtXs_0px')
  expect(output?.styles).not.toContain('_fb-_gtXs_auto')
  expect(output?.js).toMatchSnapshot()
  expect(output?.styles).toMatchSnapshot()
})

test('$group- styles are not flattened', async () => {
  const output = await extractForWeb(
    `
    import { View, XStack } from '@tamagui/core'

    export function Test() {
      return (
        <XStack group="card">
          <View
            width={100}
            $group-card={{ backgroundColor: 'red' }}
          />
        </XStack>
      )
    }
  `
  )

  // $group- styles should NOT be flattened - they need runtime handling
  // The component should not be converted to a plain div
  expect(output?.js).toContain('View')
  expect(output?.js).toContain('$group-card')
})

test('$theme- styles are not flattened', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test() {
      return (
        <View
          width={100}
          $theme-light={{ backgroundColor: 'white' }}
          $theme-dark={{ backgroundColor: 'black' }}
        />
      )
    }
  `
  )

  // $theme- styles should NOT be flattened - they need runtime handling
  // The component should not be converted to a plain div
  expect(output?.js).toContain('View')
  expect(output?.js).toContain('$theme-light')
  expect(output?.js).toContain('$theme-dark')
})

test('$platform-web styles are flattened on web', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test() {
      return (
        <View
          width={100}
          $platform-web={{ backgroundColor: 'red' }}
        />
      )
    }
  `
  )

  // $platform-web styles SHOULD be flattened on web - the platform is known at compile time
  // The component should be converted to a plain div with the styles applied
  expect(output?.js).toContain('div')
  expect(output?.js).not.toContain('$platform-web')
  expect(output?.styles).toContain('background-color')
})

// Verifies that conditional spread with runtime variable from hook inside map is correctly extracted
test('conditional spread with runtime variable preserves ternary', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    function usePathname() {
      return '/blog'
    }

    const navLinks = [{ name: 'Blog', href: '/blog' }]

    export function Header() {
      const pathname = usePathname()
      return (
        <>
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href)
            return (
              <View
                key={link.name}
                backgroundColor="red"
                {...(isActive && {
                  backgroundColor: 'blue',
                })}
              />
            )
          })}
        </>
      )
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  // The ternary should be preserved in the output - the className should depend on isActive
  expect(output?.js).toContain('isActive')
  // The hook call should NOT be removed
  expect(output?.js).toContain('usePathname')
  // The pathname variable should be preserved
  expect(output?.js).toContain('pathname')
  expect(output?.js).toMatchSnapshot()
})

// Verifies that conditional spread with prop variable preserves the ternary in className
test('conditional spread with local variable preserves ternary', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test({ isActive }) {
      return (
        <View
          backgroundColor="red"
          {...(isActive && {
            backgroundColor: 'blue',
          })}
        />
      )
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  // The ternary should be preserved - className should depend on isActive
  expect(output?.js).toContain('isActive')
  expect(output?.js).toMatchSnapshot()
})

// Verifies conditional spread + hoverStyle works correctly
test('conditional spread with hoverStyle preserves ternary', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test({ isActive }) {
      return (
        <View
          backgroundColor="red"
          cursor="pointer"
          hoverStyle={{ backgroundColor: 'green' }}
          {...(isActive && {
            backgroundColor: 'blue',
          })}
        />
      )
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  // The ternary should be preserved - className should depend on isActive
  expect(output?.js).toContain('isActive')
  expect(output?.js).toMatchSnapshot()
})

// Verifies Text with hoverStyle and conditional spread preserves ternary
test('Text with hoverStyle and conditional spread preserves ternary', async () => {
  const output = await extractForWeb(
    `// debug
    import { Text } from '@tamagui/core'

    export function Test({ isActive }) {
      return (
        <Text
          cursor="pointer"
          hoverStyle={{ color: '$color12' }}
          {...(isActive && {
            color: '$color12',
            fontWeight: '800',
          })}
        >
          hello
        </Text>
      )
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  // The ternary should be preserved - className should depend on isActive
  expect(output?.js).toContain('isActive')
  expect(output?.js).toMatchSnapshot()
})

// role attribute is passed through during extraction
test('role attribute is preserved during extraction', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test() {
      return <View role="button" />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  // The output should have role="button" on the div
  expect(output?.js).toContain('role=')
  expect(output?.js).toContain('button')
})

// CSS shorthand properties with embedded $variables
test('boxShadow with $variable extracts correctly', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test() {
      return <View boxShadow="0 0 10px $background" />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  // Should extract to CSS with box-shadow and var()
  expect(output?.styles).toContain('box-shadow')
  expect(output?.styles).toContain('var(--')
})

// Skip until RN supports border shorthand - use borderWidth/borderColor/borderStyle for cross-platform
test.skip('border with $variable extracts correctly', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test() {
      return <View border="1px solid $background" />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  // border expands to individual border props, check for color with var()
  expect(output?.styles).toContain('border')
  expect(output?.styles).toContain('var(--')
})

test('boxShadow with multiple $variables extracts correctly', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test() {
      return <View boxShadow="0 0 10px $background, 0 0 20px $color" />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  // Should contain multiple var() references
  expect(output?.styles).toContain('box-shadow')
  const varMatches = output?.styles?.match(/var\(--/g)
  expect(varMatches?.length).toBeGreaterThanOrEqual(2)
})
