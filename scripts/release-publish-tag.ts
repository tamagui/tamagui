// single source of truth for the npm dist-tag a version publishes under.
//
// used by every path in release.ts (the publish step, the skipped-package
// version resolution, and the post-publish dist-tag fixups) so a prerelease
// can never silently land on `latest` and clobber the stable line.
//
//   stable   X.Y.Z          -> latest
//   canary   X.Y.Z-<ts>     -> canary   (all-numeric prerelease, or opts.canary)
//   channel  X.Y.Z-beta.N   -> beta     (rc / alpha / next / nightly likewise)
//   explicit --tag <name>                -> that tag (always wins)
//   any other prerelease     -> throws (never defaults to latest)

// prerelease identifiers we recognize as their own dist-tag channel. a
// prerelease whose identifier isn't in here has no safe home, so we refuse
// rather than fall through to `latest`.
export const KNOWN_PRERELEASE_TAGS = new Set([
  'alpha',
  'beta',
  'canary',
  'next',
  'nightly',
  'rc',
])

export function computePublishTag(
  version: string,
  opts: { canary?: boolean; explicitTag?: string } = {}
): string {
  const explicitTag = opts.explicitTag?.trim()
  if (explicitTag) {
    return explicitTag
  }
  if (opts.canary) {
    return 'canary'
  }

  const dashIdx = version.indexOf('-')
  if (dashIdx === -1) {
    // plain X.Y.Z -> stable line
    return 'latest'
  }

  // the prerelease identifier is the first dot-segment after the dash:
  // 3.0.0-beta.5 -> "beta", 2.0.0-rc.34 -> "rc", 3.0.0-1751... -> "1751..."
  const label = version
    .slice(dashIdx + 1)
    .split('.')[0]
    .toLowerCase()

  if (/^\d+$/.test(label)) {
    // an all-numeric prerelease is a canary timestamp (e.g. 3.0.0-1751023456789)
    return 'canary'
  }
  if (KNOWN_PRERELEASE_TAGS.has(label)) {
    return label
  }

  throw new Error(
    `Refusing to publish prerelease "${version}": its prerelease identifier "${label}" ` +
      `maps to no known dist-tag (${[...KNOWN_PRERELEASE_TAGS].sort().join(', ')}).\n` +
      `Publishing it to "latest" would clobber the stable line. ` +
      `Pass an explicit --tag <name> to choose a dist-tag (e.g. --tag ${label}).`
  )
}
