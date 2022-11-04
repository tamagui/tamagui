- 1.0

  - Sheet on android: https://github.com/tamagui/tamagui/issues/261
  - When you focus an input in a dialog on mobile or a propover etc. then it disappears
  - select had a perf regression
  - site design system docs (for use in cli later)
  - blog post / home: lighthouse score diff between compiler on / off
  - runthrough and check:
    - expo guide
  - document fontFaceByWeight
  - document themeShallow
  - canary release channel
  - test sprint
    - native integration tests
    - useMedia, useTheme
    - reanimated
  - https://github.com/tamagui/tamagui/issues/186
  - https://github.com/tamagui/tamagui/issues/270
  - https://github.com/tamagui/tamagui/issues/266
  - https://github.com/tamagui/tamagui/issues/256
  - https://github.com/tamagui/tamagui/issues/242
  - `Portal` related components are not working on the Android side
  - <Adapt> change
  - theme-base - align to radix, allow configuarble colors
  - polyfill for rn 17
  - site: document more helpers: getSize / stepTokenUpOrDown / spacedChildren
  - site: fix search
  - overshootClamping fix
  - Select lg appears below site floating header
  - intellisense on "lh" shorthand props and "letterSpacing"
  - kitchen sink snack on site
  - 1.0 blog post
  - kitchen sink placeholder input color dark
  - VisuallyHidden + mediaquery + space
  - Select id="" + Label focus
  - Sheet drag up small bug native with scrollable content
  - kitchen-sink in Snack demo
  - mismatch SSR SelectTrigger due to componentName override
  - test Android in starters repo
  - if no enterStyle or exitStyle set with AnimatePresence, it doesn't exit
  - forms working bubble / label
  - inlineWhenUnflattened fontFamily on text should just be default
  - TestFontTokensInVariants types no autocompleting in variants... but showing properly on hover/type property

  - @tamagui/sx
  - @tamagui/tailwind

  - Docs
    - tamagui design tokens docs (not 1.0 necessary)
    - don't wrap in HOC if possible, will de-opt compilation
    - what works for compilation / examples
    - prop ordering
  
  - core:
    - move to object style extraction
    - slim down: Slot, concatClassName / unify usePressable+usePressability
  
---

compiler article

- mention SSR is impossible without it
- add section + two diagrams for compiler internals
- improve code demo to show media queries
- add image showing before/after of render performance (on and off compiler)

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

<ActionSheet />

---

plan for space + display none, two pronged

- web
  - CSS-only
  - could just use gap, no?
  - this handles compiled and not with near-0 overhead
  - deterministic selectors ~ disp-none, dist-lg-none etc
  - generate in createTamagui, something like:
    - .is_spaced > .disp-none + spacer { display: none; }
    - @media lg { .is_spaced > .disp-lg-none + spacer { display: none; } }
- native
  - could just wait for row-gap in native, shouldn't that work with disp none by default?
  - need to find a prop we can pass to any react-native view that wont error if unused so that non-tamagui views can receive it and basically its null
  - loop spaced children and add the prop:
    - a callback of some sort... like onShouldXX except its a fake event that just wraps any existing one
    - if active we know its spaced and remove it from tamagui
    - if not tamagui its a null event anyway
    - then if a child is disp: none at runtime, we call the callback with true/false depending
    - in the parent if it changes, we setDisplayedElements([0,1,1,1,0]) and remove the Space
      - where 1 = visible, 0 = invisible

---

Inbox

- check deps are matching in compiler startup
- can optimize useMedia:
  - https://twitter.com/sebmarkbage/status/1576603375814070273
  - "some tricky with either useDeferredValue or useSyncExternalStore you can use for this"
- dual direction scrollview shouldn't need two nested see CodeDemoPreParsed
- the useElementLayout and usePlatform hooks could use getBoundingClientRectAsync
- feather icons => https://lucide.dev
- container queries
- // enable shorthand for not having to switch modes to test when disabled by default
- native should probably avoid all optimization when it can't flatten or else pass in a __optimized attribute, otherwise its duplicating the style processing by putting __style with all the defaults + re-adding it at runtime
- have tamagui automatically build your components?
- `variantsOnly: true` on styled(), removes types for anything but variants (and className/theme etc)
- way to use tamagui with custom design system tokens
  - basically map any tokens you choose to internal tamagui ones
