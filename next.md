before v2 final:

- // import '@tamagui/native/setup-safe-area'

- activeStyle / accept not taking shorthands
  - wait on Switch.Thumb is is oppsoite

- accept type not looking right?

---

can be after v2 final

<Popover.Content
onInteractOutside={close}
not working
and cant put another View next to Content and have it show

- its beta - motion has a ton of hacks, but also dont forget:
  const animateKey = JSON.stringify(style)

- /Users/n8/tamagui/code/core/web/src/helpers/defaultAnimationDriver.tsx
  - should just be native on native, css on web? use platfomr extensions

- split input/textinput into SizableTextInput / SizableInput or not?
  - otherwise its annoying af if you want your OWN size

- fullscreen prop deprecated, use `inset: 0, position: 'absolute'` instead

- Sheet scope prop (like Dialog/Popover/Tooltip have)

- @tamagui/web can just merge into core, .native paths are perfectly fine since we build separate so no need to serapte.

- reanimated on native - no transitino can still avoidReRenders just set duration: 0 timing, should be faster

- css driver can avoidReRenders
  - reanimated too but requires testing native + worklets

- Text weirdness fixes (explore)
  - remove suppressHighlighting / margin 0 default from Text
  - fix display: inline issue
  - see what react-strict-dom is doing
  - move it to <div><span> where div is flex, span is text only props
      <div {...nonTextStyleProps}>
        <span {...textStylePropsOnly} style={{ display: 'contents' }}>

        </span>

      </div>

- smaller bugfixes/things to check work:
  - ensure onlyAllowShorthands changes types properly
  - tooltip: expects zIndex but shorthand overrides and doesn't work
  - small bug, circular prop https://x.com/flexbox_/status/1907415294047379748
  - fix toggle / multiple https://github.com/tamagui/tamagui/pull/3362
  - seems <Switch checked defaultChecked> isnt showing in the checked position

- option for compiler to optimize $theme-, $platform-, $group- media values (currently bails from optimization)
  - useTheme().x.val may have bug on light/dark switch
  - react native 78 dialogs not working
    - https://discord.com/channels/909986013848412191/1354084025895227423/1354084025895227423

- could make option automaticlaly handle overshootClamping just by esimtating length of animations and converting to timing?

- enter/exit in media not overriding

- Checkbox disabled prop not disabling on native

- if Popover can not be portaled that would be useful for some use cases

- RadioGroup.Indicator can't use AnimatePresence i think because .styleable()
  - styleable shouldn't probably do anything with presence because the child should expect to handle that, at least need to double check taht

- bug: if you name a file `polyfill-native.ts` tamagui-build doesnt output the .native files properly

- When using <Adapt.Contents /> inside an Adapt when="maxMd" it seems to hide the children before fully closed
  - https://uniswapteam.slack.com/archives/C07AHFK2QRK/p1723409606028379

- When opening a fit Sheet while keyboard is active (at least on ios) the height of the sheet is off
  - https://uniswapteam.slack.com/archives/C07AHFK2QRK/p1723475036176189

- AnimatePresence leaving things in DOM
  - https://uniswapteam.slack.com/archives/C07AHFK2QRK/p1723148309745679

---

# v3 cleanups

- iconSize => absed on fontSize not sizeToken
  - needs to somehow work with pure css flattened text + media query tho
- var(--)
- may want to align flexShrink = 1 by default to align with web default?
- styleable shouldnt forwardRef, remove it in general
- remove inlineWhenUnflattened i think
- basically we need a style() helper because:
  - then we can pre-compile styles like text defaults, view default, text-nested default
  - then we can get rid of defaultProps
  - then get rid of expensive statiConfig.defaultProps merging every render
- always dynamic optimize no need for special "components"
- remove `usePropsAndStyle` from icon `themed` somehow / pattern for that
- remove getToken + shift weirdness in general
- react compiler on internals / concurrent friendly internals
- eject from floating-ui if possible (its huge)
- drop rnw support / setupReactNative.ts

---

- MCP works w your local tamagui config?

- perf: could avoid even creating style rules, easy / big win:
  - note that in addStyleToInsertRules it checks if shouldInsert
  - note that we create all the style rules before we actually check if should insert
  - refactor: not _super_ simple in that the check may need to happen inside getStylesAtomic for example and it also needs to check the startedUnhydrated, so just need to refactor a bit so we have a "shouldInsert" a the top of getSplitStyles properly set up, then we can maybe pass to getStylesAtomic and anywhere ebfore we actually create the rulestoinsert

- import `tamagui/styled` / `@tamagui/button/styled`
  - adds styles, sizing, unstyled prop
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

- checkbox disableActiveTheme not workign
- ssr fix i think select not showing value until after load?

animations improvements:

- make tamagui package work in some simple way
  - probably making tamagui + tamagui/ui both work is fine

- react-native-web-lite
  - tree shakeable, smaller, fixes things like data- attributes not passing
  - shares core style logic with tamagui for smaller bundles used together
  - outstanding bug? https://discord.com/channels/909986013848412191/1354817119233118288/1354839267771285546

- docs on reprop context on ios new arch

- in SheetImplCustom bad logic for pulling up when scroll view inside
  - if scrollview isn't able to scroll we shouldn't disable that behavior:
    `if (scrollEnabled.current && hasScrollView.current && isDraggingUp) {`
    - we can: pass in scrollable node selector
    - do logic to determine if its actually scrollable

- apply visibility hidden to fully hidden popover for perf gains

