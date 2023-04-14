- XGroup + borderRadius doesn't set radius (see studio/header)

- yarn release --canary

- Popover trigger="hover"

- automate adding sponsor label on discord when sponsored
  - if possible we can automate adding a private chat room if they fill our something on their account

- arrow on popover doesnt render border color

- Switch unstyled - make it so it doesn't do any theme stuff

- font-family is being output to DOM on text element
- font weights in css are generating extra variables with "undefined" value if not filled in
- add defaultSize and defaultFontFamily to createTamagui
  - all instances of $true can become getConfig().defaultSize
  - all instances of $body can become getConfig().defaultFontFamily
  - remove the validation in createTamagui that enforces the keys

- <Select /> light mode the hover style is barely visible
  - todo in themes branch
  - it should have pure white bg

- relative sizing first class (and relative color)
  - add `defaultSize`, and `defaultColor`
  - add `relative()` helpers

- missing docs on useToastController().options

- bug android 
  - I've been working on integrating our component library to mobile and ran into a snag with the android build. IOS builds seamlessly and Android throws this error when trying to use Select component:
  - https://discord.com/channels/909986013848412191/1072289484755976312/1093994167601999912

- bug: android styling is different, repro:
  - https://github.com/lostpebble/tamagui-setup-project


- bug: inputs rendering twice due to focusableInputHOC, if you remove that it doesnt, this is due to styled() + how it determines ComponentIn and grabs the component


- document `unstyled` prop for components

- `defaultUnstyled` option in createTamagui

- docs for `@tamagui/font` and `@tamagui/theme`

- https://github.com/tamagui/tamagui/pull/765 

- getVariableValue(props.fontFamily) doesn't look right

- slider track - light theme blends in with bg i think

