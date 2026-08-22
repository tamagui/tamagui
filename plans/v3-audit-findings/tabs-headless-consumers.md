# `tabs-headless` consumer-search receipt

Item 24 is held pending the owner decision. The owner decision recorded in
commit `2fb9621152` restores the headless-base pattern for Tabs. This receipt
only records the current package surface and consumer evidence. It does not
change or propose a source implementation.

## 1. Current exports

**[READ]** `code/ui/tabs-headless/src/index.ts:1` is the entire package entry
point:

```ts
export * from './useTabs'
```

**[READ]** The generated declaration at
`code/ui/tabs-headless/types/useTabs.d.ts:88-130` and the source at
`code/ui/tabs-headless/src/useTabs.tsx` show this public surface.

Runtime exports:

- `useTabs` (`src/useTabs.tsx:103-288`)
- `TabsProvider` (`src/useTabs.tsx:294-296`)
- `useTabsContext` (`src/useTabs.tsx:298-304`)
- `useTab` (`src/useTabs.tsx:318-360`)
- `useTabContent` (`src/useTabs.tsx:372-394`)

Public type exports:

- `TabsActivationMode`, `TabsOrientation`, and `Direction`
  (`src/useTabs.tsx:7-9`)
- `UseTabsProps` (`src/useTabs.tsx:15-42`)
- `UseTabsReturn` (`src/useTabs.tsx:44-67`)
- `TabTriggerProps` (`src/useTabs.tsx:69-81`)
- `TabContentProps` (`src/useTabs.tsx:83-91`)
- `TabsContextValue` (`src/useTabs.tsx:93-101`)
- `UseTabProps` (`src/useTabs.tsx:310-316`)
- `UseTabContentProps` (`src/useTabs.tsx:367-370`)

**[READ]** The built ESM entry re-exports `useTabs.mjs`
(`code/ui/tabs-headless/dist/esm/index.mjs:1`), whose final export list is
`TabsProvider, useTab, useTabContent, useTabs, useTabsContext`
(`code/ui/tabs-headless/dist/esm/useTabs.mjs:252`). The CJS and native builds
list the same five runtime exports.

The package exposes only the root entry and `./package.json` in its exports
map. There are no additional public hook entrypoints in
`code/ui/tabs-headless/package.json:15-25`.

## 2. In-repo consumers and sites

### Executable source

**[READ]** A tracked-repository search for `tabs-headless` and
`@tamagui/tabs-headless`, followed by a source-only search over `*.ts`,
`*.tsx`, `*.js`, `*.jsx`, `*.mjs`, and `*.cjs`, found no executable source
import or re-export of `@tamagui/tabs-headless` outside the package itself.
In particular, the styled package imports its own local context and Tabs
implementation (`code/ui/tabs/src/Tabs.tsx:13`), and its barrel exports only
`StyledContext` and `Tabs` (`code/ui/tabs/src/index.ts:1-2`).

The existing audit statement that the package had no consumer in the surveyed
component, demo, or kitchen-sink trees is therefore confirmed for this
checkout (`plans/v3-audit-findings/cleanup-ui.md:7,30`).

### `tamagui.dev` site content

These are documentation examples and install instructions, not imports used
by the site's runtime application:

- `code/tamagui.dev/data/docs/components/tabs/3.0.0.mdx:85-88` tells readers
  to install `@tamagui/tabs-headless`.
- `code/tamagui.dev/data/docs/components/tabs/3.0.0.mdx:138` imports
  `useTabs`.
- `code/tamagui.dev/data/docs/components/tabs/3.0.0.mdx:165` imports
  `useTabs`, `TabsProvider`, `useTab`, and `useTabContent`.
- `code/tamagui.dev/data/docs/components/tabs/2.0.0.mdx:85-88` repeats the
  install instructions.
- `code/tamagui.dev/data/docs/components/tabs/2.0.0.mdx:138` imports
  `useTabs`.
- `code/tamagui.dev/data/docs/components/tabs/2.0.0.mdx:165` imports
  `useTabs`, `TabsProvider`, `useTab`, and `useTabContent`.
- `code/tamagui.dev/data/blog/version-two.mdx:434-438` names
  `@tamagui/tabs-headless` as a headless package and names `useTabs` as one of
  its hooks. This is prose, not an executable import.

