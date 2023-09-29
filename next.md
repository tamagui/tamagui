- strict shorthands (only use shorthands)
- ios no render dark/light mode support
- fix button color + pressStyle
- Select native
  - can use iOS Select as well as the newer SwiftUI menu style Picker
- avoid need for setupReactNative

- styled(ExternalComponent) should always allow Partial props
  - but if you do provide the props ideally it should 'know' they are pre-filled and therefore not required anymore
  - also it should make sure to make those props required if they aren't set in styled()

- v2 
  - shorthands
    - col => c
    - remove bg/bc confusion
  - web mode: 100% of css coverage or at least allow all valid web props
    - compiler can accummulate them and emit a file?
  - basic plugins system
  - no separate UI package necessary for optimization
  - if dynamic eval flattens every usage, remove the definition
  - headless
  - zero runtime

- TODO this could definitely be done better by at the very minimum
  - this entire proxy could be removed in favor of the proxy we make on initial theme creation, and just having a way to subscribeThemeGet(theme, (key, val) => any) at the useThemeWithState callsite

- option to disable ssr mode to avoid extra renders on SPA

-  button circular + ai not working <Button
            theme={contrastThemeName}
            circular
            jc="center"
            ai="center"
            icon={Send}
          />

- next seems to be extracting for server and web, but likely we can leave it off for server since the style should be identical

- deprecate rnw-lite when we can after making sure all tests / animation drivers pass on rnw

- imperative sheet

- styled(alertdialog.title) hits depth limit quick
  - move dialog/alertdialog over to createStyledContext would reduce a lot of depth

- sheet snappoints not consistent on mobile web vs other platforms (maybe dvh or maybe just different?)
- move simple-web to themeBuilder
- make it so specific tokens can be omitted from types where theres a default token category

- Popover.Close inside Sheet

- studio: https://codemirror.net instead of monaco
- document createStyledContext
- document ThemeBuilder

