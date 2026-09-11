# `@tamagui/compiler-core`

`CompilerSession` is Tamagui's bundler-neutral compiler API. It owns parsing,
the module graph, invalidation, lowering, and source-map-aware output. The host
owns resolution and loading.

```ts
import {
  CompilerSession,
  resolvedModuleId,
  type CompilerAdapter,
  type HostModuleInput,
} from '@tamagui/compiler-core'

const session = new CompilerSession()
const entry: HostModuleInput = {
  id: resolvedModuleId('/app/Button.tsx'),
  source: buttonSource,
  imports: [
    {
      specifier: './tokens',
      resolvedId: resolvedModuleId('/app/tokens.ts'),
    },
  ],
}

const adapter: CompilerAdapter = {
  target: 'web',
  projectGeneration: configHash,
  host: createYourLoweringHost(),
  async load(id) {
    return modules.get(id) ?? null
  },
}

const result = await session.compile({ module: entry, adapter })
```

Every `HostModuleInput` must contain a canonical id and every import must
already be resolved by the host. Mark package or runtime boundaries with
`external: true`. Call `update()` or `remove()` on watch changes and use the
returned ids to invalidate the host's module graph. Change
`projectGeneration` whenever Tamagui config or component metadata changes.

Adapters should pass the output source map back to their bundler and watch the
dependencies they loaded. Native adapters must reject CSS output rather than
silently dropping it.

The maintained adapters are:

- `@tamagui/vite-plugin` for Vite web and One's iOS/Android Rolldown pipeline
  through its Vite config provider API
- `@tamagui/metro-plugin` for Metro's main-process graph and worker cache
- `tamagui build` for explicit precompilation, including Next.js Turbopack

The legacy `@tamagui/next-plugin` and `tamagui-loader` packages only support
webpack and are outside the v3 compiler path.
