# Keyboard Controller Integration Plan

## Overview

Add `react-native-keyboard-controller` integration to Tamagui following the same pattern as gesture-handler and teleport in `@tamagui/native`. This enables smooth keyboard + sheet coordination where:

1. Dragging sheet down dismisses keyboard FIRST with smooth handoff
2. Keyboard and sheet animate in sync (60/120 FPS frame-by-frame)
3. Auto-switches to keyboard-controller on native, no-op on web

## Current State

The current `moveOnKeyboardChange` prop in Sheet (lines 508-539 of `SheetImplementationCustom.tsx`) uses basic `Keyboard.addListener()` which:

- Only gets start/end events, not frame-by-frame
- Has timing-based animation (250ms hardcoded)
- No coordination with gesture handler
- Janky visual experience

## Target Behavior (like gorhom/bottom-sheet)

1. **Interactive keyboard tracking**: Sheet moves frame-by-frame as keyboard animates
2. **Gesture handoff**: When user drags sheet down, keyboard dismisses first, then sheet drags
3. **Blur on gesture**: `enableBlurKeyboardOnGesture` - keyboard dismisses when drag starts
4. **Restore behavior**: `keyboardBlurBehavior="restore"` - sheet returns to pre-keyboard position

## Implementation Pattern

Following the exact pattern of `setup-gesture-handler.ts`:

### 1. State Module (`keyboardControllerState.ts`)

```typescript
const GLOBAL_KEY = '__tamagui_native_keyboard_controller_state__'

export interface KeyboardControllerState {
  enabled: boolean
  KeyboardProvider: any
  KeyboardAwareScrollView: any
  useKeyboardHandler: any
  useReanimatedKeyboardAnimation: any
  KeyboardController: any
  KeyboardStickyView: any
}

function getGlobalState(): KeyboardControllerState {
  /* ... */
}
export function isKeyboardControllerEnabled(): boolean
export function getKeyboardControllerState(): KeyboardControllerState
export function setKeyboardControllerState(
  updates: Partial<KeyboardControllerState>
): void
```

### 2. Setup Module (`setup-keyboard-controller.ts`)

```typescript
import { setKeyboardControllerState } from './keyboardControllerState'

function setup() {
  const g = globalThis as any
  if (g.__tamagui_native_keyboard_controller_setup_complete) return
  g.__tamagui_native_keyboard_controller_setup_complete = true

  try {
    const rnkc = require('react-native-keyboard-controller')
    const {
      KeyboardProvider,
      KeyboardAwareScrollView,
      useKeyboardHandler,
      useReanimatedKeyboardAnimation,
      KeyboardController,
      KeyboardStickyView,
    } = rnkc

    if (useKeyboardHandler && KeyboardProvider) {
      setKeyboardControllerState({
        enabled: true,
        KeyboardProvider,
        KeyboardAwareScrollView,
        useKeyboardHandler,
        useReanimatedKeyboardAnimation,
        KeyboardController,
        KeyboardStickyView,
      })
    }
  } catch {
    // keyboard-controller not available
  }
}

setup()
```

### 3. Web stub (`setup-keyboard-controller.web.ts`)

```typescript
// no-op on web
```

### 4. Package.json Updates

Add to `@tamagui/native/package.json`:

```json
{
  "peerDependencies": {
    "react-native-keyboard-controller": ">=1.0.0"
  },
  "peerDependenciesMeta": {
    "react-native-keyboard-controller": {
      "optional": true
    }
  },
  "exports": {
    "./setup-keyboard-controller": {
      "react-native": {
        "types": "./types/setup-keyboard-controller.d.ts",
        "module": "./dist/esm/setup-keyboard-controller.native.js",
        "import": "./dist/esm/setup-keyboard-controller.native.js",
        "require": "./dist/cjs/setup-keyboard-controller.native.js"
      },
      "types": "./types/setup-keyboard-controller.d.ts",
      "module": "./dist/esm/setup-keyboard-controller.mjs",
      "import": "./dist/esm/setup-keyboard-controller.mjs",
      "require": "./dist/cjs/setup-keyboard-controller.cjs"
    }
  }
}
```

### 5. Sheet Integration

New hook: `useKeyboardControllerSheet.ts`

