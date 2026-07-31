# Design: one config, loaded once

Written by Lane E, 2026-07-31, answering the manager's open question: what is
the right thing to do about duplicate core copies and duplicate configs, and
how do we make sure we only ever load one config. Design only; nothing here is
implemented. Everything cited was read from source at `9b3c02c39c`.

## The invariant, stated once

**A process evaluates the user's config module exactly once, `createTamagui`
runs exactly once per core instance, and any other core instance that needs
the config receives it as a value, never by re-evaluating anything.** Every
piece below either enforces that or deletes machinery that only existed
because it wasn't true.

The distinction that keeps this honest: there are two different failure
classes wearing one symptom.

- **A second call**: app plus library both calling `createTamagui`, or a
  config module evaluated twice into one core instance. This is user-visible
  error and should throw.
- **Split state**: `createTamagui` ran once, but in a different copy of core
  than the one doing the reading — the reading copy has empty module-local
  token and media state. No throw placement inside `createTamagui` can catch
  this, because the second copy never calls anything; it just reads. It is
  caught at the READ side, and today it is exactly what the
  `globalThis.__tamaguiConfig` fallback papers over: `getSetting` succeeds
  through the global while `useMedia`'s module-local `mediaKeysOrdered` is
  empty. Half-working is the worst outcome this codebase produces, and it is
  manufactured in `config.ts:30-66`.

## What I would do

### 1. `createTamagui` throws on a second call, and the merge dies

`createTamagui.ts:150-157` currently merges any existing config into the new
call. That reconciliation exists only to survive double-calls; under the rule
it is dead and gets deleted, not gated. The guard is the module-local
`setConfigCalledByThisInstance` that already exists in `config.ts` — never a
`globalThis` flag, for a reason that matters: Vite's module runner re-creates
a fresh module graph on config HMR (`runner.clearCache()` in the plugin's
`invalidate`), so a fresh instance legitimately makes its one call. Instance-
scoped, the rule needs no HMR carve-out at all; global-scoped, it would throw
on every config edit in dev.

Throw in development AND production. This fires at startup, not per render,
and a second configuration is equally meaningless in prod — prod-tolerate is
how the V2 merge got normalized. The message must diagnose, not announce:
the two real causes are a duplicated tamagui dependency (CJS and ESM builds
both bundled — check for `.cjs` and `.mjs` copies in devtools, dedupe or pin
resolutions) and a library calling `createTamagui` that should not be.

### 2. Split parse from install, or the rule is unenforceable

`createTamagui` today fuses a pure step (parse tokens/themes/fonts into a
config value) with an effectful step (install into this instance's
module-local state). The throw guards the EFFECT. Fused, every consumer that
legitimately needs a parsed config value more than once per process — the
test suites do this constantly; ten-plus core-test files call `createTamagui`
several times in one instance — becomes a rule violation, and the pressure to
add a bypass flag appears, which is the second path in a costume.

So: an internal pure `parseTamaguiConfig(options): TamaguiInternalConfig`,
and `createTamagui = parse + install-once (throws on repeat)`. The existing
`installTamaguiConfig(config)` stays as the value-handover seam with
**replace** semantics — it never merges, last install wins wholesale, and it
performs no module loading and no CSS discovery. It is the single sanctioned
way a config crosses between core instances or gets swapped by tooling
(compiler config-watch rebuilds, tests). Apps never call it; apps call
`createTamagui` once.

### 3. Delete the global fallback — split state becomes a loud error

`config.ts`: `getConfigFromGlobalOrLocal`'s `globalThis.__tamaguiConfig`
branch, the deferred duplicate-instance warning machinery, and `setConfig`'s
global write all go. A core copy that was never given a config then fails on
first read in every mode — `getConfig` already throws a good message; extend
`getSetting`'s guard to all modes (today production null-derefs
`config.settings`, which is the cryptic
`Cannot read properties of null (reading 'settings')` the Adapt tests hit).
The error names the duplicate-copy diagnosis.

This also settles main's `a4ce4e9bdb`: it globalizes media and token state,
extending exactly the mechanism being deleted. It should not be ported in any
form; under this design it is moot.

### 4. Our own loading paths, audited against the rule

What I found reading every consumer:

