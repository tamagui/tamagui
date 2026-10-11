# Native retained campaign readiness, 2026-08-03

The 12-sample V2/V3 native campaign is prepared but blocked. Do not build or
measure until Android reports and a2943 lifts the push freeze. The retained
numbers must come from the final committed measurement HEAD.

## Launch checklist

1. Confirm the tree is clean and record `git rev-parse HEAD`. Any later commit
   invalidates every arm because `nativeBenchBuildIdentity` includes HEAD.
2. Run `bun install --frozen-lockfile`, install both V2 fixture trees with the
   commands in `code/comparisons/NATIVE_V2_V3.md`, and regenerate all four iOS
   projects.
3. Regenerate compiler evidence at that HEAD:

   ```sh
   node code/comparisons/verify-native-compiler-output.cjs \
     --output=/tmp/tamagui-native-compiler-evidence.json
   ```

4. Before building the four retained arms, run the unminified `export:embed`
   acceptance probe from `plans/v3-metro-lowering-2026-08-03.md`. It must have
   zero `plan-miss` diagnostics and match the known-good marker profile: 20
   `__TamaguiNativeView`, 15 `__TamaguiNativeStyle*`, and 13
   `_withStableStyle` occurrences.
5. Build and install all four Release apps with the `xcodebuildmcp simulator`
   `build-and-run` command, the same simulator UDID, distinct derived-data
   directories, and the arm-specific `EXPO_PUBLIC_NATIVE_BENCH_BUILD_ID`
   commands in `code/comparisons/NATIVE_V2_V3.md`.
6. Read the installed V3 compiled app's embedded `main.jsbundle`. The minified
   bundle must contain the hoisted simple-fixture sentinel
   `"rgb(99,102,241)"`. Local identifiers do not survive minification and are
   not a valid installed-bundle check.
7. On iOS 26, pre-approve all four benchmark URL schemes and reboot the
   simulator before the smoke. The exact scheme-approval commands are recorded
   in `plans/v3-metro-lowering-2026-08-03.md`.
8. Ask a2943 for a quiet window. Take three `top -l 2` samples before the run
   and use the busiest sample's idle percentage. Do the same after the run.
   Discard the campaign if contention appears.
9. Run the warmup-only effectiveness smoke first. It needs at least two warmup
   rounds and both compiled arms must clear the 1.5x speedup gate against their
   own runtime arms.
10. Run the retained campaign with the committed protocol:

    ```sh
    bun code/comparisons/run-native-v2-v3.ts \
      --udid=<UDID> \
      --samples=12 \
      --warmups=2 \
      --seed=73129 \
      --compiler-evidence=/tmp/tamagui-native-compiler-evidence.json
    ```

Keep the raw JSON and generated Markdown together. The established noise band
is plus or minus 16 percent. Do not report a smaller delta as resolved by this
instrument.
