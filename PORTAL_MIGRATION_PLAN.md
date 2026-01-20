# Portal Migration Plan: Move from Native Hacks to react-native-teleport

## Design Decisions

1. **react-native-teleport as optional peer dep** - Users opt-in by installing it
2. **`setupNativePortal()` still exists** - Same API, just uses teleport internally when available
3. **New package: `@tamagui/native-portal`** - State management + typed component wrappers
4. **Context forwarding skips when native portals active** - `ForwardSelectContext` etc check the global
5. **Typed exports** - `NativePortal`, `NativePortalHost`, `NativePortalProvider` use globalThis internally but expose clean typed API

## Architecture

```
@tamagui/native-portal (NEW)
├── State management
│   ├── setNativePortalState(state)
│   ├── getNativePortalState() -> { enabled: boolean, type: 'teleport' | 'legacy' | null }
│   └── setupNativePortal() - tries teleport, falls back to legacy
│
├── Typed component exports (use globalThis internally, but typed API)
│   ├── NativePortal - renders teleport's Portal when available
│   ├── NativePortalHost - renders teleport's PortalHost when available
│   └── NativePortalProvider - renders teleport's PortalProvider when available
│
└── Returns null/children when teleport not available (graceful fallback)

@tamagui/portal
├── PortalProvider (GorhomPortal.tsx)
│   └── when teleport: uses NativePortalProvider from @tamagui/native-portal
│   └── when not: uses current reducer-based provider
│
├── PortalHost (GorhomPortal.tsx)
│   └── when teleport: uses NativePortalHost from @tamagui/native-portal
│   └── when not: uses current reducer state rendering
│
├── GorhomPortalItem.native.tsx
│   └── when teleport: uses NativePortal from @tamagui/native-portal
│   └── when not: uses current dispatch system
│
└── Portal.native.tsx
    └── wraps GorhomPortalItem (unchanged API)

@tamagui/select, @tamagui/popover, etc
└── ForwardSelectContext
    └── if (getNativePortalState().type === 'teleport') skip forwarding
```

## Key Insight

1. **@tamagui/native-portal** owns the teleport integration - state + typed components
2. **@tamagui/portal** uses those components when available, falls back to Gorhom
3. **Same user API** - PortalProvider/PortalHost/Portal work unchanged
4. **Typed exports** - NativePortal/NativePortalHost/NativePortalProvider are properly typed even though they use globalThis internally

## Current State Analysis

### Problems with Current Implementation

1. **Fragile RN Internals Dependency**
   - Uses `require('react-native/Libraries/Renderer/shims/ReactNative').createPortal`
   - Breaks on RN 0.81+ due to frozen globals
   - Requires opt-in `setupNativePortal()` to avoid crashes

2. **Platform Limitations**
   - Android: Always falls back to Gorhom (JS-based) portal system
   - Fabric: Disabled due to freeze issues (commit 1946d793ef)
   - iOS only: Native portals only work reliably on iOS non-Fabric

3. **Gorhom Fallback Overhead**
   - Full reducer-based state management in JS
   - Context repropagation needed for Select, Popover components
   - Extra re-renders and complexity

4. **Technical Debt**
   - SelectViewport hidden div hack for trigger portaling
   - Multiple "hacky" comments in codebase
   - Inconsistent behavior across platforms

### What react-native-teleport Provides

1. **True Native Portal Implementation**
   - iOS: Objective-C++ with proper view hierarchy manipulation
   - Android: Kotlin with ViewGroup method overrides
   - Web: createPortal + DOM manipulation

2. **Touch Event Routing**
   - iOS: Custom `hitTest` implementation routes touches correctly
   - Android: Accessibility tree handling

3. **Memory Safety**
   - Weak references throughout (`NSMapTable`, `WeakReference<>`)
   - Auto-cleanup on deallocation

4. **Pending Host System**
   - Handles race conditions when Portal renders before Host
   - Callback system notifies portals when hosts become available

5. **React Context Preservation**
   - React tree stays intact
   - Only native views are teleported
   - Hooks and context work without repropagation

## Migration Plan

### Phase 1: Create @tamagui/native-portal Package

**New package:** `code/ui/native-portal/`

```tsx
// src/state.ts
export type NativePortalState = {
  enabled: boolean
  type: 'teleport' | 'legacy' | null
}

let state: NativePortalState = { enabled: false, type: null }

export function setNativePortalState(newState: NativePortalState) {
  state = newState
}

export function getNativePortalState(): NativePortalState {
  return state
}
```

