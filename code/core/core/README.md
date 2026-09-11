## core

`@tamagui/core` is an alias. Everything in it now lives in `@tamagui/style`, and this
package re-exports that one so existing imports keep working:

```tsx
import { styled } from '@tamagui/core' // same module instance as @tamagui/style
import '@tamagui/core/reset.css'
```

New code should import `@tamagui/style` directly.

Every entry here is a re-export, never a copy, so there is exactly one runtime and one
piece of module state no matter which specifier an app reaches for. `code/core/core-test/aliasIdentity.test.tsx`
asserts that.
