# Core dead-code scan

Scope: `code/core/web/src` and `code/core/style-grammar/src`. I read
`plans/v3-beta/v3-style-engine-plan.md` and `CONTRIBUTING.md` first. I ran
`bun run check` at the repository root. It passed, including `knip`, with no
unreferenced files or dependencies reported. Generated `types/`, `dist/`, and
comparison output were excluded from consumer searches.

The findings below are limited to items not already listed in the V3 style
engine plan. “READ” means the implementation and repository-wide search were
checked directly. External deep imports cannot be observed from this checkout,
so that risk is called out where relevant.

## Findings, ranked by value

1. **Retire the old-markup selector compatibility branch.**

   - **What:** `getThemeCSSRules` adds a second selector for every theme name
     using `:not(#t_theme_full_name)`. The source says this exists only for
     markup emitted by older runtimes/extractors and can go after mixed-version
     and previously extracted markup no longer need it.
   - **File:** `code/core/web/src/helpers/getThemeCSSRules.ts:64-73`
   - **Who consumes it:** `code/core/web/src/helpers/createDesignSystem.ts:10,153`
     calls `getThemeCSSRules` while generating theme CSS. The resulting CSS is
     consumed by the web runtime through the design system.
   - **Why it is a win:** READ - the branch creates extra selector strings and
     selector matching work for every generated theme. Removing it cuts CSS
     output and one compatibility path without changing the authoritative full
     theme selector.
   - **Risk of removing it:** Existing server-rendered or extracted markup
     that has only the old class shape may stop receiving theme rules. Whether
     supported artifacts still exist outside this repository is unverified.
   - **Rough effort:** small, plus a compatibility fixture or migration check.

2. **Delete the unused legacy transition migration module and tooling export.**

   - **What:** `migrateLegacyTransition` lowers the old array and per-property
     object transition forms into the new transition IR. It is exported from
     the public tooling entrypoint at
     `code/core/style-grammar/src/tooling.ts:38`, but it has no production
     source consumer.
   - **File:** `code/core/style-grammar/src/transitionLegacy.ts:43-50`
     and `tooling.ts:38`
   - **Who consumes it:** Only
     `code/core/style-grammar/src/__tests__/transition.test.ts:3,146,200,220,295`,
     `__tests__/entrypoints.test.ts:3,19-27`, and
     `__tests__/distParity.test.ts:42`. Repository planning documents call it a
     migration prototype, but no application or compiler source imports it.
   - **Why it is a win:** READ - the entire module is compatibility parsing,
     diagnostics, and spring-key handling for a legacy input shape. Removing
     the module, its tooling export, and tests deletes shipped tooling code and
     an API surface that currently has no in-repo runtime consumer.
   - **Risk of removing it:** An external consumer may import the `/tooling`
     subpath or depend on this migration function. That external usage is
     unverified. Any still-supported legacy transition input would lose its
     migration path.
   - **Rough effort:** small to medium, including an explicit public API
     decision and deleting or replacing the migration-only tests.

3. **Remove the duplicate-instance global config fallback after the supported
   bundling boundary is settled.**

   - **What:** `getConfigFromGlobalOrLocal` checks a module-local config first,
     then reads `globalThis.__tamaguiConfig`, schedules a duplicate-instance
     warning, and maintains two global warning flags.
   - **File:** `code/core/web/src/config.ts:27-65`
   - **Who consumes it:** The web config accessors at `config.ts:67-75,
     82-142,167-179,221-224` use it, including `getSetting`, `getConfig`,
     `getTokens`, and theme/token access. These are called by the web style and
     design-system code.
   - **Why it is a win:** INFERRED - once Tamagui has one supported config
     instance per bundle, deleting this fallback removes global mutable state,
     a timer and warning machinery, and a branch from every config lookup. It
     makes config identity explicit and follows the V3 move away from
     compatibility recovery.
   - **Risk of removing it:** READ - the comments explicitly name Vite SSR
     bundling with multiple Tamagui copies as the supported reason for this
     path. HMR and duplicate-package SSR behavior can regress unless that
     packaging issue is fixed or support is intentionally dropped.
   - **Rough effort:** medium to large, because duplicate-instance behavior
     needs a bundler-level fix and a runtime test before deletion.

