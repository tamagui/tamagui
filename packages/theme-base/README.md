```tsx
import '@tamagui/theme-base/inter.css' // web-fonts
import '@tamagui/theme-base/fira-code.css' // web-fonts
import { shorthands } from '@tamagui/shorthands'
import { themes, tokens } from '@tamagui/theme-base'
import { createTamagui } from 'tamagui'

export default createTamagui({
  themes,
  tokens,
  shorthands,
})
```

For Fira Code:

```
.font_mono {
  font-feature-settings:"liga","tnum","zero","ss01","locl","calt";
}
```
