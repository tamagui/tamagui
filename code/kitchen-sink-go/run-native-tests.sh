#!/bin/bash
if [ -z "$SKIP_NATIVE_TESTS" ]; then
  bun run test:native:maestro
fi
