type MigrationFrom = 'v1' | 'v2'

export function printMigrationPrompt({ from }: { from?: string }) {
  process.stdout.write(getMigrationPrompt({ from }))
}

export function getMigrationPrompt({ from }: { from?: string } = {}) {
  const source = normalizeFrom(from)

  if (source === 'v1') {
    return `${promptHeader('v1', 'v3')}

${v1ToV2Prompt}

After the v1 to v2 pass is complete, apply the v2 to v3 pass below.

${v2ToV3Prompt}
`
  }

  return `${promptHeader('v2', 'v3')}

${v2ToV3Prompt}
`
}

function normalizeFrom(from: string | undefined): MigrationFrom {
  const value = (from || 'v2').toLowerCase().replace(/^from-?/, '')

  if (value === '1' || value === 'v1') return 'v1'
  if (value === '2' || value === 'v2') return 'v2'

  throw new Error('Usage: tamagui migrate --from v2 | --from v1')
}

function promptHeader(from: string, to: string) {
  return `You are migrating a Tamagui app from ${from} to ${to}.

Work like a careful coding agent:

- Read the app's Tamagui config, package manager, bundler, and component usage before editing.
- Keep changes scoped to the migration.
- Run the codemods listed below, then review the diff by hand.
- Do not publish packages, rotate secrets, or change production infrastructure.
- Validate with typecheck/build and at least one real app run or browser/native smoke test.
- Report any behavior that cannot be migrated mechanically.`
}

