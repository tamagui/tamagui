# iOS Native Development Tips

## Running Detox Tests

### Metro Setup

Run Metro separately for faster iteration:

```bash
yarn start > /tmp/metro.log 2>&1 &
```

Then run detox with `--reuse` to use existing Metro:

```bash
detox test --reuse
```

### Useful Detox Flags

- `--retries 0` - fail fast, don't retry
- `-t "test name"` - run specific test by name
- `--reuse` - use existing metro/app (faster iteration)

Example:

```bash
detox test --reuse --retries 0 -t "sheet drag test"
```

### Debugging Workflow

1. Skip tests already verified to speed up cycles
2. Use `console.warn()` (not `console.log`) in native code to see output in metro
3. Filter metro logs: `grep -E "pattern" /tmp/metro.log`
4. Take screenshots in tests: `await device.takeScreenshot('name')`
5. Check screenshots in `e2e/artifacts/` after runs

### Common Issues

**Gesture handler timing**: Refs may not be populated when you expect. Add logging to verify refs are set before using them.

**General principle**: Verify each step - don't assume code works, add logging and check output.
