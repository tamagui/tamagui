# Compiler consumed-prop inventory

This is the wave B item 15 inventory at `v3-beta`. A consume site is any path
that replaces or removes an authored prop span. Renaming a prop name in place is
listed for completeness but does not consume its value.

## Source-span removal mechanisms

`compiledPropsEdits` is the shared object-call remover. It replaces the first
entry in a consumed set with generated props and erases the rest. The equivalent
JSX paths perform the same first-entry replacement and rest-entry erasure inline
in `createTamaguiCompilerHost`.

Those mechanisms receive entries from three logical consume sites:

| Consume site | Inputs | Classification |
| --- | --- | --- |
| Full style lowering through `styleEntries` | `className`, `style`, `group`, `transition`, `animation`, `animateOnly`, `animatePresence`, `animatedBy`, `fontFamily`, `render`, configured shorthands, valid style props, and variants | Retained. The value becomes web classes/inline style, native style or stable-style expressions, a selected host tag, container CSS, or a blocking runtime bailout. Animation props that still require the runtime bail before removal. |
| Invalid-host additions to `styleEntries` | Text-only style props on a non-text host, both direct props and keys inside a static spread | Dropped before this item. The successful flatten erased the value and attached a non-blocking diagnostic. It now blocks lowering, so the source prop and runtime component remain. |
| Web partial extraction through `staticStyleEntries` | Static direct style props whose CSS ownership does not overlap the retained dynamic style props | Retained. The consumed values become an added atomic `className`; all dynamic and overlapping props stay on the component. |

The native, web, conditional-class, native-fast, stable-style, DOM style-handle,
JSX, `createElement`, and `jsx` branches are output forms of those same logical
sites. They do not select another class of props.

Static props inherited from a `styled()` definition enter the same style and
animation resolution even though they have no call-site span to erase. They are
retained in generated style output or force a blocking runtime bailout. This
includes the definition-level animation props whose previous silent drop was
fixed before this item.

## `nativeDOMProps` consume sites

`nativeDOMProps` adds its consumed entries to `styleEntries`, so the same
transactional source-span remover erases them only after native lowering
succeeds.

| Input | Generated carrier | Classification |
| --- | --- | --- |
| Event rows with `native: 'none'`: `onAuxClick`, `onContextMenu`, `onFocusIn`, `onFocusOut`, `onKeyUp`, `onCopy`, `onCut`, `onPaste`, `onFullscreenChange`, `onFullscreenError`, `onWheel`, `onMouseMove`, `onBeforeInput`, `onInvalid`, `onSelect` | None before this item | Dropped before this item. Each now returns a blocking lowering diagnostic and leaves the original `html.*` element and handler intact. |
| `dir` | Native style `writingDirection` | Retained for a static value. A dynamic value blocks lowering before consumption. |
| `hidden` | Native style `display: 'none'` | Retained for a static value. A dynamic value was dropped and now blocks lowering before consumption. |
| `tabIndex` | `focusable` | Retained. |
| `readOnly` | `editable` | Retained. |
| `disabled` | `disabled`, `focusable`, text-entry `editable`, and `accessibilityState.disabled` | Retained. |
| `type` | Input `secureTextEntry`, inferred `inputMode`, or the native text-entry default | Retained. Unsupported or dynamic input types block lowering. `type` on a button has the same intentional no-form effect in the native runtime twin. |
| `aria-hidden` | `accessibilityElementsHidden` and `importantForAccessibility` | Retained. |
| `aria-live` | `accessibilityLiveRegion` | Retained. |
| `aria-busy`, `aria-checked`, `aria-disabled`, `aria-expanded`, `aria-selected` | Keys in `accessibilityState` | Retained. |
| `aria-valuemax`, `aria-valuemin`, `aria-valuenow`, `aria-valuetext` | Keys in `accessibilityValue` | Retained. |

Event rows with a native equivalent are never consumed as values. Six adapted
events keep their DOM names for the primitive (`onClick`, `onLoad`, `onError`,
`onChange`, `onInput`, `onKeyDown`); the other supported events are either
retained under the same name or renamed in place to `nativeProp`.

Attribute rows marked `native: 'none'` are not compiler consume sites. They stay
in the transformed prop set and receive the structural unsupported-prop
diagnostic. Web DOM mappings (`for` to `htmlFor`, `role="none"` to
`role="presentation"`, and `testID` to `data-testid`) also edit in place and
retain their values.

## Zero-runtime Theme props

`lowerStaticTheme` replaces the complete opening `<Theme ...>` tag, so it is a
separate whole-span prop consume site:

| Input | Generated carrier | Classification |
| --- | --- | --- |
| `name` | Enumerated theme classes and the branch expression that selects them | Retained. A name that is not a literal or conditional over literals is a blocking zero violation. |
| `reset` | Theme-chain resolution | Retained. A non-literal value or combination with `name` is a blocking zero violation. |
| `contain` | `contain: "strict"` on the generated span | Retained. A non-literal value is a blocking zero violation. |
| Literal theme-key props | Generated inline-variable class, CSS rules, and island bridge layer | Retained. Invalid or dynamic values are blocking zero violations. |
| Other reserved Theme props and prop spreads | No compiled form | Never consumed successfully. They produce a blocking zero violation, and zero enforcement leaves the source unchanged. |

## Other erasure searches

The remaining empty `SourceEdit` sites in `@tamagui/compiler-core` erase imports
and bindings after zero-runtime reference analysis. The DOM structural pass
replaces consumed `style()` definitions with `undefined`. Neither path consumes
an element prop. No other compiler prop-removal mechanism exists outside the
three entry selectors and the zero-runtime Theme replacement above.
