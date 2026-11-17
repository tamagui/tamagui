---
id: t-mrkc96de-6e30
title: Diagnose G0 D0 duplicate Tailwind classification
status: done
parent_id: t-mriugrc7-e40
backend: git
sessions:
- ab-mriu55kg-47600
created_at: 1784014640258
updated_at: 1784226992856
field_marks:
  active_form: 1784014640258
  body: 1784014640258
  claim: 1784014640258
  evidence_summary: 1784014640258
  parent: 1784014640258
  priority: 1784014640258
  recovery_ref: 1784014640258
  status: 1784014640258
  title: 1784014640258
---
Read-only diagnosis complete. There is no runtime-versus-Vite grammar-view mismatch. The v3 canary uses v6, whose parsed color tokens include blue-500; runtime createGrammarConfigView therefore claims bg-blue-500. The Vite Tailwind state receives the same parsed config and filters the bare candidate. Direct proof from the canary config: parsed=true, 290 color tokens, blue-500 present, classification=tamagui. Direct Tailwind-state probe: adding a synthetic bare bg-blue-500 source left candidateCount 399 unchanged and generated no bare selector. The apparent second owner was the raw authored class retained in compiler output: compilerHost extractedStyleArtifacts saves callerClassName and concatenates it after generated atomics; DOM presence is not Tailwind CSS emission. D0 integration could use bg-blue-500 only because its minimal tokens omit that palette token. Smallest fix is fixture-only: use a Tailwind-valid modifier Tamagui does not claim, supports-[display:grid]:bg-blue-500, preserving exact oklch assertion and separate claimed-class coverage. Current shared tree already contains that concurrent fixture change; this diagnosis made no edits. Recommended focused guard: extend vite-plugin tailwind.test to assert a configured blue-500 candidate is filtered and the supports variant is compiled. Bounded dev inspection showed virtual Tailwind CSS contains only the supports selector, not a bare bg-blue-500 rule; server stopped and port 5188 clear.
