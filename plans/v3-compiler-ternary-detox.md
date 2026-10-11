# CompilerTernaryActive Detox attribution, 2026-08-04

## Verdict

**READ:** Item B did not cause the `optimized and non-optimized text should
match colors in both states` failures. The generated native fixture had the
same incorrect inactive `theme.color11.get()` branch immediately before and
after item B (`3a24f5423d`). Item B did not modify the fixture, its source, or
the Detox setup.

**READ:** The source uses `color11` when active and `color10` when inactive.
The v6 migration commit `a374c4f58c` changed both branches in the source, but
changed only the active branch in the generated native file. The generated
inactive branch remained `theme.color11.get()`. The failure colors match that
artifact exactly: optimized inactive and active were both RGB(3, 7, 18), while
the runtime inactive value was RGB(16, 24, 40).

**READ:** Current compiler output no longer lowers this theme-token
conditional. Item D deliberately bails when a conditional branch diff contains
a theme sentinel. Regenerating `CompilerTernaryActive.native.tsx` leaves the
two tested `ActiveText` components on the Tamagui runtime path, so the
optimized label in this old Detox case no longer describes its execution.
Focused static compiler coverage already records this conservative behavior in
`babel.native.test.tsx`.

## Why CI used the stale artifact

**READ:** Native CI prewarms Metro before Jest starts. The run log shows the
Android bundle completed at 11:15:38, then Jest regenerated the compiler
fixtures beginning at 11:15:42. Metro served one-module delta bundles after
that, but the app still rendered the prewarmed fixture. iOS showed the same
colors and failure.

The checked-in generated fixture is therefore an input to the prewarm, even
though Jest regenerates it later. Keeping it stale makes both platform runs
exercise obsolete output.

## Resolution

Regenerate and commit
`code/kitchen-sink/src/usecases/CompilerTernaryActive.native.tsx` from the
current compiler. This removes the obsolete compiled branches from the prewarm
and makes the served fixture agree with current compiler behavior. The tracked
fixture is formatted and carries `@ts-nocheck` because the compiler's generated
function-property cache is valid JavaScript but is not valid standalone
TypeScript source.

The Detox assertion is renamed to describe its current purpose: verifying that
the compiler bailout and the explicit runtime path render the same colors and
both transition. Compiler lowering and bailout behavior belongs to the static
compiler suite, which executes the compiler output directly and does not
depend on Metro prewarm timing.
