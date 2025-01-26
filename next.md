v2

  - @tamagui/static and all the plugins => @tamagui/compiler package
  - animation => transition
  - remove themeBuilder from plugins in favor of just using ENV to tree shake
  - remove all theme css scanning stuff to separate optional package
  - remove componentName, just allow setting default theme: ""
  - remove builders like themebuilder etc from config
    - do it via plugins automatically
  - remove inlineProps, usedKeys, partial extraction

  - must pass in colors separately but it exports the defaults still
  - createSystemFont into package
  - v4 themes
    - based on studio, allows passing in custom colors
  - remove component themes by default instead just do:
    - "surface1-3" and have components use that instead of name by default when not unstyled
  - // TODO on inverse theme changes

- v3 - aim for fast follow

  - themes => variables, control any property
  - remove tokens in favor of themes
  - default box-sizing to border-box
  - remove component themes, instead theme="surface2" etc
  - remove `name` from styled() then too

is this a bug? the is_static conditional is odd, maybe backward
- if (shouldRetain || !(process.env.IS_STATIC === 'is_static')) {

- config v5

  - aligned setting to react native layout mode
  - tokens aligned to tailwind

- config v6

  - remove tokens in favor of themes having tokens

---

v3

generic function to allow new syntaxes, eg flat mode

```tsx
<Stack width={[100, 200]} />
<Stack width={{ web: 50, native: 200, group-sm: 200 }} />
<Stack width="web:100, group-med:10px" />?
```

  - removes all nested object style props instead you always use the value
 - `core-nested`, `core-flat`, `core-tailwind`:

```tsx
createCore<CustomTypes>({
  propMapper(propsIn) { return propsOut }
})
```

  - `background` prop + linear-gradient + background-image (see *Skeleton)
  - can we remove the need for separate Text/View?
      - seems like we could scan just the direct descendents?
      https://github.com/facebook/react-strict-dom/blob/429e2fe1cb9370c59378d9ba1f4a40676bef7555/packages/react-strict-dom/src/native/modules/createStrictDOMComponent.js#L529
  - light-dark()
    - this is an official css thing so would be easy-ish to implement
  - run over components and review for removing some assumptions about `size`
  - disableInjectCSS should maybe just be automated better or defaulted on
  - flat vs style mode, style moves all tamagui styles into `style` besides the other psuedos like hover, enter, etc
  - no react-native deps across the ui kit on web
  - html.div, styled('div'), styled(html.div)
  - zero runtime mode
    - all functional styles pre-generate the styles across the possible tokens (if :number it uses SizeTokens, probably have to disallow string and '...' types but could have a way to define the values at build-time)
  - `<Theme values={{}} />` dynamic override

- perf getState could be cached (weakmap themeManager + stringify props)

- isolatedDeclarations for build perf // TODO: turn on

- beef up tests:
  - native
  - native/web performance
  - nextjs (can add to code/next-site), esp light/dark/animations
  - $group $platform $theme styling

- reanimated animate presence is making me set `opacity: 1` type default values

- Sheet.overlay is memoized incorrectly props dont update it

- popover trigger should send an event to close tooltips automatically on open
  - closeTooltips() helper
  - tooltip prop `closeOnGlobalPress`

- we should add a docs page on testing tamagui:

jest-preset.js should add (for testing native):

testEnvironmentOptions: {
  customExportConditions: ['react-native'],
}

- looks like our upgrade to 1.114 added virtualkeyboardpolicy="manual" which broke the auto keyboard appearance on android web, working on a quick fix but wanted to flag

- deeply nested themeInverse needs a fix see kitchen sink squares
- nan issue: nan start or end NaN 22 bytes: 0-22 [ 'bytes: 0', '22' ]

- button media queries break due to useStyle hook
- algolia creds
- can skip a ton of CSS by disabling prefers color theme setting
  - so long as they use next-theme, or vxrn/color-scheme

- uniswap/tamagui fixes, see uniswap section
  - the platform-web type issues should be relatively easy
  - fix customization https://discord.com/channels/909986013848412191/1206456825583632384/1274853294195605525


uniswap:

- enter/exit in media not overriding

- Checkbox disabled prop not disabling on native

- if Popover can not be portaled that would be useful for some use cases

- RadioGroup.Indicator can't use AnimatePresence i think because .styleable()
  - styleable shouldn't probably do anything with presence because the child should expect to handle that, at least need to double check taht

- transform issue:

it looks like transform does not work - console is logging [moti]: Invalid transform value. Needs to be an array. but compiler errors on Types of property 'transform' are incompatible. Type '{ translateX: string; }[]' is not assignable to type 'Transform | undefined'.

https://linear.app/uniswap/issue/WEB-4733/tamagui-transform-needs-array-to-work-but-type-expects-string

- bug: if you name a file `polyfill-native.ts` tamagui-biuld doesnt output the .native files properly

- When using <Adapt.Contents />  inside an Adapt when="sm"  it seems to hide the children before fully closed
  - https://uniswapteam.slack.com/archives/C07AHFK2QRK/p1723409606028379

- When opening a fit Sheet while keyboard is active (at least on ios) the height of the sheet is off
  - https://uniswapteam.slack.com/archives/C07AHFK2QRK/p1723475036176189
  
- AnimatePresence leaving things in DOM
  - https://uniswapteam.slack.com/archives/C07AHFK2QRK/p1723148309745679



a way to set styles for children:

```tsx
// we could just use classnames?

import { Style } from '@tamagui/core'

const Text = styled(Text, {
  className: 'button-item',
})

const Icon = styled(Text, {
  className: 'button-item',
})

const Button = withStaticProperties(ButtonFrame, {
  Icon,
  Text
})

const example = (
  <Button gap="$4">
    {/* prefer not renaming so compiler can optimize: */}
    <Style selector=".button-item" color="$color10">
      {/* all of these 👇 get the styles from ^ */}
      <Button.Text /> 
      <Button.Text />
      <Button.Text />
      <Button.Icon $button-hover={{}} />
    </Style>
  </Button>
)
```

---

v4 and beyond

- flatMode - no nested objects, everything in flat props
- plugins

---

- Dialog => Sheet adapt performance
  - see // TODO this will re-parent, ideally we would not change tree structure

- SSR safe styled context, something like:

const Context = createStyledContext({
  isVertical: {
    $sm: true,
    $gtSm: false,
  },
})


- Select is using focusScope which React.Children.only erroring in most usages
  - we should try and redo FocusScope to not cloneElement at all and instead wrap with an element + display: contents

---

- Dialog.Portal and <Dialog modal /> redundant

- as long as you use the nextjs or other new color scheme helpers they always add t_dark/t_light on first render so as long as youre ok with dark mode not working for js-off users, you could turn default the tamagui/config v4 to shouldAddPrefersColorThemes: false

- lower priority uniswap:
  - seems <Switch checked defaultChecked> isnt showing in the checked position
  - <Theme name="dark"> with switch, the thumb is not picking up the right surface color, must be a multiple-nested theme issue

- small win: `useTheme()` could take a theme name to use a diff theme than the current one

- bug in useMedia + compiler
  - https://app.graphite.dev/github/pr/Uniswap/universe/10626/fix-web-toast-alignment

/theme

- randomize button for palettes
- OG image of theme card (use the tree one we used for the list of themes in studio)
- save
- use on bento

- AnimatePresence refactor:
  - https://x.com/mattgperry/status/1816842995758498017?s=46&t=5wFlU_OsfjJ0sQPMFbtG0A

- className merging in variants!
  - `positionSticky: { true: { className: 'position-sticky' } }`
- opacity `/50`
- AnimateList
  - like AnimatePresence but for >1 items
  - AnimatePresence keepMounted={} prop?
  - can handle direction + let you control mount behavior

- remove scroll not working when Dialog adapted to Sheet on mobile
  - we may want Sheet to have its own removeScroll in this case

- AnimatePresence should just work if you change the enterStyle exitStyle dynamically in the render, no need for custom we can capture the props

- popover transform origin
  - https://codesandbox.io/p/sandbox/floating-ui-react-scale-transform-origin-qv0t1c?file=%2Fsrc%2FApp.tsx%3A43%2C25
- Setting default props for any style in a parent (variables dynamic / themes dynamic down the tree)

- Popover click outside prop

- data-disable-theme is being passed down on web snapshots
- activeTheme props for all components
- in dev mode if no checkbox indicator, warn
  - checkbox should have a default indicator probably with a simple svg check we inline
- move from useMedia match.addListener to addEventListener
- media query height taking into account the "safe height" is important
- https://linear.app/uniswap/issue/EXT-925/tamagui-error-breaking-the-extension
- document Popover.Anchor
- Sometimes press getting stuck still on uniswap moonpay flow
- Text vertical align issue: https://github.com/Uniswap/universe/pull/6730

- Popper arrow logic is bad, needs unstyled support and not to do weird shifting of sizes

- No need for View + Text (just Element and we can extend it later)

  - We'd need to mimic text inhertance on native (or remove it on web)
  - https://github.com/facebook/react-strict-dom/blob/429e2fe1cb9370c59378d9ba1f4a40676bef7555/packages/react-strict-dom/src/native/modules/createStrictDOMComponent.js#L529

- <Theme name="dark"> force below root dark causing hydration issues

- Animation + shadowOffset is causing crash in iOS due to object value

  - "auto" too

- Adapt needs public API to support any adaptation

- Select Virtualization

- settings page in takeout SSR hydration issue due to useThemeSetting

- animatedStyle showing up in animated component snapshot on native

  - add some native snapshots in ci tests

- addTheme updateTheme regression needs a test

- type to search on Select regressed

- // TODO: pulling past the limit breaks scroll on native, need to better make ScrollView

- icons move from themed() to just styled()

- native theme change warning logs + theme change speed

- document popover hoverable + onOpenChange second arg via

- add $mouse to takeout

- compiler - no need to setup any separate package

- Remove the need for Text

- popovers work with no js

- Select `ListItemFrame` area is messy/slow due to inline styles and complex components
- propMode

- make styled() only not accept most non-style props

- Scale / ScaleSelect
  should be a Menu with mini visualizations of the lum/sat scales for each

- gradient style
- "var" mode where it changes types of $ to var(--)
- calc?

- get takeout users studio access

- studio color scales first class:

  - adding a color/scale really adds a theme
  - but also adds $colorName1 => $colorNameX to base theme

- check usePropsAndStyle with group props

- alt themes don't change color1-9 so you can't do color2 and then make the alt theme make it more subtle, but they should

- disableClassName breaking css animation
- css animateOnly should always force style tag styles

- 2.0 make it just is the current state with fixes, unstyled across everything, and make various smaller breaking changes in api surfaces that need cleanup

  - recommended config with more strict settings etc
  - a few theme setups you can choose from

- Takeout theme change needs a server restart / theme builder not re-building on changing colors.ts
- Theme reset Button not changing
- ZStack is abs positioning children...

---

Web:

- createTamagui({ settings: { webMode: true } })
- avoids console warning on Text
- `@tamagui/style` separate from core
- instead of validStyleProps use validNONStyleProps
  - that way for web all style props pass through automatically
  - also likely smaller bundle size (smart detect `onX`)
- have a CSS mode
- styled('div')
- avoid flat style props + plugin for styled() control
- beforeStyles + afterStyles array

---

`style`

- enables Input taking { autofillSelectedStyle: Style }, or any component accepting a style object as a prop

```tsx
import { Stack, style } from '@tamagui/core'

// make it so style props accepts either a regular style object
// or something like this (can be exported from core):

type StackStyle = {
  base: ViewStyle
  press?: ViewStyle
  hover?: ViewStyle
  focus?: ViewStyle
}

const mySubStyle: StackStyle = style({
  backgroundColor: 'red', // optimizes on web to _bg-red

  pressStyle: {
    backgroundColor: 'blue', // optimizes on web to _press-bg-blue
  }
})

const MyComponent = (props: { accentedStyle?: StackStyle }) => {
  return (
    <Stack style={[accentedStyle]} />
  )
}


```

config: {
  styleStrategy: { type: 'prop', prop: 'sx', acceptFlatStyles: true }
}

---

Smaller features:

- no-rerender psuedo styles on native when using reanimated driver (fernando PR)
- imperative methods for many things - sheet, popover, etc, close etc
- ssr safe themeInverse would be pretty nice
- styled(ExternalComponent) should always allow Partial props
  - but if you do provide the props ideally it should 'know' they are pre-filled and therefore not required anymore
  - also it should make sure to make those props required if they aren't set in styled()
- avoid css extract on server mode next.js?

---

Performance:

- TAMAGUI_OPTIMIZE_NATIVE_VIEWS on by default using proper prop mapping
- compiler can add `disableEvents` `disableTheme` to avoid hooks
- optimization of useTheme/getSplitStyles seems like it has some decent stuff
- could lazy expand styles
- get dynamicEval working automatically
- warn on styled(Pressable) and styled(TouchableOpacity)

---

CLI:

- `tama upgrade` - official tamagui upgrade that works across bundlers
- `tamagui [clone|eject] Sheet ./packages/sheet`
  - clones the sheet package into your repo somewhere

---

Components:

- Native

  - Select
    - iOS Select as well as the newer SwiftUI menu style Picker
  - Sheet native android - https://github.com/intergalacticspacehighway/react-native-android-bottomsheet

- Menu
- DatePicker

---

# Backlog

- Popover.Close inside Sheet

- merge font-size and get-font-sized packages

- cli needs a start update command just runs diff against your `~/.tamagui/tamagui`

- sheet native iOS snapPoints

  - pre release 2.0 version of library
  - https://github.com/dominicstop/react-native-ios-modal/blob/wip/example/src/examples/Test09.tsx

- CI not failing on type errors in code/tamagui.dev
  a package.json etc etc + zip file

- @alt Sheet inside Popover breaks css animation:

  - https://tamagui.dev/docs/components/popover

- Studio: drag and drop a font and you can configure the subset

  - automatically converts to the right output formats
  - auto generates CSS
  - bundles it into

- <Sheet native />
  - https://github.com/dominicstop/react-native-ios-modal
  - we'd want expo module + snap points

- <ActionSheet />
- plus `native` prop https://reactnative.dev/docs/actionsheetios

- add test that builds site for prod + checks for header text / no errors

- Switch unstyled - make it so it doesn't do any theme stuff

- font weights in css are generating extra variables with "undefined" value if not filled in
- add defaultSize and defaultFontFamily to createTamagui

  - all instances of $true can become getConfig().defaultSize
  - remove the validation in createTamagui that enforces the keys

- bug: inputs rendering twice due to focusableInputHOC, if you remove that it doesn't, this is due to styled() + how it determines ComponentIn and grabs the component

- getVariableValue(props.fontFamily) doesn't look right

- prebuild option
  - de-dupes css
  - fixes next.js next load css
  - simplifies initial setup and need for plugins
- site snack + demo embed on all pages floating that scales up on hover on large screengrid or augment
- pass Size down context (see Group) is this just Themes but for individual props (css variable direct support <Theme set={{ size: '$4' }}> ?)?
- kitchen sink snack on site
- @tamagui/tailwind
- pass Size down context (see Group) but really this is just Themes but for individual props (css variable direct support <Theme set={{ size: '$4' }}> ?)
- <ActionSheet />
- check deps are matching in compiler startup
- can optimize useMedia / many hooks:
  - https://twitter.com/sebmarkbage/status/1576603375814070273
- dual direction scrollview shouldn't need two nested see CodeDemoPreParsed
- container queries
- `variantsOnly: true` on styled(), removes types for anything but variants (and className/theme etc)
- way to use tamagui with custom design system tokens
  - basically map any tokens you choose to internal tamagui ones
- input like button
- allow string values alongside numbers (nativebase port)
- media `$light` and `$dark` for overrides
- built in jsx => css converter
- `tag` => `as` (keep fallback around as deprecated)
  - `as={['a', { ...props }]}`
- breaking change notifier cli
- VSCode => "turn JSX into styled()"
- pass in SharedValue to any prop for animations
- try using react-native-web $css object support for classnames
- animation accept useAnimatedStyle
- Switch gesture
- <Icon />
  - use theme values and size values
  - can swap for other icon packs (use createTamagui({ icons }))
- <Text fontSize="parent" />
- <UL /> <LI /> <OL />
- hoverStyle={{ [XStack]: {} }}
- <List.Section /> see (https://developer.apple.com/documentation/swiftui/list Section)
- <GradientText /> can work native with
  - https://github.com/react-native-masked-view/masked-view
- beforeStyle, afterStyle could work ...
  - only if we can do with pseudos:
    - focusStyle={{ after: { fullscreen: true, border... } }}
    - allows for proper focused borders that don't require super hacks
    - see Switch
  - radio may be List.Radio just combines List, Label, Drawer
    - can use Switch or check or custom
- skeleton just using Theme / variables

*Skeleton

```tsx
const Skeleton = styled(Stack, {
  animation: {
    name: 'quick',
    loop: true
  },
  enterStyle: {
    x: '100%',
  },
  exitStyle: {
    x: '-100%',
  },
  background: `linear-gradient(to left, $background, $color, $background)`,
})
```
