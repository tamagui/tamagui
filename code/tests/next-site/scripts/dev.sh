#!/bin/bash

./scripts/kill-existing.sh

PORT=${PORT:-5005} NODE_OPTIONS='--no-deprecation' NODE_ENV=development yarn dev:next