- refresh site hero:
  - 100% features work the same cross-platform
  - optionally compile-time optimized, but 100% runtime feature-set
  - 0-dependency: no / faster than react-native-web
  - fully typesafe styling
  - by far best SSR
  - headless component kit
  - super-powerful: themes, animations

- sync AnimatePresence with latest changes from framer-motion
  - BUT needs careful checking - the aniamted gallery thing for example is realyl fussy and i saw regressions before when i tried syncing it

---

- popover bring back dismissable - document dismissable etc

- escape on tamagui sheet doesn't close in general keyboard accessibility
  - check radix sheet and compare and improve

- announcement

- group props require the prop key to be stable like animations
  - saves 2 hooks in every component
  - in dev mode add a extra component around every component
    - make it so it automatically handles animation/group changes without breaking
    - but make it error in the console

- issue with letter spacing after upgrading
  - https://discord.com/channels/909986013848412191/974145843919716412/1356379335132446740
  - https://share.cleanshot.com/4rKTYFkl

v3:

- aim for fast follow
- remove component themes, instead theme="surface2" etc
- remove `name` from styled()
- remove inverse in favor of sub-themes that can inverse already ssr safe
- naming:
  - themes => variables, control any property
  - remove tokens in favor of variables

- RSD - no View + Text (just Element and we can extend it later)
  - compiler can optimize
  - mimic text inhertance on native (or remove it on web)
  - https://github.com/facebook/react-strict-dom/blob/429e2fe1cb9370c59378d9ba1f4a40676bef7555/packages/react-strict-dom/src/native/modules/createStrictDOMComponent.js#L529

- todo:
  - remove $true tokens and concept
  - createStyledContext should be react compiler friendly and avoid mutating Context, just have another separate hook or soemthing.
  - remove themeBuilder from plugins in favor of just using ENV to tree shake
  - remove all theme css scanning stuff to separate optional package
  - remove componentName, just allow setting default theme: ""
  - remove builders like themebuilder etc from config
    - do it via plugins automatically
  - inlineProps => `accept: 'number' | 'string' | value<type>()`
  - remove inlineProps, usedKeys, partial extraction

  - must pass in colors separately but it exports the defaults still
  - createSystemFont into package
  - remove component themes by default instead just do:
    - "surface1-3" and have components use that instead of name by default when not unstyled
  - theme inverse only works with sub-themes named \_inverse. createThemes.generateInverseSubThemes: boolean
    - v4 config can add a boolean to do this by default
    <!-- - button-next is mostly ready now to replace button:
    - remove old button, move new button into place, fix issues around the site/bento
    - docs update: we should show "headless" style and non-headless
      - <Button.Frame><Button.Icon></Button.Icon></Button.Frame> for headless
      - <Button> for non-headless -->
  - input-next
    - rather than wrapping react-native-web we implement our own
    - keep it simple, align to web props as much as possible
    <!-- - swap image-next => image -->
  - make sure webContainerType is "right" - probably not `normal` default (currently `inline-size`)
  - we should fix "tag" and have it so you can pass typed props to the tag
    - tag => as?
    - tag={['a', { href: '' }]}
  - we may need to move the web-only valid style props to a webOnly const and filter it out on native? how does that work currently...
  - see various `@deprecated` jsdocs
  - need to copy/paste all the component docs to 2.0.0.mdx
  - need to remove ThemeableStack docs from components mdx, they now are all extensiond YStack instead of ThemeableStack
  - see how much of accessibilityDirectMap we can remove for web
  - `$platform-` prefixes should go away in favor of just `$web`, `$native` etc
  - @tamagui/cli => tamagui
    - `tamagui build` document/announce
    - `tamagui lint` fix check and document/announce
  - tamagui => tamagui
    - note many are headless
  - Cleanup Select/ListItem
    - v2-3 ListItem simplification esp for performance of Select
    - fix Select hover/type/performance

potential

- group => container

is this a bug? the is_static conditional is odd, maybe backward

- if (shouldRetain || !(process.env.IS_STATIC === 'is_static')) {

---

v3

- perspective={1000} can be on either transform OR on flat, need to figure that out
- `core-nested`, `core-flat`, `core-tailwind`:

```tsx
createCore<CustomTypes>({
  propMapper(propsIn) {
    return propsOut
  },
})
```

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
- `<Theme values={{}} />` dynamic override

- reanimated animate presence is making me set `opacity: 1` type default values

- Sheet.overlay is memoized incorrectly props dont update it

- popover trigger should send an event to close tooltips automatically on open
  - closeTooltips() helper
  - tooltip prop `closeOnGlobalPress`

- looks like our upgrade to 1.114 added virtualkeyboardpolicy="manual" which broke the auto keyboard appearance on android web, working on a quick fix but wanted to flag

- nan issue: nan start or end NaN 22 bytes: 0-22 [ 'bytes: 0', '22' ]

- button media queries break due to useStyle hook
- algolia creds
- uniswap/tamagui fixes, see uniswap section
  - the platform-web type issues should be relatively easy
  - fix customization https://discord.com/channels/909986013848412191/1206456825583632384/1274853294195605525

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
- document Popover.Anchor (implemented, needs docs)
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
  },
})

const MyComponent = (props: { accentedStyle?: StackStyle }) => {
  return <Stack style={[accentedStyle]} />
}
```

---

# Backlog

- imperative methods for things - sheet, popover, etc, close etc

- Popover.Close inside Sheet

- merge font-size and get-font-sized packages

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
