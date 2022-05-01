- beta:
  - types for $blue10 etc
  - <LinearGradient /> colors accept theme types
  - <Spacer /> doesnt work w media query display none
  - 30% fix on native + simple native demo (maybe with starters repo)
  - compiler work visually hidden
  - 0% bug // TODO i think media + pseudo needs handling here

- 1:
  - auto skeleton components
  - <Avatar />, <Select />, <Tabs />
  - redo popover/popper to use floating-ui
  - check ScrollView SSR compat saw a bug
  - do a series of small demo videos to share on twitter etc
  - <BlurView />
  - docs: extractable(), deoptProps, getExpandedShorthands

- 2: 
  - <Toast />, <Card />, <Carousel />
  - load theme hook via feature if possible
  - add fonts section to guides
  - document $body being default font family
  - styleq / react-native-web 18 exploration
  - OmitShorthands<> + expandShorthands helper (latter exists already diff name...) (see ActiveCirlce in site)

- 3
  - <Video />, <Spinner />
  - instead of generating classname strings generate objects
    - instead of concatClassNames then just object ...
  - fix memory leak causing OOM eventually on site
  - // this can be done with CSS entirely right?
  - useLayout feature hook
  - optional 18-only separate releases? beta.3.react18?
    - react native doesn't support it yet except on new arch
    - (useId/useInsertionEffect)
  - escape hatch for html props `htmlProps` or tag={} => as={} + work better?
  - bring back `onLayout` via features hooks
    - press events?
  - <LinearGradient />
    - make extractable to css

- whenever switch over to styleq or own internal css generator:
  - remove getStylesAtomic altogether - loop only once over props/styles

- exported helpers getTokens, useThemeName, getFontSize
  - spacedChildren
- exported hooks - useControllableState, useLayout
- <SizableFrame />, <EnsureFlexed />

  - Text numberOfLines / context fix
  - `space` should work with media queries
  - createTamagui({ defaultProps: { Button: {} } }) for any component
  - document/release <ThemeReverse />
  - <ListItem />

  - basic styled() extraction to css at compile time
  - ~button textProps => child selectors~
    - See if this isn't too terribly hard:
    - childStyle={{
        [Text]: {
          color: 'green',
          hoverStyle: {
            color: 'red'
          }
        }
      }}

  - container queries
  - <Scale />

  - @tamagui/cli: 
    - tamagui test ./packages/site/components/OffsetBox.tsx
    - tamagui sandbox ./packages/site/components/OffsetBox.tsx
    - tamagui compile ./packages/site/components/OffsetBox.tsx
  
  - <List /> (works with drawer + draggable + selectable)
  - <Menu />
  - <MenuDrawer />

  - // TODO only on hoverable/pressable!
  - ios/android specific themes
  - options to render to native components in more places

  - <Group />
  - <Combobox />
  - <UL /> <LI /> <OL />

- transformOrigin
  - may be able to translate to matrix https://www.jianshu.com/p/c67559b8f691
  - https://github.com/sueLan/react-native-anchor-point
- space => gap (blocked https://github.com/facebook/yoga/pull/1116)
- popover add safety checks around using Popover.Content
- Text selectColor
- focusWithinStyle
- accessibility upgrades (focus rings etc)
- JSDocs
- VSCode integrations:
  - move from functional component to styled() and back
  - built in jsx => css converter
  - "move to my design system" (finds tamagui package.json and moves there)
- much better PropsTable (expo has nice ones https://docs.expo.dev/versions/latest/sdk/linear-gradient/)
- colored cli output
- have tamagui watch the tamagui.config.ts file and report if types break
- smart responsive scaling system (<Scale /> basically)

- design system hosting
- https://github.com/react-native-menu/menu
- compiler could insert special props like:
  - __noAnimations, __noTheme, __noSpace
  - it would change key={} alongside that
  - that way HMR still works, but loads less hooks
  - works in production for extra perf
- compiler hot reload (shouldn't be too hard for basic case)
- upgrade expo/match-media (there was some problem before)

- vscode plugin to highlight the current node your cursors inside of in dom
- blur prop built in ?

- VSCode - "move to design system" action:
  - grab a selection of any styled() or functional component
  - moves it into your design system
  - updates index.ts there
  - updates imports in app
