# Security Policy

Thanks for helping keep Tamagui and its users safe.

## Supported versions

Security fixes are made against the latest published major (`tamagui` v2 and the
current `@tamagui/*` line). Please make sure you can reproduce on the latest
release before reporting.

## Reporting a vulnerability

**Please do not open a public issue for security problems.**

Report privately using **GitHub's private vulnerability reporting**:

1. Go to the repo's **Security** tab → **Report a vulnerability**
   (https://github.com/tamagui/tamagui/security/advisories/new)
2. Describe the issue, affected versions, and a proof-of-concept if you have one.

If you can't use GitHub advisories, email **security@tamagui.dev** (or
natewienert@gmail.com) with the details.

We aim to acknowledge reports within 3 business days and to ship a fix or
mitigation for confirmed high/critical issues as quickly as we reasonably can.
We're happy to credit you in the advisory unless you'd prefer to stay anonymous.

## Scope

In scope:

- The published `@tamagui/*` / `tamagui` npm packages.
- The tamagui.dev web application and its API endpoints (auth, payments,
  account/team management).
- This repository's CI/CD and release/publish pipeline.

Out of scope:

- Vulnerabilities in third-party dependencies that are already publicly known
  (please report those upstream; Dependabot tracks them here).
- Findings that require a compromised developer machine, social engineering, or
  physical access.
- Volumetric / denial-of-service testing against tamagui.dev.

## Handling secrets

If you believe a credential has been committed to this repo (current tree or
history), treat it as compromised: report it privately as above and **do not**
post the value publicly. Maintainers: rotate the credential at its source first;
history scrubbing is secondary.
