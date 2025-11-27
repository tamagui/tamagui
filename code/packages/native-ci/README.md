# @tamagui/native-ci

Native CI/CD helpers for React Native apps with Expo. Provides fingerprint-based build caching and Detox test runners for GitHub Actions.

## Features

- **Fingerprint-based caching**: Uses `@expo/fingerprint` to detect when native rebuilds are needed
- **2-level caching**: Pre-fingerprint hash (fast) + full fingerprint (accurate)
- **KV store integration**: Optional Redis/Upstash KV for persistent fingerprint cache
- **Detox test runners**: Clean TypeScript scripts for running Detox E2E tests
- **Reusable GitHub Actions**: Drop-in composite actions for iOS and Android

## Installation

```bash
npm install @tamagui/native-ci
# or
yarn add @tamagui/native-ci
# or
bun add @tamagui/native-ci
```

## CLI Usage

```bash
# Generate fingerprint for a platform
npx @tamagui/native-ci fingerprint ios
npx @tamagui/native-ci fingerprint android

# Generate pre-fingerprint hash (fast)
npx @tamagui/native-ci pre-hash yarn.lock app.json

# Generate cache key
npx @tamagui/native-ci cache-key ios <fingerprint>

# KV operations (requires env vars)
npx @tamagui/native-ci kv-get <key>
npx @tamagui/native-ci kv-set <key> <value>
```

### Options

- `--project-root <path>` - Project root directory (default: cwd)
- `--prefix <prefix>` - Cache key prefix (default: native-build)
- `--github-output` - Output results for GitHub Actions
- `--json` - Output as JSON

### Environment Variables

- `KV_STORE_REDIS_REST_URL` - Redis REST API URL for fingerprint caching
- `KV_STORE_REDIS_REST_TOKEN` - Redis REST API token

## GitHub Actions

### Fingerprint Action

```yaml
- name: Generate Fingerprint
  uses: tamagui/tamagui/code/packages/native-ci/actions/fingerprint@main
  id: fingerprint
  with:
    platform: ios  # or android
    project-root: ./my-app
    kv-url: ${{ secrets.KV_STORE_REDIS_REST_URL }}
    kv-token: ${{ secrets.KV_STORE_REDIS_REST_TOKEN }}

- name: Use fingerprint
  run: echo "Fingerprint: ${{ steps.fingerprint.outputs.fingerprint }}"
```

#### Inputs

| Input | Description | Default |
|-------|-------------|---------|
| `platform` | Platform (ios or android) | Required |
| `project-root` | Path to Expo project | `.` |
| `cache-prefix` | Prefix for cache keys | `native-build` |
| `kv-url` | Redis KV REST URL (optional) | - |
| `kv-token` | Redis KV REST token (optional) | - |
| `pre-hash-files` | Files for pre-fingerprint hash | `yarn.lock,package-lock.json,app.json` |

#### Outputs

| Output | Description |
|--------|-------------|
| `fingerprint` | Generated fingerprint hash |
| `cache-key` | Cache key for this build |
| `pre-fingerprint-hash` | Quick pre-fingerprint hash |
| `cache-hit` | Whether fingerprint was cached |

### iOS Detox Tests Action

```yaml
- name: Run iOS Detox Tests
  uses: tamagui/tamagui/code/packages/native-ci/actions/test-detox-ios@main
  with:
    working-directory: ./my-app
    config: ios.sim.debug
    app-path: ${{ env.IOS_APP_PATH }}
```

#### Inputs

| Input | Description | Default |
|-------|-------------|---------|
| `project-root` | Path to project root | `.` |
| `working-directory` | Working directory for tests | `.` |
| `config` | Detox configuration name | `ios.sim.debug` |
| `record-logs` | Log recording: none, failing, all | `all` |
| `retries` | Number of test retries | `2` |
| `simulator` | iOS simulator device type | `iPhone 15` |
| `app-path` | Path to built app (optional) | - |

### Android Detox Tests Action

```yaml
- name: Run Android Detox Tests
  uses: tamagui/tamagui/code/packages/native-ci/actions/test-detox-android@main
  with:
    working-directory: ./my-app
    config: android.emu.ci.debug
```

#### Inputs

| Input | Description | Default |
|-------|-------------|---------|
| `project-root` | Path to project root | `.` |
| `working-directory` | Working directory for tests | `.` |
| `config` | Detox configuration name | `android.emu.ci.debug` |
| `record-logs` | Log recording: none, failing, all | `all` |
| `retries` | Number of test retries | `2` |
| `api-level` | Android API level | `30` |
| `emulator-options` | Emulator options | See defaults |

## Example Workflow

```yaml
name: Native Tests

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build-ios:
    runs-on: macos-14
    outputs:
      cache-key: ${{ steps.fingerprint.outputs.cache-key }}
    steps:
      - uses: actions/checkout@v4

      - name: Generate Fingerprint
        uses: tamagui/tamagui/code/packages/native-ci/actions/fingerprint@main
        id: fingerprint
        with:
          platform: ios
          project-root: ./my-app

      - name: Check Build Cache
        uses: actions/cache/restore@v4
        id: cache
        with:
          path: ./my-app/ios/build
          key: ${{ steps.fingerprint.outputs.cache-key }}
          lookup-only: true

      - name: Build iOS App
        if: steps.cache.outputs.cache-hit != 'true'
        run: |
          cd my-app
          npx expo prebuild --platform ios
          xcodebuild -workspace ios/*.xcworkspace ...

      - name: Save Build Cache
        if: steps.cache.outputs.cache-hit != 'true'
        uses: actions/cache/save@v4
        with:
          path: ./my-app/ios/build
          key: ${{ steps.fingerprint.outputs.cache-key }}

  test-ios:
    needs: build-ios
    runs-on: macos-14
    steps:
      - uses: actions/checkout@v4

      - name: Restore Build
        uses: actions/cache/restore@v4
        with:
          path: ./my-app/ios/build
          key: ${{ needs.build-ios.outputs.cache-key }}

      - name: Run Tests
        uses: tamagui/tamagui/code/packages/native-ci/actions/test-detox-ios@main
        with:
          working-directory: ./my-app
```

## How Fingerprinting Works

1. **Pre-fingerprint hash**: Quick hash of `yarn.lock`, `app.json`, etc.
2. **KV cache lookup**: Check if we've seen this pre-hash before
3. **Full fingerprint**: If not cached, run `@expo/fingerprint` for accurate native dependency detection
4. **Cache build artifacts**: Use fingerprint as cache key

This 2-level approach means:
- Cache hits are instant (no fingerprint generation needed)
- Rebuilds only happen when native dependencies actually change
- Works across CI runs with KV persistence

## License

MIT
