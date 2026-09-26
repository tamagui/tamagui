/**
 * Import this first in a native test: an assignment in the test body runs after
 * every import has evaluated, and the core modules read the target as they
 * initialise (the platform prop-skip list is built at module scope).
 */
process.env.TAMAGUI_TARGET = 'native'