```tsx
// src/setup.ts
import { setNativePortalState } from './state'

const IS_FABRIC =
  typeof global !== 'undefined' &&
  Boolean((global as any)._IS_FABRIC ?? (global as any).nativeFabricUIManager)

export const setupNativePortal = (): void => {
  const g = globalThis as any
  if (g.__tamagui_native_portal_setup) return
  g.__tamagui_native_portal_setup = true

  // Try teleport first (preferred)
  try {
    const teleport = require('react-native-teleport')
    if (teleport?.Portal && teleport?.PortalHost && teleport?.PortalProvider) {
      g.__tamagui_teleport = teleport
      setNativePortalState({ enabled: true, type: 'teleport' })
      return
    }
  } catch {
    // teleport not installed, try legacy
  }

  // Fall back to legacy RN shims approach
  if (IS_FABRIC) {
    try {
      const mod = require('react-native/Libraries/Renderer/shims/ReactFabric')
      g.__tamagui_portal_create = mod?.default?.createPortal ?? mod.createPortal
      setNativePortalState({ enabled: true, type: 'legacy' })
    } catch (err) {
      console.info(`Note: error importing fabric portal, native portals disabled`, err)
    }
    return
  }

  try {
    const mod = require('react-native/Libraries/Renderer/shims/ReactNative')
    g.__tamagui_portal_create = mod?.default?.createPortal ?? mod.createPortal
    setNativePortalState({ enabled: true, type: 'legacy' })
  } catch (err) {
    console.info(`Note: error importing native portal, native portals disabled`, err)
  }
}
```

```tsx
// src/components.tsx
import type { ReactNode } from 'react'
import { getNativePortalState } from './state'

// Types matching react-native-teleport's API
export type NativePortalProps = {
  hostName?: string
  children: ReactNode
}

export type NativePortalHostProps = {
  name: string
}

export type NativePortalProviderProps = {
  children: ReactNode
}

// Typed wrappers that use globalThis internally
export function NativePortal({ hostName = 'root', children }: NativePortalProps) {
  const state = getNativePortalState()
  if (state.type !== 'teleport') return null

  const { Portal } = (globalThis as any).__tamagui_teleport
  return <Portal hostName={hostName}>{children}</Portal>
}

export function NativePortalHost({ name }: NativePortalHostProps) {
  const state = getNativePortalState()
  if (state.type !== 'teleport') return null

  const { PortalHost } = (globalThis as any).__tamagui_teleport
  return <PortalHost name={name} />
}

export function NativePortalProvider({ children }: NativePortalProviderProps) {
  const state = getNativePortalState()
  if (state.type !== 'teleport') return <>{children}</>

  const { PortalProvider } = (globalThis as any).__tamagui_teleport
  return <PortalProvider>{children}</PortalProvider>
}
```

```tsx
// src/index.ts
export { getNativePortalState, setNativePortalState } from './state'
export type { NativePortalState } from './state'
export { setupNativePortal } from './setup'
export { NativePortal, NativePortalHost, NativePortalProvider } from './components'
export type { NativePortalProps, NativePortalHostProps, NativePortalProviderProps } from './components'
```

### Phase 2: Update @tamagui/portal to Use @tamagui/native-portal

**Remove:** `code/ui/portal/src/native-portal.ts` (moved to new package)

### Phase 3: Update GorhomPortalItem.native.tsx (Portal Items)

**File:** `code/ui/portal/src/GorhomPortalItem.native.tsx`

The item now delegates to NativePortal when teleport available:

```tsx
import { getNativePortalState, NativePortal } from '@tamagui/native-portal'
import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useEvent } from '@tamagui/core'
import { useEffect, useId } from 'react'
import { usePortal } from './GorhomPortal'
import type { PortalItemProps } from './types'

export const GorhomPortalItem = (props: PortalItemProps) => {
  const { hostName, children, passThrough } = props

  const portalState = getNativePortalState()

  if (portalState.type === 'teleport') {
    if (passThrough) return children
    return <NativePortal hostName={hostName}>{children}</NativePortal>
  }

  // Fall back to Gorhom dispatch system
  return <GorhomPortalItemInner {...props} />
}

// Original implementation moved here
function GorhomPortalItemInner(props: PortalItemProps) {
  // ... current implementation unchanged
}
```

### Phase 4: Update GorhomPortal.tsx (Provider & Host)

**File:** `code/ui/portal/src/GorhomPortal.tsx`

Update `PortalProvider` and `PortalHost` to delegate to teleport:

