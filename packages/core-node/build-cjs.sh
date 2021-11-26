#!/bin/bash

npx esbuild dist/*.js dist/**/*.js --allow-overwrite --outdir=dist --format=cjs --target=node14 "$@"
