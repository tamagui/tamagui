# Native Style Optimization - Progress Tracker

## Goal

Build a full native module (C++/JSI) that enables zero-re-render theme switching on React Native, with:
- Benchmarks comparing: Regular RN, Regular Tamagui, Old Optimized Tamagui, Unistyles
- Support for sub-themes and nested Theme components
- JSX/createElement shim to wrap all components automatically
- Large benchmark with virtualized list scrolling performance test
- Comprehensive test coverage using TDD

## Current Status

### Phase 1: JS-Only Proof of Concept
- [x] Compiler generates `__styles` prop with pre-computed theme styles
- [x] `_TamaguiView` and `_TamaguiText` components exist
- [x] Compiler tests pass (6/6 flatten.native tests)
- [x] Optimized path IS being triggered - generates `__TamaguiView __styles={{...}}`
- [x] Fallback to HOC pattern for ternary expressions works correctly
- [x] **FIXED**: Filter out component themes (Button, Card) - now ~144 themes instead of 901
- [x] **FIXED**: Deduplicate themes with identical styles using `__themes` array
- [x] `_TamaguiView` and `_TamaguiText` support deduplicated styles with caching
- [ ] **TODO**: Kitchen-sink app verification still needed
- [ ] **TODO**: Test nested theme lookup fallback (dark_blue_custom -> dark_blue -> dark)

### Phase 2: Native Module (JSI) - NOT STARTED
- [ ] Create native module package structure
- [ ] Implement C++ core with JSI bindings
- [ ] Implement iOS native code (Objective-C++)
- [ ] Implement Android native code (Kotlin/Java JNI)
- [ ] Style registry (register/unregister views)
- [ ] setTheme() with ShadowTree updates
- [ ] Tests for native module

### Phase 3: Theme Integration - NOT STARTED
- [ ] Modify Theme component to use native registry
- [ ] Handle nested theme scopes
- [ ] Sub-theme support (dark_blue, light_red, etc.)
- [ ] Tests for theme integration

### Phase 4: JSX/createElement Shim - NOT STARTED
- [ ] Design shim approach to wrap all components
- [ ] Implement automatic component wrapping
- [ ] Handle tearing prevention
- [ ] Tests for shim

### Phase 5: Benchmarks - NOT STARTED
- [ ] Create benchmark app with complex screen
- [ ] Virtualized list with many themed items
- [ ] Benchmark: Regular React Native baseline
- [ ] Benchmark: Regular Tamagui (unoptimized)
- [ ] Benchmark: Current optimized Tamagui (JS-only)
- [ ] Benchmark: New native module optimization
- [ ] Benchmark: Unistyles comparison
- [ ] Theme switch timing measurements
- [ ] Scroll performance measurements
- [ ] Re-render count tracking

### Phase 6: Edge Cases - NOT STARTED
- [ ] Dynamic styles fallback
- [ ] Variants support
- [ ] Media queries support
- [ ] Press/hover/focus states
- [ ] SSR compatibility check

## Iteration Log

### Iteration 1 (Complete)
**Goal**: Verify current state, ensure tests pass, create TDD foundation

**Tasks**:
1. ✅ Run compiler tests and verify they actually test the optimized path
2. ✅ Fixed theme explosion (901 -> ~144 themes by filtering component themes)
3. ✅ Added deduplication for themes with identical styles
4. ✅ Updated `_TamaguiView` and `_TamaguiText` to handle deduplicated styles
5. ❌ Kitchen-sink app verification (deferred to iteration 2)

### Iteration 2 (In Progress)
**Goal**: Verify in real app, begin native module foundation

**Tasks**:
1. [ ] Verify optimization works in kitchen-sink iOS app (Expo metro config issues)
2. [ ] Create basic native module package structure
3. [ ] Write failing tests for native module functionality (TDD)
4. [ ] Document native module API design

**Notes from Iteration 2**:
- Metro bundler has resolution issues when querying from root directory
- The app IS running in simulator with old bundle
- Unit tests confirm compiler optimizations ARE working (6/6 tests pass)
- Need to rebuild iOS app to pick up new compiler changes

---

## Test Requirements

### Compiler Tests (TDD)
```
- [ ] test: generates __TamaguiView for themed YStack
- [ ] test: generates __styles with all theme variants
- [ ] test: falls back to HOC for dynamic/ternary expressions
- [ ] test: handles nested themes in compiled output
- [ ] test: generates correct sub-theme keys (dark_blue, etc.)
```

### Native Module Tests (TDD)
```
- [ ] test: register() stores view reference with styles
- [ ] test: unregister() removes view from registry
- [ ] test: setTheme() updates all views in scope
- [ ] test: setTheme() does NOT trigger React re-render
- [ ] test: nested scopes get correct theme
- [ ] test: sub-themes resolve correctly
```

### Integration Tests (TDD)
```
- [ ] test: theme toggle updates colors without re-render
- [ ] test: virtualized list maintains scroll position on theme change
- [ ] test: 1000 items list theme switch < 16ms
- [ ] test: no tearing during theme transition
```

### Benchmark Tests
```
- [ ] benchmark: measure re-render count on theme change
- [ ] benchmark: measure time to apply theme to 100/500/1000 components
- [ ] benchmark: measure FPS during scroll with frequent theme changes
- [ ] benchmark: compare against Unistyles on same test case
```

## Files to Create/Modify

### New Package: @tamagui/native-style-registry
```
code/core/native-style-registry/
├── package.json
├── src/
│   ├── index.ts
│   ├── TamaguiStyleRegistry.ts      # JS interface
│   ├── types.ts
│   └── __tests__/
│       ├── registry.test.ts
│       └── integration.test.ts
├── ios/
│   ├── TamaguiStyleRegistry.mm
│   ├── TamaguiStyleRegistry.h
│   └── TamaguiStyleRegistry.podspec
├── android/
│   ├── src/main/java/com/tamagui/styleregistry/
│   │   ├── TamaguiStyleRegistryModule.kt
│   │   └── TamaguiStyleRegistryPackage.kt
│   └── build.gradle
└── cpp/
    ├── TamaguiStyleRegistry.cpp
    ├── TamaguiStyleRegistry.h
    └── JSI bindings
```

### Modify: @tamagui/native
```
code/core/native/src/
├── _TamaguiView.tsx      # Update to use native registry
├── _TamaguiText.tsx      # Update to use native registry
├── setup-style-registry.ts   # NEW
└── index.ts              # Export setup
```

### Modify: @tamagui/core (Theme component)
```
code/core/web/src/views/Theme.tsx   # Add native registry integration
```

### New: Benchmark App
```
code/benchmarks/native-styles/
├── App.tsx
├── screens/
│   ├── ThemeSwitchBenchmark.tsx
│   ├── ScrollBenchmark.tsx
│   └── ComparisonBenchmark.tsx
└── package.json
```
