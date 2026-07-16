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

### 1. Update dependencies

- Bump every \`tamagui\` and \`@tamagui/*\` package together to v3.
- Keep \`@tamagui/core\`, \`@tamagui/web\`, and \`tamagui\` deduped in the lockfile.
- Run:

\`\`\`bash
npx tamagui check
\`\`\`

### 2. Run the Sheet codemod

Run the codemod, then inspect every changed Sheet:

\`\`\`bash
node ./node_modules/tamagui/scripts/codemods/sheet-frame-to-container.js "src/**/*.{ts,tsx}"
\`\`\`

If working inside a Tamagui checkout, this path is also valid:

\`\`\`bash
node ./scripts/codemods/sheet-frame-to-container.js "src/**/*.{ts,tsx}"
\`\`\`

Migration rules:

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
  <Sheet.Container padding="$4">
    <Sheet.Background bg="$background" borderTopRadius="$6" />
    <Sheet.ScrollView>{children}</Sheet.ScrollView>
  </Sheet.Container>
</Sheet>
\`\`\`

### 3. Remove deprecated v2 APIs

Search:

\`\`\`bash
rg "focusable|fullscreen|themeInverse|<Theme inverse|Sheet\\.Frame|styleable\\(|inlineWhenUnflattened|\\$true|getTokenRelative|stepTokenUpOrDown|forceRemoveScrollEnabled|sizeAdjust"
\`\`\`

Replace:

- \`focusable\` -> \`tabIndex\`.
- \`fullscreen\` -> explicit \`position\` and \`inset\` props.
- \`themeInverse\` -> \`theme="inverse"\`.
- \`<Theme inverse>\` -> \`<Theme name="inverse">\`.
- \`Sheet.Frame\` -> \`Sheet.Container\` plus \`Sheet.Background\`.
- \`.styleable()\` -> ordinary React composition or styled wrappers.
- forwardRef wrapper statics -> direct refs and normal composition.
- \`inlineWhenUnflattened\` -> remove it.
- deprecated UI kit aliases -> current component names.
- old platform style keys -> current \`$web\`, \`$native\`, \`$ios\`, \`$android\`, etc.
- \`forceRemoveScrollEnabled\` -> \`disableRemoveScroll\` with inverted intent.
- \`createCheckbox\` \`sizeAdjust\` -> explicit sizing math or component styles.

### 4. Replace true tokens

- Default v3 configs no longer export \`$true\` token keys.
- Component default size resolves to \`$4\`.
- Replace authored \`$true\` tokens with real keys such as \`$4\`.
- Do not change unrelated boolean props or boolean variant values.

### 5. Replace token stepping

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

### 6. Audit font size values

- \`fontSize={17}\` is a raw numeric platform value and keeps platform-default line-height behavior.
- \`fontSize="17px"\` is an exact pixel value.
- v5 config font \`size\` and \`lineHeight\` scales are pinned to px strings in v3.
- Convert custom config font tokens to px strings if exact pixels were intended.

### 7. Update FocusScope

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

### 8. Update Dialog, Popover, Select, and Adapt flows

- Dialog, Popover, and Select use one Adapt handoff model.
- Adapted Sheet content stays mounted through the sheet slide-out.
- Parts own their presence animation lifecycles.
- The \`onDidAnimate\` prop is replaced by the typed \`onTransition\` lifecycle: \`onTransition={(e) => e.phase === 'end' && e.cause === 'enter' && done()}\`.
- \`Popover.Content forceMount\` now matches Dialog semantics.
- \`Dialog.Content\` no longer accepts the old no-op \`size\` variant.
- Non-modal Dialog content no longer enables RemoveScroll while open.
- Remove internal imports such as \`useShowPopoverSheet\`, \`PopoverAdaptHiddenContext\`, or \`useSelectBreakpointActive\` if the app used them.

### 9. Update Select

- Remove \`name\` and \`autoComplete\` from custom \`Select\` usage.
- Use \`Select.Separator\` for visual grouping.
- \`Select.Content\` accepts \`onEscapeKeyDown\` and \`onInteractOutside\`.
- \`Select.Trigger\` and web \`Select.Viewport\` expose \`data-state="open" | "closed"\`.

### 10. Update themed icons

- \`<Icon size="$4" />\` now resolves through the current font's \`font.size.$4\` scale.
- Raw numeric icon sizes are unchanged.
- Themed icons no longer accept Tamagui media or pseudo props directly.
- Wrap icons in a styled \`View\` for \`$sm\`, \`hoverStyle\`, \`pressStyle\`, etc.

### 11. Check ScrollView web usage

\`@tamagui/scroll-view\` now has its own web implementation. It supports \`scrollTo\`, \`scrollToEnd\`, \`getScrollableNode\`, RN-shaped \`onScroll\`, \`contentContainerStyle\`, \`horizontal\`, and indicator props.

Replace unsupported old web/lite usage such as momentum events, \`snapTo*\`, and \`keyboardDismissMode\`.

### 12. Optional Tailwind mode

Tailwind mode is optional. Use it only if the app wants utility syntax:

\`\`\`tsx
createTamagui({
  ...defaultConfig,
  settings: {
    ...defaultConfig.settings,
    styleMode: 'tailwind',
  },
})
\`\`\`

Use \`styleMode: 'tamagui-and-tailwind'\` to mix \`className\` utilities with Tamagui props during migration.

### 13. Verification

- Run \`npx tamagui check\`.
- Run typecheck and build.
- Start the app and manually test screens using Sheet, Dialog, Popover, Select, FocusScope, icons, and ScrollView.
- Test Adapt breakpoints where popovers/selects/dialogs become sheets.
- Verify keyboard focus, Escape, outside click, scroll locking, and close animations.
- Inspect icon alignment next to text at each app size token.
- If Tailwind mode is enabled, compare web and native output for the classes used.`

const v1ToV2Prompt = `## v1 -> v2 migration pass

Bring the app to the v2 baseline before applying v3 changes.

### Requirements

- React 19+
- React Native 0.81+ with New Architecture support
- TypeScript 5+

### Config v5

- Move from \`@tamagui/config/v4\` to \`@tamagui/config/v5\` unless the app already did.
- Import animations separately from \`@tamagui/config/v5-css\`, \`v5-rn\`, \`v5-reanimated\`, or \`v5-motion\`.
- Move root \`createTamagui\` settings into \`settings\`.
- Account for v5 defaults: \`flexBasis: 0\` and \`position: static\`. Use \`styleCompat: 'legacy'\` or explicit props if needed.
- Rename media queries: \`$2xl\` -> \`$xxl\`, \`$2xs\` -> \`$xxs\`, and max queries to kebab-case such as \`$max-md\`.
- Update colors/themes to Radix v3 and Config v5 theme helpers if the app uses default themes.

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
- Add native setup imports where needed: \`@tamagui/native/setup-teleport\`, \`setup-gesture-handler\`, \`setup-zeego\`, \`setup-burnt\`, and linear-gradient setup.

### v1 -> v2 verification

- Run the app before starting v3 changes.
- Verify layout affected by flex/position defaults.
- Verify forms, tabs, groups, portals, native sheets, and Input/Image behavior.
- Commit the v1 -> v2 migration separately if possible.`
