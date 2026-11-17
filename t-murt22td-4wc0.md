---
id: t-murt22td-4wc0
title: Re-measure Tailwind blog production bundle attribution
status: done
labels:
- branch:tm/site-claims
- lane:tailwind-bundle-remeasure
- umbrella:tailwind-bundle-remeasure
backend: git
commits:
- 1777f8bdc811d07accb1879b18491f51d2aeb85f
- 74f2d8d51f6f3d92106cf41a3751a8e292c2e467
- 9ac5aefb89755f97c687d48c0e23b9eb10fc73df
- a85448e94b
created_at: 1790996472769
updated_at: 1791003311941
field_marks:
  active_form: 1790996472769
  body: 1791003311941
  claim: 1790996472769
  evidence_summary: 1790996472769
  parent: 1790996472769
  priority: 1790996472769
  recovery_ref: 1790996472769
  status: 1791003311910
  title: 1790996472769
---
Completed requested remeasurement, blog correction and approved video integration. REVIEW: none.

RAN: production minified Vite builds and gzip level 9, React/React DOM/scheduler excluded equally. Required React Native Web remains in NativeWind and Uniwind. Tamagui core client themes removed, CSS themes retained. JS gzip bytes: Tamagui 16,899; Uniwind 40,485; NativeWind v5 23,924. CSS gzip bytes: 2,199; 1,713; 1,806. Attribution/report/commands: code/comparisons/tailwind-bundle/README.md and report.html. Both build variants passed browser counter/style/theme/error probes.

Blog and harness pushed to tm/site-claims at 74f2d8d51f6f3d92106cf41a3751a8e292c2e467. Tamagui main remains held as instructed. Per-package gzip standalone/marginal measurements are nonadditive; Uniwind injected-config mapping approximate, file totals exact. Old 88,928/25,864 method audit retained in report.

Nate directly approved final video share. Approved Tamagui film source landed on Contrast main in merge 1777f8bdc811d07accb1879b18491f51d2aeb85f, including lint corrections ending 97bb4cbd60. RAN remote ancestry verification; CI owner s6466 reports full promo/video typecheck and pre-push lint clean, owns CI watch. Held One work and unrelated primary edits preserved.

RAN final frame: heavy --cores 1 remotion still TamaguiV3 --frame=900 completed. ffmpeg SSIM against approved scene: All 0.999970. Focused TS, pushed-file lint and 34-row cell equivalence passed. Full 92.2-second movie playback ended without media/page errors. Approval and movie SHA locked in promo/video/src/tamagui/locked.json.

Handoff /tmp/tailwind-bundle-handoff.md updated. tm finish already called once. No outstanding waits. Film landing worktree preserved in managed recovery; original retained due SSH cwd holders. Only remaining external gate is Nate's explicit Tamagui main authorization, outside this branch-only assignment.
