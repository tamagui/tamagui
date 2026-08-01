import * as React from 'react'
import { expect, test } from 'vitest'

import { extractForWeb } from './lib/extract'

window['React'] = React

test('theme props with a dynamic sibling bail out transactionally', async () => {
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

  expect(output?.js).toContain('theme="green"')
  expect(output?.js).toContain("bg={props.green ? 'red' : 'blue'}")
  expect(output?.styles).toBe('')
})

test('theme + media queries + conditionals extract', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test(props) {
      return (
        <View
          theme="surface1"
          flexDirection="sm:column"
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
          p="2"                              // base padding
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

test('conditional styles extract disjoint static siblings', async () => {
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

  expect(output?.js).toContain('className="_w-10px"')
  expect(output?.js).toContain("bg={props.green ? 'red' : 'blue'}")
  expect(output?.styles).toContain('width:10px')
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
        <Text fontFamily="body" />
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
        <Text fontFamily={window ? "body" : "heading"} />
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
          opacity="hover:0.85"
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
          ff="mono"
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
          ff="mono"
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
          ff="mono"
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
          fb="1 gt-xs:0px"
        />
      )
    }
  `
  )

  // fb: 0 should extract as 0px, not auto
  expect(output?.styles).toMatch(
    /@media \(min-width: 661px\) \{\._fb-\d+\{flex-basis:0px\}\}/
  )
  expect(output?.styles).not.toContain('auto')
  expect(output?.js).toMatchSnapshot()
  expect(output?.styles).toMatchSnapshot()
})

test('group clauses extract to parent-hover selectors', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test() {
      return (
        <View group="row">
          <View
            width={100}
            backgroundColor="group-hover/row:red"
          />
        </View>
      )
    }
  `
  )

  expect(output?.js).toContain('div')
  expect(output?.js).not.toContain('group-hover/row:red')
  // hover pseudo is matched off the parent's `.t_group_row` class — wrapped in
  // @media (hover:hover) so touch devices don't sticky-trigger.
  expect(output?.styles).toContain('.t_group_row:hover')
  expect(output?.styles).toContain('@media (hover: hover)')
  expect(output?.styles).toContain('background-color')
})

test('group clauses on an animated element stay on the runtime path', async () => {
  // Q2 invariant: a static @container class can't drive a JS animation driver's
  // interpolation, so an animated element's group clause must not extract to CSS.
  // the shared compiler enforces this with an all-or-nothing animation bailout.
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test() {
      return (
        <View group="card">
          <View
            width={100}
            transition="bouncy"
            backgroundColor="group-hover/card:red"
          />
        </View>
      )
    }
  `
  )
  expect(output?.js).toContain('group-hover/card:red')
})

test('group clauses on an element with an enter clause stay on the runtime path', async () => {
  // Same Q2 invariant via an enter clause.
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
            opacity="enter:0"
            backgroundColor="group-hover/card:red"
          />
        </View>
      )
    }
  `
  )
  expect(output?.js).toContain('group-hover/card:red')
})

test('theme clauses extract to atomic CSS', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test() {
      return (
        <View
          width={100}
          backgroundColor="light:white dark:black"
        />
      )
    }
  `
  )

  // fully flattens to a div; styles emitted as theme-scoped rules.
  expect(output?.js).toContain('div')
  expect(output?.js).not.toContain('light:white dark:black')
  expect(output?.styles).toContain('background-color')
  expect(output?.styles).toContain('t_light')
  expect(output?.styles).toContain('t_dark')
})

test('web styles are flattened on web', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test() {
      return (
        <View
          width={100}
          backgroundColor="web:red"
        />
      )
    }
  `
  )

  // Web clauses flatten because the platform is known at compile time.
  // The component should be converted to a plain div with the styles applied
  expect(output?.js).toContain('div')
  expect(output?.js).not.toContain('web')
  expect(output?.styles).toContain('background-color')
})

test('web transition property is preserved', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test() {
      return (
        <View
          width={100}
          transition="web:clip-path 400ms ease, transform 400ms ease"
          clipPath="web:polygon(0 0, 100% 0, 100% 100%, 0 100%)"
        />
      )
    }
  `
  )

  // A transition inside a web clause is preserved as a CSS property.
  expect(output?.styles).toContain('transition')
  expect(output?.styles).toContain('clip-path')
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

// Verifies a conditional spread and hover clause work together.
test('conditional spread with a hover clause preserves ternary', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test({ isActive }) {
      return (
        <View
          backgroundColor="red hover:green"
          cursor="pointer"
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

// Verifies Text with a hover clause and conditional spread preserves the ternary.
test('Text with a hover clause and conditional spread preserves ternary', async () => {
  const output = await extractForWeb(
    `// debug
    import { Text } from '@tamagui/core'

    export function Test({ isActive }) {
      return (
        <Text
          cursor="pointer"
          color="hover:color12"
          {...(isActive && {
            color: 'color12',
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

test('a conditional color prop stays on the runtime component', async () => {
  const output = await extractForWeb(
    `
    import { Text } from '@tamagui/core'

    export function Test({ isActive, label }) {
      return (
        <Text
          color={isActive ? 'color' : 'color11'}
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

  expect(output?.styles).toBe('')
  expect(output?.js).toContain('isActive')
  expect(output?.js).toContain("color={isActive ? 'color' : 'color11'}")
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

// dynamic font props remain when a disjoint static font prop is extracted
test('ternary with mixed theme-token and non-token values retains dynamic props', async () => {
  const output = await extractForWeb(
    `
    import { Text } from '@tamagui/core'
    export function Test({ isActive, label }) {
      return (
        <Text
          fontSize="3"
          fontWeight={isActive ? '600' : '400'}
          color={isActive ? 'color12' : 'color11'}
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

  // the static font size is disjoint, while both expressions stay on the runtime component.
  expect(output?.styles).toContain('font-size:var(--f-size-3)')
  expect(output?.js).not.toContain('fontSize="3"')
  expect(output?.js).toContain("fontWeight={isActive ? '600' : '400'}")
  expect(output?.js).toContain("color={isActive ? 'color12' : 'color11'}")
  expect(output?.js).toMatchSnapshot()
  expect(output?.styles).toMatchSnapshot()
})

// CSS shorthand properties with embedded bare tokens.
test('boxShadow with a token extracts correctly', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test() {
      return <View boxShadow="0 0 10px background" />
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
test.skip('border with a token extracts correctly', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test() {
      return <View border="1px solid background" />
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

test('boxShadow with multiple tokens extracts correctly', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'

    export function Test() {
      return <View boxShadow="0 0 10px background, 0 0 20px color" />
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
