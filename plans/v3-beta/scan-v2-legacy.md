# V2 legacy surface scan

Scope: `code/core/web/src` and `code/core/*`, with history checked where it identified the compatibility origin. The current V3 style-engine plan was read in full first. Findings below are ranked by likely value, with public API risk called out conservatively.

## Findings

### 1. Remove the `styleCompat` modes and their dispatch

- **What:** `StyleCompat` exposes `legacy`, `react-native`, and `web`. `expandFlex` has three separate flex-expansion behaviors, selected at runtime by `getStyleCompat`.
- **Where:** `code/core/web/src/config.ts:15`, `code/core/web/src/config.ts:81-84`, `code/core/web/src/helpers/expandStyle.ts:19-78`. The current type documentation at `code/core/web/src/types.tsx:1195-1205` explicitly describes `legacy` as preserving Tamagui v1 behavior and `react-native` as the RN/Yoga behavior.
- **Consumers:** The internal style emitters pass `conf.settings.styleCompat` at `code/core/web/src/helpers/propMapper.ts:103,176` and `code/core/web/src/helpers/directStyle.ts:1923-1925`. The public web entrypoint exports `getStyleCompat` and `StyleCompat` at `code/core/web/src/index.ts:73-85`. Tests configure all three paths in `code/core/core-test/getStylesAtomic.web.test.tsx:14-20,91-140`.
- **Evidence:** Commit `d72304a67b`, “Implement v2 style compatibility modes,” added this type, switch, documentation, and tests. This is direct evidence that the surface was introduced for V2 compatibility.
- **Classification:** **(b) public breaking change.** The setting and helper type are public, even though the internal style emitters are the only repository runtime consumers.
- **Why it is a win:** V3 can author web flex semantics and keep native conversion in the adapter direction. Removing the three-way branch, getter, exported type, and compatibility setting reduces runtime dispatch and configuration surface.
- **Risk of removing it:** Consumers configured with `styleCompat: 'legacy'` or `'react-native'` will change flex results. Consumers importing `getStyleCompat` will break. A migration note should tell users to author the desired web or native styles explicitly and remove the setting. The direct-style path is already slated for removal by the V3 plan, but the equivalent compatibility branch in the remaining style path still needs removal.
- **Rough effort:** Medium. Update the style emitter and configuration types, remove the public export, update the flex tests, and document the migration.

### 2. Delete the flat top-level settings fallback

- **What:** `getSetting` reads `config.settings[key] ?? config[key]`, retaining support for settings that used to live at the top level.
- **Where:** `code/core/web/src/config.ts:67-79`. The fallback is accompanied by a `@ts-expect-error` because the current config type no longer declares the flat property.
- **Consumers:** Current source consumers call `getSetting` for the nested settings API, including `code/core/web/src/helpers/variables.ts:307`, `code/core/web/src/helpers/getVariantExtras.tsx:29`, `code/core/web/src/helpers/getThemeCSSRules.ts:131,141,176`, `code/core/web/src/views/ThemeProvider.tsx:13`, `code/core/web/src/views/TamaguiProvider.tsx:81`, and the hooks under `code/core/web/src/hooks/`. The public web entrypoint exports it at `code/core/web/src/index.ts:73-76`. `CreateTamaguiProps` only advertises `settings` at `code/core/web/src/types.tsx:1411-1442`.
- **Evidence:** Commit `70ac20ddcd`, “move all settings passed into createTamagui into the settings object and deprecate the flat-style settings,” added this fallback while deprecating the old shape. `code/core/web/src/createTamagui.ts:183-191` reads nested settings directly for normalization.
- **Classification:** **(b) public breaking change.** The current public type no longer advertises flat settings, but the runtime fallback still accepts them, and `getSetting` itself is exported.
- **Why it is a win:** The fallback and its type escape can be deleted, leaving one settings shape and one lookup path. This removes compatibility work on every setting read.
- **Risk of removing it:** Older V2 configurations that still pass a recognized setting at the top level will silently stop taking effect. The migration is mechanical: move each setting under `settings`; a migration note or codemod is appropriate.
- **Rough effort:** Small to medium. Remove the fallback, audit the setting declarations, and exercise configuration creation with nested settings.

### 3. Remove `webContainerType` as a compatibility setting

