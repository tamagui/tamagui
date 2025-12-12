- option for compiler to optimize $theme-, $platform-, $group- media values (currently bails from optimization)
- v2 useTheme({ name: '' }) should remove since .get() doesnt match
- release v5 config now

- v2 - whitelist more web-only events like onKeyDown in types
  - react 19 only (can move some stuff to conditional use())

- react-native-web-lite fixes things like data- attributes not passing down etc

via chat

```
Time jsx-element-flattened: 2ms
  style: mt = "$3"
  style: mx = -6
  style: x = 3
  style: flexWrap = "wrap"
  style: columnGap = "calc(20% - 38px)"
Recoverable error extracting attribute Cannot destructure property 'shadowOffset' of 'style' as it is undefined. TypeError: Cannot destructure property 'shadowOffset' of 'style' as it is undefined.
    at styleToCSS (/Users/n8/chat/node_modules/@tamagui/web/dist/cjs/helpers/getCSSStylesAtomic.cjs:78:5)
    at getCSSStylesAtomic (/Users/n8/chat/node_modules/@tamagui/web/dist/cjs/helpers/getCSSStylesAtomic.cjs:37:3)
    at Object.createDOMProps (/Users/n8/chat/node_modules/@tamagui/react-native-web-internals/dist/cjs/modules/createDOMProps/index.cjs:143:60)
    at evaluateAttribute (/Users/n8/chat/node_modules/@tamagui/static/dist/extractor/createExtractor.js:510:76)
    at /Users/n8/chat/node_modules/@tamagui/static/dist/extractor/createExtractor.js:757:30
    at Array.flatMap (<anonymous>)
    at JSXElement (/Users/n8/chat/node_modules/@tamagui/static/dist/extractor/createExtractor.js:754:76)
    at NodePath._call (/Users/n8/chat/node_modules/@babel/traverse/lib/path/context.js:49:20)
    at NodePath.call (/Users/n8/chat/node_modules/@babel/traverse/lib/path/context.js:39:18)
    at NodePath.visit (/Users/n8/chat/node_modules/@babel/traverse/lib/path/context.js:88:31)
```

- docs on reprop context on ios new arch

- popover bring back dismissable - document dismissable etc
- in SheetImplCustom bad logic for pulling up when scroll view inside
  - if scrollview isn't able to scroll we shouldn't disable that behavior:
    `if (scrollEnabled.current && hasScrollView.current && isDraggingUp) {`
    - we can: pass in scrollable node selector
    - do logic to determine if its actually scrollable

- Dialog.Overlay shouldn't need to define key for animation
- apply visibility hidden to fully hidden popover for perf gains
- css driver can noRerender
- reanimated too but requires testing native + worklets

v2:

- remove webpack plugin

- removeScrollEnabled => disableRemoveScroll

- move to types react/react-dom 19

- removing default size based styling, look at this in tooltip!:
```
const padding = !props.unstyled
        ? (props.padding ??
          props.size ??
          popperSize ??
          getSize('$true', {
            shift: -2,
          }))
        : undefined
```

---

- escape on tamagui sheet doesn't close in general keyboard accessibility
  - check radix sheet and compare and improve

- perf: could avoid even creating style rules, easy / big win:
  - note that in addStyleToInsertRules it checks if shouldInsert
  - note that we create all the style rules before we actually check if should insert
  - refactor: not *super* simple in that the check may need to happen inside getStylesAtomic for example and it also needs to check the startedUnhydrated, so just need to refactor a bit so we have a "shouldInsert" a the top of getSplitStyles properly set up, then we can maybe pass to getStylesAtomic and anywhere ebfore we actually create the rulestoinsert

- perf: could avoid parent re-renders on group changes even if dynamic
  - if they dont themselves have animation, would need to group.emit() in the actual press events not based on an effect based on state

for v2, new site hero that captures:

- 100% features work the same cross-platform
- optionally compile-time optimized, but 100% runtime feature-set
- 0-dependency: no / faster than react-native-web
- fully typesafe styling
- by far best SSR
- headless component kit
- super-powerful: themes, animations

v2 big win / lowish effort:

- two fixes for animation drivers
  - remove <Configuration animationDriver (breaks compiler)
    - instead `animationDriver` prop on any component
  - accept multiple animationDrivers at root for proper types

- document <ClientOnly />

# force railway deploy

- in onejs/chat bug with transforms merging media queries: 
  - see // TODO bug x should overwrite not be cumulative

- css animation driver enter animations not working it seems, i used to have
  a fix for this where setState({ unmounted: true }) inside createComponent had a setTimeout() wrapped around it, but then removed it when i tested and found it didnt need it anymore, but seems it does need it again? or some other better fix ideally.

- small bug, circular prop https://x.com/flexbox_/status/1907415294047379748

- react native 78 dialogs not working
  - https://discord.com/channels/909986013848412191/1354084025895227423/1354084025895227423

- tamagui.dev the right side quick nav on docs isnt updating on page nav
  - lets redo it like how onestack.dev does it, so its actually rendered server side not just client side, that will improve it as well

- we need to actually in validStyleProps probably have the web-only ones be on a new object like "webOnly" and then actually filtered out on native so they dont clutter things.

- fix react 19 + nextjs 15
  - https://github.com/gcoakleyjr/React19-Tamagui
  - react-native-web-lite or patch rnw because it doesn't work, we should:
    - somehow fix rnw issue with rn19
    - fix issue with rnw-lite
      - https://discord.com/channels/909986013848412191/1354817119233118288/1354839267771285546
  - eventually we should avoid RNW altogether - part of v2 work is that, need to remove it from Input + Image + Spinner
  - announcement

- option to default to position "static"

