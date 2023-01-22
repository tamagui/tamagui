- make variants optimize with compiler
- simple cli build script linked into next app dir
- test keyboardavoidingview > scrollView - collapsing tamagui
- sync with rnw 19
- check into shadow/elevation not showing
- survey https://tripetto.app or gforms

1.0.X

- optimizing packages/app in starter
- react native pressable in pressable
- createThemes accepts array not object
- <Theme name="dark_orange" /> type 
- site _app has t_unmounted helper, move that into tamagui proper
- SimpleTooltip no sub theme looks bad on dark mode
- looks like maybe memory issue with portal related things dialog or something
  - was issue on ios 14 devices
  - test low memory
- So it looks like any import of tamagui (not @tamagui/core) breaks the build on the web. I've created a repro here https://stackblitz.com/edit/vitejs-vite-3sbtgb?file=src/App.tsx.
- warn not to styled(Button)
- vite fails https://github.com/tamagui/tamagui/issues/479

- bundle size reductions:
  - remove setColorAlpha in favor of internal core rgba util
  - expandStyle remove some
  - merge mergeSlotProps and mergeProps
  - move to PROP whitelist rather than style whitelist maybe avoid validStyleProps altogether
  - getStylesAtomic "all webkit prefixed rules, pointer-events"
  - color names hardcoded potentially
  - // ??
  - styled(), extendStaticConfig can just merge options rather than de-structure re-structure
  - remove mergeConfigDefaultProps
  - ThemeManager move to functional not class
  - move addTheme/updateTheme out of core
  - may be able to remove proxyThemeVariables
  - getVariantExtras looks easy to slim
  - reverseMapClassNameToValue / unitlessNumbers
  - normalizeColor etc
  - createPropMapper

---

1.1

- vertical slider native can be janky
- sync with react-native-web
  - https://github.com/necolas/react-native-web/pull/2377
- dialog sheet space regression
- switch active bg regressed
- theme shouldn't change context ever on web, redo notify()
  - instead of passing ThemeManager in context just pass a UID
    - useChangeTheme can then do listen(UID)
    
- createTamagui({ webOnly: true }) - avoids console warning on Text
  - goes hand in hand with `@tamagui/style` separate from core
- for some reason, the vertical slider is buggy in the blog post: https://tamagui.dev/blog/version-one but not on the docs page. Try clicking and fiddling with it on a desktop computer, and you'll see what I mean.
- some big theme speedups possible to avoid re-renders
- all: unset or way to unstyle things (unstyle: true)
- https://github.com/mwood23/nx-tamagui-next-repro
- #beatgig - popover not closing
- fix alt themes to be more subtle and go less strong to more strong
- revisit animations, timing animations, loops, document better
- Select id="" + Label focus
- web forms events bubble
- accessibility keyboard navigation (Menu component potentially)
- improve sandbox as mini vite stack
- VisuallyHidden + mediaquery + space


---

1.2

- react native action sheet hooks/logic adapt
- testing native - https://maestro.mobile.dev
- app dir support experimental
- styled('div')
- tooltip auto pass down accessibilityLabel

---

1.3

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

---

1.4

- re-render tests:
  - useMedia, component w/ media + style, media + css-style, media + space
  - useTheme, component with theme used in style

---

2.0

- app dir support (discussions/409)
- contrastColor (accent color) in themes (discussions/449)

---

inbox

- config-base => design-system
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
  - VisuallyHidden, Adapt, FontLanguage, etc
- Card component minor glitch: border flickers on animation end
- I'm seeing an issue where setting multiline=true on Input results in broken colors when switching between light & dark themes (doesn't use specified text color). 
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

Make Themes Better

```tsx
const theme = generateTheme([...colors], createSubtleTheme)
const theme_alt1 = extendTheme(theme, ...)

export const themes = createThemes({
  theme,
  theme_alt1,
})
```

<Button size="large" />

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

<Variants />

```tsx
export default () => (
  <SquareVariant skeleton>
    <MySquare />
  </SquareVariant>
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

const SquareVariant = createVariantProvider(MySquare)
```

---

quotes

#stream Kezlar — Today at 3:09 PM
yeah tamagui was definitely a rabbit hole, but once it clicked, it's incredible to use. Took me ~2weeks to migrate from native base but was 500% worth it
