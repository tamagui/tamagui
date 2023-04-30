#!/bin/bash

echo "building JS"

# SKIP_TYPES=1 turbo run build --filter=./packages/*
SKIP_TYPES=1 ultra -r --no-pretty build --filter=./packages/*
