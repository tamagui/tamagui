- @tamagui/cli: tamagui test ./packages/site/components/OffsetBox.tsx

cli to compile a file and see output:

> Loading tamagui
> Compiling OffsetBox
  >> <YStack />
  >> ...

- for lineargradient:
  - propMapper
  - move logic to function
- media queries in styled() not working
- Paragraph size={} not accepting simple numbers
- tamagui needs to overwrite StackProps (verify)
- themes: mobile sizing separate :)

- document: getTokens, useThemeName
- textTransform on font for uppercase h6
- document slimming react-native-web and bundle size
- TODO fix babel tests they seem right but output isny matching
- could do a pass on generated classnames to dedupe would help benchmarks
- static compilation can go further with variants because it knows they always only accept certain values... see mount-deep-tree
- basic styled() extraction => work liek props => <YStack />
- space => gap?
- fix parent variant types
- [number] (test Text numberOfLines)
- create small kitchen sink in expo to test
- fix kitchen sink
  - media query
  - hover/press
  - themes
  - shorthands
  - change theme

- escape hatch for html props `htmlProps` ?
- optimize regular styled() usage
- pressStyle test
- variants [number] [any] would be nice
  - instead of any variant: { size: (x: typed) => {} } could be inferred? fully dynamic basically
- createComponent move most hooks into dynamic loaded features, see useFeatures
  - pressable, responderEvents, layout, press events, usePlatformMethods
- onLayout
- make styled() accept any component (see Input.tsx)
- fix // TODO comments
- [perf] no need to concat classname at compile className={} if not flattening because it happens in createComponent
- media based hoverStyle/pressStyle may need runtime equivalent!
- babel add displayname
- bring back focusStyle, eventually focusWithinStyle
- make colors tree shakeable
- container queries
- auto skeleton components


- classname transitions via className (compiler + runtime)?
- honestly hover/press/focus need children selectors, this unlocks much nicer list effects and press effects:

```jsx
hoverStyle={{
  bc: 'red',

  '& .heading': {
    color: 'white'
  }
}}
```

constraints: 
  - className only!

seems somewhat doable: for css extraction its actuall direct to CSS, for js runtime you set a context, something like "ChildStyleContext" where it keeps a hash of [className]: style and then in createComponent just have to merge it in during getSplitStyles.

```tsx
hoverStyle={{ opacity: 1 }}

=> 
<MotiPressable>
</MotiPressable>

hoverStyle={{ opacity: 1, '& .link': color: 'red' }}

=> css (.item .link { color: red; })

=> js (parent):
<StyleContext target=".link" on="hover" style={{ color: 'red' }} />

=> (children)
const context = useStyleContext()
splitStyles():
  - if className === context.target
     if state.hover
        addStyle({ color: 'red' })

or moti:

const context = useStyleContext()
if className === context.target
  const state = useMotiPressable()

```


now with animations:


```tsx
// either
<Stack transition="springy" hoverStyle={{ opacity: 1 }} />
<Stack transition={{ opacity: 'springy' }} hoverStyle={{ opacity: 1 }} />

// then we define:
createTamagui({
  animations: {
    springy: {
      // may want to allow platform specifiers,
      // web animations via css are nice to fallback to
      native: {
        mass: 1,
        tension: 0.5,
      },
      web: 'transition all ease-in-out 100ms'
    }
  }
})
```
