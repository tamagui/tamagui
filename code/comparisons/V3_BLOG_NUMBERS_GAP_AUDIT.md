# V3 blog numbers gap audit

This audit maps the [V3 blog numbers plan](../../plans/v3-blog-numbers-plan.md)
to the beta-cut measurement work. Owner direction separates the work into two
tracks:

- Track 1 blocks a usable beta. It covers V2 versus V3 runtime performance and
  bundle size on the cut SHA.
- Track 2 starts after a usable test release. It covers the broader framework
  matrix, compiler comparisons, physical-device evidence, and blog production.

Beta evidence and beta communication must contain Track 1 claims only. No
competitor comparison is approved for the beta cut.

## Track 1 coverage

### Web

The retained web campaign covers Tamagui V3 compiled, V3 runtime, V2.6 compiled,
and V2.6 runtime. It records mount and same-node update across simple, rich,
group, heavy, and animated scenarios with paired confidence intervals. Its
bundle receipt records absolute and V3-versus-V2 emitted JavaScript, whole-app
JavaScript gzip, Tamagui-attributable gzip, and emitted CSS in compiled and
runtime modes.

The previous compiled bundle claim was +27,096 bytes of whole-app gzip versus
V2. A fresh post-direct-emission build on clean commit `0f510aaa6f` measured a
pre-V6 delta of +10,149 bytes. That preliminary receipt also held the V2
Tamagui-attributable gzip control at exactly 33,418 bytes and the React,
react-dom, and scheduler rendered-byte control at exactly 466,060 for V3 versus
465,924 for V2. The final post-V6 retained run must replace the preliminary
number before publication.

The post-direct-emission classification audit resolved all 480 emitted module
entries to their package owner and intended chunk with zero mismatches. All 26
entries in the fallback group were comparison fixture/configuration modules,
the shared benchmark, or Vite and Rolldown runtime modules. `directStyle.mjs`
was Tamagui-attributable in both V3 modes at 34,824 rendered bytes. Each V3 mode
emitted 107 Tamagui modules versus 100 in its V2 arm while reducing preliminary
V3 Tamagui-attributable gzip from 60,564 to 43,443 bytes, a 17,121-byte fall.

### Native

The retained native campaign runs the full default V2/V3 set. Runtime covers
simple, themed, rich, group, heavy, and real-component scenarios. Compiled
covers simple, nested-static, and styled-static. Every cell records mount,
same-node update, and keyed remount with paired confidence intervals. The
receipt also records the four source-bound embedded `main.jsbundle` sizes.

Native transition is absent from the current fixture and is the only missing
V2/V3 native scenario in the planned set.

## Deferred Track 2 gaps

### 1. Cross-framework web campaign

The cut-SHA campaign for Tailwind, inline React, NativeWind, and Uniwind is
unassigned. The existing `output/benchmarks.json` cannot serve as its baseline:
it comes from commit `398b93155b`, compares against V2.4.6, uses one warmup, and
has no V2 runtime arm. The current runner can produce mount and same-node update
for simple, rich, group, heavy, and animated scenarios. Remount, themed, and
real-component cells require new fixture and harness work.

This gap blocks every cross-framework web runtime claim in the full blog.

### 2. Non-Tamagui gzip boundary design

Whole-app gzip retention for Tailwind, inline React, NativeWind, and Uniwind
needs an approved design. Boundary changes are not authorized during the beta
cut. Future work must add new Vite configurations alongside the two controlled
Tamagui configurations. It must not edit those controlled configurations. Their
byte-for-byte V2 Tamagui and React control reproductions establish comparability
with the retained record.

This gap blocks cross-framework web bundle claims.

### 3. Native scenario and framework expansion

The V2/V3 default campaign covers every planned native scenario except
transition. A transition fixture and behavior gate still need design and
implementation. NativeWind, Uniwind, and plain React Native also need retained
Release campaigns with paired confidence intervals, keyed remount, source-bound
bundle sizes, and the expanded scenarios. The existing
`output/benchmarks-native.json` contains means only for simple and themed, with
rich, group, heavy, and animated recorded as null.

This gap blocks native transition and cross-framework native claims.

### 4. Version-neutral cross-framework compiler corpus

A shared corpus that V2, V3, NativeWind, and Uniwind can compile unchanged does
not exist. It needs agreed capability definitions, byte-identical fixtures,
behavior checks, and comparable flatten/lowering accounting. The V2/V3 neutral
micro-corpora and V3 Kitchen Sink evidence remain useful controls, but they do
not fill this matrix.

This gap blocks the compiler capability table and cross-framework flatten-rate
claims.

### 5. Compiler-speed harness

No harness records cold and warm compiler wall-clock time across V2, V3,
NativeWind, and Uniwind on the shared corpus. This work depends on the neutral
corpus and needs controlled cache state, fixed inputs, warmups, retained samples,
and recorded machine metadata.

This gap blocks every compiler-speed claim.

### 6. Physical-device spot check

The current native evidence uses iOS Release builds on a simulator. A
source-bound physical-device spot check still needs a selected device, build,
install, behavior verification, and recorded receipt.

This gap blocks the planned before-publication device check. It does not block
the simulator-based beta evidence.

### 7. Chart and post generation

The full post and its charts must be generated from committed JSON after the
Track 2 receipts land. The generator must preserve compiled and runtime arms,
scenario labels, confidence intervals, fixture and corpus sizes, machine scope,
and links to every source artifact.

This gap blocks publication of the full comparison post, not the Track 1 beta
cut.