4. **Remove the duplicate-context theme fallback once context identity is
   enforced.**

   - **What:** `_withStableStyle` reconstructs a theme from config when it has
     theme keys, no parent marker, and no `ThemeStateContext`, then warns about
     duplicate Tamagui instances.
   - **File:** `code/core/web/src/_withStableStyle.tsx:43-77`
   - **Who consumes it:** `_withStableStyle` is exported from
     `code/core/web/src/index.ts:5` and wrapped by
     `code/core/web/src/_withNativeStyle.tsx:19`; regular styled/native view
     rendering reaches this path when the context is absent.
   - **Why it is a win:** INFERRED - removing the fallback cache and theme
     reconstruction eliminates a second theme-resolution path and makes a
     missing context fail at its source instead of silently selecting a config
     theme.
   - **Risk of removing it:** READ - the code identifies a monorepo different-
     instance context as the case it handles. Removing it before package and
     context identity are guaranteed can break styles in duplicate-instance
     monorepos. The frequency of that case is unverified.
   - **Rough effort:** medium, coupled to the duplicate-instance decision.

5. **Remove the deprecated standalone DOM entry after compiler migration.**

   - **What:** The standalone `style()` handle, its style types, and generated
     `html` tag stubs are repeatedly marked deprecated and described as
     implementation plumbing. Runtime calls intentionally throw because the
     compiler is expected to replace them.
   - **File:** `code/core/web/src/dom/standalone.ts:23-33,35-51,57-71,83-101`
     and `dom/standaloneHtml.ts:23-36`
   - **Who consumes it:** The compiler recognizes and lowers
     `@tamagui/core/dom` in `code/compiler/static/src/compilerHost.ts:86` and
     `domStructuralPass.ts:23`; static and core tests import it, including
     `code/compiler/static-tests/tests/domConformance.web.test.tsx:8-49` and
     `code/core/core-test/domEntries.web.test.tsx:2-15`. The package entrypoints
     re-export it from `code/core/web/src/dom/index.ts:2,9-16` and
     `index.native.ts:2,21-28`.
   - **Why it is a win:** READ - deleting the deprecated standalone entry and
     moving compiler fixtures to the ordinary root `html` path removes a
     separate compile-only API, its throwing runtime stubs, and duplicated type
     maintenance.
   - **Risk of removing it:** High. The compiler and tests still consume this
     entry, and external users may rely on `@tamagui/core/dom` or
     `tamagui/dom`. This is a planned deprecation candidate, not a safe direct
     deletion today.
   - **Rough effort:** large, including compiler fixture migration, package
     export changes, and a documented breaking change.

6. **Delete the native cache-statistics probe or move it out of the runtime
   module.**

   - **What:** `getNativeStyleEngineCacheStats` walks all compiled mappings and
     state sets to expose cache sizes.
   - **File:** `code/core/web/src/helpers/nativeStyleEngine.ts:231-239`
   - **Who consumes it:** Only
     `code/core/core-test/nativeStyleEngineCache.native.test.tsx:3,41,46-48`
     imports it. `web/src/index.ts:19-25` re-exports the engine operations and
     flush listener, but not this statistics function. No production source
     consumer was found.
   - **Why it is a win:** READ - this is test instrumentation that adds a
     full-cache traversal and an exported symbol to the runtime helper. The
     cache test can be removed with it or replaced by an internal test hook.
   - **Risk of removing it:** An undocumented deep import or an external probe
     may use it; that is unverified. Removing the existing cache-bound test also
     loses its current guard unless an equivalent integration measurement is
     retained.
   - **Rough effort:** small.

7. **Delete the unused identifier map from the dev `Tamagui` introspection
   object.**

   - **What:** `Tamagui` exposes `identifierToValue`, while
     `getValueFromIdentifier` and `setIdentifierValue` read and write a private
     map. No producer or reader exists in the repository.
   - **File:** `code/core/web/src/Tamagui.ts:10-47`
   - **Who consumes it:** The `Tamagui` object itself is exported from
     `code/core/web/src/index.ts:63`; whole-repo searches found no consumer of
     `identifierToValue`, `getValueFromIdentifier`, or `setIdentifierValue`.
     The docs mention the dev `Tamagui` object and `allSelectors`, but do not
     mention this map.
   - **Why it is a win:** READ - the map is always empty in this repository and
     its three accessors add dev-only state and API surface with no in-repo
     behavior.
   - **Risk of removing it:** `Tamagui` is an introspection API and external
     code may access these names even though no repository consumer does. That
     usage is unverified.
   - **Rough effort:** small.

