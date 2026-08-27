# V3 Scan: Small Features & Configuration Surface

**Status:** Complete  
**Date:** 2026-08-27  
**Scope:** `code/core/web/src/createTamagui.ts`, `config.ts`, `types.tsx` (`CreateTamaguiProps` & `settings`), `views/` (`Theme.tsx`, `ThemeProvider.tsx`, `TamaguiProvider.tsx`, `TamaguiRoot.tsx`, `Configuration.tsx`, `FontLanguage.tsx`, `ThemeDebug.tsx`, `SafeAreaTracker.tsx`), and smaller helpers across `code/core/web/src/`.

---

## Executive Summary & Ranked Proposals

Ranked by **(value of removal) / (migration pain)**. The boldest defensible simplifications are placed first.

| Rank | Proposal | Target | Classification | Value / Migration Pain Rationale |
|:---:|---|---|:---:|---|
| **1** | **Delete `styleCompat` (`"legacy"`, `"react-native"`, `"web"`)** | `types.tsx:1205`, `config.ts:81-84`, `expandStyle.ts:19-78` | **(b)** | **High value / Low pain.** Deletes multi-mode flex expansion and runtime branching on every flex property. Web standard CSS flex is authored; mechanical codemod removes the setting. |
| **2** | **Delete `defaultPosition` (`"static"` vs `"relative"`)** | `types.tsx:1365`, `createComponent.tsx:404`, `compilerHost.ts:2053` | **(b)** | **High value / Low pain.** Eliminates per-render default props mutation in `createComponent` and compiler check. Standard web `position: static` default authored; explicit `position="relative"` when needed. |
| **3** | **Delete `forceStyle` escape-hatch prop** | `TamaguiComponentPropsBaseBase.tsx:103`, `useComponentState.ts:267, 360`, `createComponent.tsx:1323` | **(b)** | **High value / Zero app pain.** Zero usage in `code/ui` and `tamagui.dev`. Deletes code that forces `noClass = true` (deopting atomic CSS to inline styles) and allocates state objects. |
| **4** | **Delete `webContainerType` compat setting** | `types.tsx:1293`, `createTamagui.ts:267`, `getSplitStyles.tsx:605` | **(b)** | **High value / Low pain.** Decouples `group` from CSS container queries; replaced cleanly by explicit `container="name"` API (V3 plan §5 & §7.1). |
| **5** | **Remove flat settings fallback in `getSetting` and `config`** | `config.ts:74-78, 83`, `createTamagui.ts:257-289` | **(b)** | **Medium-High value / Low pain.** Eliminates ambiguous top-level vs nested settings resolution and removes duplicate properties on internal config object. Codemod moves flat settings to `settings: { ... }`. |
| **6** | **Delete `untilMeasured` escape-hatch prop** | `TamaguiComponentPropsBaseBase.tsx:79`, `createComponent.tsx:1262, 1435, 1458` | **(b)** | **Medium value / Zero app pain.** Zero usage in `code/ui` and `tamagui.dev`. Dead native layout hiding prop tied to legacy group measurement. |
| **7** | **Delete redundant `getShorthandValue` & `getExpandedShorthand` duplicate pair** | `helpers/getShorthandValue.ts`, `helpers/getExpandedShorthands.ts` | **(b)** | **Medium value / Low pain.** Deletes 2 duplicate helper files; `getShorthandValue` has 0 callers; `getExpandedShorthand` has 1 single caller in `Dialog.tsx:235` (easily inlined). |
| **8** | **Delete `isTamaguiComponent` and `isTamaguiElement` public helpers** | `helpers/isTamaguiComponent.tsx`, `helpers/isTamaguiElement.tsx` | **(b)** | **Medium value / Low pain.** `isTamaguiComponent` has 0 external callers; `isTamaguiElement` has 1 caller in `AlertDialog.tsx:414`. Inlines single check `Boolean(child?.type?.staticConfig)`. |
| **9** | **Delete dead `loadAnimationDriver` dynamic loader** | `config.ts:220-245` | **(b)** | **Medium value / Zero app pain.** Zero callers across the entire repository. Mutates config in-place without triggering config revisions. Replaced by `createTamagui({ animations: { ... } })` multi-driver config. |
| **10** | **Prune `asChild` modes: drop `"web"` and `"except-style-web"`** | `TamaguiComponentPropsBaseBase.tsx:25`, `createComponent.tsx:1898` | **(b)** | **Medium value / Zero app pain.** Zero callers in `code/ui` or `tamagui.dev`. React Strict DOM event alignment handles web events without `asChild` mapping shims. |
| **11** | **Delete `onlyShorthandStyleProps` setting** | `types.tsx:1389, 2084`, `core-test/onlyShorthandStyleProps.web.test.tsx` | **(b)** | **Low-Medium value / Low pain.** Redundant second shorthand strictness toggle alongside `onlyAllowShorthands`. Zero usage in `code/ui` and undocumented. |
| **12** | **Delete `ThemeDebug` DOM portal visualizer** | `views/ThemeDebug.tsx`, `views/ThemeDebug.native.tsx`, `Theme.tsx:113-119` | **(a)** | **Medium value / Zero pain.** Internal dev-only DOM overlay created for `props.debug === "visualize"`. Deletes 100+ lines from web views. |
| **13** | **Delete `setupDev` / `devConfig` visualizer runtime** | `config.ts:190-205`, `createComponent.tsx:164-180, 433-494` | **(a)** | **Medium value / Zero app pain.** Dev-only global config and DOM mouse/keyboard listeners in `createComponent.tsx`. |
| **14** | **Unify `selectionStyles` type definition** | `types.tsx:1316, 1447`, `getThemeCSSRules.ts:176` | **(a)** | **Low value / Zero pain.** Resolves duplicate type definition on both `CreateTamaguiProps` root and `GenericTamaguiSettings`. |
| **15** | **Remove `defaultSize` & `defaultTokens` destructuring in `createTamagui.ts`** | `createTamagui.ts:184-190` | **(a)** | **Low value / Zero pain.** Removes dead leftover destructuring boilerplate for deleted V2 settings. |
| **16** | **Simplify `FontLanguage` and delete dead `getFontLanguage.ts`** | `views/FontLanguage.tsx`, `views/FontLanguage.native.tsx`, `helpers/getFontLanguage.ts`, `createDesignSystem.ts:116-121` | **(b)** | **Medium value / Low pain.** Zero usage in `code/ui/*`. Deletes unreferenced `getFontLanguage.ts`, eliminates `.t_lang-` CSS generation for every font in `:root`, and removes native `JSON.stringify(props)` context allocation. |