| Path | Today | Verdict |
|---|---|---|
| vite web (`vite-plugin/loadTamagui.ts`) | Host evaluates config in the dedicated `tamagui` environment via the module runner and plugin-container resolution; `loadTamaguiFromModules` installs the value into the compiler's host core (`loadTamagui.ts:141`) | **The V3 design working.** One evaluation, one call (in the runner's core), one value handover. Keep as the reference. |
| vite native (`plugin.ts:462`) | Falls back to the standalone esbuild loader (`Static.loadTamagui`) even though the same server has a module runner | **Converge onto the runner** with native conditions in the evaluation environment. This deletes a whole standalone evaluation from the one bundler that doesn't need it. Biggest single win in paths we control. |
| `bundleConfig` ESM parsed branch (`bundleConfig.ts:482`) | Evaluates the bundled config once (format-detected, ESM `import`), whose graph binds the ESM core copy; the compiler's CJS host copy gets nothing — this is the live bug behind the empty token/media state | **Add the same value handover the reference path has** (`installTamaguiConfig` on the parsed branch — the edit is already in my working tree, held). Note this loader is already one-evaluation: `detectModuleFormat` picks ESM or CJS per the config's own format; it never attempts both in one pass. |
| `loadTamaguiSync` (`loadTamagui.ts:376`) | Under `registerRequire` the config evaluates inside the host instance's own graph, so its `createTamagui` call already installed; line 376 then calls `createTamagui` AGAIN on the parsed result | **Our own double-call.** Delete line 373-377; under the new throw it would be the first thing to trip. Sync path is otherwise tests/regenerate-only. |
| `loadTamagui` async unparsed branch (`loadTamagui.ts:74`) | Calls `createTamagui` when the config exported raw options without calling it | Legal: still exactly one call. Keep — it mirrors the app pattern where the entry, not the config module, calls `createTamagui`. |
| webpack (`loader/loader.ts:79`, `TamaguiPlugin.ts:114`) and metro (`frontend.ts:360`) | Standalone loader | Keep the standalone loader: neither bundler exposes a runner-equivalent evaluation primitive. It is already single-module-system per pass; it gains the same parsed-branch handover as bundleConfig (same code path). |
| next-plugin | `loadTamaguiBuildConfigSync` only — build options (`tamagui.build.ts`), not the app config | No app-config evaluation here; out of scope. |
| CLI (`code/core/cli`) | Standalone loader via `@tamagui/static/loadTamagui` | The acknowledged exception. Already deterministic: one module system chosen from the config's own format. Nothing loads both in one pass. |

The honest summary of point 2 of the earlier brief: **only the vite native
path still self-resolves where the host could evaluate.** Webpack, metro and
the CLI self-resolve because their hosts cannot evaluate for us, and that
loader already picks one module system deterministically. The remaining
defect in paths we control was never double-evaluation — it was the missing
value handover on one branch, plus one redundant `createTamagui` call of our
own.

### 5. What this does to the failure inventory

- **The Adapt failures** (`getSetting` on null through a real component
  path): those three tests render with NO config anywhere — not split state
  (the global fallback would have served them if any copy had one; I verified
  `setConfig` writes the global and it was absent). Under this design they
  fail the same way but loudly and instructively in all modes. The actual fix
  is test-side (the file must create a config like its siblings do) and
  belongs to the components lane.
- **Split-state half-working renders** — the class the campaign cares about —
  stop existing: with the fallback deleted, the second copy errors on first
  read with the duplicate-copy diagnosis instead of rendering with frozen
  defaults.
- **A genuinely duplicated core in an app bundle** (CJS+ESM both shipped) is
  not something the runtime can prevent, but it stops being quiet: whichever
  copy the config didn't reach now throws the diagnosis at first use.

## Order of work, when approved

1. Parse/install split + second-call throw + merge deletion + global-fallback
   deletion (one change, `@tamagui/web`, mine). Test fallout: suites that
   re-call `createTamagui` per instance move to `installTamaguiConfig` or the
   pure parse; that churn is the enforcement working.
2. `bundleConfig` parsed-branch handover (held edit) + delete the
   `loadTamaguiSync` double-call + the duplicate-instance integration test
   already drafted (`static-tests/tests/fixtures/duplicate-instance.config.mjs`).
3. Vite native convergence onto the module runner (larger; compiler lane
   coordination — it touches `createTamaguiNativePlugin`'s loading only, not
   the lowering).

Steps 1 and 2 are small and close the live bug class. Step 3 is the deletion
the V3 intent asks for and can follow independently.
