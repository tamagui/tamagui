#!/bin/bash
# bun run --filter wrapper with NO_COLOR to disable TTY formatting
NO_COLOR=1 exec bun run --filter "$@"
