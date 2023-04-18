#!/bin/bash

TAMAGUI_ENABLE_STUDIO=1 PORT=${PORT:-5005} NODE_OPTIONS='--no-deprecation' NODE_ENV=development yarn watch:site-data
