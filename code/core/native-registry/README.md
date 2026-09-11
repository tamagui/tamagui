# @tamagui/native-registry

`@tamagui/native-registry` is the native engine for Tamagui's experimental
theme fast path. It links eligible Fabric views to a small C++ registry and
applies theme changes through one ShadowTree commit without re-rendering those
views in React.

The package supports React Native 0.82 and newer. It uses
`react-native-nitro-modules`, so adding it requires rebuilding the native app.

## Enable the experiment

Install both native packages:

```sh
bun add @tamagui/native-registry react-native-nitro-modules
```

Enable compiler output in `tamagui.build.ts`:

```ts
import type { TamaguiBuildOptions } from 'tamagui'

export default {
  config: './tamagui.config.ts',
  components: ['tamagui'],
  experimental: {
    nativeFastPath: true,
  },
} satisfies TamaguiBuildOptions
```

Install the engine before the themed application tree mounts:

```ts
import * as nativeRegistry from '@tamagui/native-registry'
import { setNativeStyleEngine } from 'tamagui'

if (nativeRegistry.isAvailable()) {
  setNativeStyleEngine(nativeRegistry)
}
```

Then rebuild the iOS and Android applications. A Metro reload cannot add the
native module to an existing binary.

This API is experimental. Keep the flag off for production applications unless
you can run the native correctness suite for the React Native versions and list
implementations your application ships.

## Fallback behavior

The flag defaults to `false`. With the flag off, native compiler output is
unchanged. With the flag on but no engine installed, emitted components use the
existing theme hook and React render path. Web output is unchanged in both
cases.

The registry coexists with Tamagui's existing `DynamicColorIOS` optimization.
It does not replace or remove that path.
