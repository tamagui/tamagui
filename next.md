- beta:
  - finish blog post
  - compiler 100% on site
  - create-tamagui-app
    - get some demos in that 100% pass compile / native
  - animations
    - css
    - test hover/press styles + add to animations docs
  - load theme hook via feature
  - fix lineargradient
  - shorthands should be swapped key/val to ensure one shorthand per prop key
  - check focusStyle works or remove docs
  - styled() fix types with react native web
    - fix not needing `isText`, `isInput`, `isReactNativeWeb`
  - compiler
    - check it with variants extracting fully
    - props
      - theme
      - space/gap  (+ work with visually hidden)
      - onPress, onPressIn, onPressOut, onHoverIn, onHoverOut, ref, key
  - docs
    - animations
    - classnames is_Pagraph , font_body
    - global Tamagui in dev mode (Dev Tools)
      - Tamagui.classes['_borderBottomColor-1go1dts'] => style
    - fullscreen elevation onHoverIn onHoverOut onPress
    - excludeReactNativeWebExports recommend excluding Animated etc
    - injectCSS, mediaQueryDefaultActive, cssStyleSeparator
    - web-only strategy react-native v0.0.0 + @types/react-native
    - add fonts section?
      - document $body being default font family
    - theme-base
      - adding /inter.css /fira-code.css
      - adding font-feature-settings
      - customizing things
  - bugs
    - // TODO not working?
    - slow types (tried fixing but made them more accurate but worse :/)
    - get sizableTextSizeVarianty types working and ...fontSize
    - // TODO this should be ...fontSize type not working
    - // TODO can we make it work using its own variants with types?
    - // TODO if not then we need to add defaultVariants: {}
    - media queries in styled() not working
    - fix image w/h shorthand not translating to width/height runtime
    - Image SSR / site weirdness on some
    - ScrollView isnt SSR compat
    - // TODO check why hoverStyle not overriding
    - // TODO handle pseudos
    - // TODO i think media + pseudo needs handling here
    - o="hidden" works when it should throw type warning (its opacity)

- beta.2: 
  - space => gap
  - check theme change slow
  - slow types
  - fix memory leak causing OOM eventually on site
  - test component theme + alt theme (plus with compiled)

- beta.3:
  - styleq / react-native-web 18 exploration
  - OmitShorthands<> helper (see ActiveCirlce in site)
  - split fonts into packages
  - floating-ui

- beta.4
  - optional 18-only separate releases? beta.3.react18?
    - react native doesn't support it yet except on new arch
    - (useId/useInsertionEffect)
  - escape hatch for html props `htmlProps` or tag={} => as={} + work better?
  - bring back `onLayout` via features hooks
    - press events?
  - <LinearGradient />
    - fix using theme values
    - make extractable to css

- v1
  - github sponsor
  - docs
    - exported helpers getTokens, useThemeName, getFontSize
      - spacedChildren
    - exported hooks
    - <SizableFrame />, <EnsureFlexed />
  - fix bugs
  - blog post

- v2
  - `space` should work with media queries
  - createTamagui({ defaultProps: { Button: {} } }) for any component
  - document/release <ThemeReverse />
  - <Tabs />
  - <Label />
  - <List /> (works with drawer + draggable + selectable)
  - <List.Item />
  - <Switch />
    - to start no outputting to native but use radix style
    - <Switch><Switch.Toogle /></Switch>
    - support Switch.Toggle style extractions

- v3
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

- v4
  - container queries
  - <Scale />
  - @tamagui/cli: 
    - tamagui test ./packages/site/components/OffsetBox.tsx
    - tamagui sandbox ./packages/site/components/OffsetBox.tsx
    - tamagui compile ./packages/site/components/OffsetBox.tsx

- v5
  - auto skeleton components
  - type variants [number] / [string] (test Text numberOfLines)
  - <Menu />
  - <MenuDrawer />

- v6
  - ios/android specific themes
  - options to render to native components in more places

- v7
  - <Group />
  - <Combobox />

- write a "how the compiler works" blog post
- popover add safety checks around using Popover.Content
- Text selectColor
- focusWithinStyle
- accessibility upgrades (focus rings etc)
