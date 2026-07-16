# V3 analyzer and shared-IR proving package

This private workspace measures the two candidates named by E1 in
`plans/v3-evolution.md`. It is deliberately outside the published static compiler. The
host fixture supplies every resolved module id; neither candidate performs filesystem or
package resolution.

The checked-in source is a reviewable experiment, not a second compiler implementation.
After evidence is collected, the losing candidate is deleted and the retained graph becomes
the starting point for E2.

**Decided 2026-07-13: yuku.** `evidence/results.json` holds the recorded two-candidate run;
the `oxc-owned` adapter is deleted. The verdict and its reasoning live in
`plans/v3-evolution.md` under E1.

## E2 ownership boundary

This package remains private while E2 proves the parser-independent contracts. The shared
element IR, host-resolved project graph, deterministic partial evaluator, and diagnostics
live here so the public Babel extractor and Vite/Metro adapters remain untouched during the
parity review.

The intended dependency direction is:

```text
Vite / Metro / legacy static frontends
                ↓
      shared compiler semantics
                ↓
       yuku analyzer adapter
```

The shared layer never imports a bundler, Tamagui runtime, Babel, or Yuku types. Hosts pass
canonical host-resolved module ids (absolute filesystem paths, NUL-prefixed virtual ids, or
absolute URL-scheme ids) and import edges. The Yuku adapter uses its public API and is the
only layer that imports `yuku-analyzer`.

If any prop or child cannot normalize, the element is discriminated as incomplete and keeps
only `bailedEntries` for diagnostics; optimization consumers can access `entries` only on a
complete element.

Extraction into a dedicated public `@tamagui/compiler-core` package is contingent on E2
snapshot parity, compiled-JSX parity, diagnostics, invalidation, and source-map review. It
is not an established package or public API yet. Keeping the draft here also avoids a
manifest, lockfile, or adapter dependency change before that review.

The legacy inventory that shaped this boundary:

- `@tamagui/static` is the common Vite/Metro dependency, but currently combines Babel
  traversal, runtime/config loading, CSS emission, and guessed cross-file evaluation.
- the former per-file traversal discovered `styled()` and JSX but had no compiled-JSX call
  normalization.
- `getStaticBindingsForScope.ts` recursively loads whitelisted files through a child process,
  so it cannot be the shared host-resolved symbol graph.
- `evaluateAstNode.ts` throws or executes a supplied evaluator callback. E2 instead returns a
  deterministic value-or-bailout result and never executes modules.

`src/harness/correctness.ts` is the bounded E2 proof surface. It compares JSX, automatic
runtime calls, and `createElement`; verifies cross-package symbols and static spreads;
checks Yuku's UTF-16 source ranges plus MagicString source maps; and exercises hash
invalidation and stale-edge removal.
