#!/bin/bash
if [ -z "$SKIP_NATIVE_TESTS" ]; then
  yarn test:native
fi
