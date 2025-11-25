# Tamagui Testing Guide

## Running Tests

### Kitchen Sink Tests

The kitchen-sink package contains the main integration tests for Tamagui components. To run these tests:

1. **Start the web server** (in the background):
   ```bash
   cd code/kitchen-sink
   yarn kitchen-sink:web
   # or
   npm run start:web
   ```

2. **Run all web tests** with different animation drivers:
   ```bash
   yarn test:web
   ```
   This runs tests with CSS, React Native, and Moti animation drivers.

3. **Run tests with a specific animation driver**:
   ```bash
   # CSS animations driver
   yarn test:web:driver-css
   
   # React Native animations driver  
   yarn test:web:driver-rn
   
   # Moti animations driver
   yarn test:web:driver-moti
   ```

4. **Run a specific test file**:
   ```bash
   # Using playwright directly
   cd code/kitchen-sink
   npx playwright test tests/PopoverFocusScope.test.tsx
   
   # Or with a specific driver
   NODE_ENV=test TAMAGUI_TEST_ANIMATION_DRIVER=css npx playwright test tests/YourTest.test.tsx
   ```

5. **Debug tests**:
   ```bash
   yarn test:web:debug
   # or
   npx playwright test --debug
   ```

### Test Structure

Tests are located in `code/kitchen-sink/tests/` and follow the naming convention `ComponentName.test.tsx`.

### Writing Tests

When writing tests for focus behavior or component interactions:

1. Use appropriate wait times for animations and focus changes
2. Be aware that `trapFocus` behavior depends on the component's open state
3. Test both trapped and non-trapped focus scenarios
4. Consider browser focus behavior when `trapFocus` is false

### Common Issues

- If tests fail due to timing, add appropriate `waitForTimeout` calls
- For focus tests, ensure elements are visible before testing focus state
- When testing popover/dialog components, wait for animations to complete

## Commit Message Conventions

- Use `site:` prefix (not `fix(site):`) for tamagui.dev changes since they don't go in the changelog
- Use `ci:` prefix (not `fix(ci):`) for CI/workflow changes since they don't go in the changelog
- Keep commit messages to a single line