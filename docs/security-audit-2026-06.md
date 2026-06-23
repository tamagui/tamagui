# Security Audit — June 2026

A hardening pass across the repo, the tamagui.dev web app, the CI/CD pipeline,
and the GitHub project configuration. This document records what was found, what
was fixed in-tree, and the action items that can only be done by a maintainer
(credential rotation, etc.).

Status legend: ✅ fixed in this repo · ⚠️ **needs maintainer action** · 📋 recommended follow-up

---

## Credential leak in git history — VERIFIED ALREADY REMEDIATED (2026-06-13)

A 2023 commit (`df848c8`, `takeout/studio-next/.env`, removed the same day) is
permanently reachable in the **public** history and contained credentials for
Supabase project `akrzjiwwabjhzbvvnypu` (still referenced in
`code/packages/bento-get/src/constants.ts`):

- **GitHub PAT** (`ghp_…0FEvWK`) — tested 2026-06-13: `GET /user` → **401**. Already revoked. ✅
- **Supabase `service_role` key** (JWT, `exp` 2032, bypasses RLS) — tested
  2026-06-13: REST endpoint → **401 "Invalid API key"**. The project's JWT secret
  was rotated, so this key (and the old anon key) no longer authenticate. ✅

Both leaked credentials are dead; no rotation needed. The anon key currently in
`bento-get/constants.ts` is a post-rotation key (public by design, RLS-gated).

📋 Optional follow-up: scrub the `df848c8` blob from history (BFG /
`git filter-repo`) for cleanliness. (GitHub secret scanning + push protection
are now enabled and cover ongoing detection.)

### ⚠️ A2. Verify / remove the prod `test-user@tamagui.dev` account
The test-user endpoint previously created this account in the **production**
Supabase project with a static, source-committed password and Pro entitlements.
The static password is now removed (see H5), but if the account was ever created
in prod it still exists. Confirm in Supabase Auth and delete it if present.

---

## What was fixed in this repo

### tamagui.dev web app
| ID | Issue | Fix |
|----|-------|-----|
| C1 ✅ | `GET /api/bento/code?userGithubId=` served paid Bento source with no auth (legacy v1 CLI path; trusted a client-supplied id as the user identity) | Removed the unauthenticated branch; the shipped CLI already uses the token-authenticated `/api/bento/cli/v2/code-download`. `app/api/bento/code+api.ts` |
| C2 ✅ | `POST /api/github/app-hook` was a forgeable webhook stub (no signature verification, logged all headers) | Deleted the dead endpoint. |
| H1 ✅ | Charge endpoints applied a client-supplied `couponId` without re-validating it applied to the product (free/near-free purchases) | Added `features/stripe/assertValidCoupon.ts` and call it in `create-subscription`, `create-v2-subscription`, `add-team-seats` before any coupon is applied. |
| H2 ✅ | `/api/validate-coupon` was unauthenticated → coupon-enumeration oracle | Added `ensureAuth`. |
| H3 ✅ | Team-seat invite minted unlimited active seats and accepted arbitrary `user_id` | Enforced seat capacity vs `total_seats`, dedup of active members, and invitee-exists check. `app/api/team-seat+api.ts` |
| H4 ✅ | `/api/github/users` returned all users incl. **email** (`select('*')`) and had a PostgREST `.or()` filter injection via comma | Returns only `id, full_name, avatar_url`; name-only `ilike` (or exact-email match if `@` present, never returned); strips comma. UI no longer renders others' emails. `app/api/github/users+api.ts`, `NewAccountModal.tsx` |
| H4b ✅ | `/api/discord/search-member` let any logged-in user enumerate the whole guild | Gated behind Pro (`ensureAccess`). |
| H5 ✅ | Hardcoded test-user password (`test-user-password-12345`) usable to sign into prod via Supabase password auth | Generates a fresh random password per run and rotates any existing user's password. `app/api/test-user+api.ts` |

Confirmed already-safe during the audit: Stripe webhook signature verification,
GitHub sponsor webhook constant-time HMAC, subscription cancel/upgrade ownership
checks, postMessage origin checks, and no server secret inlined into the client
bundle.

### CI/CD pipeline
- ✅ **Fork PRs no longer receive secrets.** `test-ios-native.yml` gated the
  `secrets: inherit` build (and its dependent test job) to same-repo refs, so a
  fork PR can no longer exfiltrate `KV_STORE_REDIS_REST_*`.
- ✅ Least-privilege `permissions:` blocks added to every workflow
  (`contents: read` default; `contents: write` only on the release/changelog
  jobs that create GitHub Releases).
- ✅ Third-party actions SHA-pinned: `oven-sh/setup-bun`,
  `android-actions/setup-android`, `reactivecircus/android-emulator-runner`,
  `marvinpinto/action-automatic-releases`.
- ✅ `bun install --frozen-lockfile` in the install composite action.
- ✅ `.github/dependabot.yml` added (github-actions ecosystem) to keep action
  SHAs current.

### Secrets hygiene / scanning
- ✅ `.gitignore`: fixed `.env.test.localp` typo and added key-material globs
  (`*.pem`, `*.key`, `*.p12`, `*.p8`, `*.keystore`, …).
- Secret scanning is handled by GitHub native secret scanning + push protection
  (enabled below). A gitleaks CI job was trialed and removed — the org-licensed
  Action plus full-tree CLI scans weren't worth the cost over native scanning.

### GitHub project configuration (applied live)
- ✅ Secret scanning + **push protection** enabled (would have blocked the A1 leak).
- ✅ Dependabot vulnerability alerts + automated security updates enabled.
- ✅ Private vulnerability reporting enabled; `SECURITY.md` added.
- ✅ "Protect Master" ruleset enabled — blocks force-push and branch deletion on
  `main` (org admins retain direct-push via bypass).

### npm publish
- ✅ Confirmed no published package ships an install/postinstall hook, the
  lockfile is committed, and the interactive release flow supports 2FA/OTP.

---

## 📋 Recommended follow-ups (not yet done)

- **Adopt npm Trusted Publishing (OIDC)** for releases and publish with
  `npm publish --provenance`. Today a single `NPM_TOKEN` can publish all ~163
  packages; OIDC removes the long-lived token and adds SLSA provenance. The
  release path is currently isolated to a `test-release` branch with
  `--skip-publish`, so this is hardening, not an active hole.
- **Triage the `bun audit` backlog** (≈187 advisories, almost all transitive/dev
  in the site + zero stack). `bun update` for compatible fixes, then resolve the
  residual high/critical.
- **Optionally scrub the A1 blob from history** (BFG / `git filter-repo`). The
  leaked credentials are already dead, so this is cosmetic.
- **SHA-pin first-party `actions/*`** too (left on `@v4` for now; Dependabot will
  manage them once pinned).
- **Add rate limiting** to sensitive endpoints (coupon validation, theme
  generation, auth/email) — there is currently none.
- Replace the archived `marvinpinto/action-automatic-releases` with
  `softprops/action-gh-release` or `gh release create`.
