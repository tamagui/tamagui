# Roadmap

## Advanced traversal

Plan is just to better take static objects from anywhere and inline them, especially when combined with theme + media query.

Complex example:

```tsx
function Component() {
  const media = useMedia()

  // support extracting this to CSS entirely
  const color = media.xs ? 'red' : 'blue'
  const styles = {
    maxWidth: media.sm ? 100 : 200
    // ... other extaction semantics support as well
  }

  return (
    <>
      <VStack {...styles} color={color} />
      <VStack width={styles.maxWidth} />
    </>
  )
}
```

## Themes

```tsx
import { Theme, useTheme } from 'snackui'

// can configure useTheme in one place
// ProvideThemes at root

function Component() {
  const theme = useTheme()
  return (
    <Theme name="dark">
      <VStack color={theme.color} />
    </Theme>
  )
}
```

Has the same features as useMedia in that it will nicely not need any special fallback case when compilation is not possible.

## Scaling

One of the biggest needs in a UI is the ability to scale components to different sizes. This is not like Media Queries in that this simply having different size buttons, cards, and text on the same media/device.

While scaling is similar to Media Queries and Themes in that it's helped by having a standard, single interface, it presents some unique problems.

One is that it has a unique combinatorial explosion when combined with media queries (if done the same as media queries / themes with a freeform hook). That's hard to overcome: the static extraction would be highly confusing to understand all the cases it covers, and with theme/media already causing some level of combinatorial overhead, scale can't afford to multiply across those.

But the upside of scales is that they are actually better in some ways when they are constrained: easier to think about and to ensure edge cases are covered. Scales also usually only touch a few properties: height/padding/fontSize, so they can afford to be a bit more verbose.

Here's the idea:

```tsx
const useFontSize = createUseScale({
  // you can choose as many/few as you'd like
  sm: 12,
  md: 14,
  lg: 16,

  // optional object for media query combination
  media: {
    short: {
      sm: 10,
      md: 12,
      lg: 14
    }
  }
})

function Component(props: { scale: 'sm' | 'md' | 'lg' }) {
  const fontSize = useFontSize(props.scale)
  return (
    <Text fontSize={fontSize} />
  )
}
```

And what it'd generate, roughly:

// Component_style.css
```css
.fontSize-sm { font-size: 12px; }
.fontSize-md { font-size: 14px; }
.fontSize-lg { font-size: 16px; }
@media screen and (max-size: 500px) { :root .fontSize-sm { font-size: 10px; } }
@media screen and (max-size: 500px) { :root .fontSize-md { font-size: 12px; } }
@media screen and (max-size: 500px) { :root .fontSize-lg { font-size: 14px; } }
```

```js
import { scale } from 'snackui'
function Component(props) {
  return (
    <span className={
      props.scale == 'md'
        ? 'fontSize-md' :
          props.scale == 'lg'
            ? 'fontSize-lg' : 'fontSize-sm'
      }
    />
  )
}
```

Constraints:

- No dynamic/spread/import stuff in the createUseScale definition
- No dynamic stuff with the usage site (just fontSize={fontSize} and similar)

Problems:

- Will require tracing imports for export/import support
- Not the easiest transform behind the scenes
- Will generate many styles and large conditional chains
- Can't be combined with existing className style:
  - `fontSize-[hash]` because it needs to be overriden in media query mode
