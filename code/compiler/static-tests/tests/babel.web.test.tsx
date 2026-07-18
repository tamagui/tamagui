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

test('$group- styles extract to atomic CSS', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test() {
      return (
        <View group="card">
          <View
            width={100}
            $group-card={{ backgroundColor: 'red' }}
          />
        </View>
      )
    }
  `
  )
  // child View should fully flatten to <div> with className — no runtime $group-card prop
  expect(output?.js).toContain('div')
  expect(output?.js).not.toContain('$group-card')

  // parent's static `group="card"` should emit container CSS + `t_group_card` className.
  expect(output?.styles).toContain('container-name: card')
  expect(output?.styles).toContain('container-type: inline-size')
  expect(output?.js).toContain('t_group_card')

  // child rule rides off the parent's `.t_group_card` className.
  expect(output?.styles).toContain('.t_group_card')
  expect(output?.styles).toContain('background-color')
})

test('$group- styles with pseudo extract to parent-hover selector', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test() {
      return (
        <View group="row">
          <View
            width={100}
            $group-row-hover={{ backgroundColor: 'red' }}
          />
        </View>
      )
    }
  `
  )

  expect(output?.js).toContain('div')
  expect(output?.js).not.toContain('$group-row-hover')
  // hover pseudo is matched off the parent's `.t_group_row` class — wrapped in
  // @media (hover:hover) so touch devices don't sticky-trigger.
  expect(output?.styles).toContain('.t_group_row:hover')
  expect(output?.styles).toContain('@media (hover:hover)')
  expect(output?.styles).toContain('background-color')
})

test('$group- with untilMeasured on the same parent does NOT extract child group styles', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test() {
      return (
        <View group="card" untilMeasured="hide">
          <View
            width={100}
            $group-card={{ backgroundColor: 'red' }}
          />
        </View>
      )
    }
  `
  )

  // child's $group-card must remain inline for runtime measurement gating
  expect(output?.js).toContain('$group-card')
  // parent still extracts its container CSS so siblings without untilMeasured
  // can still use it — only the descendants' group styles bail.
})

test('$group- styles on an animated element stay on the runtime path (never extract to CSS)', async () => {
  // Q2 invariant: a static @container class can't drive a JS animation driver's
  // interpolation, so an animated element's $group- style must NOT extract to CSS.
  // the compiler enforces this via createExtractor's `animation` de-opt (the whole
  // element drops to runtime), backed by extractToClassNames' animation guard.
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test() {
      return (
        <View group="card">
          <View
            width={100}
            animation="bouncy"
            $group-card={{ backgroundColor: 'red' }}
          />
        </View>
      )
    }
  `
  )
  expect(output?.js).toContain('$group-card')
})

test('$group- styles on an element with enterStyle stay on the runtime path', async () => {
  // same Q2 invariant via a different animation surface (enterStyle). guards
  // against a regression where an animated element's group style leaks into
  // static @container CSS.
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test() {
      return (
        <View group="card">
          <View
            width={100}
            enterStyle={{ opacity: 0 }}
            $group-card={{ backgroundColor: 'red' }}
          />
        </View>
      )
    }
  `
  )
  expect(output?.js).toContain('$group-card')
})

test('$theme- styles extract to atomic CSS', async () => {
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

  // fully flattens to a div; styles emitted as theme-scoped rules.
  expect(output?.js).toContain('div')
  expect(output?.js).not.toContain('$theme-light')
  expect(output?.js).not.toContain('$theme-dark')
  expect(output?.styles).toContain('background-color')
  expect(output?.styles).toContain('t_light')
  expect(output?.styles).toContain('t_dark')
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

test('$platform-web transition property is preserved', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test() {
      return (
        <View
          width={100}
          $platform-web={{
            transition: 'clip-path 400ms ease, transform 400ms ease',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          }}
        />
      )
    }
  `
  )

  // transition inside $platform-web should be preserved as a CSS property
  expect(output?.styles).toContain('transition')
  expect(output?.styles).toContain('clip-path')
})

test('CSS-only named transition stays flattened and emits CSS', async () => {
  const output = await extractForWeb(`
    import { View } from '@tamagui/core'

    export function Test(props) {
      return <View transition="medium" opacity={props.active ? 1 : 0} />
    }
  `)

  expect({ js: output?.js, styles: output?.styles }).toMatchInlineSnapshot(`
    {
      "js": "const _cn3 = "is_View _transition-all300mscub1822784663";
    const _cn2 = "is_View _transition-all300mscub1822784663 _o-1";
    const _cn = "is_View _transition-all300mscub1822784663 _o-0";
    import { View } from '@tamagui/core';
    export function Test(props) {
      return <div className={!props.active ? _cn : props.active ? _cn2 : _cn3} />;
    }",
      "styles": ":root ._transition-all300mscub1822784663{transition:all 300ms cubic-bezier(0.25, 0.1, 0.25, 1);}
    :root ._o-1{opacity:1;}
    :root ._o-0{opacity:0;}",
    }
  `)
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

test('conditional color prop keeps hoverStyle color when flattened', async () => {
  const output = await extractForWeb(
    `
    import { Text } from '@tamagui/core'

    export function Test({ isActive, label }) {
      return (
        <Text
          color={isActive ? '$color' : '$color11'}
          hoverStyle={{ color: '$color' }}
        >
          {label}
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

  expect(output?.styles).toContain('color:var(--color11)')
  expect(output?.styles).toContain(
    '._col-0hover-color:hover{color:var(--color) !important;}'
  )
  expect(output?.js).toContain('isActive')
  expect(output?.js).toContain('!isActive ?')
  expect(output?.js).toContain('isActive ?')
  expect(output?.js).toContain('_col-0hover-color _col-color11')
  expect(output?.js).toContain('_col-0hover-color _col-color')
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

// fontWeight ternary is dropped when combined with theme-token color ternary
test('ternary with mixed theme-token and non-token values preserves all props', async () => {
  const output = await extractForWeb(
    `
    import { Text } from '@tamagui/core'
    export function Test({ isActive, label }) {
      return (
        <Text
          fontSize="$3"
          fontWeight={isActive ? '600' : '400'}
          color={isActive ? '$color12' : '$color11'}
        >
          {label}
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

  // both ternary branches should include fontWeight
  expect(output?.styles).toContain('font-weight:600')
  expect(output?.styles).toContain('font-weight:400')
  // both color values should also be present (as CSS variables for theme tokens)
  expect(output?.styles).toContain('color:var(--color12')
  expect(output?.styles).toContain('color:var(--color11')
  expect(output?.js).toMatchSnapshot()
  expect(output?.styles).toMatchSnapshot()
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

// regression: createDOMProps unconditionally emits a (possibly empty) style
// key. without removing it after the call, Object.keys(out) iterates twice
// for what was a single non-style prop, and the same JSXAttribute is emitted
// twice in the output JSX. separately, the later attribute-rename pass that
// converts testID -> data-testid only runs when the value is statically
// evaluable, so dynamic testIDs were emitted as raw `<div testID={...}>`
// and silently dropped by React.
test('non-static testID with template literal is rewritten to data-testid', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test({ x }: { x: string }) {
      return <View testID={\`a-\${x}\`} />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  // should be rewritten to data-testid (not raw testID) and only emitted once.
  expect(output?.js).toContain('data-testid={`a-${x}`}')
  expect(output?.js?.match(/data-testid=/g)?.length).toBe(1)
  expect(output?.js?.match(/\btestID=/g) ?? []).toHaveLength(0)
})
