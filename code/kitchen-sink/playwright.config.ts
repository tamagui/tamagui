import { defineConfig, devices } from '@playwright/test'
import { ANIMATION_DRIVERS } from './tests/test-utils'

const port = process.env.PORT || '9000'
const browserChannel = process.env.PLAYWRIGHT_CHANNEL
const chromiumUse = browserChannel
  ? {
      channel: browserChannel,
      launchOptions: {
        args: ['--use-angle=metal'],
      },
    }
  : undefined
const animatedChromiumUse =
  chromiumUse ??
  ({
    channel: 'chromium',
    launchOptions: {
      args: ['--use-angle=metal'],
    },
  } as const)

// Support both single-driver mode (via env var) and multi-driver parallel mode
const singleDriver = process.env.TAMAGUI_TEST_ANIMATION_DRIVER
const drivers = singleDriver ? [singleDriver] : [...ANIMATION_DRIVERS]

/**
 * Test organization:
 * - *.animated.test.ts - Animation-dependent tests, run with ALL animation drivers
 * - *.test.ts (non-animated) - Style/functional tests, run ONCE with default driver
 *
 * This significantly speeds up the test suite since most tests don't need
 * to run three times across all web animation drivers.
 */
export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: 'tests',
  reporter: [['list']],

  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: `http://localhost:${port}`,
    // Larger viewport to prevent popover positioning issues
    viewport: { width: 1920, height: 1080 },
  },

  projects: [
    // non-animated tests run once with the CSS driver
    {
      name: 'default',
      testIgnore: '**/*.animated.test.{ts,tsx}',
      metadata: { animationDriver: 'css' },
      ...(chromiumUse && { use: chromiumUse }),
    },
    // WebKit project scoped to RemoveScroll tests (scroll restoration)
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: '**/RemoveScroll.test.{ts,tsx}',
      metadata: { animationDriver: 'css' },
    },
    // the program block encoding rests on equal specificity through `:where()`
    // and source order deciding the cascade. That was only ever validated in
    // Chromium, and it is exactly the kind of thing a second engine can differ
    // on, so the program tests run under WebKit too.
    {
      name: 'webkit-programs',
      use: { ...devices['Desktop Safari'] },
      testMatch: '**/{ProgramCascade,ProgramBlockDelivery}.test.{ts,tsx}',
      metadata: { animationDriver: 'css' },
    },
    {
      name: 'webkit-select-native',
      use: { ...devices['Desktop Safari'] },
      testMatch: '**/SelectMultipleNativeWeb.test.{ts,tsx}',
      metadata: { animationDriver: 'css' },
    },
    // mobile WebKit (Safari engine + touch) for sheet keyboard/gesture tests —
    // chromium's touch/scroll/rubber-band behavior differs from iOS Safari
    {
      name: 'webkit-sheet',
      use: { browserName: 'webkit' },
      testMatch: '**/SheetWebKeyboard*.test.{ts,tsx}',
      metadata: { animationDriver: 'css' },
    },
    // animated tests run with all web animation drivers
    ...drivers.map((driver) => ({
      name: `animated-${driver}`,
      testMatch: '**/*.animated.test.{ts,tsx}',
      use: animatedChromiumUse,
      metadata: { animationDriver: driver },
    })),
  ],

  // Run your local dev server before starting the tests.
  // When run-tests-parallel.ts manages the server, REUSE_SERVER is set to skip launching another.
  webServer: {
    command: `PORT=${port} bun run start:web`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !!process.env.REUSE_SERVER,
    timeout: 120_000, // give webpack more time to start
  },

  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 2 : 1,

  timeout: 50_000,
})
