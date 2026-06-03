// per-test retry (jest-circus), the replacement for detox's whole-file --retries.
//
// detox --retries re-runs an entire failed spec file: its beforeAll (app launch +
// any compile step) plus every test in it, even the ones that passed. that doubled a
// flaky shard's wall time. jest.retryTimes instead re-runs only the individual failing
// test, and because each test's beforeEach calls safeReloadApp (a fresh app instance),
// the retry starts from clean state. far cheaper, same flake resilience.
//
// note: retryTimes does NOT re-run beforeAll, and if the app launch itself is wedged
// the breaker in utils/detox.ts makes the retry's beforeEach fail fast rather than hang.
jest.retryTimes(1, { logErrorsBeforeRetry: true })
