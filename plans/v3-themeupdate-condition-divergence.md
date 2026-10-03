# V3 ThemeUpdate condition-classification follow-up

Status: evidence-backed proposal found during the engine-consolidation cache
invalidation work. It predates that work and is not authorized for
implementation by this record.

## Current divergence

`directStyle` and `<ThemeUpdate>` apply different priority rules to the same
flat-value modifier spelling.

- `directStyle` classifies exact names as state, configured media, reserved
  platform, then configured root theme.
- `<ThemeUpdate>` classifies reserved platforms first, then its broader set of
  scheme-stripped theme buckets, and treats every other spelling as a state so
  the subtree-specific validation can reject it later.

The broader theme-bucket set is intentional. A `blue:` bucket can target
`dark_blue` and `light_blue` even when there is no exact root theme named
`blue`. Replacing it with the exact runtime table would break that contract.

The collision behavior is user-visible with deliberately colliding config
names. If a config declares a root theme named `hover`, then
`background="red hover:blue"` inside `<ThemeUpdate>` treats `hover:` as the
theme bucket, while the same value on a styled component treats `hover:` as
pointer state. If a config declares media named `web`, `<ThemeUpdate>` treats
`web:` as the always-active web platform while a styled component treats it as
the configured media query. Identical text can therefore apply under different
conditions in the two surfaces.

Unknown names also differ without a configured collision. For
`background="red typo:blue"`, `<ThemeUpdate>` preserves the `red` base and
drops the unsupported clause with its subtree-specific warning. The current
style path refuses the whole value. A typo can therefore leave a base value on
one surface and remove the property on the other.

## Why this is deferred

The behavior existed before the consolidation campaign. Phase III-d can remove
`parseValue` from the production ThemeUpdate graph while preserving these
rules, so package-surface work does not force a policy choice. Normalizing the
surfaces would add another public grammar change without reducing CORE or the
parser-cluster union.

A future decision should separately choose and pin:

1. whether core state names, platform names, and configured media names are
   reserved against ThemeUpdate bucket names;
2. whether exact configured media should beat a same-named platform in
   ThemeUpdate;
3. whether an unknown modifier discards one clause or the whole authored
   value on both surfaces.

Any implementation must retain scheme-stripped implicit buckets unless that
contract is deliberately changed at the same boundary.
