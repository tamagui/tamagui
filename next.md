rc.1

- site animate mount seems slow
- forms demo textarea top padding + shifts on focus
- maybe regression in closing popover
- style={{ filter: '' }} broken
  - instead of validStyleProps use validNONStyleProps
    - that way for web all style props pass through automatically
    - also likely smaller bundle size (smart detect `onX`)
- variants intellisense autocomplete not suggesting, but types are right
- next load css on subsequent pages (partially fixed)
- tested on FF
  - Card component minor glitch: border flickers on animation end
- #quest-portal - scroll view seems to extend beyond the bottom of the screen making it impossible to access the items at the bottom

1.0

- CI auto master merge tests passing releases
- vite compiler bug
- prebuild option
  - not de-duping css much
  - fixes next next load css
  - simplifies initial setup and need for plugins
- native + re-render tests
- snapshot test of HeroResponsive output
- `tamagui` cli basic version
- I'm seeing an issue where setting multiline=true on Input results in broken colors when switching between light & dark themes (doesn't use specified text color). 
- https://github.com/tamagui/tamagui/issues/318
- focus an input in a dialog on mobile or a propover etc. then it disappears
- https://github.com/tamagui/tamagui/issues/256
- VisuallyHidden + mediaquery + space
- test
  - native integration tests
  - useMedia
  - reanimated
  - integation on native - theme change, render time
- Sheet drag up small bug native with scrollable content
- Select id="" + Label focus
- canary release channel
- web forms events bubble

1.0 launch:

- grid on homepage linking to various nice components maybe replace features grid or augment
  - VisuallyHidden, Adapt, FontLanguage, etc
- git hook to auto-follow on every commit with a type generation
- site snack + demo embed on all pages floating that scales up on hover on large screen
- sponsor promo
- sponsor blog
- sponsor rewards e2e flow
- mailing list
- better gh PR template / sandbox
- improve sandbox to a mini vite stack
- runthrough docs a handful of times
- get an demo for studio ready
- kitchen-sink in Snack demo
- content
  - blog
    - lighthouse score diff between compiler on / off
    - compiler in/out
  - docs: expo guide

---

1.1

- Is there some way to get color-scheme to update to dark here when we toggle to the dark theme @Nate ?
  - <html class="t_dark" style="color-scheme: light;">
- dynamic eval bundle of smallish fixes: 
  - hash file contents use as hash for tmp file name
  - avoid work if matching
  - install into node_modules/.cache (import cacheDir) and symlink next to current file
  - bundle it, use the existing esbuild.buildSync helper fn
  - remove babel use esbuild plugin

---

inbox

- lighthouse score ci
- move much logic from withTamgui into TamaguiPlugin
- TestFontTokensInVariants types not autocompleting in variants... but showing properly on hover/type property
- pass Size down context (see Group) is this just Themes but for individual props (css variable direct support <Theme set={{ size: '$4' }}> ?)?
- kitchen sink snack on site
- move to object style extraction to remove concatClassName
- what works for compilation / examples
- prop ordering
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
- document/release <ThemeReverse />
- Text selectColor
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