- **What:** `webContainerType` is a configurable compatibility control for implicit web group containers. It is defaulted in config and threaded through several style-generation branches.
- **Where:** The public setting is documented at `code/core/web/src/types.tsx:1289-1300`; the default is installed at `code/core/web/src/createTamagui.ts:257-269`. `code/core/web/src/helpers/getSplitStyles.tsx:595-606` reads it, `:754-785` uses it when synthesizing group and explicit container CSS, and `:1232-1245` uses it for named-container fallback behavior. The CLI prompt generator also reads it at `code/core/cli/src/generate-prompt.ts:115-119`.
- **Consumers:** The web style splitter and CLI prompt generator are the repository consumers. The option is part of the public Tamagui settings type, so external `createTamagui` callers are also consumers.
- **Evidence:** Commit `bf3dce0a6b`, “fix(web): v2 groups answer container queries under the compat setting,” describes the setting as the V2 group/container compatibility behavior and says the later major removes it when groups become state-only. Commit `92e3bb9a6c` changed its default while fixing the compatibility behavior.
- **Classification:** **(b) public breaking change.** The setting is public and changes generated CSS and group query behavior.
- **Why it is a win:** Removing the setting, default, fallback, and CLI prompt field makes containment an authored V3 `container` concern instead of a hidden group compatibility mode. It also removes the `webContainerType || 'inline-size'` fallback branches.
- **Risk of removing it:** Users depending on implicit group containment or a custom container type will lose those queries. The migration note should point to explicit V3 `container`, `containerName`, and `containerType` props where containment is intended. The current V3 plan discusses changing implicit group/container behavior, but does not separately identify this setting and its default as a removal decision.
- **Rough effort:** Medium. Coordinate the setting removal with the planned group semantics change, compiler/style output coverage, and CLI prompt generation.

### 4. Remove `defaultPosition`

- **What:** `defaultPosition` is a config option that injects `position: 'relative'` into every eligible Tamagui component that does not already specify position.
- **Where:** The public option and its default behavior are documented at `code/core/web/src/types.tsx:1361-1365`. Runtime injection is at `code/core/web/src/createComponent.tsx:397-409`; compiler extraction duplicates it at `code/core/compiler/static/src/compilerHost.ts:2049-2057`.
- **Consumers:** `createComponent` and the static compiler are the only repository implementation consumers found. External `createTamagui` callers can configure the public option.
- **Evidence:** Commit `b042409671`, “v2: add defaultPosition setting for Tamagui components and update related configurations,” added the setting and the related runtime behavior. There is no `defaultPosition` declaration in the current nested settings defaults in `code/core/config/src/settings.ts`.
- **Classification:** **(b) public breaking change.** It is a typed configuration option and affects both runtime and compiled output.
- **Why it is a win:** V3 can use explicit authored `position` or component `defaultProps`. Removing this option deletes two parallel checks that must remain behaviorally synchronized and removes a global styling side effect.
- **Risk of removing it:** Existing apps using `settings.defaultPosition: 'relative'` will change layout and may have components whose positioning depended on the injected value. A migration note can recommend explicit `position` in component defaults or authored styles; a codemod may be practical for known configs.
- **Rough effort:** Medium. Remove the runtime and compiler branches together, then cover compiled and uncompiled output with the existing component/compiler tests.

### 5. Consider dropping the `parentSplitStyles` public parameter and merge pass

- **What:** `StyleSplitter` accepts `parentSplitStyles`, then copies the parent class names or style keys into the current result after normal style processing.
- **Where:** The parameter is declared at `code/core/web/src/helpers/getSplitStyles.tsx:93-109`; the merge pass is at `code/core/web/src/helpers/getSplitStyles.tsx:1280-1299`. `getSplitStyles` is exported from `code/core/web/src/index.ts:15`.
- **Consumers:** Whole-repository source search found no production producer of a parent split result. Internal calls pass `undefined` or `null`; the direct API test at `code/core/core-test/emitterParity.web.test.tsx:84-114` is the only deliberate repository test of the parameter. Its comment says the parameter has “no repository-internal producer” and keeps the observation for API inventory. The test helper at `code/core/core-test/utils.tsx:44-65` supplies a test value.
- **Evidence:** The parameter and merge implementation are historical public API code, with no current production producer found. The V3 plan does preserve parent-merging behavior in its semantic matrix, so this is an optional API decision rather than a confirmed omission in the plan.
- **Classification:** **(b) public breaking change, with V2-only status unverified.** Removing it is internal to current production callers, but external callers of the exported `getSplitStyles` API may use it.
- **Why it is a win:** If V3 intentionally drops this public API shape, the optional parameter and post-processing branch can be deleted. That removes a style-result mutation path with no current production producer.
- **Risk of removing it:** External callers may pass a parent result directly. There is no repository evidence that this is V2-only, so removal should happen only if direct `getSplitStyles` usage is outside the supported V3 API, with a migration note. Otherwise retain the branch while preserving the planned semantics.
- **Rough effort:** Small to medium. Decide the supported public API first, then remove the parameter, merge code, and API-only test if the decision is to break it.

