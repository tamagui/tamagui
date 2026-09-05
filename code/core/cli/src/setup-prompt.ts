// The agent brief for setting Tamagui up in a project that has never had it.
// `tamagui migrate --from v2` is the sibling for projects that already run v2.
//
// Both are printed by the CLI rather than kept only in docs so that whatever
// version a user installs describes itself, instead of an agent reading a docs
// page written against a different release.

export function printSetupPrompt() {
  process.stdout.write(getSetupPrompt())
}

export function getSetupPrompt() {
  return `You are adding Tamagui v3 to a project that does not use it yet.

Work like a careful coding agent:

- Read the project first: package manager, bundler, framework, TypeScript config,
  and whether it targets web, native, or both. Every choice below depends on it.
- Make the smallest install that actually runs, then verify it before adding more.
- Do not restyle existing components as part of setup.
- Do not publish packages, rotate secrets, or change production infrastructure.
- Stop and report if a step cannot be completed rather than guessing around it.

## 1. Check the baseline

Tamagui v3 requires React 19+, TypeScript 5+, and, for native apps, React Native
0.81+ with the New Architecture enabled. Web-only apps have no React Native
version requirement. If the project is below any of these, say so and stop.

## 2. Install

Tamagui v3 is currently a beta on the \`beta\` dist-tag. Resolve it once and pin
every package to the same version, because a mixed install silently produces two
copies of the runtime and styles that do nothing.

\`\`\`bash
V=$(npm view tamagui@beta version)
npm i tamagui@$V @tamagui/config@$V
\`\`\`

\`tamagui\` is a superset of \`@tamagui/core\`. Install \`@tamagui/core\` alone
only for a styling-only install with no UI kit.

## 3. Create the config

\`\`\`tsx
// tamagui.config.ts
import { defaultConfig } from '@tamagui/config/v6'
import { createTamagui } from 'tamagui'

export const config = createTamagui(defaultConfig)

declare module 'tamagui' {
  interface TamaguiCustomConfig extends typeof config {}
}
\`\`\`

Pick an animation driver explicitly and import it from \`@tamagui/config\`:
\`animations-css\` (web), \`animations-rn\`, \`animations-reanimated\`, or
\`animations-motion\`. Do not install \`@tamagui/theme-builder\` or any v5 builder
package; they are not part of v3.

## 4. Wrap the app

\`\`\`tsx
import { TamaguiProvider, View } from 'tamagui'
import { config } from './tamagui.config'

export default function App() {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <View width={200} height={200} bg="background" />
    </TamaguiProvider>
  )
}
\`\`\`

## 5. Wire the bundler

Add the adapter for the bundler this project actually uses, and no others:

- Vite: \`@tamagui/vite-plugin\`, or \`@tamagui/cli/vite\`
- Metro: \`@tamagui/metro-plugin\`, or \`@tamagui/cli/metro\`
- Next.js: \`@tamagui/next-plugin\`
- Turbopack: the \`tamagui build\` precompile step

There is no Webpack plugin in v3.

The compiler is an optimization, not a requirement. If wiring it is not
straightforward, skip it, note that you skipped it, and confirm the app runs
first.

## 6. Write styles the v3 way

This is the part most likely to be written as if it were v2. In v3, token and
theme names are bare, and conditions are flat clauses inside the value:

\`\`\`tsx
<View bg="background hover:background-hover" p="4 sm:6" />
\`\`\`

- No \`$\` sigils: \`bg="background"\`, not \`bg="$background"\`.
- No condition objects: there is no \`hoverStyle={{ ... }}\` and no \`$sm={{ ... }}\`.
- Modifiers chain left to right and read as prefixes: \`hover:sm:small\`.
- Clauses work on variant props too, not just style props, so
  \`size="large sm:small"\` selects a different variant value per condition.
- When two clauses both apply, the winner is decided by specificity, not by
  source order: first by platform (\`ios:\` beats \`native:\` beats unprefixed),
  then by how many conditions the clause carries, then by category
  (media < container < theme < group < state). Writing a clause later in the
  string does not make it win.
- A chain is capped at five distinct non-platform conditions.

## 7. Verify before reporting success

\`\`\`bash
npx tamagui check
\`\`\`

\`tamagui check\` reports version mismatches, duplicate installs, lockfile
problems, a missing config, and any v2 style syntax left in source. Then run the
project's own typecheck and build, and start the app and confirm a Tamagui
component renders with its styles applied. A passing typecheck is not sufficient:
flat values are strings, so a misspelled token compiles cleanly and only shows up
at runtime.

## 8. Give the agent the project's own vocabulary

Once the app runs, generate a description of this project's actual tokens,
themes, and components so later prompts do not guess at them:

\`\`\`bash
npx tamagui generate-prompt
\`\`\`

That writes \`tamagui-prompt.md\`. Keep it in the repo and regenerate it when the
config changes.
`
}
