# V3 token sigil rip: one worker, big bang

Mandate, ruled by Nate 2026-07-31: remove `$` from Tamagui entirely and make
the flat value grammar the only styling input. No runtime legacy paths.
Migration is the codemod plus the tamagui skill, not compat code. This executes
the deferred "token representation migration" from
`plans/dom-tailwind-flat-values.md` decision 13 and closes the carve-out that
let config storage keep `$` in the meantime.

This plan is executed by a single implementer working big-bang on one branch,
with two reviewers checking phase checkpoints. It is faster to break the whole
tree for two days and converge once than to keep every intermediate state
green. That trade is deliberate and approved.

## Rulings (final, do not re-litigate)

1. `$` is gone everywhere: config and token storage keys, token type unions,
   theme value lookups, runtime parsers, the compiler, docs, tests,
   kitchen-sink, demos, starters. Authoring is `bg="red-500 hover:blue-500"`
   and theme values are bare (`bg="background"`).
2. `legacyConditionObjects` is deleted now, along with the old condition-object
   parsers (`hoverStyle`, `pressStyle`, `$theme-*`, `$platform-*`, media and
   group objects) and its gate tests. This supersedes decision 23 in
   `dom-tailwind-flat-values.md`, which scheduled removal for v4. v3 ships
   flat-only.
3. The recovered wip commit `d7c1df523f` on
   `recovery/air24-v3-flat-20260731` is split, not taken whole:
   - keep: the flatValuePrograms web and native tests (rewrite expectations
     sigil-free), the style-grammar family fixes that are sigil-independent
     (background, border, font, textDecoration), and the `content` prop ruling
     recorded in `plans/v3-static-types-feasibility.md` (apply it: drop the CSS
     `content` declaration from `ExtraStyleProps` so `content` types as the
     alignContent shorthand).
   - drop: the `hasLegacyPrefix` / `CHAR_DOLLAR` acceptance in
     `style-grammar/src/resolvePayload.ts`, the `unresolved-token` error kind,
     and `core-test/tokenSigilPrograms.native.test.tsx`. These contradict
     decision 13.
4. The codemod (`code/core/codemod-flat-values`) graduates from report-only to
   write mode and is the entire migration story. It removes `$` from statically
   known token values and converts condition objects to flat clauses per the
   existing conversion rules in `dom-tailwind-flat-values.md`. Dogfood it on
   this repo; hand-fix what it flags.
5. A bare lookup miss stays literal text, since CSS keywords must pass through.
   No runtime guessing and no warnings for unknown bare names. Typos are the
   type layer's job.
6. Built-in multi-part names are kebab-case per decision 15. The parser never
   guesses camelCase-to-kebab aliases at runtime.

## Not in scope

- `styled()` option objects and plain prop objects stay. The rip covers the
  `$` sigil and condition-object styling, not object syntax as such.
- Tailwind-mode (`className` candidates) behavior changes beyond what the
  shared resolver forces.
- Any npm release. The branch merges to `v3-beta` when done, nothing publishes.

## Current state (verified 2026-07-31)

- `origin/v3-beta` at `c4be9a44c8`; frozen conformance candidate `fa3f27be45`.
- `recovery/air24-v3-flat-20260731` = v3-beta tip + two test commits
  (`42aa741708`, `f3412b1f23`) + wip `d7c1df523f` (556 insertions).
- Runtime `$` checks live in `code/core/web/src/helpers/propMapper.ts`
  (~8 sites, token/theme lookup near line 741). The wip added more in
  `style-grammar/src/resolvePayload.ts` (dropped per ruling 3).
- `$`-prefixed token unions are generated in `code/core/web/src/types.tsx`
  (`ColorTokens` and siblings).
- `legacyConditionObjects` is implemented in `createTamagui.ts`,
  `createComponent.tsx`, `getSplitStyles.tsx`, `types.tsx`, with gate tests in
  `core-test/legacyConditionGate.*.test.tsx` and codemod report wiring.
- 329 files across `code/ui`, `code/demos`, `code/kitchen-sink` author
  `"$token"` strings today.
- The codemod is report-only by design today; its acceptance test parses clean
  programs back through `@tamagui/style-grammar`.

## Phases

0. Salvage. Branch is `v3/rip-token-sigil` from the recovery tip; apply
   ruling 3 (strip the legacy-sigil pieces, keep the rest).
1. Representation. Token and theme storage keyed bare, token type unions bare,
   one lookup path. Delete every `[0] === '$'` branch in core. Config-time
   creation (`createTokens`, `createTamagui`, variables) stops writing `$`.
2. Delete legacy. `legacyConditionObjects` setting, old condition-object
   parsers, gate tests, and every dead helper they leave behind.
3. Codemod write mode. Then run it over `code/ui` skins, `code/kitchen-sink`,
   `code/demos`, starters. Hand-fix the flagged rows. This clears the 329
   files.
4. Docs and skill. `plans/tamagui-skill` teaches sigil-free authoring and the
   migration flow; docs examples rewritten sigil-free.
5. Converge. Build all packages, one full typecheck, kitchen-sink web tests,
   rerun the conformance matrix against the new candidate. Fix forward until
   green, then merge to `v3-beta`.

## Working rules for the implementer

- The tree is allowed to stay broken between phases. Do not run typecheck or
  tests per edit. Check at phase boundaries, fully at phase 5. Speed comes
  from not paying the per-step verification tax.
- No compat shims, no dual paths, no feature detection, no keeping an old
  function "just in case". Delete it.
- Commit coherent chunks with one-line conventional messages. Do not gate
  commits on green. Push the branch after every phase at minimum.
- Escalate only genuine product ambiguity (a naming collision, a user-visible
  API shape question). Everything else, decide per the rulings and keep
  moving.

## Team and review disposition

- implementer (Codex gpt-5.6-sol, xhigh, fast tier): owns the entire plan end
  to end. REVIEW: sol-reviewer and opus-reviewer at phase checkpoints.
- sol-reviewer (Codex gpt-5.6-sol, xhigh) and opus-reviewer (Claude Opus,
  xhigh): verify plan adherence at phase checkpoints, not per commit. The two
  violations that matter most: reintroduced `$` acceptance or compat shims,
  and baby-stepping (per-edit check loops, incremental green-keeping). Message
  the implementer only for violations or blockers; report checkpoint results
  to the coordinator. REVIEW: none, you are the review.
