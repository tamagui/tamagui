# `@tamagui/metro-plugin`

The E4 frontend runs the configured user Babel transformer first, resolves the
compiled module graph with Metro's resolver contract in the main process, and
publishes versioned content-addressed `LoweredModulePlan` values for isolated Metro
workers.

The cache, invalidation, diagnostics, and worker handoff are production-owned. Workers
apply the same compiler-core plan used by Vite to the post-user-Babel source, parse the
lowered output back into a Babel AST, and compose locations through both compiler maps.
Uncertain candidates remain byte-identical runtime work. The deleted Babel/static Metro
extractor is never invoked as a fallback.