- createInterFont the default weight/letterSpacing should use `true` rather than `4` key (small change just need to test make sure it doens't break)

- lets make forms use outline for 2px borders on focusStyle
  - on native it can just get a darker border but stay 1px

- force fix version
- move to use-roving-index
- cli
  - `tamagui doctor` command to check for version mismatch

support new RN props:
https://reactnative.dev/blog/2023/01/12/version-071#web-inspired-props-for-accessibility-styles-and-events

Ali:

- [ ] moti driver
- [ ] Studio
  - [x] Bring back next saas stuff
  - [x] Sponsor => Github auth Account
  - [x] Web Filesystemapi to access to folder
  - [ ] Host on vercel
  - [ ] plugins automatically watch and build
    - [ ] babel-plugin, webpack-loader, vite all share @tamagui/static
      - [ ] @tamagui/static just needs to add a call to the watch that studio.ts uses
    - [ ] if weird or hard:
      - [ ] `tama studio` comment out and instead
        - [ ] `tama studio --serve` add flag and hide vite stuff behind there
        - [ ] `tama studio` just builds once
        - [ ] `tama studio --watch` watches
- [ ] skipProps on getSplitStyle working with width={} but not styled()'s width:
- [ ] https://discord.com/channels/909986013848412191/1095303038786342983/1095303038786342983
- [x] https://github.com/chakra-ui/chakra-ui/issues/183#issuecomment-1503061828
- [ ] document keyboard avoiding view in `Sheet.mdx`
- [ ] input bug 
  - [ ] https://discord.com/channels/909986013848412191/1091749199378387065/1091909256023904377
- [x] Toasts starter
- [x] Studio get running
- [x] RadioGroup needs a press style color for the indicator
- [ ] @tamagui/change-animation-driver document
- [x] Switch for animation driver on website doesn't animate
  - [x] lets keep it as a spring
- [ ] Disable warning ENV + configuration.md docs
- [x] lets make forms use outline for 2px borders on focusStyle
  - [x] on native it can stay 1px
  - [ ] (nate) make focusStyle border darker
- [ ] WARN  Sending onAnimatedValueUpdate with no listeners registered
- [x] `<YStack space="$3" $gtSm={{ space: '$6'}}>` not working again (likely fixed)
- [ ] bezier on css animations
- [x] tabs 
  - [x] advanced demo is weird it has a bg and a separator
  - [x] prevSelectionIndicatorLayout should be state not ref to avoid concurrency issues
  - [ ] disablePassBorderRadius feels like a weird thing to need by default
    - change Group's disablePassBorderRadius to something else - perhaps the negation, passBorderRadius? i'm not sure. what do you think about this @natew 
    alternatively we could have disablePassBorderRadius default to true only on Tabs.List. but then overriding it would feel awkward (having to pass disablePassBorderRadius={false})
  - [x] IntentIndicator lowercase
    - [x] maybe make all state go into one useState({ intentAt, activeAt, tab })
  - [x] Trigger => Tab (deprecate)
  - [x] TabsTriggerFrame variant theme Button is weird does that do anythig?
- [ ] lets make Card.extractable into Card.stylable() and deprecate it
  - [ ] and document on styled() page
- native component modes
  - [ ] `RadioGroup`, `Select` native (web)
  - [ ] `Switch` native (mobile)
- [x] unstyled for 
  - [x] Select (was already done)
  - [x] Tabs
  - [x] Card (was already done)
- [x] go through the docs and remove shorthands - use full forms
- [x] go through the docs and change usage imports to tamagui instead of other packages (e.g. @tamagui/stack -> tamagui)

---

Nate:

- refactor getSplitStyles to share getSubStyle / logic with main style logic

- [x] check if bug:
  - one shouldn't work `<YStack onPress><Pressable onPress /></YStack>` - ali: I confirm this works
  - should work `<YStack><Pressable onPress /></YStack>` - ali: I confirm this works
  - result: Pressable is not supported on web since we don't implement usePressability and Pressability - moving it to your section
---

- site polish: 
  - make the text selection match the theme
  - make the link underline match the theme

- website toggle for css/spring doesn't animate? we can keep it outside of the provider ideally so its always spring


- in card : `if (isTamaguiElement(child) && !child.props.size) {` lets convert to context?
  - can we come up with a nicer pattern to avoid having to rewrite from styled() to component here? like some sort of standard way to provide context between components?... thinking out loud:
    - we could have a generic ComponentContext internally in createComponent
    - we can export a createVariantContext()
    - `const CardVariants = createVariantContext<{ size: number }>()`
    - then in Card or any parent you can do `<CardVariants size={} />`
    - finally, in `styled({ variantContext: CardVariants })`

    <CardVariants.Provider size="$10">
      <Card />
    </CardVariants.Provider>

    .for_Card.size_10 .is_Card { ... }

    <Variants skeleton>
      <Card />
    </Variants>

    variants: {
      skeleton: {
        true: {
          beforeStyle: [
            {
              background: 'grey',
            }
          ]
        }
      }
    }

- themes: outlined, contrast


- light/dark theme buttons bad colors (contrast + pressStyle borders)

- slider track - light theme blends in with bg i think

- add JSDoc help with links to docs for components
  - also can we somehow make intellisense sort the props in a way we want by default? itd be ncie to have style props after the others

- add codesandbox for most components

- https://github.com/tamagui/tamagui/issues/568
- instead of proxying we could just merge all themes on creation with their parents?

- Card has a good use case for size being passed through context/css vars
- linear-gradient next.js issue

-  I'm currently using the Selector on Native, and the animation for pulling up the modal is kind of lagging and I get spammed this error when it happens.

- add Themes page in docs under Theme, change Theme => Design System
- move packages to have unstyled
- move packages from /core to /web
- // TODO move into getSplitStyles inital `if (process.env.TAMAGUI_TARGET === 'web')` block

----

- check why styled() of a HOC is failing:

- Separator orientation="vertical" deprecate boolean `vertical`

const SheetOverlay = styled(Sheet.Overlay, {
  backgroundColor: '$bgoverlay',
})

- sheet background animation regression
- https://github.com/tamagui/tamagui/issues/478
- default light mode theme + not changing
- hoverTheme={false} works, make hoverStyle={false} to unset
- test keyboardavoidingview > scrollView - collapsing tamagui
- check into shadow/elevation not showing
- survey https://tripetto.app or gforms

- unset: useful for unstyled to usnet the defaultVariatn size

---

1.X

- // TODO could be native-only
- Select id="" + Label focus
- web forms events bubble
- theme shouldn't change context ever on web, redo notify()
  - instead of passing ThemeManager in context just pass a UID
    - useChangeTheme can then do listen(UID)
- vertical slider native can be janky
- react native action sheet hooks/logic adapt
- testing native - https://maestro.mobile.dev
- app dir support experimental
- styled('div')
- tooltip auto pass down accessibilityLabel
- accessibility keyboard navigation (Menu component potentially)
- createTamagui({ webOnly: true }) - avoids console warning on Text
  - goes hand in hand with `@tamagui/style` separate from core
- test: useMedia, reanimated, re-renders (mount, on hover, etc), render time ms
- CD on github
- home page sponsors with sizing and better logos
  - https://github.com/JamesIves/github-sponsors-readme-action
- algolia not indexing some new content
- keyboard search select bug
- variants intellisense autocomplete not suggesting, but types are right
- canary release channel
- improve native integration test
- kitchen-sink in Snack demo link
- `tamagui` cli basic version
- VisuallyHidden + mediaquery + space
- re-render tests:
  - useMedia, component w/ media + style, media + css-style, media + space
  - useTheme, component with theme used in style

- createThemes accepts array not object
- <Theme name="dark_orange" /> type 
- site _app has t_unmounted helper, move that into tamagui proper
- SimpleTooltip no sub theme looks bad on dark mode

---

2.0

- replace all RN stuff left in tamagui: Image, Input, Spinner, etc
- Accessibility + RTL
- tag="a" should get the typed props of a link
- much better non-monorepo non-expo general setup experience
- app dir support (discussions/409)
- contrastColor (accent color) in themes (discussions/449)
- all: unset

---

inbox

- remove defaultVariants in favor of just defaultProps

- // TODO move to validStyleProps to merge
- bundle size reductions:
  - merge mergeSlotProps and mergeProps
  - move to PROP whitelist rather than style whitelist maybe avoid validStyleProps altogether
  - getStylesAtomic "all webkit prefixed rules, pointer-events"
  - color names hardcoded potentially
  - // ??
  - styled(), extendStaticConfig can just merge options rather than de-structure re-structure
  - remove mergeConfigDefaultProps
  - ThemeManager move to functional not class
  - may be able to remove proxyThemeVariables
  - getVariantExtras looks easy to slim
  - reverseMapClassNameToValue / unitlessNumbers
  - normalizeColor etc
  - createPropMapper

- react native pressable in pressable
- https://github.com/mwood23/nx-tamagui-next-repro
- https://github.com/necolas/react-native-web/pull/2195/files
- https://github.com/tamagui/tamagui/issues/513
- @twaiter Has anyone used a dialog component on mobile? I havent been able to get Dialog.Closed to work (using a button). Seems like the example on the website doesnt work for mobile either (button not there)

- docs search build inline
  - add shorthands to docs
  - make search a nice demo

- tama sync
  - make it easy to have a template repo that people sync to
  - includes the git sync stuff from cli now
  - copies/diffs/merges every file there just based on heuristics
  - somehow choose "merge/overwrite/diff"
  - smart defaults
    - package.json etc
    - binary assets overwrite (if not changed, else prompt)
- setup script can power `tama sync` to sync the repo to its parent repo

- dynamic eval bundle of smallish fixes: 
  - hash file contents cache
  - dont write it as a file, use node vm
  - just use a few find and replace type things for forcing exports, fail if not possible

- site web fonts (can also be a feature of font bundles)
  - https://www.lydiahallie.io/blog/optimizing-webfonts-in-nextjs-13
  - https://simonhearne.com/2021/layout-shifts-webfonts/#reduce-layout-shift-with-f-mods

- drag on switch
- prebuild option
  - de-dupes css
  - fixes next.js next load css
  - simplifies initial setup and need for plugins
- site snack + demo embed on all pages floating that scales up on hover on large screen
- maybe regression in closing popover
- export popover and others internal handles for imperative use
- grid on homepage linking to various nice components maybe replace features grid or augment
- instead of validStyleProps use validNONStyleProps
    - that way for web all style props pass through automatically
    - also likely smaller bundle size (smart detect `onX`)
- lighthouse score ci
- move much logic from withTamgui into TamaguiPlugin
- TestFontTokensInVariants types not autocompleting in variants... but showing properly on hover/type property
- pass Size down context (see Group) is this just Themes but for individual props (css variable direct support <Theme set={{ size: '$4' }}> ?)?
- kitchen sink snack on site
- what works for compilation / examples
- @tamagui/sx
- @tamagui/tailwind
- pass Size down context (see Group) but really this is just Themes but for individual props (css variable direct support <Theme set={{ size: '$4' }}> ?)
- native props on more components
- space => gap
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
- loadFont, loadAnimations
- <Debug><...><Debug/> turns on debugging for all in tree and shows them nested
- <Icon />
  - use theme values and size values
  - can swap for other icon packs (use createTamagui({ icons }))
- <Toast />
- <Toggle><Group><Toggle.Item><Item /></Toggle.Item></Group></Toggle>
- <Tabs />
- <Accordion />
- <Autocomplete />
- <Select.SearchInput />
- <Text fontSize="parent" />
- <UL /> <LI /> <OL />
- Text numberOfLines / context fix
- hoverStyle={{ [XStack]: {} }}
- <List.Section /> see (https://developer.apple.com/documentation/swiftui/list Section)
- <GradientText /> can work native with 
  - https://github.com/react-native-masked-view/masked-view
- react-native-skia / svg image support
- beforeStyle, afterStyle could work ...
  - only if we can do with pseudos:
    - focusStyle={{ after: { fullscreen: true, border... } }}
    - allows for proper focused borders that don't require super hacks
    - see Switch
- <Avatar />
  - radio may be List.Radio just combines List, Label, Drawer
    - can use Switch or check or custom
- <Accordion />
- <Carousel />
- <Video />, <Spinner />
- <SizableFrame />, <EnsureFlexed />
- focusWithinStyle
- accessibility upgrades (focus rings etc)
- skeleton just using Theme / variables

---

<Menu />

- https://www.radix-ui.com/docs/primitives/components/dropdown-menu
- basically a popover + mouse helpers + built in item element
- don't need sub-menu for first iteration but... could if it's easier to at once
- floating-ui has helpers for this too
- `native` prop to do ContextMenu in iOS
  - ios:
    - Zeego uses react-native-ios-context-menu
    - https://github.com/nandorojo/zeego/blob/master/packages/zeego/src/menu/create-ios-menu/index.ios.tsx
  - android:
    - Zeego uses 
    - @react-native-menu/menu
    - https://github.com/nandorojo/zeego/blob/master/packages/zeego/src/menu/create-android-menu/index.android.tsx

---

<ThemeOverride />
<ThemeMutate />
<Theme values={parent => ({ backgroundColor: parent.backgroundColorHover })} />

```tsx
export default () => (
  <Theme name="orange">
    <ThemeOverride backgroundColor={-3}>
      <MySquare />
      <MyCircle />
      <MyButton />
    </ThemeOverride>

    <ThemeMutate
      getNextTheme={theme => {
        theme.background = ''
        return theme
      }}>
        <MySquare />
        <MyCircle />
        <MyButton />
    </ThemeMutate>
  </Theme>
)
```

---

<Skeleton />

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
  linearGradient: {
    to: 'left',
    colors: ['$color2', '$color3', '$color2']
  }
})
```

---

<Variants />

```tsx
export default () => (
  <MySquare.Variant skeleton>
    <MySquare />
  </MySquare.Variant>
)

const MySquare = styled(Square, {
  variants: {
    skeleton: {
      true: {
        backgroundColor: 'grey',
      }
    }
  }
})
```

and if you want multiple:

```tsx
const SkeletonVariants = composeVariantProviders(MySquare)
```

---

# Psuedo Element Styles

- beforeStyles + afterStyles array
- display: flex
- only accepts style props

+++

# Themes

Component themes could force set the actual properties even if they aren't set by the component themselves....

```tsx
themes.dark_Button = {
  borderWidth: 1,
  borderColor: 'red',

  // is this doable?
  beforeStyle: {},
}
```

=

# Winamp Re-skinability

Themes can completely transform the look and feel, a button could have multiple shadows/reflections in one theme, but be totally flat in another.


---

quotes

#stream Kezlar — Today at 3:09 PM
yeah tamagui was definitely a rabbit hole, but once it clicked, it's incredible to use. Took me ~2weeks to migrate from native base but was 500% worth it


