#!/bin/bash

mkdir dist || true
mkdir dist/cjs || true

cp ./fake-entry.js ./dist/cjs/index.cjs
cp ./fake-entry.js ./dist/cjs/index.native.js