- input like button
- allow string values alongside numbers (nativebase port)
- media `$light` and `$dark` for overrides
- built in jsx => css converter
- `tag` => `as` (keep fallback around as deprecated)
  - `as={['a', { ...props }]}`
- breaking change notifier on upgrade
  - takes any commit with BREAKING CHANGE and logs to console as yellow
- VSCode => "turn JSX into styled()"
- * excessively deep type instantiation styled(<Stack />)
- textUnderline styles not typed?
- // TODO compiler doesn't have logic to include children, de-opt (see EnsureFlexed for test usage)
- pass in SharedValue to any prop for animations
- use helpers-node in Webpack/babel/vite to pull config from your tamagui.json
- fix Label + new form inputs (native too)  
  - native works by attaching state (mutable refs) to a FormContext
  - web works by just listening for event and using FormData()
- try using react-native-web $css object support for classnames
- animation accept useAnimatedStyle
- reduce bundle size by sharing accessibility prop validity and a few others
  - see https://discord.com/channels/909986013848412191/909986013848412194/1006909946010542221
- Switch gesture
- loadFont, loadAnimations
- Card should operate through context to properly sync size
- load tamagui itself using the loadModule / fork process to avoid all register (this is also shared logic with studio loading tamagui conf..)
- instead of .sheetBreakpoint add .adaptBreakpoint and <Adapt />
  - ability to pass in custom sheet or other view
