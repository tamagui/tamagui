# Tamagui V3 Benchmark Architecture and Performance Report

**Lane**: Tamagui V3 Beta  
**Host Recorded**: `ci-64` (Apple M5 Pro, 18 logical CPUs, 64 GiB memory, Darwin 25.5.0)  
**Execution Environment**: Bun 1.4.2 / Node v24.16.0, Chromium 151.0.7922.34  
**Date**: 2026-09-14  

---

## 1. Executive Summary

Tamagui V3 maintains four complementary benchmark suites covering end-to-end web rendering, native mobile rendering, runtime style extraction, and native reconciler cache efficiency:

1. **Cross-Framework Web Benchmark Suite**: 5 scenarios (Simple, Rich, Group, Heavy, Animated) measuring Mount, Update, and Remount against Tailwind CSS 4.3, Inline React 19.2, NativeWind v5, and Uniwind 1.11.
2. **Cross-Framework Native Benchmark Suite**: 5 scenarios (Simple, Themed, Rich, Group, Heavy) on iOS 26.4 measuring React reconciliation and Fabric native commit times.
3. **Style Object Memoization Benchmark (`benchmark-style-memo.ts`)**: Measures referential cache hit rates and nanosecond overhead to bypass React Native Fabric's `diffNestedProperty` C++ traversals.
4. **`getSplitStyles` Real-World Prop Corpus Replay (`benchmark-get-split-styles.ts`)**: 8,948 real application elements replayed across 8 prop topologies to benchmark server-side and SSR CSS collection.

---

## 2. Benchmark Suites: Coverage and Rendering Architecture

### A. Web Cross-Framework Benchmark (`tamagui-bench`)

- **Workload**: 200 components per scenario (60 in the heavy scenario).
- **Lifecycle Phases Measured**:
  1. **Mount**: Initial render from an unmounted empty root (`createRoot(container)`).
  2. **Update**: State change without unmounting (`setSeed(s => s + 1)`), forcing re-render and style resolution.
  3. **Remount**: Tree replacement testing clean teardown and fresh insertion.
- **Timing Boundary**: Timer starts immediately prior to the React state dispatch via `performance.now()` and terminates in `useLayoutEffect`, capturing component evaluation, hook processing, DOM reconciliation, and layout mutations.

#### Scenario 1: Simple (Static Layout Props)
- **Goal**: Measure static JSX flattening performance.
- **Rendering**: Static prop literals (`width`, `height`, `backgroundColor`, `borderRadius`, `margin`).
- **Compiler Behavior**: The Tamagui optimizing compiler extracts static props at build time, eliminates the component wrapper, and flattens the node into a raw HTML `<div>` with pre-generated atomic CSS classes.
- **Code Snippet**:
```tsx
function SimpleItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      arr.push(
        <View
          key={i}
          data-bench-scenario-item="simple"
          width={20}
          height={20}
          backgroundColor="rgb(99,102,241)"
          borderRadius={3}
          margin={1}
        />
      )
    }
    return <>{arr}</>
  }, [seed])
}
```

#### Scenario 2: Rich (Borders, Padding, and Colors)
- **Goal**: Measure CSS rule generation and atomic class deduplication with complex static styles.
- **Rendering**: 200 elements with borders, border radii, padding, and distinct backgrounds.

#### Scenario 3: Group (Nested Row Layout)
- **Goal**: Measure nested hierarchy and layout container overhead.
- **Rendering**: 200 rows with flex direction, items center, and gap containing:
  - Avatar container (`width={32}`, `height={32}`, `borderRadius={16}`)
  - Title and subtitle layout bars with variable modulo widths
  - Trailing status badge pill with nested icon placeholder.

#### Scenario 4: Heavy (Realistic Card Feed)
- **Goal**: Measure real-world dashboard / feed complexity.
- **Rendering**: 60 multi-node cards containing 4 nested `<View>` tiers, cycling 4 palette colors, text bars, and action tags:
```tsx
function HeavyItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < HEAVY_COUNT; i++) {
      const color = CARD_COLORS[(i + seed) % 4]
      arr.push(
        <View
          key={i}
          flexDirection="row"
          alignItems="center"
          gap={12}
          padding={12}
          borderRadius={10}
          backgroundColor="rgb(250,250,250)"
          borderWidth={1}
          borderColor="rgb(212,212,212)"
          marginBottom={4}
        >
          <View width={44} height={44} borderRadius={22} backgroundColor={color} />
          <View flex={1} gap={4}>
            <View height={12} borderRadius={4} backgroundColor="rgb(64,64,64)" width={80 + ((i * 17) % 60)} />
            <View height={10} borderRadius={3} backgroundColor="rgb(115,115,115)" width={120 + ((i * 13) % 80)} />
          </View>
          <View paddingHorizontal={8} paddingVertical={3} borderRadius={6} backgroundColor="rgb(219,234,254)">
            <View width={24} height={8} borderRadius={3} backgroundColor="rgb(59,130,246)" />
          </View>
        </View>
      )
    }
    return <>{arr}</>
  }, [seed])
}
```