8. **Delete the orphaned `getFontLanguage` helper.**

   - **What:** A one-line helper derives a language suffix from a font family.
   - **File:** `code/core/web/src/helpers/getFontLanguage.ts:1`
   - **Who consumes it:** Whole-repo search found no source or test consumer;
     only the generated declaration mentions it, which was excluded from the
     search. It is not re-exported by `web/src/index.ts`.
   - **Why it is a win:** READ - deleting the file removes an unreferenced
     source module and stale declaration generation input.
   - **Risk of removing it:** An undocumented deep import could exist outside
     the repository. No in-repo behavior depends on it.
   - **Rough effort:** trivial.

9. **Delete `noteOnce`, including its test-only pin, or relocate it to test
   utilities.**

   - **What:** `noteOnce` keeps a development-only message set, clears it at a
     bound, and warns once per message.
   - **File:** `code/core/web/src/helpers/noteOnce.ts:1-9`
   - **Who consumes it:** The only source consumer is
     `code/core/core-test/noteOnce.web.test.tsx:2,11-17`, which exists to pin
     this helper's dedupe and bounded-cache behavior. No web production source
     imports it, and it is not exported from `web/src/index.ts`.
   - **Why it is a win:** READ - the runtime package carries a development
     warning helper with no production call site. Deleting it removes the
     module and its set allocation; the test-only behavior can disappear with
     the unused helper.
   - **Risk of removing it:** An undocumented deep import or an unbuilt local
     debugging call may exist outside the repository. That is unverified.
   - **Rough effort:** trivial.

10. **Remove the unused native `getStyleAtomic` no-op export.**

    - **What:** The native CSS-atomic compatibility module defines one shared
      warning no-op and exports four aliases. `getStyleAtomic` has no consumer.
    - **File:** `code/core/web/src/helpers/getCSSStylesAtomic.native.ts:1-8`
    - **Who consumes it:** Whole-repo search found no source or test consumer
      of `getStyleAtomic`. The other aliases have platform-resolved consumers,
      so only this export is a candidate.
    - **Why it is a win:** READ - removing the unused alias shrinks the native
      compatibility API without touching the live aliases.
    - **Risk of removing it:** An external deep import is unverified. The
      function is already a no-op that only warns, so no in-repo behavior is
      lost.
    - **Rough effort:** trivial.

11. **Remove the dead dynamic-value extractor export and inline the one-use
    scheme helper.**

    - **What:** `extractValueFromDynamic` is exported but never called. In the
      same module, `getOppositeScheme` is exported and called exactly once by
      `getDynamicVal`.
    - **File:** `code/core/web/src/helpers/getDynamicVal.ts:1-3,40-63`
    - **Who consumes it:** `getDynamicVal` and `isColorStyleKey` are live. The
      whole-repo search found no consumer of `extractValueFromDynamic`; the
      only call to `getOppositeScheme` is `getDynamicVal.ts:49`. `getDynamicVal`
      is used by `hooks/getThemeProxied.ts:168,191`, and
      `isColorStyleKey` is used by direct-style code.
    - **Why it is a win:** READ - deleting the unused extractor removes dead
      API surface, and inlining the three-line opposite-scheme branch removes a
      helper used once. The live dynamic-color code remains unchanged.
    - **Risk of removing it:** External deep imports of either exported helper
      are unverified. The `getOppositeScheme` export is not needed by any
      repository consumer.
    - **Rough effort:** trivial.

12. **Inline `getTokenObject` into `getToken`.**

    - **What:** `getTokenObject` is an exported helper called only by the next
      function in the same file.
    - **File:** `code/core/web/src/config.ts:145-155`
    - **Who consumes it:** `getToken` at `config.ts:153` is the only call site;
      `getToken` and `getTokenValue` are exported through `web/src/index.ts:78-80`.
      No other source or test imports `getTokenObject`, and it is not included
      in that explicit root export list.
    - **Why it is a win:** READ - inlining removes one function and one
      deep-importable symbol while keeping the live token lookup API and logic.
    - **Risk of removing it:** An undocumented deep import from the config
      module is unverified.
    - **Rough effort:** trivial.

