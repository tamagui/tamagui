#!/bin/bash

npx esbuild dist/core/**/*.js dist/core/**/**/*.js --outdir=dist --format=cjs --target=node16 "$@"
