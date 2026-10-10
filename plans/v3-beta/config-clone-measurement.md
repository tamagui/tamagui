# Config clone allocation measurement

The serializer reuses Object.entries pairs, recursively replaces retained
values, compacts the pairs in place, and calls Object.fromEntries. Getter
snapshots and traversal order are preserved while flatMap callbacks and
replacement pair allocations are removed.

Baseline: 0bf6b0676459d52b4e8775d8f82ecfec7a95c64b.
Candidate: c968a59ae57576a41e4b84ad258fa9fe6784200e.

## Validation

Both implementations were built from the same locked workspace and installed
through the canonical local release command into an isolated downstream
consumer. The candidate static package passed its full build, format, and lint.

Eight warmed full generator runs used baseline/candidate/candidate/baseline
twice. Packages were rebuilt and locally packed when implementations changed.

| measure | baseline median | candidate median |
| --- | ---: | ---: |
| child process CPU | 3.4793235 s | 2.8488420 s |
| elapsed time | 3.1968996 s | 2.6315222 s |

Child CPU was 18.12% lower in this sample under Bun 1.4.2 and normal four-core
admission on an Apple Silicon host with concurrent work. Individual timings
overlap; this measures generator execution rather than a complete install or
an isolated timing window.

All 30 config and guide artifacts matched in every measured run. Both root
application variants matched, and both implementations rejected invalid
style syntax. Generator source and tracked consumer files remained unchanged.

A separate eight-run comparison on 15 normalized config artifacts totaling
26,016,404 bytes reduced CPU median from 0.099012 s to 0.0771325 s. Getter order,
excluded and inherited keys, symbols, object prototypes, functions, components,
sparse arrays, throwing getters, and cycles retained the same results or failures.

One independent model review found no semantic blocker in the final source
diff. It reviewed traversal and failures; the parent ran the consumer checks.