- i think a big current bug is onlyAllowShorthands can be set on settings or on base, but if its set on base it breaks types entirely.

- tooltip: expects zIndex but shorthand overrides and doesn't work

- make group props require the prop key to be stable like animations
  - saves 2 hooks in every component
  - in dev mode add a extra component around every component
    - make it so it automatically handles animation/group changes without breaking
    - but make it error in the console

- useTheme().x.val may have bug on light/dark switch

bug:

- https://github.com/tamagui/tamagui/issues/3322

As an example, we have a Button that has a variant, default.
its pressStyle is
pressStyle: {
  backgroundColor: '$accent3Hovered',
},
1:48
however, doing this
<Button
  variant="default"
  {...props}
  pressStyle={{
    backgroundColor: 'red',
  }}
>
does not give the Button a red background when pressed

- issue with letter spacing after upgrading
  - https://discord.com/channels/909986013848412191/974145843919716412/1356379335132446740
  - https://share.cleanshot.com/4rKTYFkl

v2

blog post:

- during v2:
  - headless versions of every component
  - native versions of every components
  - border, background, boxShadow props with web style , separation
  - var(--) style tokens

- talk about v3:
  - aim for fast follow
  - if not in 2, animation => transition
  - default box-sizing to border-box
  - default position: static
  - remove component themes, instead theme="surface2" etc
  - remove `name` from styled()
  - remove inverse in favor of sub-themes that can inverse already ssr safe
  - naming:
    - themes => variables, control any property
    - remove tokens in favor of variables
  
  - RSD style - no View + Text (just Element and we can extend it later)
    - compiler can optimize
    - mimic text inhertance on native (or remove it on web)
    - https://github.com/facebook/react-strict-dom/blob/429e2fe1cb9370c59378d9ba1f4a40676bef7555/packages/react-strict-dom/src/native/modules/createStrictDOMComponent.js#L529


- todo:
  - remove $true tokens and concept
  - default position relative => position static with ENV to revert
  - onMouseMove, onDoubleClick and other web props
  - createStyledContext should be react compiler friendly and avoid mutating Context, just have another separate hook or soemthing.
  - animation => transition
  - remove themeBuilder from plugins in favor of just using ENV to tree shake
  - remove all theme css scanning stuff to separate optional package
  - remove componentName, just allow setting default theme: ""
  - remove builders like themebuilder etc from config
    - do it via plugins automatically
  - remove inlineProps, usedKeys, partial extraction

  - must pass in colors separately but it exports the defaults still
  - createSystemFont into package
  - remove component themes by default instead just do:
    - "surface1-3" and have components use that instead of name by default when not unstyled
  - // TODO on inverse theme changes

is this a bug? the is_static conditional is odd, maybe backward
- if (shouldRetain || !(process.env.IS_STATIC === 'is_static')) {

- config v5

  - aligned setting to react native layout mode
  - tokens aligned to tailwind

---

v3

- perspective={1000} can be on either transform OR on flat, need to figure that out
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

- can skip a ton of CSS by disabling prefers color theme setting
  - so long as they use next-theme, or vxrn/color-scheme

uniswap:

- enter/exit in media not overriding

- Checkbox disabled prop not disabling on native

- if Popover can not be portaled that would be useful for some use cases

- RadioGroup.Indicator can't use AnimatePresence i think because .styleable()
  - styleable shouldn't probably do anything with presence because the child should expect to handle that, at least need to double check taht

- bug: if you name a file `polyfill-native.ts` tamagui-biuld doesnt output the .native files properly

- When using <Adapt.Contents />  inside an Adapt when="maxMd"  it seems to hide the children before fully closed
  - https://uniswapteam.slack.com/archives/C07AHFK2QRK/p1723409606028379

- When opening a fit Sheet while keyboard is active (at least on ios) the height of the sheet is off
  - https://uniswapteam.slack.com/archives/C07AHFK2QRK/p1723475036176189
  
- AnimatePresence leaving things in DOM
  - https://uniswapteam.slack.com/archives/C07AHFK2QRK/p1723148309745679

---

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

- Adapt needs public API to support any adaptation

- Select Virtualization

- settings page in takeout SSR hydration issue due to useThemeSetting

- animatedStyle showing up in animated component snapshot on native

  - add some native snapshots in ci tests

- addTheme updateTheme regression needs a test

- type to search on Select regressed

- // TODO: pulling past the limit breaks scroll on native, need to better make ScrollView

- native theme change warning logs + theme change speed

- document popover hoverable + onOpenChange second arg via

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

# Backlog

- Popover.Close inside Sheet

- merge font-size and get-font-sized packages

- cli needs a start update command just runs diff against your `~/.tamagui/tamagui`

- <Sheet native />
  - https://github.com/dominicstop/react-native-ios-modal
  - we'd want expo module + snap points

- <ActionSheet />
- plus `native` prop https://reactnative.dev/docs/actionsheetios

- add test that builds site for prod + checks for header text / no errors

- Switch unstyled - make it so it doesn't do any theme stuff

- font weights in css are generating extra variables with "undefined" value if not filled in
- add defaultSize and defaultFontFamily to createTamagui

- @tamagui/tailwind
- pass Size down context (see Group) but really this is just Themes but for individual props (css variable direct support <Theme set={{ size: '$4' }}> ?)
- `tag` => `as` (keep fallback around as deprecated)
  - `as={['a', { ...props }]}`
- VSCode => "turn JSX into styled()"
- Switch gesture
- beforeStyle, afterStyle could work ...
  - only if we can do with pseudos:
    - focusStyle={{ after: { fullscreen: true, border... } }}
    - allows for proper focused borders that don't require super hacks
    - see Switch
  - radio may be List.Radio just combines List, Label, Drawer
    - can use Switch or check or custom
