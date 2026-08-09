// read a server-only secret at runtime.
//
// the production server build (`one build`) inlines `process.env.X` references
// as literal strings into dist/api when X is set at build time -- which bakes
// live secrets (service_role key, sk_live, the GitHub PAT, ...) into the
// deployed artifact at rest. the dynamic property access here can't be matched
// by that static `process.env.X` replacement, so the value stays a real runtime
// env lookup and never lands in the bundle. always read server secrets through
// this, never `process.env.SECRET` directly.
export const serverEnv = (key: string): string | undefined => process.env[key]
