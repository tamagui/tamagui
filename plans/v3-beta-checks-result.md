# v3-beta Checks repair

The repair is split across these commits:

- `15eb984a9e` fixes the strict type-check failures and restores the intended v6 font-scale behavior in unit and browser integration coverage.
- `9b503af5a4` brings the remaining unit contracts in sync with deliberate API and template changes.
- `bdac251aca` removes optional whitespace from production CSS variable declarations so the zero-runtime starter stays inside its unchanged gzip limits.
- `7c59094172` applies the same deliberate Button control-height contract to the native size coverage.
- `2e905de12e` removes the remaining optional formatting from production design-system and theme CSS.
- `f329e4a2be` pins native conditional font extraction to the deliberate v6 font metrics and strengthens its per-branch assertions.

No test assertion, timeout, retry, skip, coverage requirement, or size budget was loosened.

## Findings

- The font-size expectations were stale after the deliberate v6 scale change in `5df9322fea`. The v5 scale remains pinned, while v6 resolves the tested icon token to 13.
- Button control height is deliberately separate from font size after `e7581ccea5`. The size test now compares each public path to the exact resolver that owns it.
- DOM `borderStyle` omitted `none` and `hidden` even though `d4b9384c52` deliberately added both to the public stack style surface.
- The create-tamagui CLI test still moved down five options after `cfccca66cd` removed Expo Router and moved the Next plus Expo starter to the fifth option.
- The bundled Tailwind grammar snapshot omitted the generated light and dark brand descendants now present in the default theme config.
- The zero-runtime CSS overage was formatting bytes between declarations. Production output now omits those spaces while development output retains readable spacing.

## Validation

- `bun turbo run test:web --filter='!@tamagui/kitchen-sink' --concurrency=1`: 167 tasks passed.
- `code/core/web`: 20 files and 98 tests/type assertions passed.
- `code/core/cli`: 6 files and 37 tests passed.
- `code/core/create-tamagui`: 20 tests passed.
- Pinned Node 24.16 zero-runtime measurement passed all six unchanged graph-size ceilings. Vite was 4058/4063 bytes, Next was 4076/4080 bytes, and Metro was 4076/4410 bytes for base/islands respectively.
- `bun run lint` passed with two pre-existing warnings.
- `bun run check` passed all dependency, unused, Tamagui, reference, path, web-type, and LSP pin checks.
- Checks run `34778035179` proved all three integration shards and the workspace type check green at `15eb984a9e`; its failures exposed the remaining unit type contract and common production CSS formatting.
- Checks run `34780130123` kept those lanes green and narrowed the remaining unit failure to the native counterpart of the already-proven Button contract. Its zero-runtime failure showed the first formatting pass reduced every CSS artifact without fully recovering the Metro islands ceiling.
- Checks run `34781159173` passed every job except the native compiler snapshot fixed in `f329e4a2be`. Both zero-runtime jobs passed with the unchanged budgets.
