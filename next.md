- beta:
  - fix on native + simple native demo (maybe with starters repo)
  - compiler 100% on site
  - create-tamagui-app
    - get some demos in that 100% pass compile / native
  - animations
    - css
    - test hover/press styles + add to animations docs
  - compiler
    - check it with variants extracting fully
    - props
      - theme, space/gap  (+ work with visually hidden)
      - onPress, onPressIn, onPressOut, onHoverIn, onHoverOut, ref, key
  - docs
    - animations
  - bugs
    - Image SSR / site weirdness on some
    - // TODO i think media + pseudo needs handling here

- 1: 
  - animateProps={[]} (basically transition-properties)
  - // @ts-ignore TODO we need to make GetProps only use StackStylePropsBase and then later build that up better in styled()
  - // @ts-expect-error TODO
  - check ScrollView SSR compat saw a bug
  - do a series of small demo videos to share on twitter etc
  - <BlurView />
  - space => gap
  - check theme change slow
  - slow types
  - fix memory leak causing OOM eventually on site
  - test component theme + alt theme (plus with compiled)
  - docs: extractable(), deoptProps, getExpandedShorthands

- 2:
  - load theme hook via feature if possible
  - add fonts section to guides
  - document $body being default font family
  - styleq / react-native-web 18 exploration
  - OmitShorthands<> helper (see ActiveCirlce in site)
  - split fonts into packages
  - floating-ui

- 3
  - // this can be done with CSS entirely right?
  - useLayout feature hook
  - optional 18-only separate releases? beta.3.react18?
    - react native doesn't support it yet except on new arch
    - (useId/useInsertionEffect)
  - escape hatch for html props `htmlProps` or tag={} => as={} + work better?
  - bring back `onLayout` via features hooks
    - press events?
  - <LinearGradient />
    - fix ssr
    - make extractable to css
  - bugs:
    - // TODO adding fontWeight here doesn't override SizableText variant


- exported helpers getTokens, useThemeName, getFontSize
  - spacedChildren
- exported hooks - useControllableState, useLayout
- <SizableFrame />, <EnsureFlexed />

  - Text numberOfLines / context fix
  - `space` should work with media queries
  - createTamagui({ defaultProps: { Button: {} } }) for any component
  - document/release <ThemeReverse />
  - <Tabs />
  - <Label />
  - <ListItem />
  - <Switch />
    - to start no outputting to native but use radix style
    - <Switch><Switch.Toogle /></Switch>
    - support Switch.Toggle style extractions

  - basic styled() extraction to css at compile time
  - catchall: { variants: '...' => {} } / styled(Text, () => ({}))
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

  - auto skeleton components
  - <List /> (works with drawer + draggable + selectable)
  - <Menu />
  - <MenuDrawer />

  - ios/android specific themes
  - options to render to native components in more places

  - <Group />
  - <Combobox />
  - <UL /> <LI /> <OL />

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
- <Select />
- colored cli output
- have tamagui watch the tamagui.config.ts file and report if types break
- smart responsive scaling system (<Scale /> basically)

// defaultProps: {
  //   Button: {
  //     scaleIcon: 2,
  //   },
  // },
  // mediaScale: {
  //   horizontal: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
  //   vertical: ['short', 'tall'],
  // },

animation popup 
