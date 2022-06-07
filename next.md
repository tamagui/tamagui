- Group make media style size use properly
- fix compiler on bootstrap repo not accepting packages/app
- use style values instead of classnames when non-extracted
  - think of <YStack x={cursor.position} /> we'll generate infinite classnames
  - also aligns with stylex

- 1.0
  - document no need to use compiler during install
  - document rationale on size/space 
   - (size = height of button, 1 = smallest button, 10 = largest, 4 = natural, 6 = typical largest, 2 = typical smallest)
  - TODO bug backgroundStrong on dark in light / not variabl
  - make webpack plugin that does stuff from next-plugin and sandbox webpack etc
  - compile styled() to just css classes
  - pressStyle on card regression
  - fix media scale on takeout
  - fix dark mode takeout
  - fix light mode inverse when using prefers
  - Switch on native
  - https://github.com/tamagui/tamagui/issues/53
  - VisuallyHidden/display: none working with space
  - // TODO shouldn't need tag="span" if buttoninbutton context works - test + in prod
  - Input based on Button for icon/iconAfter
  - overwriting `disabled` in variants breaks types... (see ThemeableStack)
  - fix `as const` for variants with string const bug
  - sell sizing story better - home hero, blog post?
  - sell compiler much better in hero
  - html props: role, tabIndex, input type
  - <Input /> variant doesnt override paddingHorizontal set on same input
  - make SimpleTooltip inverse by default
    - make all inverse by default? i think so? or else make sub-themes handle it...
  - input type="email", button type="submit" etc
    - its fine to wrap input in HOC like button
    - normalize divergent android/ios:
      - https://reactnative.dev/docs/textinput
        - android accepts "autoComplete"
        - ios accepts "textContentType"
        - set secureTextEntry automatically for type="password"
  - form onSubmit
  - // TODO bug not applying
  - shorthands-only type/docs
  - tokens-only type/docs
  - fix /types import
  - make Label work on native with touch event (require single <Label.Provider> at root)
    - make sure Select, Input, Switch etc all work with it
  - document $body being default font family
  - better docs on @tamagui/stacks (Sizable, ThemeableSizable, export variants)
  - add more of a kitchen sink demo to starts
  - test Android in starters repo
  - size=5.5 icon scales diff
  - size={55} doesnt set size only icon
  - if no enterStyle or exitStyle set with AnimatePresence, it doesn't exit
  - theme light needs darker shadows?
  - much better PropsTable (expo has nice ones https://docs.expo.dev/versions/latest/sdk/linear-gradient/)
  - <Select />, <Dialog /> (AlertDialog)
  
  - <SelectableList /> (type = multi | single)
    - in place of Radio (+ checkbox)
    - needs ToggleGroup
      - needs RovingFocusGroup

  - <LinearGradient /> colors accept theme types
  - <Spacer /> doesnt work w media query display none
  - compiler work visually hidden
  - 0% bug // TODO i think media + pseudo needs handling here
  - maybe <UL /> <LI /> <OL />
  - focusStyle on native
  - document exported helpers getTokens, useThemeName, getFontSize, spacedChildren
  - // TODO infer ref

(potentially 1.0)
  - // native doesn't support until next react-native version, need to remove eventually
  - styled(Button)
  - need to redo concatClassName(), can be removed entirely for non-flattened
  - Group borderRadius adjustment should be based on it's borderWidth + padding, not always set to 1, needs to de-opt those props
  - <Tabs />
    - needs RovingFocusGroup
  - <Toast />
  - `blur` style prop
  - explore removing need for patching react-native-web
      - PR to rnw to publish pieces we need
  - web-only mode:
    - alias react-native => @tamagui/react-native-web-only ?
  - Stacks / Grid 
    - https://mobily.github.io/stacks/docs/changelog
      - https://github.com/mobily/stacks/blob/master/src/Stacks_component_Grid.res
    - maybe redo space to use this logic too if done at runtime (and then that allows moving to gap / compilation)
  - createTamagui({ defaultProps: { Button: {} } }) for any component
  - `space` should work with media queries
  - Text numberOfLines / context fix
  - OmitShorthands<> + expandShorthands helper (latter exists already diff name...) (see ActiveCirlce in site)
    - Docs/ability to configure stricted theme values (dont accept anything but tokens)
  - add fonts section to guides
  - auto skeleton components
  - simple <Table /> could be similar to PropsTable

takeout:
  - customizable createTheme()
  - cli: 
    - tamagui generate
      - JSDocs / TSMorph
    - tamagui serve
      - able to focus in on any component without needing to restart anything
      - localhost:3000/FuzzyComponentName
    - tamagui test ./packages/site/components/OffsetBox.tsx
    - tamagui debug ./packages/site/components/OffsetBox.tsx
  - ios/android specific themes
  - basic styled() extraction to css at compile time
  - compiler hot reload
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

- next css shaker 
  - loads every page after build and finds all unused styles, produces minimal css
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
  - only if we can do with psuedos:
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
- <Menu />
- <PopoverDrawer /> + <MenuDrawer />
- // TODO only on hoverable/pressable!
- options to render to native components in more places
- <Group />
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


### Skeleton

- I think we ultimately need a new prop for all tamagui components skeleton, if true it will render the component as-is, but add an overlay view (SkeletonOverlay) that covers it with some default style, plus should set various things like pointerevents and aria-disabled

- skeleton prop can also accept any react element, so you can do <Button skeleton={<MyCustomSkeleton />} and maybe that even receives some special prop that gives info on the Button to skeleton

- we can add a defaultSkeleton to createTamagui so you can control that out of the box (defaults to SkeletonOverlay)

- been wanting to add this to tamagui since forever but its a good use case here: we can add a  new option defaultProps to createTamagui, so you can do defaultProps: { Button: { skeleton: <SomeSpecialOneJustForButton /> } } which may be useful for if certain components have different needs

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

