# @tamagui/portal

Portal component for Tamagui.

## Native Portal Setup

By default, portals on native use [@gorhom/portal](https://github.com/gorhom/react-native-portal). If you want to use React Native's native `createPortal` functionality, you can set it up manually:

```ts
import { setupPortal } from '@tamagui/portal'

// Your custom createPortal implementation
setupPortal({
  createPortal: (children, container) => {
    // Return your portal implementation
  }
})
```

### Legacy Portal

For convenience, if you're on React Native < 0.82 and want native portal support using React Native's internal APIs, you can use the legacy export:

```ts
import { createPortal } from '@tamagui/portal/legacy-portal'
import { setupPortal } from '@tamagui/portal'

// Call this early in your app (before rendering any portals)
if (createPortal) {
  setupPortal({ createPortal })
}
```

> **Warning**: This uses deprecated deep imports from `react-native` (`react-native/Libraries/Renderer/shims/ReactFabric` and `react-native/Libraries/Renderer/shims/ReactNative`) which will be removed in a future React Native version.
