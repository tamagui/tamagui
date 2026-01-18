#!/bin/sh

args="$@"

ultra -r --no-pretty --concurrency 400 $args
