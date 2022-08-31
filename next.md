- 1.0

  - light/dark theme change is re-rendering more than it should
  - VisuallyHidden + mediaquery + space
  - Select id="" + Label focus
  - Image JSON error on kitchen-sink
  - Sheet drag up small bug native with scrollable content
  - prod build native stuck on copying resources
  - kitchen-sink in Snack demo
  - check animation flicker again
    - flicker on some enterStyle animation native (hermes only)
  - changing family responsive tests
  - adding `shorthandsOverride` to createTamagui should be easy enough to type with Omit<>
  - fix reanimated 2.9/3.0 __frame var
  - windows without WSL
  - <Select /> has selectable cursor on hold down + move
  - way to use tamagui with custom design system tokens
    - basically map any tokens you choose to internal tamagui ones
  - or get overshoot clamp working for react-native animations driver
  - mismatch SSR SelectTrigger due to componentName override
  - // TODO still have as const bug
  - add ui package setting custom types example in starter
  - Group make media style size use properly
  - sell sizing story better - home hero, blog post?
  - <Input /> variant doesnt override paddingHorizontal set on same input
  - test Android in starters repo
  - if no enterStyle or exitStyle set with AnimatePresence, it doesn't exit
  - forms working bubble / label

  - FAQ
    - don't wrap in HOC if possible, will de-opt compilation
    - what works for compilation / examples
---

<Menu />

- borrow from radix
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

(potentially 1.0)
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
  - tamagui-build could run extraction *before* - but still needs webpack... so not sure
    - no need for `module:jsx`, instead output `module:native` and `module:css`
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
  - <Accordion />
  - <Autocomplete />
  - <Select.SearchInput />
  
  - principles doc to explain:
    - everything works runtime + compile the same
    - designed for apps - so runtime performance key
      - trades off bigger bundle size / a bit more init/memory
  - sell compiler / open source better on home
  - maybe <UL /> <LI /> <OL />
  - super short classnames for themes in production
  - Input based on Button for icon/iconAfter
  - cache at variant level (?)
  - another couple passes over style system to reduce work and size
  - sizing.mdx - rationale on size/space 
   - (size = height of button, 1 = smallest button, 10 = largest, 4 = natural, 6 = typical largest, 2 = typical smallest)
  - ci should include a fake publish + reinstall step, because sometimes package.json.files[] is missing new files
  - // native doesn't support until next react-native version, need to remove eventually
  - <Tabs />
    - needs RovingFocusGroup
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
    - built in jsx => css converter
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
- // TODO only on hoverable/pressable!
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


site optimize:
  - burntsienna (loading from potentially 3 places)


### Image v2

fast-image - https://github.com/DylanVann/react-native-fast-image


### Skeleton

- I think we ultimately need a new prop for all tamagui components skeleton, if true it will render the component as-is, but add an overlay view (SkeletonOverlay) that covers it with some default style, plus should set various things like pointerevents and aria-disabled

- skeleton prop can also accept any react element, so you can do <Button skeleton={<MyCustomSkeleton />} and maybe that even receives some special prop that gives info on the Button to skeleton

- we can add a defaultSkeleton to createTamagui so you can control that out of the box (defaults to SkeletonOverlay)

- may eventually want something like skeletonStyle which only applies to the parent component when skeleton is on, this probably is necessary so you can do things like overflow: hidden; position: relative when skeletons are on, so they fit inside nicely and shadows dont overlap

- a nice wrapper component <Skeleton>{...components}</Skeleton> and it will force all children that support it to have a skeleton, but runs into trouble with fully flattened components... we'd have to limit them to only accept skeletonStyle and not a sub-component i believe, this is my biggest ? right now... maybe nice to limit skeleton to only be style props, because otherwise can get heavy.. 

- when you have Suspense this is a bit weird, but you can do something like <Suspense fallback={<Skeleton><MyLoadingView load={false} /></Skeleton>}><MyLoadingView /></Skeleton>


### Ornaments

- <Button ornaments={[MyStyledOverlay]} />

- they must be a plain styled() view, can't be a functional component that ensures we can extract them fully

- this means they can be compiled away fully and limits weirdness, we're not trying to make some new react API inside react, just add a way to decorate things with themes

- one great example of their use case is Skeleton, but another is more complex themes (see the attached screenshot). right now you can't really replicate that without making a very complex component with lots of sub-components, and it sort of breaks everything you like about styled() and compilation etc etc. And ideally you'd want to be able to make a component like that  entirely through themes.... 

- make themes support ornaments... since we already have component-specificity with themes, you'd get some crazy ability: dark_Button could add a few ornaments and make that entire 8bit looking button (and it would swap out entirely on changing theme). if we get pseudos working as well, then dark_Button could have ornamentsFocus and ornamentsHover and we'd get that cool effect in the screenshot where you have little edges on each corner

- i think for v1 too no media queries or pseudo states though, but we could add those eventually it just requires more logic/compilation

- i think this solves somewhat the skeleton stuff in a few ways in that Skeleton can be a special ornament thats applied, and also it would be two parts: Skeleton.Frame and Skeleton.Shine. if animations work (this part is tricky as at least for web we'd only be able to support CSS)

