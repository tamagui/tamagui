# Repository dependency security

The root Bun overrides and patches repair this repository's workspace graph.
They do not change a published package's version or certify every downstream
installation. Isolated application lockfiles have separate dependency graphs.

Keep locally repaired versions visible in `bun audit`; do not rename a package
version to hide a registry finding.

| Local patch | Provenance and preserved contract |
| --- | --- |
| deepmerge 4.3.1 | [Returned prototype poisoning](https://github.com/advisories/GHSA-gcqx-w48m-w2h4) has no published fix. Define own data properties at all three copy sites in source, CommonJS and UMD, retaining merge options, arrays, symbols and the existing inherited-property guard. |
| glob 13.0.6 | Backport the [upstream cancellation repair](https://github.com/isaacs/node-glob/commit/4682e8c9). Stop cancelled walkers before another directory traversal and settle paused cancellation callbacks. Consolidate promise API majors 9 through 13, while retaining older callback API majors. |
| minimatch 10.2.6 | Backport [upstream resource bounds](https://github.com/isaacs/minimatch/commit/77a0f5c4b80bdc641c3c930a1d9edf5ad2db57f8). Bound globpart splitting by the brace expansion budget and avoid quadratic deduplication for large sets. Preserve the matcher API consumed by glob 13. |

Published repairs cover the HTTP adapters and clients, telemetry propagation and
database instrumentation, cryptographic tooling, parsers, browser extraction,
image processing and test environment. The ordinary Vitest package and its
native alias select the same repaired patch. Body-parser 1 and 2 remain separate;
the Undici override targets version 7, and the Zod override targets version 4.
Puppeteer's browser helper replaces extract-zip; its obsolete FTP and IP-address
override roots are removed with that dependency chain.

Remaining advisory boundaries include Metro's image-size 1 caller, Zod 3, and
older stream-json in Detox tooling. Metro consumes image-size as a callable and
also passes filenames, so a global image-size 2 override would break its API.
Zod 3 and stream-json require separate compatibility work. Registry reports for
the three locally patched versions remain expected. A successful audit gate or
consumer smoke check does not mean the repository is free of security issues.