---

## 1. Walk of Every Entry in `settings` (`GenericTamaguiSettings`)

### 1.1 `styleCompat`
- **Read:** [`code/core/web/src/types.tsx:1195-1206`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L1195-L1206), [`code/core/web/src/config.ts:15, 81-84`](file:///Users/n8/tamagui/code/core/web/src/config.ts#L81-L84), [`code/core/web/src/helpers/expandStyle.ts:19-78`](file:///Users/n8/tamagui/code/core/web/src/helpers/expandStyle.ts#L19-L78).
- **Consumers:** Internal style emitters (`expandStyle.ts:74`, `propMapper.ts:103, 176`, `directStyle.ts:1925`), public export `getStyleCompat` in `index.ts:75`, tests in `getStylesAtomic.web.test.tsx:14-140`.
- **Docs & UI:** Undocumented in `code/tamagui.dev/data/docs`. Zero usage in `code/ui/*` or `tamagui.dev`.
- **Breaking Impact:** Removing it breaks apps setting `styleCompat: "legacy"` or `"react-native"` and any external caller of `getStyleCompat()`. Flex resolution becomes standard CSS flex (`flex: <number>` -> `flexGrow: <number>, flexShrink: 1, flexBasis: 0`).
- **Codemod:** Mechanical codemod deletes `settings.styleCompat` and changes any legacy-dependent components to author explicit `flexBasis="auto"` or `flexShrink={0}`.
- **Replacement:** Author CSS standard styles directly.
- **Confidence:** Verified (high).
- **Classification:** **(b) public breaking change with mechanical migration**

### 1.2 `defaultPosition`
- **Read:** [`code/core/web/src/types.tsx:1363-1365`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L1363-L1365), [`code/core/web/src/createComponent.tsx:401-409`](file:///Users/n8/tamagui/code/core/web/src/createComponent.tsx#L401-L409), [`code/compiler/static/src/compilerHost.ts:2053`](file:///Users/n8/tamagui/code/compiler/static/src/compilerHost.ts#L2053).
- **Consumers:** `createComponent.tsx` render path (mutates default props on every component instantiation on web) and `compilerHost.ts`.
- **Docs & UI:** Undocumented in `code/tamagui.dev/data/docs/core/configuration.mdx`. Zero usage in `code/ui/*` and `tamagui.dev`.
- **Breaking Impact:** In V1, Tamagui defaulted to `position: "relative"` (React Native semantics). V2/V3 defaulted to `position: "static"` (CSS standard). `defaultPosition: "relative"` was an opt-in escape hatch for V1 legacy apps. Removing it means all components default to standard `static`.
- **Codemod:** Mechanical codemod removes `settings.defaultPosition` from `tamagui.config.ts`.
- **Replacement:** Author `position="relative"` explicitly on components or custom styled frames that require relative positioning.
- **Confidence:** Verified (high).
- **Classification:** **(b) public breaking change with mechanical migration**

### 1.3 `webContainerType`
- **Read:** [`code/core/web/src/types.tsx:1289-1301`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L1289-L1301), [`code/core/web/src/createTamagui.ts:267`](file:///Users/n8/tamagui/code/core/web/src/createTamagui.ts#L267), [`code/core/web/src/helpers/getSplitStyles.tsx:605`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L605), [`code/core/cli/src/generate-prompt.ts:115-119`](file:///Users/n8/tamagui/code/core/cli/src/generate-prompt.ts#L115-L119).
- **Consumers:** `getSplitStyles.tsx:605` for implicit `group` container CSS generation, `generate-prompt.ts`.
- **Docs & UI:** Documented in `configuration.mdx:788-793`.
- **Breaking Impact:** Commit `bf3dce0a6b` added `webContainerType` as a V2 compatibility bridge when groups were overloaded with container query behavior. Removing it breaks implicit container establishment on `<View group />`.
- **Codemod:** Mechanical codemod changes `<View group="name" />` containing container queries to `<View group="name" container="name" />` and deletes `webContainerType`.
- **Replacement:** Use the new V3 `container` prop API (`<View container />` or `<View container="name" />`, V3 style engine plan §5 & §7.1).
- **Confidence:** Verified (high).
- **Classification:** **(b) public breaking change with mechanical migration**

### 1.4 `defaultSize` & `defaultTokens` (Leftover Destructuring)
- **Read:** [`code/core/web/src/createTamagui.ts:183-190`](file:///Users/n8/tamagui/code/core/web/src/createTamagui.ts#L183-L190).
- **Consumers:** `createTamagui.ts` lines 184-189:
  ```ts
  const {
    defaultSize: _removedDefaultSize,
    defaultTokens: _removedDefaultTokens,
    ...settingsIn
  } = (configIn.settings || {}) as NonNullable<CreateTamaguiProps["settings"]> & {
    defaultSize?: unknown
    defaultTokens?: unknown
  }
  ```
- **Docs & UI:** Undocumented. Not in `GenericTamaguiSettings` types.
- **Breaking Impact:** None. These were removed in V2 and this destructuring is dead boilerplate to throw away keys if users pass them.
- **Replacement:** Fully delete the destructuring; let `settingsIn = configIn.settings || {}`.
- **Confidence:** Verified (high).
- **Classification:** **(a) internal only**

### 1.5 `onlyShorthandStyleProps`
- **Read:** [`code/core/web/src/types.tsx:1375-1390, 2084`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L1375-L1390), [`code/core/core-test/onlyShorthandStyleProps.web.test.tsx:1-50`](file:///Users/n8/tamagui/code/core/core-test/onlyShorthandStyleProps.web.test.tsx#L1-L50).
- **Consumers:** Type-level validation only; tests in `onlyShorthandStyleProps.web.test.tsx`.
- **Docs & UI:** Undocumented in `code/tamagui.dev/data/docs/core/configuration.mdx`. Zero usage in `code/ui/*` or `tamagui.dev`.
- **Breaking Impact:** Removes the type toggle that hides individual border/outline/shadow longhands (`borderWidth`, `shadowColor`, etc.).
- **Codemod:** Mechanical codemod removes `onlyShorthandStyleProps` from config.
- **Replacement:** Use `onlyAllowShorthands: true` or author shorthand props directly.
- **Confidence:** Verified (high).
- **Classification:** **(b) public breaking change with mechanical migration**

### 1.6 `onlyAllowShorthands`
- **Read:** [`code/core/web/src/types.tsx:1303-1306, 2083`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L1303-L1306), [`code/core/web/src/createTamagui.ts:259`](file:///Users/n8/tamagui/code/core/web/src/createTamagui.ts#L259), [`code/core/cli/src/generate-prompt.ts:60-84`](file:///Users/n8/tamagui/code/core/cli/src/generate-prompt.ts#L60-L84).
- **Consumers:** Type inference, CLI prompt generator, starter templates (`code/packages/tamagui-dev-config`).
- **Docs & UI:** Documented in `configuration.mdx:761-766`.
- **Status:** **Keep as valid type-level setting**, but clean up the redundant top-level `config.onlyAllowShorthands` field on `TamaguiInternalConfig` so settings are stored strictly in `config.settings`.
- **Confidence:** Verified (high).
- **Classification:** **(a) internal only** (for config structure cleanup)

### 1.7 `selectionStyles`
- **Read:** [`code/core/web/src/types.tsx:1316, 1447`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L1316), [`code/core/web/src/helpers/getThemeCSSRules.ts:176`](file:///Users/n8/tamagui/code/core/web/src/helpers/getThemeCSSRules.ts#L176), [`code/core/config/src/settings.ts:4`](file:///Users/n8/tamagui/code/core/config/src/settings.ts#L4).
- **Consumers:** `getThemeCSSRules.ts:176` (calls `getSetting("selectionStyles")`).
- **Docs & UI:** Documented in `configuration.mdx:747-752`.
- **Anomaly:** Defined twice in types: at top level of `CreateTamaguiProps.selectionStyles` (line 1447) AND inside `GenericTamaguiSettings.selectionStyles` (line 1316).
- **Status:** **Keep feature, unify type definition.** Delete the duplicate top-level `selectionStyles` property on `CreateTamaguiProps` so it resides unambiguously on `settings.selectionStyles`.
- **Confidence:** Verified (high).
- **Classification:** **(a) internal only**

### 1.8 `defaultFont`
- **Read:** [`code/core/web/src/types.tsx:1309-1311, 1487`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L1309-L1311), [`code/core/web/src/createTamagui.ts:191-203`](file:///Users/n8/tamagui/code/core/web/src/createTamagui.ts#L191-L203), [`code/core/web/src/views/TamaguiRoot.tsx:37`](file:///Users/n8/tamagui/code/core/web/src/views/TamaguiRoot.tsx#L37), [`code/core/font-size/src/getFontSize.ts:29`](file:///Users/n8/tamagui/code/core/font-size/src/getFontSize.ts#L29).
- **Consumers:** CSS font variable emission, `TamaguiRoot` font scoping, `getFontSize`, CLI prompts.
- **Docs & UI:** Documented in `configuration.mdx:728-732`.
- **Status:** **Keep.** Standard font fallback mechanism.
- **Confidence:** Verified (high).

### 1.9 `disableSSR`
- **Read:** [`code/core/web/src/types.tsx:1322-1336`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L1322-L1336), [`code/core/web/src/views/TamaguiProvider.tsx:81`](file:///Users/n8/tamagui/code/core/web/src/views/TamaguiProvider.tsx#L81), [`code/core/web/src/hooks/useDisableSSR.tsx:5`](file:///Users/n8/tamagui/code/core/web/src/hooks/useDisableSSR.tsx#L5), [`code/core/web/src/hooks/useComponentState.ts:375`](file:///Users/n8/tamagui/code/core/web/src/hooks/useComponentState.ts#L375), [`code/core/web/src/hooks/useMedia.tsx:335`](file:///Users/n8/tamagui/code/core/web/src/hooks/useMedia.tsx#L335).
- **Consumers:** `TamaguiProvider` (wraps tree in `ClientOnly`), `useMedia` (skips 2-pass hydration media state on web SPA).
- **Docs & UI:** Documented in `configuration.mdx:723-726` and `server-rendering.mdx:31`.
- **Status:** **Keep.** Essential for client-only (SPA) apps.
- **Confidence:** Verified (high).

### 1.10 `mediaQueryDefaultActive`
- **Read:** [`code/core/web/src/types.tsx:1339-1343`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L1339-L1343), [`code/core/web/src/hooks/useMedia.tsx:32, 55`](file:///Users/n8/tamagui/code/core/web/src/hooks/useMedia.tsx#L32).
- **Consumers:** SSR media hydration state initialization in `useMedia`.
- **Docs & UI:** Documented in `configuration.mdx:734-738` and `server-rendering.mdx`.
- **Status:** **Keep.** Essential for SSR media query rendering.
- **Confidence:** Verified (high).

### 1.11 `shouldAddPrefersColorThemes`
- **Read:** [`code/core/web/src/types.tsx:1346-1349`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L1346-L1349), [`code/core/web/src/helpers/variables.ts:307`](file:///Users/n8/tamagui/code/core/web/src/helpers/variables.ts#L307), [`code/core/web/src/helpers/getThemeCSSRules.ts:141`](file:///Users/n8/tamagui/code/core/web/src/helpers/getThemeCSSRules.ts#L141).
- **Consumers:** CSS theme generator (adds `@media(prefers-color-scheme)` rules).
- **Docs & UI:** Documented in `configuration.mdx:754-758`.
- **Status:** **Keep.** Enables zero-JS system color scheme switching in CSS.
- **Confidence:** Verified (high).

### 1.12 `addThemeClassName`
- **Read:** [`code/core/web/src/types.tsx:1352-1359`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L1352-L1359), [`code/core/web/src/views/ThemeProvider.tsx:13`](file:///Users/n8/tamagui/code/core/web/src/views/ThemeProvider.tsx#L13), [`code/core/web/src/helpers/getThemeCSSRules.ts:131`](file:///Users/n8/tamagui/code/core/web/src/helpers/getThemeCSSRules.ts#L131).
- **Consumers:** `ThemeProvider.tsx:13` (attaches root theme class to `html` or `body`).
- **Docs & UI:** Documented in `configuration.mdx:740-745` and `how-to-upgrade.mdx:479`.
- **Status:** **Keep.** Controls root element theme class injection.
- **Confidence:** Verified (high).

### 1.13 `remBaseFontSize`
- **Read:** [`code/core/web/src/types.tsx:1368-1372`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L1368-L1372), [`code/core/web/src/helpers/resolveRem.native.ts:15`](file:///Users/n8/tamagui/code/core/web/src/helpers/resolveRem.native.ts#L15).
- **Consumers:** Native rem unit resolution against `PixelRatio.getFontScale()`.
- **Docs & UI:** Documented in `intro/styles.mdx:251-257`.
- **Status:** **Keep.**
- **Confidence:** Verified (high).

### 1.14 `fastSchemeChange`
- **Read:** [`code/core/web/src/types.tsx:1250-1266`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L1250-L1266), [`code/core/web/src/hooks/useThemeState.ts:376`](file:///Users/n8/tamagui/code/core/web/src/hooks/useThemeState.ts#L376), [`code/core/web/src/hooks/getThemeProxied.ts:136`](file:///Users/n8/tamagui/code/core/web/src/hooks/getThemeProxied.ts#L136).
- **Consumers:** iOS `DynamicColorIOS` color wrapping and native theme change optimization.
- **Docs & UI:** Documented in `configuration.mdx:774-779`, `installation.mdx:108`, `use-theme.mdx:53`, `theme.mdx:127`.
- **Status:** **Keep or enable by default on native.** (As noted in `types.tsx:1253`, making this default on native without a setting simplifies config).
- **Confidence:** Verified (high).

### 1.15 `optimizeFor`
- **Read:** [`code/core/web/src/types.tsx:1269-1287`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L1269-L1287), [`code/core/web/src/hooks/isOptimizedForFirstRender.ts:6`](file:///Users/n8/tamagui/code/core/web/src/hooks/isOptimizedForFirstRender.ts#L6), [`code/core/web/src/hooks/isOptimizedForFirstRender.native.ts:6`](file:///Users/n8/tamagui/code/core/web/src/hooks/isOptimizedForFirstRender.native.ts#L6).
- **Consumers:** `isOptimizedForFirstRender` helper in `useTheme`, `useMedia`, `useComponentState`.
- **Docs & UI:** Documented in `configuration.mdx:781-786`.
- **Status:** **Keep.** Controls startup granular tracking vs coarse subscriptions.
- **Confidence:** Verified (high).

### 1.16 `allowedStyleValues`
- **Read:** [`code/core/web/src/types.tsx:1233-1246, 1685-1720`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L1233-L1246), [`code/core/web/src/helpers/propMapper.ts:626-645`](file:///Users/n8/tamagui/code/core/web/src/helpers/propMapper.ts#L626-L645).
- **Consumers:** Type-level style strictness validation; runtime `propMapper.ts:630` check in `fallbackVariant`.
- **Docs & UI:** Documented in `configuration.mdx:768-831`.
- **Status:** **Keep for types, remove runtime check.** The type strictness is heavily used. The runtime check in `propMapper.ts` is deleted as part of the V3 style engine rebuild (Plan §6.1).
- **Confidence:** Verified (high).

---

## 2. Component Escape-Hatch Props

### 2.1 `forceStyle`
- **Read:** [`code/core/web/src/interfaces/TamaguiComponentPropsBaseBase.tsx:103`](file:///Users/n8/tamagui/code/core/web/src/interfaces/TamaguiComponentPropsBaseBase.tsx#L103), [`code/core/web/src/hooks/useComponentState.ts:267, 360`](file:///Users/n8/tamagui/code/core/web/src/hooks/useComponentState.ts#L267), [`code/core/web/src/createComponent.tsx:1323, 1334`](file:///Users/n8/tamagui/code/core/web/src/createComponent.tsx#L1323).
- **Consumers:** Zero usage in `code/ui/*`, zero in `code/tamagui.dev`. Only 1 test in `core-test/domRuntimeContext.native.test.tsx:102`.
- **What it does:** Forces pseudo state (`"hover" | "press" | "focus" | "focusVisible" | "focusWithin"`). In `useComponentState.ts:360`, it sets `noClass = !isWeb || !!props.forceStyle`, which **completely deopts web atomic CSS generation to inline styles**, and line 267 allocates `{ ...states[0], [props.forceStyle]: true }`.
- **Breaking Impact:** Deleting `forceStyle` removes the pseudo-forcing escape hatch.
- **Codemod:** Mechanical codemod removes `forceStyle` props.
- **Replacement:** Use real DOM interaction triggers, user-event testing utilities, or standard CSS pseudo-classes.
- **Confidence:** Verified (high).
- **Classification:** **(b) public breaking change with mechanical migration**

### 2.2 `untilMeasured`
- **Read:** [`code/core/web/src/interfaces/TamaguiComponentPropsBaseBase.tsx:79`](file:///Users/n8/tamagui/code/core/web/src/interfaces/TamaguiComponentPropsBaseBase.tsx#L79), [`code/core/web/src/createComponent.tsx:1262, 1435, 1458`](file:///Users/n8/tamagui/code/core/web/src/createComponent.tsx#L1262).
- **Consumers:** Zero usage across `code/ui/*` and `code/tamagui.dev`.
- **What it does:** Hides elements on native (`opacity: 0`) until parent group measures layout.
- **Breaking Impact:** In V3, `group` no longer establishes query containers or performs implicit measurement (Plan §5 & §7.1). `untilMeasured` is orphaned.
- **Codemod:** Mechanical codemod removes `untilMeasured` props.
- **Replacement:** Use the new V3 `container` prop API.
- **Confidence:** Verified (high).
- **Classification:** **(b) public breaking change with mechanical migration**

### 2.3 `asChild` Variants (`"web"` and `"except-style-web"`)
- **Read:** [`code/core/web/src/interfaces/TamaguiComponentPropsBaseBase.tsx:20-25`](file:///Users/n8/tamagui/code/core/web/src/interfaces/TamaguiComponentPropsBaseBase.tsx#L20-L25), [`code/core/web/src/createComponent.tsx:1898`](file:///Users/n8/tamagui/code/core/web/src/createComponent.tsx#L1898), [`code/core/web/src/helpers/getSplitStyles.tsx:931, 1411`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L931).
- **Consumers:** Zero usage in `code/ui/*` or `code/tamagui.dev`. Only boolean `asChild` and `asChild="except-style"` are used in `code/ui` (e.g. `Dialog.Close`, `Tooltip.Trigger`, `ToggleGroup.Item`).
- **What it does:** `"web"` and `"except-style-web"` map React Native press handlers (`onPress`, `onPressIn`, etc.) to DOM events (`onClick`, `onMouseDown`) during slot merging.
- **Breaking Impact:** In V3 React Strict DOM / web-first alignment, web DOM events are standard authored props and mapped on native by the native adapter.
- **Codemod:** Mechanical codemod replaces `asChild="web"` -> `asChild`, and `asChild="except-style-web"` -> `asChild="except-style"`.
- **Replacement:** Author standard `asChild` or `asChild="except-style"`.
- **Confidence:** Verified (high).
- **Classification:** **(b) public breaking change with mechanical migration**

### 2.4 `disableNativeStyle`
- **Read:** [`code/core/web/src/types.tsx:358`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L358), [`code/core/web/src/createComponent.tsx:893`](file:///Users/n8/tamagui/code/core/web/src/createComponent.tsx#L893), [`code/kitchen-sink/src/usecases/NativeRegistryShowdownCase.tsx:60-73`](file:///Users/n8/tamagui/code/kitchen-sink/src/usecases/NativeRegistryShowdownCase.tsx#L60-L73).
- **Consumers:** Only used in the `NativeRegistryShowdownCase` benchmark and 1 test in `nativeFastPath.native.test.tsx:213`.
- **What it does:** Opts out of the native style engine fast-path.
- **Breaking Impact:** None for normal applications.
- **Replacement:** Remove from public `TamaguiComponentPropsBaseBase` prop union; keep as internal benchmark flag if needed.
- **Confidence:** Verified (high).
- **Classification:** **(a) internal only**

---

## 3. Whole Small Features with Low Usage / Single Call Sites

### 3.1 `getShorthandValue` and `getExpandedShorthand`
- **Read:** [`code/core/web/src/helpers/getShorthandValue.ts:1-10`](file:///Users/n8/tamagui/code/core/web/src/helpers/getShorthandValue.ts#L1-L10), [`code/core/web/src/helpers/getExpandedShorthands.ts:1-7`](file:///Users/n8/tamagui/code/core/web/src/helpers/getExpandedShorthands.ts#L1-L7), [`code/core/web/src/index.ts:12, 14`](file:///Users/n8/tamagui/code/core/web/src/index.ts#L12).
- **Consumers:**
  - `getShorthandValue`: **Zero call sites** across the entire repository.
  - `getExpandedShorthand`: Exactly **1 call site** in `code/ui/dialog/src/Dialog.tsx:235` (`const zIndex = getExpandedShorthand("zIndex", props)`).
- **What they are:** Two duplicate files with inverted signatures (`(props, key)` vs `(propKey, props)`) that do the exact same lookup: `props[key] ?? props[inverseShorthands[key]]`.
- **Docs:** Zero docs pages.
- **What removing buys:** Deletes 2 files, 2 public exports, and replaces the single call in `Dialog.tsx` with direct prop reading (`props.zIndex ?? props.zi`).
- **Confidence:** Verified (high).
- **Classification:** **(b) public breaking change with mechanical migration**

### 3.2 `isTamaguiComponent` & `isTamaguiElement`
- **Read:** [`code/core/web/src/helpers/isTamaguiComponent.tsx:1-9`](file:///Users/n8/tamagui/code/core/web/src/helpers/isTamaguiComponent.tsx#L1-L9), [`code/core/web/src/helpers/isTamaguiElement.tsx:1-11`](file:///Users/n8/tamagui/code/core/web/src/helpers/isTamaguiElement.tsx#L1-L11), [`code/core/web/src/index.ts:35, 36`](file:///Users/n8/tamagui/code/core/web/src/index.ts#L35).
- **Consumers:**
  - `isTamaguiComponent`: Zero external call sites (only imported by `isTamaguiElement.tsx`).
  - `isTamaguiElement`: Exactly **1 call site** in `code/ui/alert-dialog/src/AlertDialog.tsx:414` (`const part = isTamaguiElement(child)`).
- **Docs:** Zero docs pages.
- **What removing buys:** Deletes 2 files, 2 public exports, and inlines the single `Boolean(child?.type?.["staticConfig"])` check in `AlertDialog.tsx`.
- **Confidence:** Verified (high).
- **Classification:** **(b) public breaking change with mechanical migration**

### 3.3 `loadAnimationDriver`
- **Read:** [`code/core/web/src/config.ts:220-245`](file:///Users/n8/tamagui/code/core/web/src/config.ts#L220-L245), [`code/core/web/src/index.ts:81`](file:///Users/n8/tamagui/code/core/web/src/index.ts#L81).
- **Consumers:** **Zero call sites** across the entire repository (0 in `code/ui`, 0 in `tamagui.dev`, 0 in tests, 0 in starters).
- **Docs:** Zero docs pages.
- **What it does:** Mutates `config.animations` in-place at runtime without triggering `prepareConfigRevision(config)`.
- **What removing buys:** Deletes 26 lines of dead runtime mutation code and removes an unmanaged config mutation vector.
- **Replacement:** Configure drivers declaratively via `createTamagui({ animations: { default: ..., spring: ... } })`.
- **Confidence:** Verified (high).
- **Classification:** **(b) public breaking change with mechanical migration**

### 3.4 `setupDev` / `devConfig`
- **Read:** [`code/core/web/src/config.ts:190-205`](file:///Users/n8/tamagui/code/core/web/src/config.ts#L190-L205), [`code/core/web/src/createComponent.tsx:164-180, 433-494`](file:///Users/n8/tamagui/code/core/web/src/createComponent.tsx#L164-L180), [`code/packages/tamagui-dev-config/src/tamagui.dev.config.ts:11`](file:///Users/n8/tamagui/code/packages/tamagui-dev-config/src/tamagui.dev.config.ts#L11).
- **Consumers:** Single setup call in `tamagui-dev-config`.
- **Docs:** Zero docs pages.
- **What it does:** Global visualizer configuration that registers window key listeners and creates absolute overlay DOM nodes with tooltips in dev mode.
- **What removing buys:** Removes 60+ lines of DOM inspection code from `createComponent.tsx` and eliminates global mutable state `devConfig`.
- **Confidence:** Verified (high).
- **Classification:** **(a) internal only**

### 3.5 `ThemeDebug`
- **Read:** [`code/core/web/src/views/ThemeDebug.tsx:1-95`](file:///Users/n8/tamagui/code/core/web/src/views/ThemeDebug.tsx#L1-L95), [`code/core/web/src/views/ThemeDebug.native.tsx:1-17`](file:///Users/n8/tamagui/code/core/web/src/views/ThemeDebug.native.tsx#L1-L17), [`code/core/web/src/views/Theme.tsx:113-119`](file:///Users/n8/tamagui/code/core/web/src/views/Theme.tsx#L113-L119).
- **Consumers:** Single internal consumer in `Theme.tsx:115` when `props.debug === "visualize"`.
- **Docs:** Zero docs pages. Not exported in `index.ts`.
- **What it does:** Imperatively creates a fixed bottom-overlay `div` via `document.createElement` and `createPortal` with JSON dump of theme state. Native version is an empty stub.
- **What removing buys:** Deletes 112 lines of legacy DOM portal debugging code from the core bundle.
- **Confidence:** Verified (high).
- **Classification:** **(a) internal only**

### 3.6 `themeable` Standalone HOC Export
- **Read:** [`code/core/web/src/helpers/themeable.tsx:1-97`](file:///Users/n8/tamagui/code/core/web/src/helpers/themeable.tsx#L1-L97), [`code/core/web/src/createStyledHOC.tsx:77`](file:///Users/n8/tamagui/code/core/web/src/createStyledHOC.tsx#L77), [`code/core/web/src/index.ts:46`](file:///Users/n8/tamagui/code/core/web/src/index.ts#L46).
- **Consumers:** Only `createStyledHOC.tsx:77` calls it. Zero usage in `code/ui/*`.
- **Docs:** Zero docs pages.
- **What removing buys:** Inlines the theme wrapper inside `createStyledHOC` and deletes `themeable.tsx` (97 lines) and its public barrel export.
- **Confidence:** Verified (high).
- **Classification:** **(b) public breaking change with mechanical migration**

### 3.7 `FontLanguage` and `getFontLanguage.ts`
- **Read:** [`code/core/web/src/views/FontLanguage.tsx:1-19`](file:///Users/n8/tamagui/code/core/web/src/views/FontLanguage.tsx#L1-L19), [`code/core/web/src/views/FontLanguage.native.tsx:1-14`](file:///Users/n8/tamagui/code/core/web/src/views/FontLanguage.native.tsx#L1-L14), [`code/core/web/src/helpers/getFontLanguage.ts:1-7`](file:///Users/n8/tamagui/code/core/web/src/helpers/getFontLanguage.ts#L1-L7), [`code/core/web/src/helpers/createDesignSystem.ts:116-121`](file:///Users/n8/tamagui/code/core/web/src/helpers/createDesignSystem.ts#L116-L121).
- **Consumers:** `getFontLanguage.ts` has **zero callers** in the entire repo. `FontLanguage` is exported but used in **zero components in `code/ui/*`** (only 1 test in `kitchen-sink`).
- **Docs:** Documented in `code/tamagui.dev/data/docs/core/font-language.mdx`.
- **What removing buys:** Eliminates `.t_lang-` CSS generation for every font in `:root` CSS, removes `ComponentContext.language` Native re-renders with `JSON.stringify(props)`, and deletes `helpers/getFontLanguage.ts`.
- **Replacement:** Use standard CSS `:lang()` selectors or theme variants for localized font swapping.
- **Confidence:** Verified (high).
- **Classification:** **(b) public breaking change with mechanical migration**

---

## 4. Config Normalizations in `createTamagui.ts` Accepting Older Shapes

### 4.1 Flat Settings Fallback in `getSetting` and `getStyleCompat`
- **Read:** [`code/core/web/src/config.ts:74-78`](file:///Users/n8/tamagui/code/core/web/src/config.ts#L74-L78):
  ```ts
  return config!.settings[key] ?? (config as any)[key]
  ```
  and [`config.ts:83`](file:///Users/n8/tamagui/code/core/web/src/config.ts#L83):
  ```ts
  return (config?.settings.styleCompat ?? (config as any)?.styleCompat) || "web"
  ```
- **Why it exists:** Accepts settings placed at the root of `createTamagui({ ... })` from Tamagui v1/early v2 configs before the `settings: { ... }` object was introduced.
- **Cleanup:** Delete the fallback `?? config[key]`. Read directly from `config.settings[key]`.

### 4.2 Destructuring and Ignoring `defaultSize` / `defaultTokens`
- **Read:** [`code/core/web/src/createTamagui.ts:183-190`](file:///Users/n8/tamagui/code/core/web/src/createTamagui.ts#L183-L190):
  ```ts
  const {
    defaultSize: _removedDefaultSize,
    defaultTokens: _removedDefaultTokens,
    ...settingsIn
  } = (configIn.settings || {}) as ...
  ```
- **Why it exists:** Silently swallows deleted V2 settings so they don't leak into `settingsIn`.
- **Cleanup:** Delete the destructuring.

### 4.3 `webContainerType: "inline-size"` Default Injection
- **Read:** [`code/core/web/src/createTamagui.ts:267`](file:///Users/n8/tamagui/code/core/web/src/createTamagui.ts#L267):
  ```ts
  settings: {
    webContainerType: "inline-size",
    ...settingsIn,
  }
  ```
- **Why it exists:** Defaulted group container query behavior in V2.
- **Cleanup:** Delete `webContainerType` default injection along with the setting itself (V3 plan §7.1).

### 4.4 `builtinShorthands` Merged into `config.shorthands`
- **Read:** [`code/core/web/src/createTamagui.ts:232, 376-420`](file:///Users/n8/tamagui/code/core/web/src/createTamagui.ts#L232):
  ```ts
  const shorthands = { ...builtinShorthands, ...userShorthands }
  ```
- **Why it exists:** Merges 45 internal 2-4 letter atomic CSS classname prefixes (`bblr`, `bts`, `col`, `dsp`, `fd`, `ov`, `pos`, `ws`) into the user's `config.shorthands` and `inverseShorthands`.
- **Cleanup:** Separate internal CSS class abbreviations from user-defined style prop shorthands.

### 4.5 Duplication of `onlyAllowShorthands` and `fontLanguages` at Config Root
- **Read:** [`code/core/web/src/createTamagui.ts:258-260`](file:///Users/n8/tamagui/code/core/web/src/createTamagui.ts#L258-L260):
  `onlyAllowShorthands: false` and `fontLanguages: []` are set as top-level properties on `TamaguiInternalConfig` in addition to being on `settings`.
- **Cleanup:** Keep settings strictly on `config.settings`.

---

## 5. Defaults That V3 Chooses Differently

| Setting | V2 Default Behavior | V3 Choice | Rationale |
|---|---|---|---|
| **`styleCompat`** | Defaults to `"web"`, but kept `"legacy"` (v1 flex) and `"react-native"` (Yoga flex) modes live on every prop evaluation. | **Deleted.** CSS web flex is the only mode. | V3 moves toward web APIs and React Strict DOM alignment. No runtime flex dispatch. |
| **`defaultPosition`** | Defaults to `"static"`, but kept runtime code to inject `position: "relative"` on all web views if configured. | **Deleted.** Web views are `"static"` by default. | Removes per-render default props mutation in `createComponent.tsx`. Explicit `position="relative"` authored when needed. |
| **`webContainerType`** | Injected default `"inline-size"` on `settings` for `group` container queries. | **Deleted.** | `group` is decoupled from containers. Query containers require explicit `container` prop (V3 plan §5). |
| **`fastSchemeChange`** | Optional setting defaulting to `false` in types (though enabled in `@tamagui/config`). | **Promote to default on iOS** without manual toggle. | Enables `DynamicColorIOS` out-of-the-box on native as intended (`types.tsx:1253`). |

---

## 6. Considered and Rejected List

- **`render` prop** ([`TamaguiComponentPropsBaseBase.tsx:55-63`](file:///Users/n8/tamagui/code/core/web/src/interfaces/TamaguiComponentPropsBaseBase.tsx#L55-L63)): *Kept.* Extensively used across `code/ui/*` and `code/tamagui.dev` as the web element tag selector (`render="button"`, `render="a"`, `render="span"`), matching React Strict DOM `as` tag authoring.
- **`passThrough` prop** ([`Theme.tsx:45-103`](file:///Users/n8/tamagui/code/core/web/src/views/Theme.tsx#L45-L103)): *Kept.* Critical structural primitive for `Adapt`, `Popover`, `Dialog`, `Portal`, and `Theme` subtree adaptation.
- **`debug` prop** ([`createComponent.tsx:354, 380`](file:///Users/n8/tamagui/code/core/web/src/createComponent.tsx#L354)): *Kept (dev-only).* Essential developer diagnostic tool that is tree-shaken in production.
- **`animatedBy` prop** ([`createComponent.tsx:498-512`](file:///Users/n8/tamagui/code/core/web/src/createComponent.tsx#L498-L512)): *Kept.* Primary component-level API for selecting animation drivers in multi-driver configurations.
- **`disableOptimization` prop** ([`compilerHost.ts:1560-1568`](file:///Users/n8/tamagui/code/compiler/static/src/compilerHost.ts#L1560-L1568)): *Kept.* Essential compiler escape hatch for bailing out specific components from static extraction.
- **`createStyledHOC`** ([`createStyledHOC.tsx:1-89`](file:///Users/n8/tamagui/code/core/web/src/createStyledHOC.tsx#L1-L89)): *Kept.* Extensively consumed across `code/ui/*` (Button, Input, Checkbox, Slider, Sheet) to build composite styled components.
- **`Configuration` / `useConfiguration`** ([`views/Configuration.tsx:1-21`](file:///Users/n8/tamagui/code/core/web/src/views/Configuration.tsx#L1-L21)): *Kept.* Clean subtree context override for animation drivers and SSR client-only boundaries.
- **`Slot` / `Slottable`** ([`views/Slot.tsx:1-88`](file:///Users/n8/tamagui/code/core/web/src/views/Slot.tsx#L1-L88)): *Kept.* Standard Radix-compatible slot composition primitive used across headless UI packages.