```typescript
import { isKeyboardControllerEnabled, getKeyboardControllerState } from '@tamagui/native'
import { useSharedValue } from 'react-native-reanimated'

export function useKeyboardControllerSheet({
  enabled,
  onKeyboardShow,
  onKeyboardHide,
  animatedNumber,
  positions,
  position,
  screenSize,
}: UseKeyboardControllerSheetOptions) {
  const keyboardControllerEnabled = isKeyboardControllerEnabled()
  const keyboardHeight = useSharedValue(0)
  const basePosition = useSharedValue(0)

  if (!keyboardControllerEnabled || !enabled) {
    return { keyboardHeight: null }
  }

  const { useKeyboardHandler } = getKeyboardControllerState()

  useKeyboardHandler({
    onStart: (e) => {
      'worklet'
      // store position before keyboard
      basePosition.value = positions[position]
    },
    onMove: (e) => {
      'worklet'
      // frame-by-frame tracking
      keyboardHeight.value = e.height
      const newY = Math.max(basePosition.value - e.height, 0)
      // update sheet position directly via shared value
    },
    onEnd: (e) => {
      'worklet'
      // keyboard fully shown/hidden
    },
  })

  return { keyboardHeight }
}
```

### 6. Gesture + Keyboard Coordination

The key insight from gorhom/bottom-sheet: when gesture starts, blur keyboard first.

In `useGestureHandlerPan.ts`, add:

```typescript
const { KeyboardController } = getKeyboardControllerState()

// in onStart handler:
if (keyboardControllerEnabled && enableBlurKeyboardOnGesture) {
  KeyboardController.dismiss()
}
```

## New Props for Sheet

```typescript
interface SheetProps {
  // existing
  moveOnKeyboardChange?: boolean

  // new with keyboard-controller
  keyboardBehavior?: 'interactive' | 'extend' | 'fillParent'
  keyboardBlurBehavior?: 'none' | 'restore'
  enableBlurKeyboardOnGesture?: boolean
}
```

## Files to Create/Modify

### Create

1. `code/core/native/src/keyboardControllerState.ts`
2. `code/core/native/src/setup-keyboard-controller.ts`
3. `code/core/native/src/setup-keyboard-controller.web.ts`
4. `code/ui/sheet/src/useKeyboardControllerSheet.ts`
5. `code/ui/sheet/src/useKeyboardControllerSheet.native.ts`
6. `code/kitchen-sink/src/usecases/SheetKeyboardDragCase.tsx`
7. `code/kitchen-sink/e2e/SheetKeyboardDrag.test.ts`

### Modify

1. `code/core/native/package.json` - add peer dep + exports
2. `code/core/native/src/index.ts` - export state functions
3. `code/ui/sheet/src/SheetImplementationCustom.tsx` - integrate hook
4. `code/ui/sheet/src/types.ts` - add new props
5. `docs/using-ios.md` - add keyboard test workflow

## Detox Test Cases

### SheetKeyboardDrag.test.ts

```typescript
describe('SheetKeyboardDrag - Keyboard Controller Integration', () => {
  it('should show keyboard-controller enabled', async () => {
    // verify setup worked
  })

  it('Case 1: open keyboard, sheet moves up smoothly', async () => {
    // tap input -> keyboard shows -> sheet animates up
    // verify sheet position changed
  })

  it('Case 2: drag sheet down dismisses keyboard first', async () => {
    // open keyboard
    // start dragging sheet down
    // keyboard should dismiss FIRST
    // then sheet can drag down
  })

  it('Case 3: keyboard dismiss, sheet returns to original position', async () => {
    // open keyboard (sheet moves up)
    // dismiss keyboard (tap outside)
    // sheet should animate back to original snap point
  })

  it('Case 4: rapid keyboard show/hide is smooth', async () => {
    // focus input -> unfocus -> focus -> unfocus
    // no janky animation
  })
})
```

## Testing Workflow (update using-ios.md)

```bash
# 1. Start metro in background
cd code/kitchen-sink && yarn start > /tmp/metro.log 2>&1 &

# 2. Build app once
detox build -c ios.sim.debug

# 3. Run keyboard tests iteratively
detox test --reuse --retries 0 -t "keyboard" -c ios.sim.debug

# 4. Check screenshots in e2e/artifacts/
# Look for smooth keyboard + sheet coordination

# 5. Filter metro logs for keyboard events
grep -E "keyboard|Keyboard" /tmp/metro.log
```

## Success Criteria

1. **Smooth 60fps animation**: Sheet tracks keyboard frame-by-frame
2. **Gesture handoff works**: Drag sheet down -> keyboard dismisses -> sheet drags
3. **No jank**: No visual glitches during rapid keyboard show/hide
4. **Graceful fallback**: If keyboard-controller not installed, falls back to current behavior
5. **Web no-op**: Import doesn't break web builds
6. **Detox tests pass**: All keyboard test cases green

## Reference Implementation

- gorhom/bottom-sheet: https://github.com/gorhom/react-native-bottom-sheet
- react-native-keyboard-controller: https://github.com/kirillzyusko/react-native-keyboard-controller
- actions-sheet: Uses keyboard-controller internally

## Phase 2 (Future)

1. `KeyboardAwareScrollView` integration for Sheet.ScrollView
2. `KeyboardStickyView` for input toolbars that stick above keyboard
3. Android-specific optimizations (windowSoftInputMode handling)