```tsx
import { getNativePortalState, NativePortalProvider, NativePortalHost } from '@tamagui/native-portal'

// PortalProvider - wrap with teleport's provider when available
const PortalProviderComponent = ({
  rootHostName = 'root',
  shouldAddRootHost = true,
  children,
}: PortalProviderProps) => {
  const portalState = getNativePortalState()

  if (portalState.type === 'teleport') {
    return (
      <NativePortalProvider>
        {children}
        {shouldAddRootHost && <PortalHost name={rootHostName} />}
      </NativePortalProvider>
    )
  }

  // Fall back to Gorhom reducer-based provider
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const transitionDispatch = useMemo(() => {
    const next = (value: any) => {
      startTransition(() => {
        dispatch(value)
      })
    }
    return next as typeof dispatch
  }, [dispatch])

  return (
    <PortalDispatchContext.Provider value={transitionDispatch}>
      <PortalStateContext.Provider value={state}>
        {children}
        {shouldAddRootHost && <PortalHost name={rootHostName} />}
      </PortalStateContext.Provider>
    </PortalDispatchContext.Provider>
  )
}

// PortalHost - render teleport's host when available
export const PortalHost = memo(function PortalHost(props: PortalHostProps) {
  if (isWeb) {
    return <PortalHostWeb {...props} />
  }

  const portalState = getNativePortalState()

  if (portalState.type === 'teleport') {
    return <NativePortalHost name={props.name} />
  }

  return <PortalHostNonNative {...props} />
})
```

### Phase 5: Update Context Forwarding Components

**Files to modify:**
- `code/ui/select/src/SelectViewport.tsx`
- `code/ui/popover/src/Popover.tsx`
- Any other components with `ForwardXContext` patterns

**Pattern:**

```tsx
import { getNativePortalState } from '@tamagui/native-portal'

// In component:
const needsRepropagation = (() => {
  const portalState = getNativePortalState()
  // teleport preserves context, no repropagation needed
  if (portalState.type === 'teleport') return false
  // legacy/gorhom need repropagation on android, or ios without native portal
  return isAndroid || (isIos && !portalState.enabled)
})()

// Then use needsRepropagation to conditionally wrap with ForwardContext
```

### Phase 6: Update package.json Files

**@tamagui/native-portal/package.json (NEW):**
```json
{
  "name": "@tamagui/native-portal",
  "peerDependencies": {
    "react-native-teleport": ">=1.0.0"
  },
  "peerDependenciesMeta": {
    "react-native-teleport": {
      "optional": true
    }
  },
  "dependencies": {
    "react": "*"
  }
}
```

**@tamagui/portal/package.json:**
```json
{
  "dependencies": {
    "@tamagui/native-portal": "..."
  }
}
```

**Update exports in @tamagui/portal:**
- Re-export `setupNativePortal` from `@tamagui/native-portal` for backward compat
- Or keep `/native-portal` entry point that re-exports from new package

**Components that check portal state:**
```json
{
  "dependencies": {
    "@tamagui/native-portal": "..."
  }
}
```

### Phase 7: Testing Strategy

1. **Without teleport installed** - Verify Gorhom fallback still works
2. **With teleport installed** - Verify teleport path activates
3. **Context forwarding** - Verify it skips when teleport active
4. **All platforms** - iOS, Android, Fabric, non-Fabric
5. **Sheet/Select/Popover/Dialog** - Integration tests with overlays

### Phase 8: Documentation

**User setup with teleport (recommended):**
```tsx
// 1. Install
// npm install react-native-teleport

// 2. In app entry point - call setup before rendering
import { setupNativePortal } from '@tamagui/native-portal'
setupNativePortal() // Will use teleport automatically

// 3. Use PortalProvider from @tamagui/portal (unchanged!)
import { PortalProvider } from '@tamagui/portal'

export default function App() {
  return (
    <PortalProvider>
      <TamaguiProvider>
        <YourApp />
      </TamaguiProvider>
    </PortalProvider>
  )
}
```

**User setup without teleport (legacy, still works):**
```tsx
// Same as before - just call setup
import { setupNativePortal } from '@tamagui/native-portal'
setupNativePortal() // Falls back to legacy RN shims or Gorhom

// PortalProvider works the same way
import { PortalProvider } from '@tamagui/portal'
```

**Backward compat:** `@tamagui/portal/native-portal` re-exports from `@tamagui/native-portal`

## Benefits

1. **Non-breaking** - Existing users keep working
2. **Opt-in improvement** - Install teleport for better experience
3. **Automatic detection** - setupNativePortal picks best available
4. **Context forwarding optimized** - Skipped when teleport active
5. **Works on Android** - Teleport has real native Android support
6. **Works on Fabric** - Teleport handles new architecture
7. **Same API** - PortalProvider/PortalHost/Portal work unchanged

## Open Questions

1. **PortalHost name** - Should we standardize on "root" or let users choose?
2. **Provider placement** - Document clearly where PortalProvider should go relative to TamaguiProvider
3. **Web** - Should teleport also be used on web, or keep current createPortal approach?
