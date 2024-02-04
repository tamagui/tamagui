#!/bin/bash

if [ "$IS_TAMAGUI_DEV" == "1" ]; then
  # because was annoying to always get crypt errors when watching
  git-crypt unlock
fi

yarn npm-run-all --parallel watch:ts watch:packages
