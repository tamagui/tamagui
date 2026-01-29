# iOS Native Development Tips

## Running Detox Tests

### Metro Setup

Run Metro separately for faster iteration:

```bash
cd code/kitchen-sink
yarn start > /tmp/metro.log 2>&1 &
```

Then run detox with `--reuse` to use existing Metro:

```bash
npx detox test -c ios.sim.debug --reuse
```

### Single Test Workflow (Recommended for Dev)

For one-off test runs, use `--maxWorkers 1` to avoid spawning multiple simulators:

```bash
# run a single test on one simulator (fast iteration)
npx detox test -c ios.sim.debug --reuse --retries 0 --maxWorkers 1 -t "test name"
```

This prevents Detox from launching 10+ simulators in parallel, which is noisy for debugging.

### Full Test Suite (CI or Final Verification)

For running all tests, omit `--maxWorkers` to use parallelization:

```bash
npx detox test -c ios.sim.debug --reuse
```

### Useful Detox Flags

- `--retries 0` - fail fast, don't retry
- `-t "test name"` - run specific test by name
- `--reuse` - use existing metro/app (faster iteration)
- `--maxWorkers 1` - single simulator (quieter for debugging)
- `--headless` - run without simulator UI (CI only)

Example:

```bash
npx detox test -c ios.sim.debug --reuse --retries 0 --maxWorkers 1 -t "sheet drag test"
```

### Managing Simulators

Detox can leave many simulators running. Here's how to manage them:

```bash
# list all simulators
xcrun simctl list devices

# shutdown all simulators
xcrun simctl shutdown all

# boot a specific simulator
xcrun simctl boot "iPhone 15"

# erase a simulator (fresh state)
xcrun simctl erase "iPhone 15"

# delete unavailable simulators (cleanup old Xcode versions)
xcrun simctl delete unavailable
```

If simulators are stuck in "Shutting Down" state:

```bash
# force kill all simulator processes
killall Simulator 2>/dev/null
xcrun simctl shutdown all
sleep 2
xcrun simctl boot "iPhone 15"
```

### Debugging Workflow

1. Skip tests already verified to speed up cycles
2. Use `console.warn()` (not `console.log`) in native code to see output in metro
3. Filter metro logs: `grep -E "pattern" /tmp/metro.log`
4. Take screenshots in tests: `await device.takeScreenshot('name')`
5. Check screenshots in `e2e/artifacts/` after runs

### Example

The keyboard tests verify smooth handoff between keyboard and sheet gestures:

```bash
# Run keyboard-specific tests
detox test --reuse --retries 0 -t "Keyboard"

# Watch for keyboard events in metro logs
grep -E "keyboard|Keyboard|kb-" /tmp/metro.log
```
