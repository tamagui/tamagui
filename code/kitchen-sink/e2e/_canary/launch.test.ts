/**
 * Pre-flight launch canary.
 *
 * Run by run-detox-ios.ts BEFORE the real shard suite (not part of any shard's
 * file list; lives in a subdir so the shard-coverage validator's non-recursive
 * readdir never sees it).
 *
 * Why this exists: when the simulator boots and the app installs fine but Detox
 * can't establish its app<->server connection at launchApp time, every real test
 * file's beforeAll hangs the full 180s jest hook timeout, and with --retries the
 * whole shard burns ~50min before failing (see memory
 * project_detox_app_connect_runaway). This canary launches the app ONCE with a
 * short timeout; if it can't connect, run-detox-ios.ts bails the shard
 * immediately instead of letting every file hang.
 */
import { safeLaunchApp } from '../utils/detox'

// short bound: a healthy launch+connect (sync disabled, keyboard controller off)
// is well under this. a connect hang fails here in ~90s instead of 180s x every
// file x retries.
jest.setTimeout(90000)

describe('detox launch canary', () => {
  it('app launches and connects to Detox', async () => {
    // safeLaunchApp resolves only once the app has connected to the Detox
    // server (it launches with sync disabled + keyboard controller off, the
    // same path every real test uses). reaching this line IS the assertion.
    await safeLaunchApp({ newInstance: true })
  })
})