- inverse not updating theme on doc site after two theme changes (see http://localhost:5005/docs/core/theme inverse demos)

- #questportal how to build a button the ...size tokens.size[name] type is breaking

- merge font-size and get-font-sized packages

- forwardRef to icons

- modal flicker https://discord.com/channels/909986013848412191/1111044987858206821

- doing  <Paragraph ff={'$heading'} .. does work to make native use the font in the face prop (what's this prop for?) in $heading, but it still uses the size for $body, not $header, while web does use the correct respective sizing

- add just early return hooks eslint check
- Sheet.Close, Sheet imperative close

---

- `tamagui [clone|eject] Sheet ./packages/sheet`
  - clones the sheet package into your repo somewhere

studio
- templates working
- Button.studio.tsx + run locally
  - give it your app port and it launches electron or just gives you a new url?
- figma export components
- figma import tokens
- size/space/button docs
- slow press on buttons
- make `getButtonSized` somehow configurable by users
- document `tokenCategories` in createPropMapper in configuration
- document how `size` + `font` + `space` should work together to help create a cohesive design system that works with tamagui

Ali todos:
  - studio:
    - colors:
      - when you modify the popup in the bottom left should have a "save" option
        - save will make it actually update the themes with the right values
    - animations:
      - profiling its super slow, because for some reason animation.start() taking forever: for now just make it debounce / not animation on drag

  - [x] studio
    - [ ] make it remember dark/light choice (localStorage)
    - [ ] Themes tab
      - [ ] if just "light" or just "dark" is selected and you toggle light/dark on the top right, make the themeId also switch (themeId = whats selected in sidebar)
  - [ ] select: https://discord.com/channels/@me/1071157561757274193/1097795811703791646 - did some investigations on the issue, it's a safari-only issue it seems. todo: perf/virtualization of select items


---

# Backlog



- if you change webpack config to alias RN to RNW (not lite) one animation test fails

- cli needs a start update command just runs diff against your `~/.tamagui/tamagui`

- sheet native ios snapPoints
  - pre release 2.0 version of library
  - https://github.com/dominicstop/react-native-ios-modal/blob/wip/example/src/examples/Test09.tsx

- sheet native android - https://github.com/intergalacticspacehighway/react-native-android-bottomsheet

- sorry to keep pulling on the same thread here haha, I've got it close now but I think I must still be doing something wrong, the theme works on the button text if I pass it down to CustomButtonText manually like theme={props.theme}  and use extractable, but when I update it to styleable, all the text goes white—second screenshot (probably inheriting from one of the parent themes I guess?)
  - https://discord.com/channels/909986013848412191/974145843919716412/1100788149501833236

- eventually all of getThemeCSSRules could be done at build-time


- CI not failing on type errors in apps/site
a package.json etc etc + zip file

- export * from lucide icons in your ui package causes build error

- Uniswap Button - https://discord.com/channels/909986013848412191/974145843919716412/1100156660296724482

- @alt Sheet inside Popover breaks css animation:
  - https://tamagui.dev/docs/components/popover

- @ali https://discord.com/channels/909986013848412191/974145843919716412/1100115005451538503

- https://discord.com/channels/909986013848412191/974145843919716412/1100099134935023668

- https://discord.com/channels/909986013848412191/909986013848412194/1100077456448294942

- @ali Modal doesn't re-enable pointer events until the animation fully completes (popover too?)
  - https://github.com/tamagui/tamagui/issues/985

- sheet overlay variant https://discord.com/channels/909986013848412191/1103391377615749211/1103391377615749211

- Studio: drag and drop a font and you can configure the subset
  - automatically converts to the right output formats
  - auto generates CSS
  - bundles it into 

- [ ] bring back static-tests webpack.test.tsx (rename to web.tsx to run) "disabled for now but we really need to bring this back" showing "unknown test" for some reason

- [ ] double render on new button - waiting for fernando's opinion (fernando may do low prio)

- [ ] supabase local -> staging -> prod and migrations setup

- `tama doctor`
  - probably use @manypky internally
    - https://github.com/Thinkmill/manypkg/blob/main/packages/cli/src/run.ts
  - scan all package.json in monorepo
  - make sure all tamagui versions match
  - watch for non @tamagui stuff like loader
  - auto run this whenever compiler is run as well on startup
  - output nice message

- $web / $native make them work as media queries

- theme based "media queries" automatically:
  - $dark / $light but could be any theme?

- '> Child' descendent queries
  - only with css driver it can extract to css
  - without it uses context

- <Sheet native />
  - https://github.com/dominicstop/react-native-ios-modal
  - we'd want expo module + snap points

- <ActionSheet />
 - plus `native` prop https://reactnative.dev/docs/actionsheetios

- add test that builds site for prod + checks for header text / no errors

- yarn release --canary

- Popover trigger="hover"

- Switch unstyled - make it so it doesn't do any theme stuff

- font-family is being output to DOM on text element
- font weights in css are generating extra variables with "undefined" value if not filled in
- add defaultSize and defaultFontFamily to createTamagui
  - all instances of $true can become getConfig().defaultSize
  - all instances of $body can become getConfig().defaultFontFamily
  - remove the validation in createTamagui that enforces the keys

- relative sizing first class (and relative color)
  - add `defaultSize`, and `defaultColor`
  - add `relative()` helpers

- bug android 
  - I've been working on integrating our component library to mobile and ran into a snag with the android build. IOS builds seamlessly and Android throws this error when trying to use Select component:
  - https://discord.com/channels/909986013848412191/1072289484755976312/1093994167601999912

- bug: android styling is different, repro:
  - https://github.com/lostpebble/tamagui-setup-project


- bug: inputs rendering twice due to focusableInputHOC, if you remove that it doesnt, this is due to styled() + how it determines ComponentIn and grabs the component

- document `unstyled` prop for components

- docs for `@tamagui/font` and `@tamagui/theme`

- https://github.com/tamagui/tamagui/pull/765 

- getVariableValue(props.fontFamily) doesn't look right

- cli
  - `tamagui doctor` command to check for version mismatch

support new RN props:
https://reactnative.dev/blog/2023/01/12/version-071#web-inspired-props-for-accessibility-styles-and-events

Ali:

- [ ] document keyboard avoiding view in `Sheet.mdx`
- [ ] input bug 
- [ ] @tamagui/change-animation-driver document
- [ ] Disable warning ENV + configuration.md docs
  - [ ] (nate) make focusStyle border darker
- [ ] bezier on css animations
  - [ ] disablePassBorderRadius feels like a weird thing to need by default
    - change Group's disablePassBorderRadius to something else - perhaps the negation, passBorderRadius? i'm not sure. what do you think about this @natew 
    alternatively we could have disablePassBorderRadius default to true only on Tabs.List. but then overriding it would feel awkward (having to pass disablePassBorderRadius={false})
  - [ ] and document on styled() page
- native component modes
  - [ ] `RadioGroup`, `Select` native (web)
  - [ ] `Switch` native (mobile)

---

# Nate

### PR

  - animated colors demo
  - studio preview video
  - plus studio landing page with invite system
  - theme inverse shows off generic themes

---

- website toggle for css/spring doesn't animate? we can keep it outside of the provider ideally so its always spring

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

- https://github.com/tamagui/tamagui/issues/478
- default light mode theme + not changing
- hoverTheme={false} works, make hoverStyle={false} to unset
- test keyboardavoidingview > scrollView - collapsing tamagui
- check into shadow/elevation not showing
- survey https://tripetto.app or gforms

- unset: useful for unstyled to usnet the defaultVariatn size

---

1.X

- Select id="" + Label focus
- web forms events bubble
- theme shouldn't change context ever on web, redo notify()
  - instead of passing ThemeManager in context just pass a UID
    - useChangeTheme can then do listen(UID)
- vertical slider native can be janky
- styled('div')
- tooltip auto pass down accessibilityLabel
- accessibility keyboard navigation (Menu component potentially)
- createTamagui({ webOnly: true }) - avoids console warning on Text
  - goes hand in hand with `@tamagui/style` separate from core
- test: useMedia, reanimated, re-renders (mount, on hover, etc), render time ms
- CD on github
- home page sponsors with sizing and better logos
  - https://github.com/JamesIves/github-sponsors-readme-action
- keyboard search select bug
- variants intellisense autocomplete not suggesting, but types are right
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

- remove from web (can keep in core or make pluggable):
  - themeable
  - space
  - can have an env setting to exclude all the theme generation stuff if you are using the pre-build: `getThemeCSSRules`
- replace all RN stuff left in tamagui: Image, Input, Spinner, etc
- Accessibility + RTL
- tag="a" should get the typed props of a link
- much better non-monorepo non-expo general setup experience
- app dir support (discussions/409)
- contrastColor (accent color) in themes (discussions/449)
- all: unset

---

- react native pressable in pressable
- https://github.com/mwood23/nx-tamagui-next-repro
- https://github.com/necolas/react-native-web/pull/2195/files
- https://github.com/tamagui/tamagui/issues/513

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
- <Autocomplete />
- <Select.SearchInput />
- <Text fontSize="parent" />
- <UL /> <LI /> <OL />
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
  - radio may be List.Radio just combines List, Label, Drawer
    - can use Switch or check or custom
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

# Pseudo Element Styles

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

