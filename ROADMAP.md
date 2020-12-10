# Roadmap

## Media Query syntax support with compilation to CSS

Previously was thinking of doing a simple version, with potential for objects:

```tsx
<VStack color={['red', 'blue']} />
<VStack color={{ small: 'red', medium: 'blue' }} />
```

But there were a few downsides, especially with how it conflicts with existing React Native array style props. To fix that you'd have to deviate from the React Native style spec, which would then require runtime translation on every view.

New plan is to do this:

```tsx
import { useMedia } from 'snackui'

// can configure useMedia in one place

function Component() {
  const media = useMedia()
  return (
    <>
      <VStack
        color="red"
        {...(media.small && {
          color: 'blue',
        })}
      />
      <VStack color={media.small ? 'red' : 'blue'} />
    </>
  )
}
```

Reasons are:

- More flexible to use
- Far easier to build/support, already supported extractions using existing syntax
- Falls back gracefully without any need to transform
- Easy to use for any other logical purpose beside styling
- TypeScript support for media keys
- Can define as many media queries as you want
- Not order dependent

In the future it's potentially possible then to have it simplify and auto-insert the hook for you.

```tsx
import { Media } from 'snackui'

// can configure useMedia in one place

function Component() {
  return (
    <VStack
      color="red"
      {...(Media.small && {
        color: 'blue',
      })}
    />
  )
}
```

It also dovetails nicely with Themes:

## Themes:

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