13. **Inline the single-use `mergeStyleBranch` helper.**

    - **What:** `mergeStyleBranch` is a private helper called once at
      `mergeVariants.ts:53`; it contains the per-property merge loop.
    - **File:** `code/core/web/src/helpers/mergeVariants.ts:8-24,53`
    - **Who consumes it:** Only `mergeVariants` calls it. `mergeVariants` is
      used by `code/core/web/src/styled.tsx:16,620` and covered by
      `code/core/core-test/mergeVariants.web.test.tsx`.
    - **Why it is a win:** READ - inlining removes a one-call abstraction and
      leaves one implementation path for this merge operation. The existing
      behavior tests exercise the containing function.
    - **Risk of removing it:** Low functional risk if the loop is copied
      unchanged; the main risk is making the recursive function harder to read.
    - **Rough effort:** trivial.

14. **Stop exporting internal style-grammar tables and helpers from the
    wildcard tooling entrypoint.**

    - **What:** These symbols are exported by wildcard through
      `code/core/style-grammar/src/tooling.ts:2-43`, but repository-wide source
      searches found no non-test consumer of the export itself:
      `namedCssColors` (`backgroundFamily.ts:3`, used internally at `:92`),
      `borderFamilyTargets` (`borderFamily.ts:21`, used internally at `:112`),
      `fontShorthandTargets` (`fontShorthand.ts:24`, used internally at `:79`),
      `propToGrammarEntry` (`registry.ts:144`, used internally at `:149`),
      and `hasTokenName` (`candidate.ts:199`, used internally by candidate
      parsing). `encodeArbitrary` (`candidate.ts:685`) is used internally at
      `candidate.ts:624` and directly by only
      `__tests__/candidate.test.ts:6`.
    - **Who consumes it:** The named tables and helpers are consumed by their
      defining modules. `encodeArbitrary` is additionally consumed only by its
      test. No application, compiler, language-service, codemod, or other
      repository source imports these names from the tooling entrypoint.
    - **Why it is a win:** READ - removing only the excess `export` keywords
      shrinks the `/tooling` declaration and API surface while preserving the
      internal implementations. This is a small API cleanup rather than a
      runtime byte claim.
    - **Risk of removing it:** External style-grammar tooling may import these
      names from `/tooling`; that usage is unverified. `encodeArbitrary`'s
      direct test pin would need to test it through the public candidate path or
      be removed.
    - **Rough effort:** small.

15. **Remove the zero-consumer `THEME_NAME_SEPARATOR` export.**

    - **What:** The separator constant is exported from the constants module,
      but no source or test reads it.
    - **File:** `code/core/web/src/constants/constants.ts:3`, re-exported by
      `web/src/index.ts:90`
    - **Who consumes it:** Whole-repo search found no source or test consumer.
      The other constants in the same module have live consumers, so this is a
      symbol-level cleanup.
    - **Why it is a win:** READ - it removes a stale root API symbol and its
      generated declaration without changing theme-name behavior, which is
      currently authored inline wherever needed.
    - **Risk of removing it:** External users may import the constant from the
      root package. That usage is unverified.
    - **Rough effort:** trivial.

## Checked and found nothing

- `bun run check`: passed. `knip` reported no unused files or dependencies.
- `web/src/helpers/directStyle.ts`, `getSplitStyles.tsx`, `propMapper.ts`, and
  their related style-program paths: I excluded the known V3 plan findings,
  including `contextOnly`, which has non-default callers.
- `style-grammar/src/transformFamily.ts`, `borderFamily.ts`,
  `fontShorthand.ts`, `textDecorationFamily.ts`, `serializePayload.ts`,
  `programHash.ts`, `programs.ts`, `states.ts`, and `table.ts`: several exports
  are currently test-only or internally consumed, but the current V3 plan
  explicitly treats these grammar, lowering, serialization, and state tables
  as active/future engine work. I did not label those implementations dead.
- `web/src/helpers/getThemeProxied.ts`, `eventHandling.native.ts`,
  `expandStyles.ts`, `views/Theme.tsx`, and `types.tsx`: the TODOs and fallback
  branches have live callers or describe planned follow-up behavior, so they
  are not zero-consumer findings.
- `web/src/dom/standalone.ts` and `standaloneHtml.ts`: included above as a
  deprecation/removal candidate, not as currently unreachable code, because the
  compiler and static tests still consume them.
