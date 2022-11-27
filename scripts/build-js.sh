#!/bin/bash

echo "building JS"

SKIP_TYPES=1 turbo run build --filter=./packages/*
