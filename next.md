- being able to limit fallback value better:
  - only number | `${string}%` | SpaceToken
  - right now its either allowing random strings or not allowing % strings, both which we don't want
  - eventually could also make "color-like" strings easier:
    - `#${string}` | `rgb(${string})` | `rgba(${string})` | `hsl(${string})` | `hsla(${string})` | NamedColors | 'transparent'

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

high level:

  - automate sponsors a bit better (link discord on tamagui site)
  - private canary packages on github
  - tiered line system for studio
  - improve tests and docs
  - make themes and sizing easier, simpler, better documented, more controllable
  - headless
  - studio
  - takeout
  - income:
    - font packages + font package builder ui
    - merch
    - outlined, pastel, neon themes, other theme drops (gumroad cheap)
    - auth/account/profile drop
    - better monorepo pro drop

---

via #gwun:

- if you have light_blue_Button but no light_blue theme, causes update issues when you switch

- defining a theme and componentName on a Stack/View should make the instantiated components inside inherit:

  ```tsx
  <Theme name=(theme}>
    <YStack
      theme="none"
      componentName="GaContainer"
      backgroundColor="$background"?
      <GaScrollView bg="$backgroundSoft"›
      </GaScrollView>
    </YStack>
  </Theme>
  ```

  After upgrading to latest, just on native, the "$background" in the
  YStack works as expected but the child <GaScrollView
  bg="$backgroundSoft" does not. Same applies if replaced with a
  <Stack> or anv other component.

- <Theme name="blue"><Theme reset><Button theme="orange" /></Theme></Theme>

something like this i believe, where native is correct but web the button isn't orange


---

- `tamagui [clone|eject] Sheet ./packages/sheet`
  - clones the sheet package into your repo somewhere

- $web / $native / $ios / $android

starter
- feed
- more work on profile
- cropper on web, potentially
- add users to github repo
- template github action

takeout
- checkout
- page for showing all purchased products / subscriptions
- discord integration

studio
- templates working
- Button.studio.tsx + run locally
  - give it your app port and it launches electron or just gives you a new url?
- figma export components
- figma import tokens

- we could somehow generate separate native and web potentially?
  - basically we generate esbuild two different versions: .native.js and .web.js
  - can flatten all TAMAGUI_TARGET then in each and maybe avoid that setup step
  - can automatically map react-native to react-native-web (then only have to alias for -lite)
  - should be 0-config setup

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

- slider track - light theme blends in with bg i think

- Button and other similar ones - make the hover/press/focusStyle zIndex 2, 3, 4 (or all 2) by default

- createInterFont the default weight/letterSpacing should use `true` rather than `4` key (small change just need to test make sure it doens't break)

- cli
  - `tamagui doctor` command to check for version mismatch

support new RN props:
https://reactnative.dev/blog/2023/01/12/version-071#web-inspired-props-for-accessibility-styles-and-events

Ali:

- [ ] moti driver
- [ ] Studio
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
- [ ] document keyboard avoiding view in `Sheet.mdx`
- [ ] input bug 
  - [ ] https://discord.com/channels/909986013848412191/1091749199378387065/1091909256023904377
- [ ] @tamagui/change-animation-driver document
- [ ] Disable warning ENV + configuration.md docs
  - [ ] (nate) make focusStyle border darker
- [ ] WARN  Sending onAnimatedValueUpdate with no listeners registered
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

  - release hoverglow
  - release use-store
  - tabs demo
  - animated colors demo
  - studio preview video
  - plus studio landing page with invite system
  - theme inverse shows off generic themes

- refactor getSplitStyles to share getSubStyle / logic with main style logic
  - "When I place style: backgroundGradient outside of variants, it works"

---

- site polish: 
  - make the text selection match the theme
  - make the link underline match the theme

- website toggle for css/spring doesn't animate? we can keep it outside of the provider ideally so its always spring


- in card : `if (isTamaguiElement(child) && !child.props.size) {` lets convert to context?
  - can we come up with a nicer pattern to avoid having to rewrite from styled() to component here? like some sort of standard way to provide context between components?... thinking out loud:
    - we could have a generic ComponentContext internally in createComponent
    - we can export a createStyledContext()
    - `const CardVariants = createStyledContext<{ size: number }>()`
    - then in Card or any parent you can do `<CardVariants size={} />`
    - finally, in `styled({ provider: CardVariants })`

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

- Select id="" + Label focus
- web forms events bubble
- theme shouldn't change context ever on web, redo notify()
  - instead of passing ThemeManager in context just pass a UID
    - useChangeTheme can then do listen(UID)
- vertical slider native can be janky
- react native action sheet hooks/logic adapt
- testing native - https://maestro.mobile.dev
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
- <Toast />
- <Toggle><Group><Toggle.Item><Item /></Toggle.Item></Group></Toggle>
- <Tabs />
- <Accordion />
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

## Descendent Styles

ideas:

```tsx
const Child = styled(Stack, {
  $Parent: [
    {
      backgroundColor: 'green'
    },
    {
      when: 'small',
      backgroundColor: 'red',
    },
  ],
})
```

```tsx
styled(Stack, {
  $sm$dark$Parent: { ... }
})
```

```tsx
const Child = styled(Stack, {
  $sm: { ... },
  $dark: { ... },
  $Parent: { ... },
  compounds: [
    {
       media: '$sm',
       theme: 'dark',
       parent: 'Parent',
       styles: {
          // ...
       }
    }
  ]
});
```


### On the parent:

```tsx
const ButtonFrame = styled(Stack, {
  ButtonText: {
    color: 'red',
  },

  hoverStyle: {
    ButtonText: {
      color: 'green'
    }
  },

  $small: {
    hoverStyle: {
      ButtonText: {
        color: 'blue'
      }
    }
  }
})

const ButtonText = styled(Stack, {
  name: 'ButtonText',
})
```

### On the child:

```tsx
const ButtonFrame = styled(Stack, {})

const ButtonText = styled(Stack, {
  name: 'ButtonText',

  in_ButtonFrame: {
    color: 'red',

    hoverStyle: {
      color: 'green',
    },

    $small: {
      hoverStyle: {
        color: 'blue'
      }
    }
  },
})
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