const v2ToV3Prompt = `## v2 -> v3 migration prompt

### 0. Choose the intermediate checkpoint before editing

The Tamagui package version and the config version are separate. Tamagui V3
supports Config v5; upgrading the runtime does not require Config v6.

- Coming from V2: first reach V3 packages and APIs with the app's existing token, theme, font, media, and animation values. Keep custom config values. If an old config entry is no longer exported, preserve its resolved values in an app-owned config; do not substitute v6 defaults.
- Coming from Config v5 or v5-subtle: keep that config during the V3 API upgrade. Keep the 12-step adaptive colors, spacing, radii, font scales, and breakpoint meanings. Do not remap them to the v6 scale.
- Already running V3 with Config v5: this intermediate checkpoint is valid. Inventory remaining V2 APIs before applying codemods; do not repeat completed work or treat Config v5 as an upgrade failure.
- Do not combine this pass with wholesale \`html.*\` adoption, Tailwind conversion, new skins, or a theme redesign unless separately requested.

Record the starting package/config versions and representative light/dark,
responsive, and native screenshots. Name the intended checkpoint in the plan:
"V3 API, existing design values." Visual changes during this pass need an
explanation or a fix, not automatic screenshot acceptance.

The checkpoint is complete when the required API migration, report review,
typecheck/build, and real app checks in step 15 pass. Leave Config v6 and other
optional design changes in a separate follow-up; do not start them just because
the V3 API work is finished.

### 1. Update dependencies

- Bump every \`tamagui\` and \`@tamagui/*\` package together to v3.
- Keep \`@tamagui/core\`, \`@tamagui/web\`, and \`tamagui\` deduped in the lockfile.
- Run:

\`\`\`bash
npx tamagui check
\`\`\`

### 2. Migrate tokens and conditional styles

V3 accepts bare token/theme names and flat clauses only. Run the transactional
flat-values codemod from your project root, dry run first:

\`\`\`bash
npx @tamagui/codemod-flat-values --report flat-values-report.md ./src
npx @tamagui/codemod-flat-values --write \\
  --report flat-values-report.md \\
  --json flat-values-report.json \\
  ./src
\`\`\`

For example, this V2 input:

\`\`\`tsx
<View bg="$background" hoverStyle={{ bg: '$backgroundHover' }} $sm={{ p: '$6' }} p="$4" />
\`\`\`

becomes:

\`\`\`tsx
<View bg="background hover:background-hover" p="4 sm:6" />
\`\`\`

Resolve every report row and rerun until the app has no V2 authoring. Do not
add a compatibility setting or restore condition-object parsing.

### 3. Preserve config values while migrating required APIs

- Existing Config v5 applications should keep \`@tamagui/config/v5\` or \`/v5-subtle\` while migrating incrementally. These are frozen static compatibility packs, so they preserve the V5 token and theme values but will not receive new theme-builder features.
- Import animations from \`@tamagui/config/animations-css\`, \`animations-rn\`, \`animations-reanimated\`, or \`animations-motion\`.
- Apps using Sheet or animated-number hooks with the CSS driver must import \`createAnimations\` from \`@tamagui/animations-css/extras\`. The root entry omits those hooks.
- Remove \`@tamagui/theme-builder\` and V5 builder imports from packages that no longer export them. Static \`@tamagui/themes/v5\`, \`/v5-subtle\`, and \`/v5-tokens\` imports remain supported.
- An app that GENERATES its v5 themes (\`createV5Theme\`, \`subtleChildrenThemes\`, \`createPalettes\`) has two ways to stay on v5 for this migration: run the builder once and serialize the result to a static literal, or import the same builders from \`@tamagui/config-v5\` (and \`@tamagui/config-v5/builder\`), the opt-in package that carries them. Take one of those when the themes are built from values the app only knows at runtime; the optional v6 recipe move in the appendix is a separate migration.
- Component names no longer select uppercase theme segments automatically. Replace component themes with explicit normal theme or \`level2\` boundaries in component skins.

Do not apply the v6 color remap or recipe conversion in the optional appendix
while keeping Config v5. Reserved API/theme-key spelling changes still apply;
preserve the resolved values behind the renamed keys.

### 4. Migrate Sheet anatomy

The flat-values codemod from step 2 rewrites every provable \`Sheet.Frame\` to
\`Sheet.Container\` with a \`Sheet.Background\` first child carrying the surface
props, and reports spreads and \`styled(Sheet.Frame, …)\` targets for review.
Check each rewritten callsite against these rules:

- Replace \`Sheet.Frame\` with \`Sheet.Container\` plus \`Sheet.Background\`.
- Keep layout props such as \`padding\`, \`gap\`, \`height\`, \`maxHeight\`, and flex props on \`Sheet.Container\`.
- Move visual surface props such as \`bg\`, \`borderRadius\`, \`elevation\`, and \`shadow*\` to \`Sheet.Background\`.
- Keep \`Sheet.Overlay\` as a direct child of \`Sheet\`.
- Add explicit clipping if old \`Sheet.Frame\` overflow clipping mattered.
- \`disableHideBottomOverflow\` belongs on \`Sheet.Background\`.

Before:

\`\`\`tsx
<Sheet>
  <Sheet.Overlay />
  <Sheet.Frame padding="$4" bg="$background" borderTopRadius="$6">
    <Sheet.ScrollView>{children}</Sheet.ScrollView>
  </Sheet.Frame>
</Sheet>
\`\`\`

After:

\`\`\`tsx
<Sheet>
  <Sheet.Overlay />
  <Sheet.Container padding="4">
    <Sheet.Background bg="background" borderTopRadius="6" />
    <Sheet.ScrollView>{children}</Sheet.ScrollView>
  </Sheet.Container>
</Sheet>
\`\`\`

### 5. Remove deprecated v2 APIs

Search:

\`\`\`bash
rg "focusable|fullscreen|themeInverse|<Theme inverse|Sheet\\.Frame|styleable\\(|inlineWhenUnflattened|\\$true|getTokenRelative|stepTokenUpOrDown|forceRemoveScrollEnabled|sizeAdjust|getExpandedShorthands|usePropsAndStyle|useProps|useStyle"
\`\`\`

Replace:

- \`focusable\` -> \`tabIndex\`.
- \`fullscreen\` -> explicit \`position\` and \`inset\` props.
- \`themeInverse\` -> \`theme="inverse"\`.
- \`<Theme inverse>\` -> \`<Theme name="inverse">\`.
- \`Sheet.Frame\` -> \`Sheet.Container\` plus \`Sheet.Background\`.
- \`Component.styleable(fn)\` -> \`createStyledHOC(Component, fn)\` (same behavior, standalone function).
- forwardRef wrapper statics -> direct refs and normal composition.
- \`inlineWhenUnflattened\` -> remove it.
- deprecated UI kit aliases -> current component names.
- old platform style keys -> flat \`web:\`, \`native:\`, \`ios:\`, and \`android:\` clauses.
- \`forceRemoveScrollEnabled\` -> \`disableRemoveScroll\` with inverted intent.
- \`createCheckbox\` \`sizeAdjust\` -> explicit sizing math or component styles.
- \`getExpandedShorthands\` -> \`getExpandedShorthand(key, props)\` when behavior code needs one authored prop and must accept its configured shorthand.
- \`useProps\`, \`useStyle\`, and \`usePropsAndStyle\` -> keep conditional values on styled Tamagui components; use \`splitStyleProps\` only when a wrapper must partition authored props.

V2 could spread one style across its base prop, pseudo-style objects, media
objects, and platform objects. The removed hooks gathered those separate
objects into resolved props and styles. V3 keeps every base and conditional
clause for a style on that style's single property, for example
\`opacity="1 hover:0.7 sm:0.8"\`. The styled component interprets that value,
so a wrapper should pass it through instead of flattening the component's
styles in JavaScript.

\`splitStyleProps(props)\` returns \`[styleProps, regularProps]\` in one pass.
Pass \`{ expandShorthands: true }\` to canonicalize selected keys. Its optional
filter map selects only those canonical keys, leaving rejected style props in
the second object. The filter may instead be a callback receiving
\`(key, value, originalKey, isStyleProp)\`.

\`getExpandedShorthand(key, props)\` only chooses the longhand or configured
shorthand for one property. It does not resolve tokens or select the active
clause. Neither does \`splitStyleProps\`. Use \`useMedia()\` or \`useTheme()\`
when behavior itself needs active responsive or theme state.

### 6. Replace true tokens

- Default v3 configs no longer export the legacy \`$true\` token key.
- The codemod writes \`$true\` on style props as \`4\` and reports a \`legacy-true-token\` warning; confirm the app's config aliased it there.
- On \`size\`, \`elevation\`, and \`iconSize\` it writes the boolean \`true\`, which resolves to the component default size.
- Token definitions and custom variants are not edited; search them for the alias by hand.
- Do not change unrelated boolean props or boolean variant values.

### 7. Replace token stepping

Removed from \`@tamagui/get-token\`:

- \`stepTokenUpOrDown\`
- \`getTokenRelative\`
- the second options argument to \`getSize\`, \`getSpace\`, and \`getRadius\`
- \`shift\`, \`bounds\`, and \`excludeHalfSteps\`

Before:

\`\`\`tsx
const padding = getSize(size, { shift: -2 })
\`\`\`

After:

\`\`\`tsx
const padding = getVariableValue(getSize(size)) * 0.6
\`\`\`

Use explicit token keys when you need a named smaller or larger token. Use numeric multiplication when proportional sizing is intended.

### 8. Audit font size values

- \`fontSize={17}\` is a raw numeric platform value and keeps platform-default line-height behavior.
- \`fontSize="17px"\` is an exact pixel value.
- Configured font \`size\` and \`lineHeight\` tokens should use px strings when exact web pixels are intended.
- Convert custom config font tokens to px strings if exact pixels were intended.

### 9. Update FocusScope

- Function-as-children is removed. Pass JSX children directly.
- FocusScope renders a \`display: contents\` wrapper.
- Use \`noFocus\` for zero-focus mode when focus should be rejected entirely.

Before:

\`\`\`tsx
<FocusScope loop>
  {({ ref, onKeyDown, tabIndex }) => (
    <View ref={ref} onKeyDown={onKeyDown} tabIndex={tabIndex} />
  )}
</FocusScope>
\`\`\`

After:

\`\`\`tsx
<FocusScope loop>
  <View />
</FocusScope>
\`\`\`

### 10. Update Dialog, Popover, Select, and Adapt flows

- Dialog, Popover, and Select use one Adapt handoff model.
- Adapted Sheet content stays mounted through the sheet slide-out.
- Parts own their presence animation lifecycles.
- The \`onDidAnimate\` prop is replaced by the typed \`onTransition\` lifecycle: \`onTransition={(e) => e.phase === 'end' && e.cause === 'enter' && done()}\`.
- \`Popover.Content forceMount\` now matches Dialog semantics.
- \`Dialog.Content\` no longer accepts the old no-op \`size\` variant.
- Non-modal Dialog content no longer enables RemoveScroll while open.
- Remove internal imports such as \`useShowPopoverSheet\`, \`PopoverAdaptHiddenContext\`, or \`useSelectBreakpointActive\` if the app used them.

### 11. Update Select

- Keep \`name\` when Select participates in a form. Remove the unsupported \`autoComplete\` prop.
- Use \`Select.Separator\` for visual grouping.
- \`Select.Content\` accepts \`onEscapeKeyDown\` and \`onInteractOutside\`.
- \`Select.Trigger\` and web \`Select.Viewport\` expose \`data-state="open" | "closed"\`.

### 12. Update themed icons

- \`<Icon size="4" />\` now resolves through the current font's \`font.size['4']\` scale.
- Raw numeric icon sizes are unchanged.
- Themed icons no longer accept Tamagui media or pseudo props directly.
- Wrap icons in a styled \`View\` for media and state clauses.

### 13. Check ScrollView web usage

\`@tamagui/scroll-view\` now has its own web implementation. It supports \`scrollTo\`, \`scrollToEnd\`, \`getScrollableNode\`, RN-shaped \`onScroll\`, \`contentContainerStyle\`, \`horizontal\`, and indicator props.

Replace unsupported old web/lite usage such as momentum events, \`snapTo*\`, and \`keyboardDismissMode\`.

### 14. Optional Tailwind frontend

Skip this in the intermediate V3 API checkpoint unless Tailwind adoption was
separately requested. It does not require changing the whole app to Config v6.

Tailwind authoring is selected by the component package, with no global config:

\`\`\`tsx
import { View, Text, styled } from '@tamagui/tailwind'
\`\`\`

Keep importing regular Tamagui components from \`tamagui\` or
\`@tamagui/core\`. Do not mix utility classes and Tamagui style props on the
same component; choose the import whose styling language that component uses.

### 15. Verification

- Run \`npx tamagui check\`.
- Run typecheck and build.
- Start the app and manually test screens using Sheet, Dialog, Popover, Select, FocusScope, icons, and ScrollView.
- Test Adapt breakpoints where popovers/selects/dialogs become sheets.
- Verify keyboard focus, Escape, outside click, scroll locking, and close animations.
- Inspect icon alignment next to text at each app size token.
- If the Tailwind frontend is used, compare web and native output for the classes used.
- Compare the same screens and resolved control dimensions with the baseline. Keeping Config v5 preserves the scales, but does not prove that changed component APIs preserve every layout.
- Report the final package version, retained config, manual fixes, runtime evidence, and deferred optional work. A validated V3 app on Config v5 is a completed migration.

### Optional follow-up: Config v6, only when separately requested

This appendix is not part of the intermediate V3 API checkpoint. Start a new
reviewable change after that checkpoint is validated. Record new visual
acceptance criteria before changing design values.

- New apps can start with \`defaultConfig\` from \`@tamagui/config/v6\`.
- For an existing app, inventory and compare resolved spacing, size, radius, font, icon, and media values. Map by resolved value when preserving appearance; the same token name can mean a different number in v6.
- Preserve breakpoint meaning: changing a max-width key to a min-width key can invert responsive behavior.

- Use \`createThemes\`, \`levels\`, scales, and the other recipe helpers from \`@tamagui/themes/builder\`.
- Remove \`componentThemes\`, \`templates\`, \`masks\`, \`childrenThemes\`, and \`grandChildrenThemes\`. Express hierarchy in the recipe tree, semantic values in scales, and exact one-theme overrides in \`values\`.

Rename the adaptive 12-step ramp approximately:

- \`color1\` -> \`color1\`
- \`color2\` -> \`color2\`
- \`color3\` -> \`color3\`
- \`color4\` -> \`color4\`
- \`color5\` -> \`color5\`
- \`color6\` and \`color7\` -> \`color6\`
- \`color8\` -> \`color7\`
- \`color9\` -> \`color8\`
- \`color10\` -> \`color9\`
- \`color11\` -> \`color10\`
- \`color12\` -> \`color11\`

The endpoints are exact; inspect contrast in the compressed middle. Replace
\`surface1\` with \`level2\`, \`surface2\` with \`level3\`, and \`surface3\`
or \`surface4\` with \`level4\`. Levels are relative and preserve a surrounding
color theme when nested.

Search the config and application together:

\`\`\`bash
rg "@tamagui/theme-builder|v5-builder|createV5Theme|componentThemes|grandChildrenThemes|surface[1-4]|color12"
\`\`\`

Validate the config change separately with light/dark screenshots, responsive
layouts, text and icon alignment, and every platform the app ships. Do not
accept visual drift merely because the codemod and typecheck are green.`