- `tamagui check`
  - checks dist/ folders exist based on package.json
    - including whether it loads properly on node
    - checks package.json.files fields
    - checks types/* output actually maps to every input file
- <Icon />
  - use theme values and size values
  - can swap for other icon packs (use createTamagui({ icons }))
- <Toast />
- <Toggle><Group><Toggle.Item><Item /></Toggle.Item></Group></Toggle>
- <Tabs />
  - needs RovingFocusGroup / check Showtimes
- <Accordion />
- <Autocomplete />
- <Select.SearchInput />

```tsx
fontSize="parent"
// not inherit, actually matches the `size` token
```

- maybe <UL /> <LI /> <OL />
- Input based on Button for icon/iconAfter
- cache at variant level (?)
- another couple passes over style system to reduce work and size
- sizing.mdx - rationale on size/space 
  - (size = height of button, 1 = smallest button, 10 = largest, 4 = natural, 6 = typical largest, 2 = typical smallest)
- ci should include a fake publish + reinstall step, because sometimes package.json.files[] is missing new files
- // native doesn't support until next react-native version, need to remove eventually
- `blur` style prop
- `space` should work with media queries
- Text numberOfLines / context fix
- OmitShorthands<> + expandShorthands helper (latter exists already diff name...) (see ActiveCirlce in site)
  - Docs/ability to configure stricted theme values (dont accept anything but tokens)
- add fonts section to guides

---

takeout:
  - customizable createTheme()
  - cli: 
    - tamagui generate
      - JSDocs / TSMorph
    - tamagui serve
      - able to focus in on any component without needing to restart anything
      - localhost:3000/FuzzyComponentName
    - tamagui test ./apps/site/components/OffsetBox.tsx
    - tamagui debug ./apps/site/components/OffsetBox.tsx
  - ios/android specific themes
  - VSCode
    - move from functional component to styled() and back
    - "move to my design system" (finds tamagui package.json and moves there)
      - grab a selection of any styled() or functional component
      - moves it into your design system
      - updates index.ts there
      - updates imports in app
  - <Combobox /> (<SelectInput /> or <InputSelect />)
  - <Scale />
  - List hierarchical (https://developer.apple.com/documentation/swiftui/list)

---

- ornaments system:
    - hooks inside any styled component to add decoration-only elements
      - for example to mimic iOS style ListItem you want a separator
      - themes should ideally define this, right? 
        - or themes can export decorations

so:

```tsx
import { ornaments, themes } from '@tamagui/theme-ios'

export const createTamagui({
  ornaments,
  themes
})

// could enforce it only accepts TamaguiComponents:
const ListItemSeparator = styled(Stack, {})
const ornaments = {
  ListItem: [ListItemSeparator],
}

//  could make it accept platform specific object
const ornaments = {
  ListItem: {
    ios: [ListItemSeparator],
    web: []
  },
}
```

- swappable animation drivers to load css initially and change out
- better profiling tools / startup / dep analysis
- hoverStyle={{ [XStack]: {} }}
- <List.Section /> see (https://developer.apple.com/documentation/swiftui/list Section)
- compiler could insert special props like:
  - __noAnimations, __noTheme, __noSpace
  - it would change key={} alongside that
  - that way HMR still works, but loads less hooks
  - works in production for extra perf
- as={} + extraction + types
- <GradientText /> can work native with 
  - https://github.com/react-native-masked-view/masked-view
- react-native-skia / svg image support
- beforeStyle, afterStyle could work ...
  - only if we can do with pseudos:
    - focusStyle={{ after: { fullscreen: true, border... } }}
    - allows for proper focused borders that don't require super hacks
    - see Switch
- styled(Button) types break   
- <Avatar />
  - radio may be List.Radio just combines List, Label, Drawer
    - can use Switch or check or custom
- <Accordion />
- <Carousel />
- load theme hook via feature if possible
- styleq / react-native-web 18 exploration
- <Video />, <Spinner />
- instead of generating classname strings generate objects
  - instead of concatClassNames then just object ...
- fix memory leak causing OOM eventually on site
- // this can be done with CSS entirely right?
- optional 18-only separate releases? beta.3.react18?
  - react native doesn't support it yet except on new arch
  - (useId/useInsertionEffect)
- escape hatch for html props `htmlProps` or tag={} => as={} + work better?
- whenever switch over to styleq or own internal css generator:
  - remove getStylesAtomic altogether - loop only once over props/styles
- exported hooks - useControllableState, useLayout
- <SizableFrame />, <EnsureFlexed />
- document/release <ThemeReverse />
- container queries
- options to render to native components in more places
- transformOrigin
  - may be able to translate to matrix https://www.jianshu.com/p/c67559b8f691
  - https://github.com/sueLan/react-native-anchor-point
- space => gap (blocked https://github.com/facebook/yoga/pull/1116)
- Text selectColor
- focusWithinStyle
- accessibility upgrades (focus rings etc)
- colored cli output
- have tamagui watch the tamagui.config.ts file and report if types break
- smart responsive scaling system (<Scale /> basically)
- https://github.com/react-native-menu/menu
- vscode plugin to highlight the current node your cursors inside of in dom
- blur prop built in ?
- // TODO fix any type

### Image v2

fast-image - https://github.com/DylanVann/react-native-fast-image

### Skeleton

- I think we ultimately need a new prop for all tamagui components skeleton, if true it will render the component as-is, but add an overlay view (SkeletonOverlay) that covers it with some default style, plus should set various things like pointerevents and aria-disabled

- skeleton prop can also accept any react element, so you can do <Button skeleton={<MyCustomSkeleton />} and maybe that even receives some special prop that gives info on the Button to skeleton

- we can add a defaultSkeleton to createTamagui so you can control that out of the box (defaults to SkeletonOverlay)

- may eventually want something like skeletonStyle which only applies to the parent component when skeleton is on, this probably is necessary so you can do things like overflow: hidden; position: relative when skeletons are on, so they fit inside nicely and shadows dont overlap

- a nice wrapper component <Skeleton>{...components}</Skeleton> and it will force all children that support it to have a skeleton, but runs into trouble with fully flattened components... we'd have to limit them to only accept skeletonStyle and not a sub-component i believe, this is my biggest ? right now... maybe nice to limit skeleton to only be style props, because otherwise can get heavy.. 

- when you have Suspense this is a bit weird, but you can do something like <Suspense fallback={<Skeleton><MyLoadingView load={false} /></Skeleton>}><MyLoadingView /></Skeleton>
