// compat with bundlers that resolve this directory instead of the package `exports`
// map (metro without package exports). ESM so the resolved graph matches what the
// exports map hands a modern bundler, instead of downgrading it to the CJS build.
export * from '../dist/esm/internal-runtime.mjs'