const v1ToV2Prompt = `## v1 -> v2 migration pass

Bring the app to the v2 baseline before applying v3 changes.

### Requirements

- React 19+
- React Native 0.81+ with New Architecture support
- TypeScript 5+

### Config

- Preserve the app's existing token, theme, font, and breakpoint values while reaching the v2 API baseline. Keep supported Config v5 imports or serialize the old generated config into app-owned values when an entry is no longer exported. Config v6 is a separate optional migration after the v3 checkpoint below.
- Import animations separately from \`@tamagui/config/animations-css\`, \`animations-rn\`, \`animations-reanimated\`, or \`animations-motion\`.
- Move root \`createTamagui\` settings into \`settings\`.
- Account for the defaults \`flexBasis: 0\` and \`position: static\`. Use \`styleCompat: 'legacy'\` or explicit props if needed.
- Rename media queries: \`$2xl\` -> \`$xxl\`, \`$2xs\` -> \`$xxs\`, and max queries to kebab-case such as \`$max-md\`.
- Preserve resolved colors and themes; defer v6 recipe conversion to the optional follow-up below.

### v1 prop and API changes

- \`animation\` -> \`transition\`.
- \`AnimationProp\` -> \`TransitionProp\`.
- \`tag\` -> \`render\`.
- \`Stack\` -> \`View\`.
- \`StackProps\` -> \`ViewProps\`.
- \`space\` and \`spaceDirection\` -> \`gap\`.
- \`themeInverse\` and \`<Theme inverse>\` -> \`theme="inverse"\` and \`<Theme name="inverse">\`.
- \`onHoverIn\` / \`onHoverOut\` -> \`onPointerEnter\` / \`onPointerLeave\` or mouse events.
- \`ellipse\` -> \`numberOfLines={1}\`.
- React Native accessibility props -> ARIA/web equivalents where applicable.
- React Native shadow props -> \`boxShadow\`.

### v1 component changes

- Input and Image prefer web-standard props such as \`type\`, \`inputMode\`, \`src\`, \`alt\`, and \`objectFit\`.
- Button and ListItem no longer take direct text style props. Style text through child components.
- Tabs uses \`Tabs.Tab\` instead of \`Tabs.Trigger\`; \`activationMode\` defaults to \`manual\`.
- Group requires \`Group.Item\`; remove old separator/space/scrollable auto-cloning props.
- Replace old \`Popover.Sheet\` subcomponents with standalone \`Sheet\` inside \`Adapt\`.
- Add native setup imports where needed: \`@tamagui/native/setup-teleport\`, \`setup-gesture-handler\`, \`setup-expo-ui-menu\` or \`setup-zeego\`, \`setup-burnt\`, and linear-gradient setup.

### v1 -> v2 verification

- Run the app before starting v3 changes.
- Verify layout affected by flex/position defaults.
- Verify forms, tabs, groups, portals, native sheets, and Input/Image behavior.
- Commit the v1 -> v2 migration separately if possible.`