#### Scenario 5: Animated (Dynamic Transitions)
- **Goal**: Measure runtime path overhead when styles change dynamically on re-renders.
- **Rendering**: 200 items with `transition="bouncy"`, varying `opacity` (0.85 vs 1.0) and `scale` (0.95 vs 1.0) toggled by seed parity.
- **Code Snippet**:
```tsx
function AnimatedItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      arr.push(
        <View
          key={i}
          transition="bouncy"
          width={24}
          height={24}
          borderRadius={4}
          backgroundColor="rgb(59,130,246)"
          margin={1}
          opacity={seed % 2 ? 0.85 : 1}
          scale={seed % 2 ? 0.95 : 1}
        />
      )
    }
    return <>{arr}</>
  }, [seed])
}
```

#### Scenario 6: Flat Values (V3 Syntax & Compound Selectors)
- **Goal**: Validate V3 flat-value grammar parsing, media queries, hover pseudos, and compound states without runtime bloat.
- **Rendering**:
```tsx
const FlatFrame = styled(View, {
  variants: {
    tone: {
      warm: { backgroundColor: 'rgb(253,186,116) web:rgb(249,115,22) hover:rgb(234,88,12)' },
      cool: { backgroundColor: 'rgb(147,197,253) web:rgb(59,130,246) hover:rgb(37,99,235)' },
    },
    elevated: { true: { borderRadius: '4px web:8px hover:12px' } },
  }
})

<FlatFrame
  tone={(i + seed) % 2 ? 'warm' : 'cool'}
  elevated
  disabled={(i + seed) % 3 === 0}
  animation="quick"
  width="24px web:28px sm:32px"
  height="24px web:28px hover:30px"
  margin="1px web:2px"
  opacity="1 enter:0.2 disabled:0.5"
/>
```

---

### B. Native Cross-Framework Benchmark (`native-class-bench.tsx`)

- **Workload**: 200 items (60 in heavy) in production iOS Release builds with Expo 57, React Native 0.86.2, Fabric architecture.
- **Scenarios**: Simple, Themed, Rich, Group, Heavy.
- **Verification Gate**: Explicit point dimensions verified with a 20x20 layout probe prior to timing to ensure strict visual and structural parity across libraries.
- **Timing**: Measures through `useLayoutEffect`, covering React reconciliation plus synchronous native ShadowTree commits.

---

### C. Style Object Memoization Benchmark (`benchmark-style-memo.ts`)

- **Purpose**: React Native Fabric's C++ component reconciler (`ReactNativeAttributePayload.diffNestedProperty`) compares style objects by pointer reference (`prevStyle === nextStyle`). If references match, Fabric completely skips recursive per-property tree diffing and the C++ `cloneNodeWithNewProps` call.
- **Memoization Levels Evaluated**:
  - `L0`: Baseline (fresh style object on every pass).
  - `L1`: Instance-level shallow cache against previous render.
  - `L2`: Per-config defaults cache.
  - `L3`: Content-addressed deterministic hash cache.
- **Results Recorded on `ci-64`**:
```
scenario             level                 ns/op   hit rate      vs L0   RN diff saved
------------------------------------------------------------------------------------------
static-view          L1-instance            2017     100.0%      1.112x   ~100% skipped
static-styled        L1-instance            1953     100.0%      0.972x   ~100% skipped
dynamic-one-prop     L1-instance            2622      33.3%      0.939x    ~33% skipped
static-variant       L1-instance            1515     100.0%      0.643x   ~100% skipped
dynamic-variant      L1-instance            1519      33.3%      1.017x    ~33% skipped
many-static-props    L1-instance            5489     100.0%      0.692x   ~100% skipped
nested-themed        L1-instance            4436     100.0%      0.797x   ~100% skipped
```
- **Key Finding**: In `static-variant`, L1 caching eliminates 100% of Fabric diffs and drops JS overhead by **35.7%** (1,515 ns vs 2,357 ns). In `many-static-props`, JS overhead drops by **30.8%** (5,489 ns vs 7,932 ns).

---

### D. Real-World Corpus Replay Benchmark (`benchmark-get-split-styles.ts`)

- **Purpose**: Replays 8,948 harvested production application elements through `getSplitStyles` to measure style parsing and CSS sheet collection without DOM overhead.
- **Coverage**:
  - `plain-props`: 6,745 elements (17.5 µs median)
  - `variant-props`: 1,674 elements (27.2 µs median)
  - `clause-strings`: 625 elements (58.4 µs median)
  - `style-prop-heavy`: 540 elements (61.2 µs median)
  - `shorthand-heavy`: 345 elements (42.8 µs median)
- **Total Throughput**: 20.8 µs median per element across all 8,948 components; verified deterministic checksum `29228766`.