### 6. Remove the orphaned `getExpandedShorthand` export

- **What:** `getExpandedShorthand` is a one-property lookup helper that checks an authored key and then its inverse shorthand. It has no source consumer other than its export.
- **Where:** The implementation is `code/core/web/src/helpers/getExpandedShorthands.ts:1-6`; the web entrypoint exports the helper directory at `code/core/web/src/index.ts:12`.
- **Consumers:** Whole-repository source search, excluding generated output, found only the definition and entrypoint export. No current core, compiler, CLI, or test source calls the helper.
- **Evidence:** Commit `369ce633d1`, “chore(core): remove deprecated getExpandedShorthands helper,” removed the older plural helper. A later commit, `d1dbe07d15`, reintroduced the singular helper, and `b4be6a49c6` changed its lookup to `inverseShorthands`. The current repository has no internal caller for that replacement.
- **Classification:** **(b) public breaking change, with V2-only status unverified.** The source evidence supports orphaned internal code, but the package export makes external use possible.
- **Why it is a win:** Delete the unused helper and export. This removes code from the package surface without changing current repository runtime behavior.
- **Risk of removing it:** External callers or deep imports may use it even though the repository does not. A deprecation period or migration note is safer than treating the absence of internal callers as proof that it is unused externally.
- **Rough effort:** Small. Remove the source export and its focused API tests if any are added or found during the final package check.

### 7. Drop `migrateLegacyTransition` from the public tooling entrypoint after the V3 migration window

- **What:** `transitionLegacy.ts` lowers legacy transition arrays and per-property object forms into transition IR. It is a tooling migration helper, not a runtime style emitter.
- **Where:** The legacy input shapes and migration function are at `code/core/style-grammar/src/transitionLegacy.ts:9-12,43-47`; the tooling entrypoint re-exports it at `code/core/style-grammar/src/tooling.ts:38`. The package exposes `./tooling` in `code/core/style-grammar/package.json:35-42`.
- **Consumers:** Repository consumers are only the style-grammar tests: `code/core/style-grammar/src/__tests__/transition.test.ts:3,143+`, `entrypoints.test.ts:3,21`, and `distParity.test.ts:42+`. No core runtime, compiler, or codemod source consumer was found. The current web type surface still accepts legacy transition values at `code/core/web/src/types.tsx:1562-1624`, so deleting this helper alone would not remove those runtime forms.
- **Evidence:** Commit `45e042f337` added the helper as a legacy transition migration alongside the transition IR prototype. Commit `dbcfed002e` split runtime and tooling entrypoints while retaining it only in tooling.
- **Classification:** **(b) public tooling breaking change, with V2-only status unverified.** The helper is explicitly legacy and has no repository production consumer, but external tooling users can import the public `./tooling` path.
- **Why it is a win:** Once migration support is no longer needed, deleting the helper and tooling export removes its code from the tooling artifact. It does not change the app runtime graph by itself.
- **Risk of removing it:** External codemods or build integrations may depend on it, and removing it before users migrate defeats the purpose of the helper. Keep it through the announced V3 migration window unless the tooling package is intentionally breaking now.
- **Rough effort:** Small. Remove the helper export and its tests after confirming the migration window and package consumers.

## Checked and found nothing new

- `dataSet`, accessibility spelling, and web-authored `aria-*`, `role`, `data-*` surfaces. These are already addressed by the current V3 plan or are the intended V3 direction.
- Implicit `$group-*` syntax, group/container semantics, and explicit `container` behavior. The plan already covers the semantic change; `webContainerType` above is the separate setting and fallback that was not enumerated there.
- `directStyle`, `propMapper`, object style syntax, legacy transform aliases, and transform lowering. The plan already lists their removal or consolidation work. In particular, `transformMatrix`, `rotation`, `translateX`, and `translateY` at `code/core/web/src/dom/styleTypes.ts:523-530` are already within the plan’s legacy-transform scope.
- `parentSplitStyles` producers other than the API-only test. None were found; the parameter itself is recorded above because it remains publicly exposed.
- `programEligibility` and `legacyPartComposite` in `code/core/style-grammar/src/programEligibility.ts:19-45`. These are consumed by runtime, codemod, ESLint, and language-service paths, so they are current behavior infrastructure rather than V2-only baggage.
- The deprecated `match.addListener` and `removeListener` calls at `code/core/web/src/hooks/useMedia.tsx:87-91`. The source comment says React Native still needs them, so this is platform support rather than V2 compatibility.
- Standalone DOM declarations and font/text/transition parsing fallbacks. The searched paths are implementation or authored compatibility behavior still used by current emitters, and no evidence showed that they exist only for V2.