**[READ]** The only site represented by these references is `tamagui.dev`,
with two versioned Tabs documentation pages and one blog post. There is no
tracked application or test import in this checkout.

## 3. Standalone npm package versus re-export

**[READ]** `code/ui/tabs-headless/package.json` identifies a separate package:

```json
{
  "name": "@tamagui/tabs-headless",
  "version": "2.7.7",
  "source": "src/index.ts",
  "files": ["src", "types", "dist"],
  "main": "dist/cjs",
  "module": "dist/esm",
  "types": "./types/index.d.ts",
  "publishConfig": { "access": "public" }
}
```

The exact fields are at `code/ui/tabs-headless/package.json:2-14` and
`:27-29`. It is also under the root workspace glob `./code/ui/**/*`
(`package.json:8-23`), and the release package scanner collects each
workspace directory with a named `package.json`
(`scripts/release.ts:212-234`).

**[READ]** This is repository evidence that `@tamagui/tabs-headless` is
configured as its own public, publishable package. It does not prove that a
particular version is currently present in the npm registry. Registry state,
external consumer count, and download counts are not available from this
checkout.

**[READ]** The package is not re-exported by the sibling or umbrella packages
in this repository:

- `code/ui/tabs/src/index.ts:1-2` exports only the styled Tabs package's local
  `StyledContext` and `Tabs` modules.
- `code/ui/tamagui/src/index.ts:43` re-exports `@tamagui/tabs`, not
  `@tamagui/tabs-headless`; its generated barrel says the same at
  `code/ui/tamagui/types/index.d.ts:42`.
- `code/ui/ui/src/index.ts:55` and
  `code/ui/ui/types/index.d.ts:43` also re-export only `@tamagui/tabs`.
- `code/ui/tamagui/package.json:252-260` exposes a `./tabs` subpath, and
  `:355-361` depends on `@tamagui/tabs`; it has no `tabs-headless` subpath or
  dependency.
- The only tracked `package.json` containing the literal package name is
  `code/ui/tabs-headless/package.json:2`.

## 4. Concrete external-consumer impact

**[READ]** A consumer using the documented API currently has code shaped like
this:

```ts
import { useTabs } from '@tamagui/tabs-headless'
import { useTabs, TabsProvider, useTab, useTabContent } from '@tamagui/tabs-headless'
```

The documented `useTabs` example consumes `tabsProps`, `listProps`,
`getTabProps`, `getContentProps`, and `value`
(`3.0.0.mdx:138-154`). The component-based example consumes
`contextValue` and `tabsProps` from `useTabs`, then `TabsProvider`, `useTab`,
and `useTabContent` (`3.0.0.mdx:165-180`). The public declaration also makes
`useTabsContext` available even though the docs do not import it
(`types/useTabs.d.ts:88-90`).

If the standalone package went away with no compatibility entrypoint, an
external consumer would have to:

1. Remove `@tamagui/tabs-headless` from its dependencies and install the
   chosen replacement package.
2. Change every import specifier from `@tamagui/tabs-headless` to that
   replacement. The current repository does not identify a replacement
   package or replacement subpath.
3. Adapt calls if the replacement does not preserve all five runtime exports
   and the associated hook contracts. Switching to the currently re-exported
   `@tamagui/tabs` or `tamagui/tabs` is not a drop-in source edit based on this
   checkout: those entries expose the styled `Tabs` API, while the current
   headless package exposes hooks and prop builders.
4. Update lockfiles, documentation, and any published examples that refer to
   the old package name.

If the implementation is merged into `@tamagui/tabs` while preserving these
five runtime names and their type surface, the concrete consumer changes are
the dependency declaration and import specifier only. If the old package name
continues to resolve through a published compatibility package, consumers can
make no source change during the transition, but that compatibility package
means the old public package has not actually disappeared.

**[INFERRED recommendation]** Treat the root package name and the five runtime
exports as a public compatibility contract until an owner-approved migration
target exists. The repository itself cannot determine how many outside users
depend on that contract, but the docs explicitly instruct users to install and
import it, and the manifest configures it as a public standalone package.

## Limits of this receipt

**[READ]** The search can establish repository consumers and documented usage.
It cannot enumerate npm consumers, private applications, unpublished forks, or
download volume. Those facts require registry, telemetry, or owner-provided
external data and are intentionally not guessed here.
