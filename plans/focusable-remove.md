# Remove `focusable` prop in favor of `tabIndex`

## Summary

Remove the React Native `focusable` prop from Tamagui v2 in favor of the web-standard `tabIndex`. This simplifies the API and aligns with web conventions.

## Semantic Mapping

- `focusable={true}` → `tabIndex={0}`
- `focusable={false}` → `tabIndex={-1}`
- `focusable={!disabled}` → `tabIndex={disabled ? -1 : 0}`

## Files to Change

### Core (remove type + forwarding)

1. **`code/core/web/src/interfaces/TamaguiComponentEvents.tsx:8`**
   - Remove `focusable?: any` from type

2. **`code/core/react-native-web-internals/src/modules/forwardedProps/index.tsx:68`**
   - Remove `focusable: true` from forwarded props

3. **`code/core/react-native-web-internals/src/modules/createDOMProps/index.tsx`**
   - Remove focusable handling (lines 110, 310-339)
   - Or just leave it - once removed from forwardedProps it won't reach here

4. **`code/core/web/src/createComponent.tsx:1295`**
   - Remove `focusable: viewProps.focusable ?? true`

5. **`code/core/core/src/createOptimizedView.native.tsx:40,117-119`**
   - Keep `tabIndex` → `focusable` conversion for native (RN still uses focusable)
   - Just remove accepting `focusable` as input prop

### UI Components (change focusable → tabIndex)

6. **`code/ui/button/src/v1/Button.tsx`**
   - Line 84: `focusable: true` → `tabIndex: 0`
   - Line 295: remove `focusable: undefined`

7. **`code/ui/toggle-group/src/ToggleGroup.tsx:83`**
   - `focusable={!disabled}` → `tabIndex={disabled ? -1 : 0}`

8. **`code/ui/toast/src/ToastImpl.tsx:34`**
   - `focusable: true` → `tabIndex: 0`

9. **`code/ui/toast/src/ToastViewport.tsx:293`**
   - `focusable={context.toastCount > 0}` → `tabIndex={context.toastCount > 0 ? 0 : -1}`

10. **`code/ui/radio-headless/src/useRadioGroup.tsx:235`**
    - `focusable: !isDisabled` → `tabIndex: isDisabled ? -1 : 0`

11. **`code/ui/create-menu/src/createBaseMenu.tsx:1039`**
    - `focusable={!disabled}` → `tabIndex={disabled ? -1 : 0}`

12. **`code/ui/tabs/src/createTabs.tsx:142`**
    - `focusable={!disabled}` → `tabIndex={disabled ? -1 : 0}`

13. **`code/ui/input/src/shared.tsx:20`**
    - `focusable: true` → `tabIndex: 0`

14. **`code/ui/roving-focus/src/RovingFocusGroup.tsx:172,237`**
    - Line 172: `focusable={focusable}` → `tabIndex={focusable ? 0 : -1}`
    - Line 237: Update `ItemData` type if needed

### Tests

15. **`code/core/react-native-web-internals/src/modules/createDOMProps/__tests__/index-test.tsx`**
    - Update or remove focusable tests

16. **`code/core/core-test/webAlignment.web.test.tsx:213-220`**
    - Update test expectations

17. **`code/core/core-test/webAlignment.native.test.tsx:188-194`**
    - Update test expectations

18. **`code/compiler/static-tests/tests/webAlignment.web.test.tsx:221`**
    - Update test

### Out of Scope (separate package)

- `code/packages/react-native-web-lite` - This is a separate RN-web compatibility layer, keep focusable there

## Difficulty

**Medium** - Straightforward changes but spread across ~15 files. Main risk is missing a usage somewhere.

## Testing

1. Run `yarn test` in affected packages
2. Check kitchen-sink for focus behavior
3. Verify tabIndex works correctly on web and maps to focusable on native
