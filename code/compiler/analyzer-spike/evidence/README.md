# Evidence protocol

The E1 decision uses one command from this directory after dependencies are locked:

```sh
bun --expose-gc src/harness/run.ts
```

The command checks binding, re-export, spread, workspace, source JSX, compiled JSX, and
source-map correctness before measuring either candidate. Timing workers run in fresh
processes over the same generated 1,000-module, two-branch graph and record ten cold samples,
one hundred warm root edits affecting exactly one 500-module branch, changed/unchanged static
values, and unaffected parse counts. Separate fresh memory workers take a post-GC baseline
after importing one candidate and creating the fixture, then construct, link, and query exactly
one graph before the final GC and heap/RSS measurement. The runtime/CPU environment is recorded
in `results.json`.

Correctness and source maps are absolute gates. Warm invalidation must have a p95 no greater
than 50ms and no greater than 25% of the cold median. Yuku is eligible only through its public
API without a patch, fork, or internal import. Memory is a recorded decision input; more than
2x the competing candidate or 256MiB for this graph requires explicit justification.
