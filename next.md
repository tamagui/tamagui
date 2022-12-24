1.0

- variants intellisense autocomplete not suggesting, but types are right
- next load css on subsequent pages (partially fixed)
  - https://github.com/vanilla-extract-css/vanilla-extract/blob/master/packages/webpack-plugin/src/loader.ts
- run over site on mobile web, desktop

1.0 launch:

- catchy blog title
- sponsor promo
- mailing list
- runthrough docs a handful of times
- blog compiler in/out

1.0 post launch:

- canary release channel
- sponsor rewards e2e flow
- add new sponsors script
    - https://github.com/JamesIves/github-sponsors-readme-action
- one full on integration native test unlocks:
  - no more manual checks every release
  - auto release on merge to master
  - do some snapshot tests of site files like HeroResponsive

1.0 potentially:

- kitchen-sink in Snack demo link
- get an demo for studio ready
- `tamagui` cli basic version

---

1.1

- #beatgig - popover not closing
- fix alt themes to be more subtle and go less strong to more strong
- revisit animations, timing animations, loops, document better
- Select id="" + Label focus
- web forms events bubble
- improve sandbox to a mini vite stack
- VisuallyHidden + mediaquery + space
- test
  - native integration tests
  - useMedia
  - reanimated
  - integation on native - theme change, render time
- CI auto master merge tests passing releases
- tama sync
  - make it easy to have a template repo that people sync to
  - includes the git sync stuff from cli now
  - copies/diffs/merges every file there just based on heuristics
  - somehow choose "merge/overwrite/diff"
  - smart defaults
    - package.json etc
    - binary assets overwrite (if not changed, else prompt)
- setup script can power `tama sync` to sync the repo to its parent repo

---

inbox

- textarea shifts on focus

- dynamic eval bundle of smallish fixes: 
  - hash file contents cache
  - dont write it as a file, use node vm
  - just use a few find and replace type things for forcing exports, fail if not possible

- site web fonts (can also be a feature of font bundles)
  - https://www.lydiahallie.io/blog/optimizing-webfonts-in-nextjs-13
  - https://simonhearne.com/2021/layout-shifts-webfonts/#reduce-layout-shift-with-f-mods

- drag on switch
- sheets can be way faster, they listen for layout/windowdimensions and re-render constnatly, but whe closed that could be ignored, just needs one level more of wrapping and react memo stuff
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


---

quotes

#stream Kezlar — Today at 3:09 PM
yeah tamagui was definitely a rabbit hole, but once it clicked, it's incredible to use. Took me ~2weeks to migrate from native base but was 500% worth it
