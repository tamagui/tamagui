# Codemod report playbook

Every row in the flat-values report is one of four assessments or a flag
code. This is what each one means operationally and what you do about it.
The full semantics live in `code/core/codemod-flat-values/README.md`; this
file is the action table.

## Assessments

| Assessment | Meaning | Action |
|---|---|---|
| `clean` | Property, platform targets, and TypeScript host all check out | Applied by `--write`; review in the diff |
| `needs-relocation` | Valid syntax, wrong home: the target or host cannot evaluate it | Move the code where the report says (`.web.tsx`, `.native.tsx`, a Text host, `html.*`), or keep the authored driver path for `exitStyle` |
| `unknown-host` | Provably Tamagui, but TypeScript could not expose the component's prop surface (most often compound members like `Menu.Item`) | Confirm the host accepts the style, then convert by hand; the component is not necessarily wrong, the tooling could not see it |
| `ineligible` | The property has no flat clause spelling (shadow/transform parts) | Rebuild on the composite (`boxShadow`, `textShadow`, `transform`); see hard-cases |

## Flag codes

| Code | Action |
|---|---|
| `legacy-token-dot-path` | `$1.5`-style names need one flat token name; check the config for the replacement spelling and migrate the config if it still uses dot-path keys |
| `legacy-numeric-composite-token` | Substitute the numeric token's resolved CSS value inside the composite string |
| `legacy-token-constant` | Migrate the module constant holding the token, then re-run |
| `unproven-container-group` / `ambiguous-container-group` / `container-group-not-declared` | Find the element that declares the group, add `container containerName="<group>"` to it yourself, convert the condition to `@size/<group>:`, and verify layout (containment changes) |
| `legacy-group-presence` | `$group-card` with no state or size styles every descendant unconditionally and has no flat spelling; restructure as a variant on the descendants or explicit props |
| `unknown-legacy-condition` / `unregistered-legacy-condition` | The condition name is not in the v6 registry (custom media keys are the usual cause); add the key to the config's media before converting |
| `non-style-condition-entry` | A conditional non-style prop (`numberOfLines`) has no flat target; move the branch to JSX logic |
| `dynamic-legacy-condition` | The condition object itself is built at runtime; lift the branch per property (hard-cases: whole condition props) |
| `dynamic-condition-value` | A value inside the condition object is runtime; lift the branch outside the clause (hard-cases: dynamic values) |
| `unprovable-dynamic-value` / `dynamic-string-value` | The checker cannot prove the value's shape; tighten the type or manually confirm no `$` spelling can arrive at runtime |
| `non-css-style-value` / `empty-style-value` | The base a clause needs is `true`/`false`/`null` or always nullish; give the property a real base or restructure |
| `structured-transform-dynamic` / `structured-transform-matrix` | Dynamic or matrix transform arrays keep their authored form; if a condition needs them, author a complete `transform` string manually or keep the logic in JS |
| `structured-font-variant-*` / `structured-background-image-*` / `structured-<property>` | The structure has no verified CSS spelling; keep authored or rewrite manually with runtime verification |
| `condition-order-not-preservable` / `base-order-not-preservable` | An opaque spread or unconverted condition sits between contributions; convert the blocker first, then re-run, and never reorder to force a merge |
| `computed-property` | A computed key hides the style property; resolve the key statically or leave authored |
| `value-reparses-as-program` | The converted string would read back as more than one base value; adjust the value (usually quoting or spacing) until it round-trips |
| `emitted-program-mismatch` / `emitted-value-invalid` | Codemod bug; report it upstream with the site, do not hand-apply the suggestion |

## Configuration warnings

| Code | Action |
|---|---|
| `legacy-palette-token` | The site keeps a v5 palette-step name (`blue10`) the v6 defaults do not define; missing colors drop silently at runtime. Replace with an absolute token (`blue-500`) or a theme's adaptive `colorN` value before running the app |

## Exit condition

Re-run the report after every batch of manual fixes. Done means: zero
remaining legacy condition objects, zero unresolved flags, zero
`legacy-palette-token` warnings, and the report's file list of
"still needs a hand edit" is empty.
