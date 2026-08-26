# getSplitStyles and propMapper hot-path benchmark

## Phase 1 baseline

**READ**: The baseline is commit `38fded5d9f35fc84e0558b5bb5770ccbc9b587de` on `v3-beta`. The checkout began at `d37d5a002b`; commits `12b5dc576d` and `38fded5d9f` landed while the benchmark was being built. They changed documentation and CI only. None of `propMapper.ts`, `getSplitStyles.tsx`, `directStyle.ts`, or `expandStyle.ts` changed between those commits.

Run from the repository root:

```sh
bun code/comparisons/generate-get-split-styles-prop-corpus.ts
NODE_ENV=production TAMAGUI_TARGET=web bun code/comparisons/benchmark-get-split-styles.ts --label=baseline-38fded5d9f --output=code/comparisons/get-split-styles-baseline.json
bun code/comparisons/profile-hotpath.ts --label=corpus-baseline-38fded5d9f
```

The microbenchmark used Bun 1.3.14 on darwin-arm64, 3 warmups, and 11 measured rounds. Each operation is one call to the same simplified `getSplitStyles` harness used by core-test with the static prop object from one harvested JSX element.

| Scenario | Elements | Props/op | Baseline median ns/op |
| --- | ---: | ---: | ---: |
| Plain props | 6,745 | 2.28 | 5,061.0 |
| Clause strings | 625 | 5.46 | 22,189.6 |
| Conditional objects | 14 | 8.00 | 13,050.8 |
| Variant props | 1,674 | 2.84 | 7,247.4 |
| Shorthand-heavy | 345 | 5.30 | 13,926.4 |
| Style-prop-heavy | 540 | 7.57 | 26,563.2 |
| Total corpus | 8,948 | 2.56 | 7,086.7 |

Microbenchmark allocations are intentionally unreported. A forced-GC heap delta measures retained memory, not total allocation. The production browser profiler supplies sampled allocation attribution instead.

### Corpus distribution

**READ**: The deterministic Babel harvest parsed 755 JSX/TSX files and retained 22,918 static attributes on 8,948 elements. Strings are 75.22%, numbers 17.55%, clause strings 4.77%, objects 1.62%, classified variants 7.82%, and shorthands 10.32%. The checked-in corpus has SHA-256 `3b49958c05089cbe506f247e641e33d16d490017394fc9eca42f8296dd15d587`.

### Production browser cross-check

**READ**: The production `heavy`, runtime, extraction-disabled profile used 3 warmups, 20 measured iterations, scale 200, 420 hosts per mount, and 840 renders per iteration.

| Receipt | Baseline |
| --- | ---: |
| Mount median | 8.2 ms |
| Update median | 6.4 ms |
| Sampled CPU per iteration | 247.307 ms |
| Sampled allocation per iteration | 6,634,397 bytes |
| Sampled allocation per render | 7,898.1 bytes |
| `directStyle` self-time per iteration | 3.509 ms |
| `getSplitStyles` self-time per iteration | 1.242 ms |
| `directStyle` sampled allocation per iteration | 1,591,726 bytes |
| `getSplitStyles` sampled allocation per iteration | 535,088 bytes |

**INFERRED**: The corpus benchmark exercises the same functions that dominate the production profile. Any proposed optimization still needs both a corpus median improvement and a confirming browser profile before it is retained.

## Phase 2 result

The final corpus replay was recorded at commit `cce990fb7c`.

| Scenario | Baseline ns/op | Final ns/op | Raw change |
| --- | ---: | ---: | ---: |
| Plain props | 5,061.0 | 2,057.0 | -59.36% |
| Clause strings | 22,189.6 | 7,634.9 | -65.59% |
| Conditional objects | 13,050.8 | 6,007.7 | -53.97% |
| Variant props | 7,247.4 | 2,935.7 | -59.49% |
| Shorthand-heavy | 13,926.4 | 4,647.8 | -66.63% |
| Style-prop-heavy | 26,563.2 | 9,363.4 | -64.75% |
| Total corpus | 7,086.7 | 2,784.1 | -60.71% |

**READ**: These are the checked-in baseline and final benchmark outputs. Host-wide timing changed substantially between the two runs, so the raw change does not isolate the code change.

An immediate control and candidate replay held the source tree and host conditions fixed. This is the causal timing comparison for the retained optimization.

| Scenario | Same-tree control ns/op | Candidate ns/op | Change |
| --- | ---: | ---: | ---: |
| Plain props | 2,480.6 | 2,280.8 | -8.06% |
| Clause strings | 9,469.9 | 7,868.8 | -16.91% |
| Conditional objects | 6,795.4 | 6,251.2 | -8.01% |
| Variant props | 3,492.9 | 3,071.1 | -12.08% |
| Shorthand-heavy | 6,124.8 | 4,918.4 | -19.70% |
| Style-prop-heavy | 11,371.7 | 9,889.3 | -13.04% |
| Total corpus | 3,475.8 | 3,075.9 | -11.50% |

### Retained change

`getCSSStyleAtomic` previously allocated a one-property object for every call, only for its private worker to read the value back by key. The private path now takes that value directly.

The direct atomic identity cache also copied its rule array on every cache hit. `directStyle` now borrows the immutable cache entry and takes ownership only before a same-property contribution mutates it or before the array is exposed through `rulesToInsert`. Public `getCSSStyleAtomic` callers retain the previous owned-array behavior.

**READ**: The immediate production browser A/B used the same source tree for both profiles.

| Sampled allocation | Same-tree control | Candidate | Change |
| --- | ---: | ---: | ---: |
| Total per iteration | 6,614,094 bytes | 6,243,137 bytes | -5.61% |
| Total per render | 7,873.9 bytes | 7,432.3 bytes | -5.61% |
| `directStyle` per iteration | 1,593,932 bytes | 1,396,953 bytes | -12.36% |
| `getCSSStylesAtomic` per iteration | 737,871 bytes | 550,267 bytes | -25.42% |

**READ**: A second production profile at final commit `cce990fb7c` measured 6,287,675 bytes per iteration, 7,485.3 bytes per render, 1,400,097 bytes in `directStyle`, and 550,094 bytes in `getCSSStylesAtomic`. This confirms the allocation reduction persisted after the final internal ownership marker and parallel correctness fixes were applied.

### Reverted trials

- **READ**: Reusing the `source.indexOf(':')` result in the clause-string contributor did not produce a stable same-tree win. Repeated runs reversed direction, so it was reverted.
- **READ**: Adding a shared `isString` boolean to create a single top-level value dispatch made the immediate control 1% to 5% faster. It was reverted.
- **READ**: Emitting top-level variant styles directly instead of returning result tuples did not improve the variant corpus lane. Browser sampled allocation increased from 6,634,397 to 6,639,678 bytes per iteration, so it was reverted.

### Bundle size

**READ**: The immediate same-tree zero-runtime comparison shrank the Vite island by 15 gzip bytes, Next by 38 gzip bytes, and Metro by 17 bytes. The remaining checkout-wide size movement came from the parallel flat-conditional-object fixes and is owned by that change's baseline update.

**READ**: The combined intentional baseline moved from 92,487 to 92,995 bytes for Vite, 92,766 to 93,342 bytes for Next, and 388,487 to 389,103 bytes for Metro. A second Node 24.16.0 measurement passed all zero-byte thresholds against the updated baseline.
