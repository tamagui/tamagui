# Roadmap

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
